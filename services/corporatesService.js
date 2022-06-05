"use strict";

const {v4: uuidv4} = require('uuid');
const {BrokingCompany, Corporate, CorporateHR, Customer, Executive, ExecutiveCorporateMapping, sequelize} = require('../models');
const {Op} = require('sequelize');
const {logger} = require('../config/logger');
const loginDomains = require('../helpers/logindomains');
const {InvalidCorporate, DuplicateCorporate, InvalidCorporateStatus} = require('../errors/corporateErrors');
const {ServerError} = require('../errors/serverError');
const executivesService = require('./executivesService');
const {BadRequest} = require("../errors/invalidQueryParams");
const {InvalidCredentials} = require("../errors/invalidCredentials");
const {ROLE_SUPERUSER, ROLE_SRMANAGER, ROLE_MANAGER, ROLE_EXECUTIVE, ROLE_HR, ROLE_CUSTOMER} = require("./employeeStatus");

const getCorporateNames = () => {
  return new Promise( (resolve, reject) => {
    Corporate.scope('companyName').findAll()
    .then(corporates => { resolve(corporates); })
    .catch(e => {reject(e);} );
  });
};

const _getCorporatesByExecutives = (executives, status) => {
  return new Promise( (resolve, reject) => {
    let _ecMap;
    const _executiveUuids = executives.map(e => { return {executiveUuid: e.uuid}});

    ExecutiveCorporateMapping.findAll({where: {[Op.or]: _executiveUuids}})
    .then(execCorpMaps => {
      if (!execCorpMaps || execCorpMaps.length === 0) {
        throw('No executive corporate mappings found');
      }
      _ecMap = execCorpMaps;
      const _corporateUuids = execCorpMaps.map(ec => {return ec.corporateUuid;})
      const _whereOptions = {uuid: {[Op.or]: _corporateUuids}};
      if (status) {_whereOptions.status = status;}
      return Corporate.findAll({where: _whereOptions})
    })
    .then(corporates => {
      if (!corporates || corporates.length === 0) {
        throw('No corporate found');
      }
      corporates.forEach(c => {
        const _linkedECMap = _ecMap.filter(ec => ec.corporateUuid === c.uuid);
        const _linkedExecutives = [];
        if (_linkedECMap && _linkedECMap.length > 0) {
          _linkedECMap.forEach(ec => {
            const _exec = executives.find(e => e.uuid === ec.executiveUuid);
            if (_exec) {
              _linkedExecutives.push(_exec);
            }
          })
        }
        c.dataValues.linkedExecutives = _linkedExecutives;
      })
      resolve(corporates);
    })
    .catch(error => {
      switch (error) {
        case 'No executive corporate mappings found':
        case 'No corporate found':
          resolve([]);
          break;
        default:
          reject(error);
      }
    });
  })
}

const _getCorporatesForManager = (credentials, status) => {
  return new Promise( (resolve, reject) => {
    executivesService.getExecutivesByManagerEmpid(credentials.empid)
    .then(executives => {
      if (!executives || executives.length === 0) {
        throw('No mapped executives found');
      }
      return _getCorporatesByExecutives(executives, status);
    })
    .then(corporates => {
      if (!corporates || corporates.length === 0) {
        throw('No corporates found');
      }
      resolve(corporates);
    })
    .catch(error => {
      switch (error) {
        case 'No mapped executives found':
        case 'No corporates found':
          resolve([]);
          break;
        default:
          reject(error);
      }
    });
  })
}

function _getCorporatesForExecutive(credentials, status) {
  return new Promise( (resolve, reject) => {
    let _exec;
    const _dto =[];

    Executive.scope('defaultScope', 'minimalFields').findOne({where: {userUuid: credentials.uuid}})
    .then(executive => {
      _exec = executive;
      return ExecutiveCorporateMapping.scope('defaultScope').findAll({
        attributes: ['corporateUuid'],
        where: {executiveUuid: executive.uuid}
      });
    })
    .then(corporateUuids => {
      if (!corporateUuids || corporateUuids.length === 0) {
        return [];
      }
      const _whereOptions = {};
      const _corporateUuids = corporateUuids.map(c => {
        return c.corporateUuid;
      });
      _whereOptions.uuid = {[Op.or]: _corporateUuids};
      if (status) {_whereOptions.status = status;}
      return Corporate.scope(['defaultScope', 'minimalFields']).findAll({where: _whereOptions})
    })
    .then(corporates => {
      corporates.forEach(c => {
        if (c) {
          c.dataValues.linkedExecutives = [_exec]
          _dto.push(c);
        }
      });
      resolve(_dto);
    })
    .catch(error => {
      reject(error);
    });
  });
}

