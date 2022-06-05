"use strict";

const {v4: uuidv4} = require('uuid');
const { Executive, sequelize, User, ExecutiveCorporateMapping, EmployeeGrievance, InsuranceEnquiry } = require('../models');
const {logger} = require('../config/logger');
const argon2 = require('argon2');
const {Op} = require("sequelize");
const {ROLE_EXECUTIVE, ROLE_MANAGER, ROLE_SRMANAGER, ROLE_SUPERUSER} = require("./employeeStatus");
const {ServerError} = require("../errors/serverError");
const {BadRequest} = require('../errors/invalidQueryParams')

const getExecutives = (credentials, queryParams) => {
  return new Promise((resolve, reject) => {
    logger.info(`${module.filename}.${getExecutives.name}()`);

    switch (credentials.role) {
      case ROLE_SUPERUSER:
        Executive.findAll()
        .then(executives => resolve(executives.filter(ex => ex.firstName !== 'Admin')))
        .catch(err => reject(err));
        break;

      case ROLE_SRMANAGER:
      case ROLE_MANAGER:
        getExecutivesByManagerEmpid(credentials.empid, queryParams.empid, queryParams.brokingCompanyUuid)
        .then(executives => {resolve(executives);})
        .catch(err => {reject(err);});
        break;

      case ROLE_EXECUTIVE:
        if (queryParams.empid || queryParams.brokingCompanyUuid) {
          const error = new BadRequest(queryParams, `An Executive cannot query by 'empid' or 'brokingCompanyUuid'. These query params are reserved for manager only.`);
          throw(error);
        }

        Executive.findAll({where: {userUuid: credentials.uuid}})
        .then(executives => {
          if (executives.length > 1) {
            const error = new ServerError('DBIntegrityError', 'More than one executive was found matching the logged in executive.', executives);
            reject(error);
          }
          resolve(executives);
        })
        .catch(err => {
          reject(err);
        });
        break;
    }
  });
};

const getAllExecutivesByBrokingCompanyUuid = (brokingCompanyUuid) => {
  return new Promise((resolve, reject) => {
    logger.info(`${module.filename}.${getAllExecutivesByBrokingCompanyUuid.name}()`);
    Executive.findAll({where: { brokingCompanyUuid: brokingCompanyUuid }})
    .then(executives => { resolve(executives); })
    .catch( err => { reject(err); });
  });
};

const getExecutiveByEmpId = (empid) => {
  return new Promise((resolve, reject) => {
    logger.info(`${module.filename}.${getExecutiveByEmpId.name}()`);
    Executive.findAll({where: { empid: empid }})
    .then(executives => { resolve(executives); })
    .catch( err => { reject(err); });
  });
};

const getExecutiveMappedCorportatesByUUid = (uuid) => {
  return new Promise((resolve, reject) => {
    logger.info(`${module.filename}.${getExecutiveMappedCorportatesByUUid.name}()`);
    ExecutiveCorporateMapping.findAll({where: { executiveUuid: uuid }})
    .then(mappings => { resolve(mappings); })
    .catch( err => { reject(err); });
  });
};

const _validateNewExecutives = (executives) => {
  return new Promise((resolve, reject) => {

    let promises = [];
    executives.forEach(ex => {
      if (!ex.uuid) {ex.uuid = uuidv4();}
      promises.push(Executive.findOne({where: {empid: ex.empid, brokingCompanyUuid: ex.brokingCompanyUuid}}));
    });
    Promise.all(promises)
    .then(executivesFromDb => {
      let alreadyPresentExecutives = [];
      executivesFromDb.forEach(ex => {
        if (ex && ex.uuid && ex.userUuid && ex.empid) {
          logger.info(`Executive {uuid: ${ex.uuid}, empid: ${ex.empid}, name: ${ex.firstName} ${ex.lastName} } is already present`);
          alreadyPresentExecutives.push(ex);
        }
      })
      if (alreadyPresentExecutives && alreadyPresentExecutives.length !== 0) {
        logger.info(`Some customers provided for new addition are already present in table. Rejecting this request therefore.`);
        const error = new BadRequest(alreadyPresentExecutives, `User with given empid is already present.`);
        reject(error);
      } else {
        logger.info(`All customers are new.`);
        resolve(executives);
      }
    })
  })
}

