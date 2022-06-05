"use strict";

const {logger} = require('../config/logger');
const {CorporateHR, sequelize, User} = require('../models');
const { Op } = require('sequelize');
const argon2 = require('argon2');
const {v4: uuidv4} = require('uuid');
const {ServerError} = require('../errors/serverError');
const {BadRequest} = require('../errors/invalidQueryParams');

const corporateHrStatus = require('./employeeStatus');
const VALID_CORPORATEHR_STATUSES = require('./employeeStatus').status;
const VALID_CORPORATEHR_APPROVAL_TYPES = require('./employeeStatus').approvalType;

const getCorporateHrByUuid = uuid => {
  return new Promise((resolve, reject) => {
    logger.debug(`${module.id} - ${getCorporateHrByUuid.name}`);
    CorporateHR.findOne({where: {uuid: uuid}})
    .then(hr => {resolve(hr)})
    .catch(err => {reject(err)});
  });
};

const getCorporateHrByUserUuid = uuid => {
  return new Promise((resolve, reject) => {
    logger.debug(`${module.id} - ${getCorporateHrByUserUuid.name}`);
    CorporateHR.findOne({where: {userUuid: uuid}})
    .then(hr => {resolve(hr)})
    .catch(err => {reject(err)});
  });
};

const getCorporateHrByEmpIdByCorporateUuid = (empid, corporateUuid) => {
  return new Promise((resolve, reject) => {
    logger.debug(`${module.id} - ${getCorporateHrByEmpIdByCorporateUuid.name}`);
    CorporateHR.findOne({where: {empid: empid, corporateUuid: corporateUuid}})
    .then(hr => {resolve(hr)})
    .catch(err => {reject(err)});
  });
};

const getCorporateHrByCorporateUuid = uuid => {
  return new Promise((resolve, reject) => {    
    CorporateHR.findAll({where: {corporateUuid: uuid}})
    .then(hr => {resolve(hr)})
    .catch(err => {reject(err)});
  });
};

const getCorporateHrs = (credentials, status, approvalType) => {
  return new Promise((resolve, reject) => {
    logger.info(`+${module.id} - ${getCorporateHrs.name}()`);
    logger.debug(`received params: {credentials: ${credentials}, status: ${status}, approvalType:${approvalType}}`);

    if (status && !VALID_CORPORATEHR_STATUSES.includes(status) && status !== 'all') {
      const error = new BadRequest({status: status}, `status value is incorrect.`);
      throw(error);
    }

    if (approvalType && !VALID_CORPORATEHR_APPROVAL_TYPES.includes(approvalType) && approvalType !== 'all') {
      const error = new BadRequest({approvalType: approvalType}, `approvaltype value is incorrect.`);
      throw(error);
    }

    let whereOptions = {};
    if (credentials.role === 'hr') {
      whereOptions.corporateUuid = credentials.corporateUuid;
    }
    if (status) {
      whereOptions.status = (status === 'all') ? {[Op.or]: VALID_CORPORATEHR_STATUSES} : status;
    }
    if (approvalType) {
      whereOptions.approvalType = (approvalType === 'all') ? {[Op.or]: VALID_CORPORATEHR_APPROVAL_TYPES} : approvalType;
    }
    logger.info(`Querying for CorporateHR with these options: ${JSON.stringify(whereOptions)}`);

    const promise = (Object.keys(whereOptions))
      ? CorporateHR.findAll({where: whereOptions})
      : CorporateHR.findAll();

    promise
    .then(chrlist => {
      resolve(chrlist);
    })
    .catch(err => {
      logger.error('Error encountered while getting corporateHRs from DB.');
      reject(err);
    });
  });
}