function _getCorporatesForHr(credentials, status) {
  return new Promise( (resolve, reject) => {
    const _dto = [];
    CorporateHR.scope('defaultScope').findOne({where: {userUuid: credentials.uuid}})
    .then(chr => {
      const _whereOptions = {};
      _whereOptions.uuid = chr.corporateUuid;
      if (status) { _whereOptions.status = status}
      return Corporate.scope(['defaultScope', 'minimalFields']).findOne({where: _whereOptions});
    })
    .then(c => {
      if (c) {
        c.dataValues.linkedExecutives = [];
        _dto.push(c);
      }
      resolve(_dto);
    })
    .catch(e => {
      reject(e);
    });
  });
}

const getCorporates = (credentials, status) => {
  return new Promise( (resolve, reject) => {
    logger.info(`${module.id}-${getCorporates.name}()`);

    switch(credentials.role) {
      case ROLE_SUPERUSER:
      case ROLE_SRMANAGER:
      case ROLE_MANAGER:
        _getCorporatesForManager(credentials, status)
        .then(corporates => {resolve(corporates);})
        .catch(error => {reject(error);});
        break;

      case ROLE_EXECUTIVE:
        _getCorporatesForExecutive(credentials, status)
        .then(corporates => {resolve(corporates);})
        .catch(error => {reject(error);});
        break;

      case ROLE_HR:
        _getCorporatesForHr(credentials, status)
        .then(corporates => {resolve(corporates);})
        .catch(error => {reject(error);});
        break;

      case ROLE_CUSTOMER:
      default:
        const message = `Invalid role provided to query corporates`;
        const data = {role: credentials.role};
        const err = new InvalidCredentials(message, data);
        reject(err);
        break;
    }
  });
};

const getCorporatesByUuid = uuid => {
  return new Promise( (resolve, reject) => {
    Corporate.scope(['defaultScope', 'minimalFields']).findOne({where: {uuid: uuid}})
    .then(corporate => { resolve(corporate); })
    .catch(e => {reject(e);} );
  });
};

const getCorporateNameByUuid = uuid => {
  return new Promise( (resolve, reject) => {
    logger.info(`${module.id} - ${getCorporateNameByUuid.name}()`);
    Corporate.scope('companyName').findOne({where: {uuid: uuid}})
    .then(companyName => {
      resolve(companyName);
    })
    .catch(e => {
      logger.error(`error: ${JSON.stringify(e)}`);
      reject(e);
    });
  });
};

const getCorporateByCompanyName = companyName => {
  return new Promise( (resolve, reject) => {
    Corporate.scope(['defaultScope', 'minimalFields']).findOne({where: {companyName: companyName}})
    .then(corporate => { resolve(corporate); })
    .catch(e => {reject(e);} );
  });
};

const getCorporateByDisplayName = displayName => {
  return new Promise( (resolve, reject) => {
    Corporate.scope(['defaultScope', 'minimalFields']).findOne({where: {displayName: displayName}})
    .then(corporate => { resolve(corporate); })
    .catch(e => {reject(e);} );
  });
};