const _createNewUsersAndUpdatedExecutives = (credentials, executives) => {
  return new Promise((resolve, reject) => {
    let newUsers = [];
    let passwordPromises = [];
    executives.forEach(executive => {
      logger.debug(`Creating new user from Executive : ${JSON.stringify(executive)}`)
      let user = {};
      user.uuid = uuidv4();
      executive.userUuid = user.uuid;
      user.username = executive.empid;
      user.role = executive.designation;
      user.email = executive.email ? executive.email: null;
      user.mobile = executive.mobile ? executive.mobile: null;
      user.corporateUuid = null;
      user.brokingCompanyUuid = executive.brokingCompanyUuid;
      user.password = executive.empid;
      passwordPromises.push(argon2.hash(user.password));
      newUsers.push(user);
    })

    Promise.all(passwordPromises)
    .then(passwordHashes => {
      for (let i=0; i < newUsers.length; i++) {
        newUsers[i].password = passwordHashes[i];
      }
      logger.info('Created newUsers for adding new user objects to DB.');
      resolve({newUsers: newUsers, updatedExecutives: executives});
    })
    .catch(err =>{
      logger.info('Error while creating passwords.');
      logger.error(`${JSON.stringify(err)}`);
      reject(err);
    })
  });
}

const addExecutives = (credentials, executives) => {
  return new Promise((resolve, reject) => {
    logger.info(`+${module.filename}.${addExecutives.name}()`);

    let validatedExecutives = null;
    let updatedExecutives = null;
    _validateNewExecutives(executives)
    .then(ex => {
      logger.info('New executives have been validated');
      logger.info(`${JSON.stringify(ex)}`);
      validatedExecutives = ex;
      return _createNewUsersAndUpdatedExecutives(credentials, validatedExecutives);
    })
    .then(newUserPromisesAndUpdatedExecutives => {
      logger.info('Adding new users and new executives under a single transaction.');
      updatedExecutives = newUserPromisesAndUpdatedExecutives.updatedExecutives;
      return sequelize.transaction(t => {
        logger.info(`Adding [${newUserPromisesAndUpdatedExecutives.newUsers.length}] new users....`);
        return User.bulkCreate(newUserPromisesAndUpdatedExecutives.newUsers, {transation: t})
        .then(users => {
          logger.info(`Created [${users.length}] new Users`);
          logger.info(`Adding [${newUserPromisesAndUpdatedExecutives.updatedExecutives.length}] new customers....`);
          return Executive.bulkCreate(newUserPromisesAndUpdatedExecutives.updatedExecutives, {transation: t})
        });
      })
    })
    .then(result => {
      logger.info(`Transaction successfully committed.`)
      logger.debug(`${JSON.stringify(result)}`)
      logger.info(`Successfully added [${executives.length}] executives into DB.`);
      resolve(updatedExecutives);
    })
    .catch(err => {
      console.log(err);
      logger.error(`Error while adding executives: ${JSON.stringify(err)}`);
      logger.error(`${JSON.stringify(err)}`);
      reject(err);
    });
  });
};

const getExecutiveByUserUuid = uuid => {
  return new Promise((resolve, reject) => {
    logger.info(`${module.filename} - ${getExecutiveByUserUuid.name}`);
    Executive.findOne({where: {userUuid: uuid}})
    .then(executive => {resolve(executive);})
    .catch( err => {reject(err);});
  });
};

const updateCorporateExecutives = (corporateUuid, executiveUuid) => {
  return new Promise((resolve, reject) => {
    logger.info(`${module.filename}.${updateCorporateExecutives.name}()`);
    ExecutiveCorporateMapping.destroy({ where: { corporateUuid: corporateUuid }})
    .then(ignore => {
      ExecutiveCorporateMapping.create({uuid: uuidv4(), executiveUuid: executiveUuid,  corporateUuid: corporateUuid})
      .then(ignore => {resolve(`Executive updated successfully for the corporate : ${corporateUuid}`);})
      .catch(err => {
        const error = new ServerError('ErrorUpdatingCustomers', 'Error occurred while updating Corporate. Please see data for more details.', err);
        reject(error);
      });
      });
    })
    .catch(err => {
      const error = new ServerError('ErrorUpdatingCustomers', 'Error occurred while updating Corporate. Please see data for more details.', err);
      reject(error);
    });
};

const updateEmployeeReportedIssue = (executiveUuid, complaintId, status, resolution, resolvedDate) => {
  return new Promise((resolve, reject) => {
    logger.info(`${module.filename}.${updateEmployeeReportedIssue.name}()`);
    EmployeeGrievance.update({executiveUuid:executiveUuid, status:status, resolution:resolution, dateOfDisclosure:resolvedDate},
      {where: {id:complaintId}}
    )
    .then(ignore =>{
      resolve('Issue updated successfully');
    })
    .catch(err => {
      const error = new ServerError('ErrorUpdatingCustomers', 'Error occurred while updating Customer Issues. Please see data for more details.', err);
      reject(error);
    });
})


};