const _validateNewCorporateHrs = (corporateHrs) => {
  return new Promise((resolve, reject) => {

    let _dupCorporateHrPromises = [];
    let _dupUserPromises = [];
    let _dupCorporateHrs = [];

    corporateHrs.forEach(chr => {
      if (!chr.uuid) {
        chr.uuid = uuidv4();
      }
      chr.status = 'created';
      _dupCorporateHrPromises.push(CorporateHR.findOne({where: {uuid: chr.uuid}}));
      _dupCorporateHrPromises.push(CorporateHR.findOne({where: {empid: chr.empid, corporateUuid: chr.corporateUuid}}));
      _dupUserPromises.push(User.findOne({where: {username: chr.empid, corporateUuid: chr.corporateUuid}}));
    });

    Promise.all(_dupCorporateHrPromises)
    .then(corporateHrsFromDb => {
      corporateHrsFromDb.forEach(chr => {
        if (chr && chr.uuid && chr.userUuid && chr.empid && chr.corporateUuid) {
          logger.info(`CorporateHr {uuid: ${chr.uuid}, empid: ${chr.empid}, corporateUuid: ${chr.corporateUuid}, name: ${chr.firstName} ${chr.lastName} } is already present`);
          _dupCorporateHrs.push(chr);
        }
      })
      if (_dupCorporateHrs && _dupCorporateHrs.length !== 0) {
        logger.info(`Some corporateHrs provided for new addition are already present in table.`);
        return Promise.all(_dupUserPromises);
      } else {
        logger.info(`All corporateHrs are new.`);
        return Promise.all(_dupUserPromises);
      }
    })
    .then(usersFromDb => {
      let _dupUsers = [];
      usersFromDb.forEach(u => {
        if (u && u.uuid && u.username) {
          logger.info(`User {uuid: ${u.uuid}, username: ${u.username}} is already present`);
          _dupUsers.push(u);
        }
      })
      if (_dupUsers && _dupUsers.length !== 0) {
        logger.info(`Some corporateHrs (and users) provided for new addition are already present in table. Rejecting this request therefore.`);
        let _uniqueCorporateHrs = corporateHrs.filter(
          chr => {
            return !_dupCorporateHrs.find(d => (d.empid === chr.empid) && (d.corporateUuid === chr.corporateUuid))
          }
        );
        resolve(_uniqueCorporateHrs, _dupCorporateHrs);
      } else {
        logger.info(`All corporateHrs and users are new.`);
        resolve(corporateHrs, null);
      }
    })
    .catch(err => {
      logger.error(err);
      reject(err);
    })
  })
}

const _createNewUsersAndUpdatedCorporateHrs = corporateHrs => {
  return new Promise((resolve, reject) => {
    let newUsers = [];
    let passwordPromises = [];
    corporateHrs.forEach(corporateHr => {
      logger.debug(`Creating new user from CorporateHr : ${JSON.stringify(corporateHr)}`)
      let user = {};
      user.uuid = uuidv4();
      corporateHr.userUuid = user.uuid;
      user.username = corporateHr.empid;
      user.role = 'hr';
      user.corporateUuid = corporateHr.corporateUuid;
      user.brokingCompanyUuid = null;
      user.email = corporateHr.email ? corporateHr.email : null;
      user.mobile = corporateHr.mobile ? corporateHr.mobile : null;
      user.password = corporateHr.empid;
      passwordPromises.push(argon2.hash(user.password));
      newUsers.push(user);
    })

    Promise.all(passwordPromises)
    .then(passwordHashes => {
      for (let i = 0; i < newUsers.length; i++) {
        newUsers[i].password = passwordHashes[i];
      }
      logger.info('Created newUsers for adding new user objects to DB.');
      resolve({newUsers: newUsers, updatedCorporateHrs: corporateHrs});
    })
    .catch(err => {
      logger.info('Error while creating passwords.');
      logger.error(`${JSON.stringify(err)}`);
      reject(err);
    })
  });
}