const addCorporates = (credentials, corporates) => {
  return new Promise((resolve, reject) => {
    logger.debug(`+${module.id}.${addCorporates.name}()`);
    const userUuid = credentials.uuid;
    logger.info(`Received [${corporates.length}] corporates to add, with logged in manager/executive UUID as [${userUuid}]`);

    let _brokingCompanyUuid, _brokingCompanyName, _executiveUuid;
    let _promises = [];
    logger.info(`Finding executive details for logged in user: [${userUuid}]`);
    Executive.scope('defaultScope').findOne({where: {userUuid: userUuid}})
    .then(executive => {
      logger.info(`Found matching executive {uuid: ${executive.uuid}, userUuid: ${executive.userUuid}, firstName: ${executive.firstName} }`);
      _executiveUuid = executive.uuid;
      _brokingCompanyUuid = executive.brokingCompanyUuid;
      return BrokingCompany.scope('defaultScope').findOne({where: {uuid: _brokingCompanyUuid}});
    })
    .then(bc => {
      _brokingCompanyName = bc.companyName;
      corporates.forEach(corp => {
        _promises.push(_addCorporateIntoDb(_executiveUuid, corp));
      });
      logger.info(`Going to execute promises to create corporates.`);
      return Promise.all(_promises)
    })
    .then(result => {
      logger.info('All given corporates have been added.');
      logger.debug(`${JSON.stringify(result)}`);
      resolve(result);
    })
    .catch(err => {
      console.error(err);
      reject(err);
    })
  });
};

const addHRsByCorporate = (corporateUuid, hrList) => {
  return new Promise( (resolve, reject) => {
    let promises = [];
    hrList.forEach(hr => {
      hr.uuid = uuidv4();
      hr.corporateUuid = corporateUuid;
      promises.push(CorporateHR.create(hr));
    });
    Promise.all(promises)
    .then(result => {
      resolve(result);
    })
    .catch(err => {
      console.error(err);
      reject(err);
    })
  });
};

const _addCorporateIntoDb = (executiveUuid, corporate) => {
  return new Promise((resolve, reject) => {
    let _result = null;
    if (!corporate) {
      throw(new InvalidCorporate('An invalid or empty Corporate object was sent for inserting to DB. Please recheck your input and submit again.'));
    }

    logger.info(`executiveUuid: ${executiveUuid}`);
    Corporate.scope(['defaultScope', 'minimalFields']).findOne({where: {companyName: corporate.companyName.trim()}})
    .then(corp => {
      if (corp && corp.uuid) {
        throw(new DuplicateCorporate('A corporate with the given name is already present.', corp));
      }
      corporate.uuid = (corporate.uuid) ? corporate.uuid: uuidv4();
      corporate.status = 'new';
      return sequelize.transaction(t => {
        logger.info(`Adding new corporate [${corporate.uuid}]`);
        return Corporate.create(corporate, {transation: t})
        .then(createdCorporate => {
          _result = createdCorporate;
          logger.info(`Created Corporate: ${JSON.stringify(_result)}`);
          logger.info(`executiveUuid: ${executiveUuid}`);
          logger.info(`corporateUuid: ${_result.uuid}`);
          return ExecutiveCorporateMapping.create(
            {uuid: uuidv4(), executiveUuid: executiveUuid,  corporateUuid: _result.uuid},
            {transation: t});
        });
      })
      .then(txnResult => {
        logger.info(`Transaction successfully committed.`)
        logger.debug(`${JSON.stringify(txnResult)}`)
        resolve(_result);
      })
      .catch(err => {
        logger.error(`${JSON.stringify(err)}`);
        reject(err)
      });
    })
    .catch(err => {
      logger.error(`${JSON.stringify(err)}`);
      reject(err)
    });
  });
};

const searchCorporates = searchStr => {
  return new Promise((resolve, reject) => {
    logger.debug(`${module.id} - ${searchCorporates.name}()`);
    logger.info(`Searching for names of corporates containing [${searchStr}]`);
    Corporate.scope(['defaultScope', 'minimalFields']).findAll({
      where: {companyName: {[Op.substring]: searchStr}},
      attributes: ['companyName', 'uuid'],
      order: [['companyName', 'ASC']]
    })
    .then(corporates => {
      logger.info(`Search found [${corporates.length}] records`);
      logger.debug(corporates);
      resolve(corporates);
    })
    .catch(err => {
      const error = new ServerError('CorporateSearchError', 'Error occurred during search for corporate names', err);
      reject(error);
    });
  });
};