const updateEmployeeReportedCallback = (executiveUuid, requestId, status, comments) => {
  return new Promise((resolve, reject) => {
    logger.info(`${module.filename}.${updateEmployeeReportedCallback.name}()`);
    InsuranceEnquiry.update({executiveUuid:executiveUuid, status:status, comments:comments},
      {where: {id:requestId}}
    )
    .then(ignore =>{
      resolve('Callback request updated successfully');
    })
    .catch(err => {
      const error = new ServerError('ErrorUpdatingCustomersCallBackRequests', 'Error occurred while updating Customer Callback requests. Please see data for more details.', err);
      reject(error);
    });
  });
};

const getExecutivesByCorporateUuid = corporateUuid => {
  return new Promise((resolve, reject) => {
    logger.info(`${module.filename}.${getExecutivesByCorporateUuid.name}()`);

    ExecutiveCorporateMapping.findAll({where: {corporateUuid: corporateUuid}})
    .then(ecMap => {
      const _getExecutivePromises = [];
      ecMap.forEach(ecm => {
        _getExecutivePromises.push(Executive.scope(['defaultScope', 'minimalFields']).findOne({where: {uuid: ecm.executiveUuid}}));
      });
      return Promise.all(_getExecutivePromises);
    })
    .then(executives => {
      const _dto = {corporateUuid: corporateUuid, executives: executives};
      resolve(_dto);
    })
    .catch(err => {
      reject(err);
    })
  });
}

const getExecutivesByManagerEmpid = (managerEmpid, executiveEmpid, brokingCompanyUuid) => {
  return new Promise((resolve, reject) => {
    logger.info(`${module.filename}.${getExecutivesByManagerEmpid.name}()`);
    let executives = [];
    const srmanagers = [];
    const managers = [];
    const _whereOptions = {};

    if (executiveEmpid) {
      _whereOptions.empid = executiveEmpid;
    }
    if (brokingCompanyUuid) {
      _whereOptions.brokingCompanyUuid = brokingCompanyUuid;
    }
    _whereOptions.supervisorEmpid = managerEmpid;

    Executive.findAll({where: _whereOptions})
    .then(result => {
      result.forEach(ex => {
        switch (ex.designation) {
          case ROLE_SRMANAGER:srmanagers.push(ex);break;
          case ROLE_MANAGER:managers.push(ex);break;
          case ROLE_EXECUTIVE:executives.push(ex);break;
        }
      })
      let promise;
      if (srmanagers && srmanagers.length > 0) {
        _whereOptions.supervisorEmpid = {[Op.or]: srmanagers.map(ex => ex.empid)};
        promise = Executive.findAll({where: _whereOptions});
      } else {
        promise = null;
      }
      return promise;
    })
    .then(result => {
      if (result && result.length > 0) {
        result.forEach(ex => {
          switch (ex.designation) {
            case ROLE_MANAGER:managers.push(ex);break;
            case ROLE_EXECUTIVE:executives.push(ex);break;
          }
        })
      }
      let promise;
      if (managers && managers.length > 0) {
        _whereOptions.supervisorEmpid = {[Op.or]: managers.map(ex => ex.empid)};
        promise = Executive.findAll({where: _whereOptions});
      } else {
        promise = null;
      }
      return promise;
    })
    .then(result => {
      if (result && result.length > 0) {
        executives = executives.concat(result).flat();
      }
      resolve(executives);
    })
    .catch(err => {
      reject(err);
    })
  });
}

module.exports = {
  addExecutives: addExecutives,
  getAllExecutivesByBrokingCompanyUuid: getAllExecutivesByBrokingCompanyUuid,
  getExecutiveByEmpId: getExecutiveByEmpId,
  getExecutiveByUserUuid: getExecutiveByUserUuid,
  getExecutiveMappedCorportatesByUUid: getExecutiveMappedCorportatesByUUid,
  getExecutives: getExecutives,
  getExecutivesByCorporateUuid : getExecutivesByCorporateUuid,
  getExecutivesByManagerEmpid: getExecutivesByManagerEmpid,
  updateCorporateExecutives: updateCorporateExecutives,
  updateEmployeeReportedCallback: updateEmployeeReportedCallback,
  updateEmployeeReportedIssue: updateEmployeeReportedIssue,
};