const addCorporateHrs = (credentials, corporateHrs) => {
  return new Promise((resolve, reject) => {
    logger.info(`+${module.id} - ${addCorporateHrs.name}()`);

    let _uniqueCorporateHrs = null;
    let _dupCorporateHrs = null;
    let _updatedCorporateHrs = null;
    _validateNewCorporateHrs(corporateHrs)
    .then((uniqueCorporateHrs, dupCorporateHrs) => {
      logger.info('New corporateHrs have been validated');
      _uniqueCorporateHrs = uniqueCorporateHrs;
      if (!_uniqueCorporateHrs || _uniqueCorporateHrs.length === 0) {
        const error = new BadRequest(null, `All corporateHrs provided for addition into DB are already present`);
        throw(error);
      }
      _dupCorporateHrs = dupCorporateHrs;
      return _createNewUsersAndUpdatedCorporateHrs(_uniqueCorporateHrs);
    })
    .then(newUserPromisesAndUpdatedCorporateHrs => {
      logger.info('Adding new users and new corporateHrs under a single transaction.');
      _updatedCorporateHrs = newUserPromisesAndUpdatedCorporateHrs.updatedCorporateHrs;
      return sequelize.transaction(t => {
        logger.info(`Adding [${newUserPromisesAndUpdatedCorporateHrs.newUsers.length}] new users....`);
        return User.bulkCreate(newUserPromisesAndUpdatedCorporateHrs.newUsers, {transation: t})
        .then(users => {
          logger.info(`Added [${users.length}] new Users`);
          logger.info(`Adding [${newUserPromisesAndUpdatedCorporateHrs.updatedCorporateHrs.length}] new corporateHrs....`);
          return CorporateHR.bulkCreate(newUserPromisesAndUpdatedCorporateHrs.updatedCorporateHrs, {transation: t})
        });
      })
    })
    .then(ignoreResult => {
      logger.info(`Added [${corporateHrs.length}] corporateHrs`);
      let dto = {}
      dto.newCorporateHrs = _updatedCorporateHrs;
      dto.dupCorporateHrs = _dupCorporateHrs;
      resolve(dto);
    })
    .catch(err => {
      console.log(err);
      logger.error(`Error while adding corporateHrs: ${JSON.stringify(err)}`);
      reject(err);
    });
  });
}


const _getUpdateFields = (modified, orig) => {
  let updateFields = {};
  let _orig = orig.dataValues; // We are relying on Sequelize providing a dataValues. If they change this internally, this method won't work.

  Object.keys(_orig).forEach(key => {
    switch (key) {
      case 'uuid': // Intentionally skip these fields. They should not be modified by server even if sent.
      case 'active':
      case 'createdAt':
      case 'updatedAt':
        break;
      case 'status':
        logger.verbose(`key: ${key}`);
        if (modified.hasOwnProperty('status') && (modified.status !== _orig.status)) {
          if (!VALID_CORPORATEHR_STATUSES.includes(modified.status)) {
            const error = new BadRequest({status: modified.status}, `Status value is incorrect.`);
            throw(error);
          }

          if (modified.status === corporateHrStatus.STATUS_TPA_APPROVED &&
            modified.approvalType === corporateHrStatus.APPROVAL_TYPE_ADDITION) {
            updateFields.status = corporateHrStatus.STATUS_ACTIVE;
          } else if (modified.status === corporateHrStatus.STATUS_TPA_APPROVED &&
            modified.approvalType === corporateHrStatus.APPROVAL_TYPE_DELETION) {
            updateFields.status = corporateHrStatus.STATUS_INACTIVE;
          } else {
            updateFields.status = modified.status;
          }

          if ([corporateHrStatus.STATUS_CREATED, corporateHrStatus.STATUS_HR_APPROVED].includes(modified.status)) {
            updateFields.approvalType = corporateHrStatus.APPROVAL_TYPE_ADDITION;
          } else if ([corporateHrStatus.STATUS_RESIGNED].includes(modified.status)) {
            updateFields.approvalType = corporateHrStatus.APPROVAL_TYPE_DELETION;
          } else if ([corporateHrStatus.STATUS_ACTIVE, corporateHrStatus.STATUS_INACTIVE].includes(modified.status)) {
            updateFields.approvalType = corporateHrStatus.APPROVAL_TYPE_NONE;
          } else if ([corporateHrStatus.STATUS_ACTIVE, corporateHrStatus.STATUS_INACTIVE].includes(updateFields.status)) {
            updateFields.approvalType = corporateHrStatus.APPROVAL_TYPE_NONE;
          } else {
            updateFields.approvalType = modified.approvalType;
          }
        }
        break;
      default: { // All the others are straightforward replacements.
        logger.verbose(`key: ${key}`);
        if (modified.hasOwnProperty(key) && (modified[key] !== orig[key])) {
          updateFields[key] = modified[key];
        }
        break;
      }
    }
  });

  return updateFields;
}