const VALID_CORPORATE_STATUS = ['new', 'approved'];
const _getUpdateFields = (modified, orig) => {
  let updateFields = {};
  let _orig = orig.dataValues; // We are relying on Sequelize providing a dataValues. If they change this internally, this method won't work.

  Object.keys(_orig).forEach(key => {
    switch (key) {
      case 'uuid': // Intentionally skip these fields. They should not be modified by server even if sent.
      case 'createdAt':
      case 'updatedAt':
        break;

      case 'status':
        logger.verbose(`key: ${key}`);
        if (modified.hasOwnProperty(key)) {
          if (!VALID_CORPORATE_STATUS.includes(modified.status)) {
            throw(new InvalidCorporateStatus(modified.status));
          }
          if (modified.status !== orig.status) { updateFields.status = modified.status; }
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
};

const updateCorporate = (credentials, modifiedCorporate) => {
  return new Promise((resolve, reject) => {
    logger.info(`+${module.id} - ${updateCorporate.name}()`);
    logger.debug(`To modify: ${JSON.stringify(modifiedCorporate)}`);
    logger.info(`Received [${Object.keys(modifiedCorporate).length - 1}] field(s) to update.`);

    let _updateFields = null;
    let _rowsUpdated = 0;
    let _existingCorporate = null;

    Corporate.scope(['defaultScope', 'minimalFields']).findOne({where: {uuid: modifiedCorporate.uuid}})
    .then(corp => {
      logger.debug(`original: ${JSON.stringify(corp)}`);
      _existingCorporate = corp;
      logger.debug(`_existingCorporate: ${JSON.stringify(_existingCorporate)}`);
      if (modifiedCorporate.companyName && modifiedCorporate.companyName !== _existingCorporate.companyName) {
        logger.debug(`Checking if corporate with new companyName [${modifiedCorporate.companyName}] is already present.`);
        return Corporate.scope(['defaultScope', 'minimalFields']).findOne({where: {companyName: modifiedCorporate.companyName}});
      } else {
        logger.debug(`returning null`);
        return Promise.resolve(null);
      }
    })
    .then(duplicateCorp => {
      if (duplicateCorp) {
        logger.debug(`Duplicate corporate found for new companyName [${duplicateCorp.companyName}].`);
        throw(
          new DuplicateCorporate(
            'companyName provided for modify already belongs to another corporate.',
            {companyName: duplicateCorp.companyName}
            )
        );
      }

      if (modifiedCorporate.displayName && modifiedCorporate.displayName !== _existingCorporate.displayName) {
        logger.debug(`Checking if corporate with new displayName [${modifiedCorporate.displayName}] is already present.`);
        return Corporate.scope(['defaultScope', 'minimalFields']).findOne({where: {displayName: modifiedCorporate.displayName}});
      } else {
        logger.debug(`returning null`);
        return Promise.resolve(null);
      }
    })
    .then(duplicateCorp => {
      if (duplicateCorp) {
        logger.debug(`Duplicate corporate found for new displayName [${duplicateCorp.displayName}].`);
        throw(
          new DuplicateCorporate(
            'companyName provided for modify already belongs to another corporate.',
            {uuid: duplicateCorp.uuid, displayName: duplicateCorp.displayName, companyName: duplicateCorp.companyName}
          )
        );
      }

      _updateFields = _getUpdateFields(modifiedCorporate, _existingCorporate);
      logger.info(`updateFields: ${JSON.stringify(_updateFields)}`);

      if (!Object.keys(_updateFields).length) {
        resolve('Nothing to update. Modified values appear to be same as existing values.')
      } else {
        let options = {};
        options.where = {uuid: modifiedCorporate.uuid};
        // options.returning = true; // According to Sequelize docs, this option works only on PostgreSQL.

        return Corporate.update(_updateFields, options);
      }
    })
    .then((rowsUpdated, ignoreUpdatedCorps) => { // ignoreUpdatedCorps seen only on PostgreSQL
      _rowsUpdated = rowsUpdated;
      logger.info(`Finished updating [${rowsUpdated}] corporates.`);

      // Table updated, now update subdomain in json
      if (modifiedCorporate.status !== 'approved') {
        resolve(`${_rowsUpdated} rows updated`);
      } else {
        logger.info(`Going to update subdomains.`);
        return loginDomains.addSubdomain({
          corporateDisplayName: modifiedCorporate.displayName || _existingCorporate.displayName,
          corporateName: modifiedCorporate.companyName || _existingCorporate.companyName,
          brokingCompanyUuid: credentials.brokingCompanyUuid
        });
      }
    })
    .then(subdomain => {
      logger.info(`new Subdomain: ${JSON.stringify(subdomain)}`);
      resolve({subdomain: subdomain});
    })
    .catch(err => {
      logger.error(err);
      if (err.status) {
        reject(err);
      } else {
        reject(new ServerError(
          'ErrorUpdatingCustomers',
          'Error occurred while updating Corporate. Please see data for more details.',
          err
        ));
      }
    });
  });
}

const _getCorporatesForCustomer = credentials => {
  return new Promise((resolve, reject) => {
    logger.info(`${module.id} - ${_getCorporatesForCustomer.name}()`);
    logger.info(`credentials: ${JSON.stringify(credentials)}`);

    Customer.findOne({where: {userUuid: credentials.uuid}})
    .then(c => {
      if (!c) {
        const error = new BadRequest(null, `Customer not found with given username.`);
        throw(error);
      }
      return getCorporatesByUuid(c.corporateUuid);
    })
    .then(corp => {
      if (!corp) {
        const error = new BadRequest(null, `Corporate not found for customer with given username.`);
        throw(error);
      }
      resolve(corp);
    })
    .catch(err => {
      reject(err);
    })
  });
}

const getCorporatesByUserCredentials = credentials => {
  return new Promise((resolve, reject) => {
    logger.info(`${module.id} - ${getCorporatesByUserCredentials.name}()`);
    let _promise;
    switch (credentials.role) {
      case ROLE_CUSTOMER:
        _promise = _getCorporatesForCustomer(credentials);
        break;
      case ROLE_HR:
        _promise = _getCorporatesForHr(credentials);
        break;
      case ROLE_EXECUTIVE:
        _promise = _getCorporatesForExecutive(credentials);
        break;
      case ROLE_SUPERUSER:
      case ROLE_SRMANAGER:
      case ROLE_MANAGER:
        _promise = _getCorporatesForManager(credentials);
        break;
    }

    _promise
    .then(corporates => {
      resolve(corporates);
    })
    .catch(err => {
      reject(err);
    });
  });
};


const updateCorporateExecutive = (credentials, data) => {
  return new Promise((resolve, reject) => {  
    Executive.scope('defaultScope', 'minimalFields').findOne({where: {uuid: data.executiveUuid}})
    .then(res => {        
        if (!res) {
         const error = new BadRequest(null, `Excutive not found with that uuuid.`);
         throw(error);
       }
       return ExecutiveCorporateMapping.findOne({where: {corporateUuid: data.corporateUuid}});    
    }) 
    .then(res => { 
      if (!res) {
        const error = new BadRequest(null, `Corporate mapping not found.`);
        throw(error);
      }
      return ExecutiveCorporateMapping.update({executiveUuid: data.executiveUuid}, {where: {corporateUuid: data.corporateUuid}});
     })
     .then(ignoreRes => {
       resolve({executiveUuid:data.executiveUuid, corporateUuid: data.corporateUuid});        
     })
    .catch(err => {     
      reject(err);      
    });
  });
};

module.exports = {
  getCorporateByDisplayName: getCorporateByDisplayName,
  getCorporates: getCorporates,
  getCorporateByCompanyName: getCorporateByCompanyName,
  getCorporatesByUserCredentials: getCorporatesByUserCredentials,
  getCorporatesByUuid: getCorporatesByUuid,
  getCorporateNameByUuid: getCorporateNameByUuid,
  getCorporateNames: getCorporateNames,
  addCorporates: addCorporates,
  addHRsByCorporate: addHRsByCorporate,
  searchCorporates: searchCorporates,
  updateCorporate: updateCorporate,
  updateCorporateExecutive: updateCorporateExecutive
}