const updateCorporateHr = (credentials, modifiedCorporateHr) => {
  return new Promise((resolve, reject) => {
    logger.info(`+${module.id} - ${updateCorporateHr.name}()`);
    logger.debug(`To modify: ${JSON.stringify(modifiedCorporateHr)}`);
    logger.info(`Received [${Object.keys(modifiedCorporateHr).length - 1}] field(s) to update.`);

    let _updateFields = null;
    let _rowsUpdated = 0;
    let _existingCorporateHr = null;

    CorporateHR.findOne({where: {uuid: modifiedCorporateHr.uuid}})
    .then(chr => {
      logger.debug(`original: ${JSON.stringify(chr)}`);
      _existingCorporateHr = chr;
      logger.debug(`_existingCorporateHr: ${JSON.stringify(_existingCorporateHr)}`);
      if (modifiedCorporateHr.empid && modifiedCorporateHr.empid !== _existingCorporateHr.empid) {
        logger.debug(`Checking if customer with new empid [${modifiedCorporateHr.empid}] is already present.`);
        return CorporateHR.findOne({where: {empid: modifiedCorporateHr.empid, corporateUuid: chr.corporateUuid}});
      } else {
        return Promise.resolve(null);
      }
    })
    .then(duplicatechr => {
      logger.debug(`duplicateCorporateHr: ${duplicatechr}`);
      if (duplicatechr) {
        logger.debug(`Duplicate customer found for new empid [${duplicatechr.empid}].`);
        const error = new BadRequest({empid: duplicatechr.empid, firstName: duplicatechr.firstName, lastName: duplicatechr.lastName}, `The employee id provided for modify already belongs to another customer.`);
        throw(error);
      }

      _updateFields = _getUpdateFields(modifiedCorporateHr, _existingCorporateHr);
      logger.info(`updateFields: ${JSON.stringify(_updateFields)}`);
      if (!Object.keys(_updateFields).length) {
        resolve(0);
      }

      let options = {};
      options.where = {uuid: modifiedCorporateHr.uuid};

      return CorporateHR.update(_updateFields, options);
    })
    .then((rowsUpdated, updatedCorporateHrs) => { // updatedCorporateHrs seen only on PostgreSQL
      _rowsUpdated = rowsUpdated;
      logger.info(`Finished updating [${rowsUpdated}] corporate HRs.`);
      logger.verbose(`updatedCorporateHrs: ${JSON.stringify(updatedCorporateHrs)}.`);
      resolve(_rowsUpdated);
    })
    .catch(err => {
      logger.error(err);
      if (err.status) {
        reject(err);
      } else {
        const error = new ServerError('ErrorUpdatingCorporateHrs', 'Error occurred while updating modifiedCorporateHr. This is a server error. Please see data for actual error.', err);
        reject(error);
      }
    });
  });
}


module.exports = {
  addCorporateHrs: addCorporateHrs,
  getCorporateHrByCorporateUuid: getCorporateHrByCorporateUuid,
  getCorporateHrByEmpIdByCorporateUuid: getCorporateHrByEmpIdByCorporateUuid,
  getCorporateHrs: getCorporateHrs,
  getCorporateHrByUserUuid: getCorporateHrByUserUuid,
  getCorporateHrByUuid:getCorporateHrByUuid,
  updateCorporateHr: updateCorporateHr,
};