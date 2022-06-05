"use strict";

const argon2 = require('argon2');
const {logger} = require('../config/logger');
const {v4: uuidv4} = require('uuid');
const {Op} = require('sequelize');
const {Ailment, Corporate, CorporateHR, Customer, Executive, ExecutiveCorporateMapping} = require('../models');
const {InsuranceCompany, Policy, PolicyAilmentMapping, NetworkHospital, sequelize, TPA, User } = require('../models');
const {BadRequest} = require('../errors/invalidQueryParams');
const {UnauthorizedAccess} = require('../errors/invalidCredentials');

const tpasService = require('./tpasService');
const insuranceCompaniesService = require('./insuranceCompaniesService');
const corporatesService = require('./corporatesService');
const tpaHelper = require('../helpers/tpaHelper');
const employeeStatus = require('./employeeStatus');

const POLICY_ATTRIBUTES = [
  'uuid',
  ['tpaUuid', 'TPAUUID'],
  ['corporateUuid', 'corporateUUID'],
  ['insuranceCompanyUuid', 'insuranceCompanyUUID'],
  ['policyId', 'policyNumber'],
  'fromDate',
  'toDate',
  'policyYear',
  'familyDefinition',
  'numberOfFamilies',
  'numberOfDependents',
  'sumInsured',
  'premiumPerFamily',
  'premiumPerDependent',
  ['opd', 'OPD'],
  'maternityCover',
  'maternityLimit',
  'babyCoverDayOne',
  'preExistingCover',
  'firstYearExclusions',
  'secondYearExclusions',
  'congenitalDiseasesInternal',
  'congenitalDiseasesExternal',
  'corporateBufferAndConditions',
  'categories',
  'roomRentLimits',
  'copay',
  'parentalSubLimit',
  'parentalCopay',
  ['opdLimit', 'OPDLimit'],
  'appendicitis',
  'hernia',
  'arthiritis',
  'digestiveDisorders',
  'cataract',
  'gallBladderAndHisterectomy',
  'kneeReplacement',
  'jointReplacementIncludingVertrebalJoints',
  'treatmentForKidneyStones',
  'piles',
  'hydrocele',
  'lasikSurgery',
  'wellnessProgram',
  'helpdeskSchedule',
  'others',
  ['visistaSpoc1Name', 'visistaSPOC1Name'],
  ['visistaSpoc1Designation', 'visistaSPOC1Designation'],
  ['visistaSpoc1Email', 'visistaSPOC1Email'],
  ['visistaSpoc1Mobile', 'visistaSPOC1Mobile'],
  ['visistaSpoc2Name', 'visistaSPOC2Name'],
  ['visistaSpoc2Designation', 'visistaSPOC2Designation'],
  ['visistaSpoc2Email', 'visistaSPOC2Email'],
  ['visistaSpoc2Mobile', 'visistaSPOC2Mobile'],
  ['visistaSpoc3Name', 'visistaSPOC3Name'],
  ['visistaSpoc3Designation', 'visistaSPOC3Designation'],
  ['visistaSpoc3Email', 'visistaSPOC3Email'],
  ['visistaSpoc3Mobile', 'visistaSPOC3Mobile'],
  ['tpaSpoc1Name', 'TPASPOC1Name'],
  ['tpaSpoc1Designation', 'TPASPOC1Designation'],
  ['tpaSpoc1Email', 'TPASPOC1Email'],
  ['tpaSpoc1Mobile', 'TPASPOC1Mobile'],
  ['tpaSpoc2Name', 'TPASPOC2Name'],
  ['tpaSpoc2Designation', 'TPASPOC2Designation'],
  ['tpaSpoc2Email', 'TPASPOC2Email'],
  ['tpaSpoc2Mobile', 'TPASPOC2Mobile'],
  ['tpaSpoc3Name', 'TPASPOC3Name'],
  ['tpaSpoc3Designation', 'TPASPOC3Designation'],
  ['tpaSpoc3Email', 'TPASPOC3Email'],
  ['tpaSpoc3Mobile', 'TPASPOC3Mobile'],
  ['clientSpoc1Empid', 'clientSPOC1Empid'],
  ['clientSpoc1Name', 'clientSPOC1Name'],
  ['clientSpoc1Email', 'clientSPOC1Email'],
  ['clientSpoc1Designation', 'clientSPOC1Designation'],
  ['clientSpoc1Mobile', 'clientSPOC1Mobile'],
  ['clientSpoc2Empid', 'clientSPOC2Empid'],
  ['clientSpoc2Name', 'clientSPOC2Name'],
  ['clientSpoc2Designation', 'clientSPOC2Designation'],
  ['clientSpoc2Email', 'clientSPOC2Email'],
  ['clientSpoc2Mobile', 'clientSPOC2Mobile'],
  ['clientSpoc3Empid', 'clientSPOC3Empid'],
  ['clientSpoc3Name', 'clientSPOC3Name'],
  ['clientSpoc3Designation', 'clientSPOC3Designation'],
  ['clientSpoc3Email', 'clientSPOC3Email'],
  ['clientSpoc3Mobile', 'clientSPOC3Mobile'],
  'status',
  'active'
];

const getPolicies = (credentials, corporateUuid) => {
  return new Promise((resolve, reject) => {
    logger.info(`${module.id} - ${getPolicies.name}()`);
    logger.info(`role: ${credentials.role}, uuid: ${credentials.uuid}, corporateUuid: ${corporateUuid}`);

    let _corporates = [];
    let _policies = [];

    corporatesService.getCorporatesByUserCredentials(credentials)
    .then(corporates => {
      const _whereOptions = {};
      if (Array.isArray(corporates)) {
        logger.info(`${corporates.length} corporates received`);
        _corporates = corporates;
        const _corporateUuids = corporates.map(c => {return c.uuid;});
        _whereOptions.corporateUuid = {[Op.or]: _corporateUuids};
      } else {
        logger.info(`1 corporate received`);
        _corporates.push(corporates);
        _whereOptions.corporateUuid = corporates.uuid;
      }
      return Policy.findAll({where: _whereOptions, attributes: POLICY_ATTRIBUTES})
    })
    .then(policies => {
      let _tpaPromises = [];
      _policies = policies.flat();
      _policies.forEach(p => {
        logger.verbose(`policy: {uuid: ${p.dataValues.uuid}}`);
        const c1 = _corporates.find(
          c => c.uuid === p.dataValues.corporateUUID
        );
        p.dataValues.companyName = c1.companyName;
        const tpaByUuid = tpasService.getTpaNameByUuid(p.dataValues.TPAUUID);
        _tpaPromises.push(tpaByUuid);
      });
      return Promise.all(_tpaPromises);
    })
    .then(tpas => {
      logger.verbose(`tpas: ${JSON.stringify(tpas)}`);
      let _insuranceCompanyPromises = [];
      _policies.forEach(p => {
        const tpa = tpas.find(({uuid}) => uuid === p.dataValues.TPAUUID);
        p.dataValues.TPAName = tpa.companyName;
        const insuranceCompanyByUuid = insuranceCompaniesService.getInsuranceCompanyNameByUuid(p.dataValues.insuranceCompanyUUID);
        _insuranceCompanyPromises.push(insuranceCompanyByUuid);
      });
      return Promise.all(_insuranceCompanyPromises);
    })
    .then(insuranceCompanies => {
      logger.verbose(`insuranceCompanies: ${JSON.stringify(insuranceCompanies)}`);
      _policies.forEach(p => {
        const insuranceCompany = insuranceCompanies.find(({uuid}) => uuid === p.dataValues.insuranceCompanyUUID);
        p.dataValues.insuranceCompanyName = insuranceCompany.companyName;
      });
      resolve(_policies);
    })
    .catch(err => {
      reject(err);
    })
  });
};


const getPoliciesByTpa = tpaUuid => {
  return new Promise((resolve, reject) => {
    let result = {};
    TPA.findOne({where: {uuid: tpaUuid}})
    .then(t => {
      result.tpa = t;
      return Policy.findAll({where: {tpaUuid: t.uuid}, attributes: POLICY_ATTRIBUTES});
    })
    .then(p => {
      result.policies = p;
      resolve(p);
    })
    .catch(err => {
      reject(err);
    })
  });
};

const getPoliciesByCorporate = (corporateUuid) => {
  return new Promise((resolve, reject) => {
    let result = {};
    Corporate.findOne({where: {uuid: corporateUuid}})
    .then(c => {
      result.corporate = c;
      return Policy.findAll({where: {corporateUuid: c.uuid}, attributes: POLICY_ATTRIBUTES});
    })
    .then(p => {
      result.policies = p;
      resolve(p);
    })
    .catch(err => {
      reject(err);
    })
  });
};

const getPoliciesByInsuranceCompany = (insuranceCompanyUuid) => {
  return new Promise((resolve, reject) => {
    let result = {};
    InsuranceCompany.findOne({where: {uuid: insuranceCompanyUuid}})
    .then(i => {
      result.insuranceCompany = i;
      return Policy.findAll({where: {insuranceCompanyUuid: i.uuid}, attributes: POLICY_ATTRIBUTES});
    })
    .then(p => {
      result.policies = p;
      resolve(p);
    })
    .catch(err => {
      reject(err);
    })
  });
};

const getPoliciesByTpaByCorporate = (tpaUuid, corporateUuid) => {
  return new Promise((resolve, reject) => {
    let result = {};
    TPA.findOne({where: {uuid: tpaUuid}})
    .then(t => {
      result.tpa = t;
      return Corporate.findOne({where: {uuid: corporateUuid}});
    })
    .then(c => {
      result.corporate = c;
      return Policy.findAll(
        {
          where: {
            [Op.and]: [
              {tpaUuid: tpaUuid},
              {corporateUuid: corporateUuid}
            ]
          },
          attributes: POLICY_ATTRIBUTES
        });
    })
    .then(p => {
      result.policies = p;
      resolve(p);
    })
    .catch(err => {
      reject(err);
    })
  });
};

const getPoliciesByTpaByInsuranceCompany = (tpaUuid, insuranceCompanyUuid) => {
  return new Promise((resolve, reject) => {
    let result = {};
    TPA.findOne({where: {uuid: tpaUuid}})
    .then(t => {
      result.tpa = t;
      return InsuranceCompany.findOne({where: {uuid: insuranceCompanyUuid}});
    })
    .then(i => {
      result.insuranceCompany = i;
      return Policy.findAll(
        {
          where: {
            [Op.and]: [
              {tpaUuid: tpaUuid},
              {insuranceCompanyUuid: insuranceCompanyUuid}
            ]
          },
          attributes: POLICY_ATTRIBUTES
        });
    })
    .then(p => {
      result.policies = p;
      resolve(p);
    })
    .catch(err => {
      reject(err);
    })
  });
};

const getPoliciesByCorporateByInsuranceCompany = (corporateUuid, insuranceCompanyUuid) => {
  return new Promise((resolve, reject) => {
    let result = {};
    Corporate.findOne({where: {uuid: corporateUuid}})
    .then(c => {
      result.corporate = c;
      return InsuranceCompany.findOne({where: {uuid: insuranceCompanyUuid}});
    })
    .then(i => {
      result.insuranceCompany = i;
      return Policy.findAll(
        {
          where: {
            [Op.and]: [
              {corporateUuid: corporateUuid},
              {insuranceCompanyUuid: insuranceCompanyUuid}
            ]
          },
          attributes: POLICY_ATTRIBUTES
        });
    })
    .then(p => {
      result.policies = p;
      resolve(p);
    })
    .catch(err => {
      reject(err);
    })
  });
};

const getPoliciesByTpaByCorporateByInsuranceCompany = (tpaUuid, corporateUuid, insuranceCompanyUuid) => {
  return new Promise((resolve, reject) => {
    let result = {};
    TPA.findOne({where: {uuid: tpaUuid}})
    .then(t => {
      result.tpa = t;
      return Corporate.findOne({where: {uuid: corporateUuid}});
    })
    .then(c => {
      result.corporate = c;
      return InsuranceCompany.findOne({where: {uuid: insuranceCompanyUuid}});
    })
    .then(i => {
      result.insuranceCompany = i;
      return Policy.findAll(
        {
          where: {
            [Op.and]: [
              {tpaUuid: tpaUuid},
              {corporateUuid: corporateUuid},
              {insuranceCompanyUuid: insuranceCompanyUuid}
            ]
          },
          attributes: POLICY_ATTRIBUTES
        });
    })
    .then(p => {
      result.policies = p;
      resolve(p);
    })
    .catch(err => {
      reject(err);
    })
  });
};

const getPolicyForCustomerByPolicyId = (userUuid, policyId) => {
  return new Promise((resolve, reject) => {
    let dto = {};
    Customer.findOne({where: {userUuid: userUuid}})
    .then(c => {
      if (!c) {
        const error = new UnauthorizedAccess(`Customer not found with given UUID.`, {userUuid: userUuid});
        throw(error);
      } else {
        dto.customer = c;
        return Corporate.findOne({where: {uuid: c.corporateUuid}})
      }
    })
    .then(corp => {
      if (!corp) {
        const error = new UnauthorizedAccess(`Matching Corporate not found for customer with given username.`);
        throw(error);
      } else {
        dto.corporate = corp;
        return Policy.findAll({
          where: {
            [Op.and]: [{corporateUuid: corp.uuid}, {policyId: policyId}]
          },
          attributes: POLICY_ATTRIBUTES
        })
      }
    })
    .then(p => {
      if (!p) {
        const error = new BadRequest({policyId: policyId}, `Policy with given id not found.`);
        reject(error);
      } else {
        dto.policy = p;
        resolve(dto);
      }
    })
    .catch(err => {
      reject(err);
    })
  });
};

const getPolicyForHrByPolicyId = (userUuid, policyId) => {
  return new Promise((resolve, reject) => {
    logger.info(`${module.id} - ${getPolicyForHrByPolicyId.name}`)

    let dto = {};
    CorporateHR.findOne({where: {userUuid: userUuid}})
    .then(chr => {
      if (!chr) {
        const error = new UnauthorizedAccess(`Manager not found with given username.`);
        throw(error);
      } else {
        dto.corporateHr = chr;
        return Corporate.findOne({where: {uuid: chr.corporateUuid}})
      }
    })
    .then(corp => {
      if (!corp) {
        const error = new UnauthorizedAccess(`Matching Corporate not found for HR.`);
        throw(error);
      } else {
        dto.corporate = corp;
        return Policy.findAll({
          where: {
            [Op.and]: [{corporateUuid: corp.uuid}, {policyId: policyId}]
          },
          attributes: POLICY_ATTRIBUTES
        })
      }
    })
    .then(p => {
      if (!p) {
        const error = new BadRequest({policyId: policyId}, `Policy with given id not found.`);
        reject(error);
      } else {
        dto.policy = p;
        resolve(dto.policy);
      }
    })
    .catch(err => {
      reject(err);
    })
  });
};

const getPolicyForExecutiveByPolicyId = (userUuid, policyId) => {
  return new Promise((resolve, reject) => {
    let dto = {};
    Executive.findOne({where: {userUuid: userUuid}})
    .then(e => {
      if (!e) {
        const error = new UnauthorizedAccess(`Executive not found with given username.`);
        throw(error);
      } else {
        dto.executive = e;
        return ExecutiveCorporateMapping.findAll({where: {executiveUuid: e.uuid}})
      }
    })
    .then(ecMap => {
      if (!ecMap) {
        const error = new UnauthorizedAccess(`Corporates not found for executive.`);
        throw(error);
      } else {
        dto.ecMap = ecMap;
        return Policy.findOne({where: {policyId: policyId}, attributes: POLICY_ATTRIBUTES});
      }
    })
    .then(p => {
      let isPolicyManagedByThisExecutive = false;
      for (let ec of dto.ecMap) {
        if (ec.executiveUuid === dto.executive.uuid && ec.corporateUuid === p.corporateUUID) {
          isPolicyManagedByThisExecutive = true;
          break;
        }
      }
      if (!isPolicyManagedByThisExecutive) {
        const error = new BadRequest({policyId: policyId}, `Policy not found for given (policyId, executive, corporate) combo.`);
        reject(error);
      } else {
        dto.policy = p;
        resolve(dto);
      }
    })
    .catch(err => {
      reject(err);
    })
  });
};

const getPolicyByPolicyId = policyId => {
  return new Promise((resolve, reject) => {
    Policy.findOne({where: {policyId: policyId},
      attributes: POLICY_ATTRIBUTES
    })
    .then(p => {
      resolve(p);
    })
    .catch(err => {
      reject(err);
    });
  });
};

const getNetworkHospitalsByPolicyId = policyId => {
  return new Promise((resolve, reject) => {
    logger.debug(`${module.id} - ${getNetworkHospitalsByPolicyId.name}()`);
    Policy.findOne({where: {policyId: policyId}, attributes: POLICY_ATTRIBUTES})
    .then(policy => {
      if (!policy) {
        logger.error(`No policy found with policyid ${policyId}`)
        throw({
          httpError: 400,
          errCode: 'NoPolicyFoundForPolicyId',
          msg: 'No policy was found with given policyId'
        });
      }

      logger.debug(`Found policy [${policy.uuid}] with policy ${policy.policyNumber}`);
      return NetworkHospital.findAll({where: {tpaUuid: policy.TPAUUID}});
    })
    .then(networkHospitals => {
      if (!networkHospitals || networkHospitals.length === 0) {
        logger.error(`No network hospitals for given policyid ${policyId}`)
        throw({
          httpError: 400,
          errCode: 'NoNetworkHospitalFoundForPolicyId',
          msg: 'No network hospital was found for given policyId'
        });
      }

      logger.error(`Found ${networkHospitals.length} network hospital(s).`)
      resolve(networkHospitals);
    })
    .catch(error => {
      reject(error);
    });
  });
}

const addNetworkHospitalsAsExecutiveByPolicyId = (userUuid, policyId, nhlist) => {
  return new Promise((resolve, reject) => {
    logger.debug(`${module.id} - ${addNetworkHospitalsAsExecutiveByPolicyId.name}()`);
    let _ecMap;
    Executive.findOne({where: {userUuid: userUuid}})
    .then(executive => {
      if (!executive) {
        const error = new UnauthorizedAccess(`Executive not found with given username.`);
        throw(error);
      }

      logger.debug(`executiveUuid: ${executive.uuid}`);
      return ExecutiveCorporateMapping.findAll({where: {executiveUuid: executive.uuid}})
    })
    .then(ecMap => {
      if (!ecMap || ecMap.length === 0) {
        const error = new UnauthorizedAccess(`Corporates not found for executive.`);
        throw(error);
      }

      _ecMap = ecMap;

      logger.debug(`Received [${ecMap.length}] executiveCorporateMapppings`);
      return Policy.findOne({where: {policyId: policyId}, attributes: POLICY_ATTRIBUTES});
    })
    .then(p => {
      if (!p || Object.keys(p).length === 0 || !p.policyId || p.policyId.length === 0) {
        throw 'Policy ' + policyId + ' not found. Enter a valid policyID to add a network hospital'
      }
      let isValidPolicyForThisExecutive = false;
      for (let ec of _ecMap) {
        if (ec.corporateUuid === p.corporateUUID) {
          isValidPolicyForThisExecutive = true;
          break;
        }
      }
      if (!isValidPolicyForThisExecutive) {
        const error = new UnauthorizedAccess(`You are not authorized to add a new network hospital for the given policy.`, {policyId: policyId});
        reject(error);
      }
      nhlist.forEach(nh => {
        nh.uuid = uuidv4();
      });
      return NetworkHospital.bulkCreate(nhlist);
    })
    .then(networkHospitalsList => {
      resolve(networkHospitalsList);
    })
    .catch(err => {
      reject(err);
    });
  });
};

const addNetworkHospitalsByPolicyId = (policyId, nhlist) => {
  return new Promise((resolve, reject) => {
    Policy.findOne({where: {policyId: policyId}, attributes: POLICY_ATTRIBUTES})
    .then(p => {
      if (!p || Object.keys(p).length === 0 || !p.policyNumber || p.policyId.length === 0) {
        throw 'Policy ' + policyId + ' not found. Enter a valid policyID to add a network hospital'
      }
      logger.info('Found policy [%s]', p.policyNumber);
      nhlist.forEach(nh => {
        nh.uuid = uuidv4();
      });
      return NetworkHospital.bulkCreate(nhlist);
    })
    .then(nhlist => {
      resolve(nhlist);
    })
    .catch(err => {
      logger.error(err);
      reject(err);
    });
  });
};

const getAilmentsByPolicyId = policyId => {
  return new Promise((resolve, reject) => {
    let result = {};
    let promises = [];
    Policy.findOne({where: {policyId: policyId}, attributes: POLICY_ATTRIBUTES})
    .then(p => {
      result.policyId = p.policyNumber;
      return PolicyAilmentMapping.findAll({where: {PolicyUuid: p.uuid}});
    })
    .then(mappings => {
      mappings.forEach(m => {
        promises.push(Ailment.findOne({where: {uuid: m.AilmentUuid}}));
      });
      return Promise.all(promises);
    })
    .then(ailmentsList => {
      result.ailments = ailmentsList;
      resolve(result);
    })
    .catch(error => {
      reject(error);
    });
  });
};

const _segregatePolicies = policies => {
  return new Promise((resolve, ignoreReject) => {
    const _segregatePolicy = policy => {
      return new Promise((resolve, reject) => {
        TPA.findOne({where: {uuid: policy.tpaUuid}})
        .then(tpa => {
          if (!tpa) {
            logger.debug(`policy {policyId: ${policy.policyId}} has invalid TPA {tpaUuid: ${policy.tpaUuid}}`);
            resolve({policyId: policy.policyId, qualification: 'policyWithInvalidTPA'});
          }
          else { return InsuranceCompany.findOne({where: {uuid: policy.insuranceCompanyUuid}}); }
        })
        .then(ins => {
          if (!ins) {
            logger.debug(`policy {policyId: ${policy.policyId}} has invalid insurance company {insuranceCompanyUuid: ${policy.insuranceCompanyUuid}}`);
            resolve({policyId: policy.policyId, qualification: 'policyWithInvalidInsuranceCompany'});
          }
          else { return Corporate.findOne({where: {uuid: policy.corporateUuid}}); }
        })
        .then(corp => {
          if (!corp) {
            logger.debug(`policy {policyId: ${policy.policyId}} has invalid corporate {corporateUuid: ${policy.corporateUuid}}`);
            resolve({policyNumber: policy.policyId, qualification: 'policyWithInvalidCorporate'});
          }
          else { return Policy.findOne({where: {policyId: policy.policyId}, attributes: POLICY_ATTRIBUTES}); }
        })
        .then(p => {
          if (p) {
            logger.debug(`policy {policyId: ${policy.policyNumber}} is already associated with another policy {policyUuid: ${p.uuid}}`);
            resolve({policyId: policy.policyNumber, qualification: 'policyWithDuplicatePolicyId'});
          }
          else { resolve({policyId: policy.policyNumber, qualification: 'newPolicy'}); }
        })
        .catch(err => {
          logger.error(err);
          reject(err);
        })
      })
    }

    let _promises = [];
    policies.forEach(policy => {
      _promises.push(_segregatePolicy(policy));
    })

    Promise.all(_promises)
    .then(results => {
      let _policiesWithInvalidTPA = [];
      let _policiesWithInvalidInsuranceCompany = [];
      let _policiesWithInvalidCorporate = [];
      let _policiesWithDuplicatePolicyId = [];
      let _newPolicies = [];

      policies.forEach(policy => {
        let _policyQualification = results.find(result => result.policyNumber === policy.policyNumber);
        switch (_policyQualification.qualification) {
          case "policyWithInvalidTPA": _policiesWithInvalidTPA.push(policy); break;
          case "policyWithInvalidInsuranceCompany": _policiesWithInvalidInsuranceCompany.push(policy); break;
          case "policyWithInvalidCorporate": _policiesWithInvalidCorporate.push(policy); break;
          case "policyWithDuplicatePolicyId": _policiesWithDuplicatePolicyId.push(policy); break;
          case "newPolicy": _newPolicies.push(policy);
        }
      })

      resolve({
        "policiesWithInvalidTPA": _policiesWithInvalidTPA,
        "policiesWithInvalidInsuranceCompany": _policiesWithInvalidInsuranceCompany,
        "policiesWithInvalidCorporate": _policiesWithInvalidCorporate,
        "policiesWithDuplicatePolicyId": _policiesWithDuplicatePolicyId,
        "newPolicies": _newPolicies
      });
    })
  })
}

const addPolicies = policies => {
  return new Promise((resolve, reject) => {
    logger.info(`${module.id} - ${addPolicies.name}()`);
    let _segregatedPolicies;
    let promises = [];

    _segregatePolicies(policies)
    .then(segregatedPolicies => {
      logger.debug(`segregatedPolicies: ${JSON.stringify(segregatedPolicies)}`);
      _segregatedPolicies = segregatedPolicies;
      if (_segregatedPolicies.newPolicies.length === 0) {
        const error = new BadRequest(_segregatedPolicies, `No new policy was Added into table. Please check attached "data" for details of issues noticed.`);
        throw(error);
      }
      _segregatedPolicies.newPolicies.forEach(policy => {
        logger.debug(`Before pushing _addPolicy for policyId: ${policy.policyId}`);
        promises.push(_addPolicy(policy));
      })
      return Promise.all(promises);
    })
    .then(result => {
      logger.info(`Done with bulk inserting ${result.length} policies`);
      let dto = {};
      dto.newPolicies = result;
      if (_segregatedPolicies.hasOwnProperty('_policiesWithInvalidTPA')) {
        dto.policiesWithInvalidTPA = _segregatedPolicies._policiesWithInvalidTPA;
      }
      if (_segregatedPolicies.hasOwnProperty('_policiesWithInvalidInsuranceCompany')) {
        dto.policiesWithInvalidInsuranceCompany = _segregatedPolicies._policiesWithInvalidInsuranceCompany;
      }
      if (_segregatedPolicies.hasOwnProperty('_policiesWithInvalidCorporate')) {
        dto.policiesWithInvalidCorporate = _segregatedPolicies._policiesWithInvalidCorporate;
      }
      if (_segregatedPolicies.hasOwnProperty('_policiesWithDuplicatePolicyId')) {
        dto.policiesWithDuplicatePolicyId = _segregatedPolicies._policiesWithDuplicatePolicyId;
      }
      logger.debug(`${JSON.stringify(dto)}`);
      resolve(dto);
    })
    .catch(err => {
      logger.error(err);
      reject(err);
    })
  });
};

const _getUpdateFields = (modified, orig) => {
  let updateFields = {};
  let _orig = orig.dataValues; // We are relying on Sequelize providing a dataValues. If they change this internally, this method won't work.

  Object.keys(_orig).forEach(key => {
    switch (key) {
      case 'uuid': // Intentionally skip these fields. They should not be modified by server even if sent.
      case 'corporateUuid':
      case 'insuranceCompanyUuid':
      case 'active':
      case 'createdAt':
      case 'updatedAt':
        break;
      case 'fromDate': // Date modifications apparently need a separate logic
      case 'toDate': {
        logger.verbose(`key: ${key}`);
        let origDt = new Date(Date.parse(orig[key]));
        let modifiedDt = modified.hasOwnProperty(key) ? new Date(Date.parse(modified[key])) : null;
        if (modifiedDt && !(modifiedDt.getTime() === origDt.getTime())) {
          updateFields[key] = modified[key];
        }
        break;
      }
      default: { // All the others are straightforward replacements.
        logger.verbose(`{key: ${key}, original: ${orig[key]}, modified: ${modified[key]}}`);
        if (modified.hasOwnProperty(key) && (modified[key] !== orig[key])) {
          updateFields[key] = modified[key];
        }
        break;
      }
    }
  });
  return updateFields;
};

const updatePolicy = (credentials, modifiedPolicy) => {
  return new Promise((resolve, reject) => {
    logger.info(`${module.id} - ${updatePolicy.name}()`);
    logger.debug(`To modify: ${JSON.stringify(modifiedPolicy)}`);

    let _updateFields = null;
    let _existingPolicy = null;

    Policy.findOne({where: {uuid: modifiedPolicy.uuid}})
    .then(policy => {
      logger.debug(`original: ${JSON.stringify(policy)}`);
      _existingPolicy = policy;
      logger.debug(`_existingPolicy: ${JSON.stringify(_existingPolicy)}`);
      if (modifiedPolicy.policyId && _existingPolicy.policyId && modifiedPolicy.policyId !== _existingPolicy.policyId) {
        logger.debug(`Checking if policy with new policyId [${modifiedPolicy.policyId}] is already present.`);
        return Policy.findOne({where: {policyId: modifiedPolicy.policyId}, attributes: POLICY_ATTRIBUTES});
      } else {
        logger.debug(`returning null`);
        return Promise.resolve(null);
      }
    })
    .then(duplicatePolicy => {
      logger.debug(`duplicatePolicy: ${duplicatePolicy}`);
      if (duplicatePolicy) {
        logger.debug(`Duplicate Policy found for policyId [${duplicatePolicy.policyNumber}].`);
        const error = new BadRequest({policyId: duplicatePolicy.policyNumber, uuid: duplicatePolicy.uuid}, `The policy id provided for modify already belongs to another policy.`);
        throw(error);
      }

      _updateFields = _getUpdateFields(modifiedPolicy, _existingPolicy);
      logger.info(`updateFields: ${JSON.stringify(_updateFields)}`);
      if (!Object.keys(_updateFields).length) {
        resolve( 'Nothing to update. Modified values appear to be same as existing values.');
      }

      let options = {};
      options.where = {uuid: modifiedPolicy.uuid};
      // options.returning = true; // According to Sequelize docs, this option works only on PostgreSQL.

      return Policy.update(_updateFields, options);
    })
    .then((rowsUpdated, updatedPolicies) => { // updatedPolicies seen only on PostgreSQL
      logger.info(`Finished updating [${rowsUpdated}] policies.`);
      logger.verbose(`updatedPolicies: ${JSON.stringify(updatedPolicies)}.`);
      resolve(rowsUpdated);
    })
    .catch(err => {
      logger.error(err);
      if (err.status) {
        reject(err);
      } else {
        const error = new UnauthorizedAccess(`Error occurred while updating modifiedPolicy. This is a server error. Please see data for actual error.`, err);
        reject(error);
      }
    });
  });
};

const _addPolicy =  (policy) => {
  return new Promise((resolve, reject) => {
    logger.debug(`_addPolicy()`);
    logger.debug(`policy: ${JSON.stringify(policy)}`);

    let _dto = null;

    return sequelize.transaction(t => {
      policy.uuid = uuidv4();
      policy.status = 'created';
      return Policy.create(policy, {transaction: t})
      .then(createdPolicy => {
        _dto = createdPolicy;
        return (_dto.clientSpoc1Empid) ? argon2.hash(_dto.clientSpoc1Empid) : null;
      })
      .then(clientSpoc1Password => {
        const user = (_dto.clientSpoc1Empid && clientSpoc1Password && _dto.corporateUuid)
          ? {uuid: uuidv4(), username: _dto.clientSpoc1Empid, password: clientSpoc1Password, role: 'hr',
            corporateUuid: _dto.corporateUuid, email: _dto.clientSpoc1Email, mobile: _dto.clientSpoc1Mobile}
          : null;
        return (user) ? User.create(user, {transaction: t}) : null;
      })
      .then(clientSpoc1User => {
        logger.verbose(`clientSpoc1User: ${clientSpoc1User}`);
        const corporateHr = (clientSpoc1User && clientSpoc1User.uuid && _dto.clientSpoc1Empid)
          ? {uuid: uuidv4(), userUuid: clientSpoc1User.uuid, empid: _dto.clientSpoc1Empid,
            firstName: _dto.clientSpoc1Name, corporateUuid: _dto.corporateUuid, email: _dto.clientSpoc1Email,
            mobile: _dto.clientSpoc1Mobile, status:employeeStatus.STATUS_ACTIVE,
            approvalType: employeeStatus.APPROVAL_TYPE_NONE}
          : null;
        logger.verbose(`corporateHr: ${corporateHr}`);
        return (corporateHr) ? CorporateHR.create(corporateHr, {transaction: t}) : null;
      })
      .then(ignoreClientSpoc1CorporateHr => {
        logger.verbose(`ignoreClientSpoc1CorporateHr: ${ignoreClientSpoc1CorporateHr}`);
        return (_dto.clientSpoc2Empid) ? argon2.hash(_dto.clientSpoc2Empid) : null;
      })
      .then(clientSpoc2Password => {
        const user = (_dto.clientSpoc2Empid && clientSpoc2Password && _dto.corporateUuid)
          ? {uuid: uuidv4(), username: _dto.clientSpoc2Empid, password: clientSpoc2Password, role: 'hr',
            corporateUuid: _dto.corporateUuid, email: _dto.clientSpoc2Email, mobile: _dto.clientSpoc2Mobile}
          : null;
        logger.verbose(`user: ${user}`);
        return (user) ? User.create(user, {transaction: t}) : null;
      })
      .then(clientSpoc2User => {
        logger.verbose(`clientSpoc2User: ${clientSpoc2User}`);
        const corporateHr = (clientSpoc2User && clientSpoc2User.uuid && _dto.clientSpoc2Empid)
          ? {uuid: uuidv4(), userUuid: clientSpoc2User.uuid, empid: _dto.clientSpoc2Empid,
            firstName: _dto.clientSpoc2Name, corporateUuid: _dto.corporateUuid, email: _dto.clientSpoc2Email,
            mobile: _dto.clientSpoc2Mobile, status:employeeStatus.STATUS_ACTIVE,
            approvalType: employeeStatus.APPROVAL_TYPE_NONE}
          : null;
        logger.verbose(`corporateHr: ${corporateHr}`);
        return (corporateHr) ? CorporateHR.create(corporateHr, {transaction: t}) : null;
      })
      .then(ignoreClientSpoc2CorporateHr => {
        logger.verbose(`ignoreClientSpoc2CorporateHr: ${ignoreClientSpoc2CorporateHr}`);
        return (_dto.clientSpoc3Empid) ? argon2.hash(_dto.clientSpoc3Empid) : null;
      })
      .then(clientSpoc3Password => {
        const user = (_dto.clientSpoc3Empid && clientSpoc3Password && _dto.corporateUuid)
          ? {uuid: uuidv4(), username: _dto.clientSpoc3Empid, password: clientSpoc3Password, role: 'hr',
            corporateUuid: _dto.corporateUuid, email: _dto.clientSpoc3Email, mobile: _dto.clientSpoc3Mobile,
            status:employeeStatus.STATUS_ACTIVE, approvalType: employeeStatus.APPROVAL_TYPE_NONE}
          : null;
        logger.verbose(`user: ${user}`);
        return (user) ? User.create(user, {transaction: t}) : null;
      })
      .then(clientSpoc3User => {
        logger.verbose(`clientSpoc3User: ${clientSpoc3User}`);
        const corporateHr = (clientSpoc3User && clientSpoc3User.uuid && _dto.clientSpoc3Empid)
          ? {uuid: uuidv4(), userUuid: clientSpoc3User.uuid, empid: policy.clientSpoc3Empid,
            firstName: policy.clientSpoc3Name, corporateUuid: policy.corporateUuid, email: policy.clientSpoc3Email,
            mobile: policy.clientSpoc3Mobile}
          : null;
        logger.verbose(`corporateHr: ${corporateHr}`);
        return (corporateHr) ? CorporateHR.create(corporateHr, {transaction: t}) : null;
      })
    })
    .then(tResult => {
      logger.info(`Transaction committed - ${JSON.stringify(tResult)}`);
      resolve(_dto);
    })
    .catch(tErr => {
      logger.info(`Transaction failed - ${JSON.stringify(tErr)}`);
      reject(tErr);
    });
  });
};


const addAilmentsByPolicyId = (policyId, ailments) => {
  return new Promise((resolve, reject) => {
    let result = {};
    Policy.findOne({where: {policyId: policyId}, attributes: POLICY_ATTRIBUTES})
    .then(p => {
      if (!p || Object.keys(p).length === 0 || !p.policyNumber || p.policyNumber.length === 0) {
        throw 'Policy ' + policyId + ' not found. Enter a valid policyID to add a network hospital'
      }
      result.policy = {uuid: p.uuid, policyId: p.policyNumber};
      ailments.forEach(a => {
        a.uuid = uuidv4();
      });
      return Ailment.bulkCreate(ailments);
    })
    .then(ailmentsList => {
      let promises = [];
      ailmentsList.forEach(a => {
        promises.push(
          PolicyAilmentMapping.create(
            {uuid: uuidv4(), PolicyUuid: result.policy.uuid, AilmentUuid: a.uuid}));
      });
      return Promise.all(promises);
    })
    .then(ailmentsList => {
      result.ailments = ailmentsList;
      resolve(result);
    })
    .catch(err => {
      reject(err);
    });
  });
};

const addAilmentsAsExecutiveByPolicyId = (userUuid, policyId, ailments) => {
  return new Promise((resolve, reject) => {
    let _dto = {};
    Executive.findOne({where: {userUuid: userUuid}})
    .then(e => {
      if (!e) {
        const error = new UnauthorizedAccess(`Executive not found with given username.`);
        throw(error);
      } else {
        _dto.executive = e;
        return ExecutiveCorporateMapping.findAll({where: {executiveUuid: e.uuid}})
      }
    })
    .then(ecMap => {
      if (!ecMap) {
        const error = new UnauthorizedAccess(`Corporates not found for executive.`);
        throw(error);
      } else {
        _dto.employeeCorporateMapping = ecMap;
        return Policy.findOne({where: {policyId: policyId}, attributes: POLICY_ATTRIBUTES});
      }
    })
    .then(p => {
      if (!p || Object.keys(p).length === 0 || !p.policyNumber || p.policyNumber.length === 0) {
        throw('Policy ' + policyId + ' not found. Enter a valid policyID to add a ailment.')
      }
      let isValidPolicyForThisExecutive = false;
      for (let ec of _dto.employeeCorporateMapping) {
        if (ec.corporateUuid === p.corporateUUID) {
          isValidPolicyForThisExecutive = true;
          break;
        }
      }
      if (!isValidPolicyForThisExecutive) {
        const error = new UnauthorizedAccess(`You are not authorized to add an ailment for the given policy.`);
        throw(error);
      }
      _dto.policy = {uuid: p.uuid, policyId: p.policyNumber};
      ailments.forEach(nh => {
        nh.uuid = uuidv4();
      });
      return Ailment.bulkCreate(ailments);
    })
    .then(ailments => {
      let promises = [];
      ailments.forEach(a => {
        promises.push(
          PolicyAilmentMapping.create(
            {uuid: uuidv4(), PolicyUuid: _dto.policy.uuid, AilmentUuid: a.uuid}));
      });
      return Promise.all(promises);
    })
    .then(alist => {
      _dto.ailments = alist;
      resolve(_dto);
    })
    .catch(err => {
      reject(err);
    });
  });
};

const getPolicyECardForCustomerByPolicyIdByEmpid = (customerUserUuid, policyId) => {
  return new Promise((resolve, reject) => {
    logger.debug(`${module.id} - ${getPolicyECardForCustomerByPolicyIdByEmpid.name}()`);

    let customerCorporateUuid = null;
    let policyCorporateUuid = null;
    let customerEmpid = null;

    Customer.findOne({where: {userUuid: customerUserUuid}})
    .then(customer => {
      if (!customer) {
        const error = new BadRequest(`Customer not found with given UUID.`);
        reject(error);
      }
      logger.info(`located customer [${customer.firstName} ${customer.lastName}] with UUID [${customerUserUuid}] and corporateUuid [${customer.corporateUuid}]`);
      customerCorporateUuid = customer.corporateUuid;
      customerEmpid = customer.empid;
      return Policy.findOne({where: {policyId: policyId}, attributes: POLICY_ATTRIBUTES});
    })
    .then(policy => {
      if (!policy) {
        const error = new BadRequest(`Policy not found with given policyId.`);
        throw(error);
      }
      policyCorporateUuid = policy.corporateUUID;
      if (policyCorporateUuid !== customerCorporateUuid) {
        const error = new UnauthorizedAccess(`Customer\'s corporate UUID and policy\'s corporate UUID do not match.`, {customerCorporateUuid: customerCorporateUuid, policyCorporateUuid: policyCorporateUuid});
        throw(error);
      }
      logger.info(`located policy [${policy.policyNumber}] associated with corporateUuid [${policy.corporateUUID}]`);
      logger.debug(`{customerEmpid: ${customerEmpid}, policyCorporateUuid: ${policyCorporateUuid}, customerCorporateUuid: ${customerCorporateUuid}, , policy.policyId: ${policy.policyNumber}`);

      return TPA.findOne({where: {uuid: policy.TPAUUID}});
    })
    .then(tpa => {
      return tpaHelper.getPolicyEcard(tpa.uuid, customerEmpid, policyId);
    })
    .then(policyECard => {
      if (!policyECard) {
        const error = new BadRequest('Policy ECard not found', `No ECard was found for given policy ID.`);
        throw(error);
      }
      logger.info(`Received policy ecard from SOAP service.`);
      logger.debug(`eCard: ${JSON.stringify(policyECard)}`);
      resolve(policyECard);
    })
    .catch(err => {
      logger.error(err);
      reject(err);
    })
  });
}

const getPolicyECardForCustomer = (customerUserUuid, options) => {
  return new Promise((resolve, reject) => {
    logger.debug(`+${module.id} - ${getPolicyECardForCustomer.name}()`);

    let policyId = null;

    Customer.findOne({where: {userUuid: customerUserUuid}})
    .then(customer => {
      if (!customer) {
        const error = new UnauthorizedAccess(`Customer not found with given UUID.`, {userUuid: customerUserUuid});
        throw(error);
      }
      logger.info(`located customer [${customer.firstName} ${customer.lastName}] with empid [${customer.empid}] and corporateUuid [${customer.corporateUuid}]`);
      if (customer.empid !== options.empid || customer.corporateUuid !== options.corporateUuid) {
        const error = new UnauthorizedAccess(`Given empid and corporate do not match with logged in customer.`, {empid: options.empid, corporateUuid: customer.corporateUuid});
        throw(error);
      }
      return Policy.findOne({where: {corporateUuid: customer.corporateUuid}, attributes: POLICY_ATTRIBUTES});
    })
    .then(policy => {
      if (!policy) {
        const error = new UnauthorizedAccess(`Policy not found for given customer.`);
        throw(error);
      }

      policyId = policy.dataValues.policyNumber;
      logger.info(`located policy [${policyId}] associated for customer {empid: ${options.empid}, corporateUuid: ${options.corporateUuid}}`);
      return TPA.findOne({where: {uuid: policy.dataValues.TPAUUID}});
    })
    .then(tpa => {
      console.log('Came');
      console.log(tpa);
      return tpaHelper.getPolicyEcard(tpa.uuid, options.empid, policyId);
    })
    .then(policyECard => {
      if (!policyECard) {
        const error = new BadRequest('Policy ECard not found', `No ECard was found for given policy ID.`);
        throw(error);
      }
      logger.info(`Received policy ecard from SOAP service.`);
      logger.debug(`eCard: ${JSON.stringify(policyECard)}`);

      resolve(policyECard);
    })
    .catch(err => {
      logger.error(err);
      reject(err);
    })
  });
}

const getPolicyECardForExecutiveByPolicyIdByEmpidByCorporateUuid = (executiveUserUuid, policyId, customerEmpid, corporateUuid) => {
  return new Promise((resolve, reject) => {
    logger.debug(`${module.id} - ${getPolicyECardForExecutiveByPolicyIdByEmpidByCorporateUuid.name}()`);

    let executiveCorporateUuid = null;
    let policyCorporateUuid = null;
    let corporateUuids = [];
    let policyId = null;

    Customer.findOne({where: {[Op.and]: [{empid: customerEmpid}, {corporateUuid: corporateUuid}]}})
    .then(customer => {
      if (!customer) {
        const error = new BadRequest(null, `Given empid does not belong to given corporate UUID. Please recheck.`);
        throw(error);
      }
      return Executive.findOne({where: {userUuid: executiveUserUuid}});
    })
    .then(executive => {
      if (!executive) {
        const error = new UnauthorizedAccess(`Executive not found with given UUID.`);
        throw(error);
      }
      logger.info(`located executive [${executive.firstName} ${executive.lastName}] with UUID [${executiveUserUuid}] and corporateUuid [${executive.corporateUuid}]`);
      return ExecutiveCorporateMapping.findAll({where: {executiveUuid: executive.uuid}});
    })
    .then(executiveCorporateMappings => {
      logger.debug(executiveCorporateMappings);
      if (!executiveCorporateMappings) {
        const error = new UnauthorizedAccess(`Executive has no corporates mapped.`);
        throw(error);
      }
      executiveCorporateMappings.forEach(ec => {
        logger.debug(`ec: ${JSON.stringify(ec)}`);
        if (ec) {
          corporateUuids.push(ec.corporateUuid);
        }
      })
      logger.debug(`corporateUuids: ${corporateUuids}`);
      if (!corporateUuids.includes(corporateUuid)) {
        const error = new UnauthorizedAccess(`Given corporateUuid does not belong to corporates managed by this executive.`);
        throw(error);
      }

      return Policy.findOne({where: {policyId: policyId}, attributes: POLICY_ATTRIBUTES});
    })
    .then(policy => {
      if (!policy) {
        const error = new UnauthorizedAccess(`Policy not found with given policyId.`);
        throw(error);
      }
      policyCorporateUuid = policy.corporateUUID;
      if (!corporateUuids.includes(policyCorporateUuid)) {
        const error = new UnauthorizedAccess(`This policy UUID does not belong to corporates managed by this executive.`);
        throw(error);
      }
      logger.info(`located policy [${policy.policyNumber}] associated with corporateUuid [${policy.corporateUUID}]`);
      logger.debug(`{customerEmpid: ${customerEmpid}, policyCorporateUuid: ${policyCorporateUuid}, customerCorporateUuid: ${executiveCorporateUuid}, , policy.policyId: ${policy.policyNumber}`);

      policyId = policy.policyNumber;
      return TPA.findOne({where: {uuid: policy.TPAUUID}});
    })
    .then(tpa => {
      return tpaHelper.getPolicyEcard(tpa.uuid, customerEmpid, policyId);
    })
    .then(policyECard => {
      if (!policyECard) {
        const error = new BadRequest(`Policy ECard not found`, `No ECard was found for given policy ID.`);
        throw(error);
      }
      logger.info(`Received policy ecard from SOAP service.`);
      logger.debug(`eCard: ${JSON.stringify(policyECard)}`);
      resolve(policyECard);
    })
    .catch(err => {
      logger.error(err);
      reject(err);
    })
  });
}

const getPolicyECardForExecutive = (executiveUserUuid, options) => {
  return new Promise((resolve, reject) => {
    logger.debug(`${module.id} - ${getPolicyECardForExecutive.name}()`);

    let customerCorporateUuid = null;
    let policyId = null;

    Customer.findOne({where: {empid: options.empid, corporateUuid: options.corporateUuid}})
    .then(customer => {
      if (!customer) {
        const error = new UnauthorizedAccess(`Customer not found with given empid.`, {empid: options.empid});
        throw(error);
      }
      logger.info(`Found customer: {firstName: ${customer.firstName}, lastName: ${customer.lastName}, empid: ${customer.empid}, corporateUuid: ${customer.corporateUuid}}`);

      customerCorporateUuid = customer.corporateUuid;
      return Executive.findOne({where: {userUuid: executiveUserUuid}})
    })
    .then(executive => {
      if (!executive) {
        const error = new UnauthorizedAccess(`Executive not found with given UUID.`, {uuid: executiveUserUuid});
        throw(error);
      }
      logger.info(`Found executive: {firstName: ${executive.firstName}, lastName:${executive.lastName}, corporateUuid: ${executive.corporateUuid}`);

      return ExecutiveCorporateMapping.findAll({where: {executiveUuid: executive.uuid}});
    })
    .then(executiveCorporateMappings => {
      logger.debug(executiveCorporateMappings);
      if (!executiveCorporateMappings) {
        const error = new UnauthorizedAccess(`Executive has no corporates mapped.`);
        throw(error);
      }
      let corporateUuids = [];
      executiveCorporateMappings.forEach(ec => {
        logger.debug(`ec: ${JSON.stringify(ec)}`);
        if (ec) {
          corporateUuids.push(ec.corporateUuid);
        }
      })
      logger.debug(`corporateUuids: ${corporateUuids}`);
      if (!corporateUuids.includes(customerCorporateUuid)) {
        const error = new UnauthorizedAccess(`Executive has no corporates mapped.`);
        throw(error);
      }

      return Policy.findOne({where: {corporateUuid: customerCorporateUuid}, attributes: POLICY_ATTRIBUTES});
    })
    .then(policy => {
      policy = policy.dataValues;
      if (!policy) {
        const error = new UnauthorizedAccess(`Policy not found with given policyId.`);
        throw(error);
      }
      logger.debug(`policy: {policyId: ${policy.policyNumber}, tpaUuid: ${policy.TPAUUID}`);
      policyId = policy.policyNumber;
      return TPA.findOne({where: {uuid: policy.TPAUUID}});
    })
    .then(tpa => {
      logger.debug(`tpa: {tpaId: ${tpa.tpaid}, companyName: ${tpa.companyName}`);
      return tpaHelper.getPolicyEcard(tpa.uuid, options.empid, policyId);
    })
    .then(policyECard => {
      if (!policyECard) {
        const error = new BadRequest(`Policy ECard not found`, `No ECard was found for given policy ID.`);
        throw(error);
      }
      logger.info(`Received policy ecard from SOAP service.`);
      logger.debug(`eCard: ${JSON.stringify(policyECard)}`);

      resolve(policyECard);
    })
    .catch(err => {
      logger.error(err);
      reject(err);
    })
  });
}

const getPolicyECardForHrByPolicyIdByEmpid = (hrUserUuid, policyId, customerEmpid) => {
  return new Promise((resolve, reject) => {
    logger.debug(`${module.id} - ${getPolicyECardForHrByPolicyIdByEmpid.name}()`);

    let hrCorporateUuid = null;
    let policyCorporateUuid = null;

    CorporateHR.findOne({where: {userUuid: hrUserUuid}})
    .then(hr => {
      if (!hr) {
        const error = new UnauthorizedAccess(`HR not found with given UUID.`);
        throw(error);
      }
      hrCorporateUuid = hr.corporateUuid;
      logger.info(`located HR [${hr.firstName} ${hr.lastName}] with UUID [${hrUserUuid}] and corporateUuid [${hrCorporateUuid}]`);
      return Policy.findOne({where: {policyId: policyId}, attributes: POLICY_ATTRIBUTES});
    })
    .then(policy => {
      if (!policy) {
        const error = new UnauthorizedAccess(`Policy not found with given policyId.`);
        throw(error);
      }
      policyCorporateUuid = policy.corporateUUID;
      if (hrCorporateUuid !== policyCorporateUuid) {
        const error = new UnauthorizedAccess(`This policy UUID does not belong to corporates managed by this HR.`);
        throw(error);
      }
      logger.info(`located policy [${policy.policyNumber}] associated with corporateUuid [${policyCorporateUuid}]`);
      logger.debug(`{customerEmpid: ${customerEmpid}, policyCorporateUuid: ${policyCorporateUuid}, customerCorporateUuid: ${hrCorporateUuid}, , policy.policyId: ${policy.policyNumber}`);

      return TPA.findOne({where: {uuid: policy.TPAUUID}});
    })
    .then(tpa => {
      return tpaHelper.getPolicyEcard(tpa.uuid, customerEmpid, policyId);
    })
    .then(policyECard => {
      if (!policyECard) {
        const error = new BadRequest(`Policy ECard not found`, `No ECard was found for given policy ID.`);
        throw(error);
      }
      logger.info(`Received policy ecard from SOAP service.`);
      logger.debug(`eCard: ${JSON.stringify(policyECard)}`);
      resolve(policyECard);
    })
    .catch(err => {
      logger.error(err);
      reject(err);
    })
  });
}

const getPolicyECardForHr = (hrUserUuid, options) => {
  return new Promise((resolve, reject) => {
    logger.debug(`+${module.id} - ${getPolicyECardForHr.name}()`);

    let hrCorporateUuid = null;
    let policyCorporateUuid = null;
    let policyId = null;

    CorporateHR.findOne({where: {userUuid: hrUserUuid}})
    .then(hr => {
      if (!hr) {
        const error = new UnauthorizedAccess(`HR not found with given UUID.`);
        throw(error);
      }
      hrCorporateUuid = hr.corporateUuid;
      logger.info(`Found HR: {uuid: ${hrUserUuid}, firstName: ${hr.firstName}, lastName: ${hr.lastName}, corporateUuid: ${hrCorporateUuid}}`);

      return Customer.findOne({where: {empId: options.empid, corporateUuid: options.corporateUuid}});
    })
    .then(foundCustomer => {
      if (!foundCustomer) {
        const error = new UnauthorizedAccess(`Customer not found with given empid.`, {empid: options.empid});
        throw(error);
      }

      if (options.corporateUuid !== hrCorporateUuid) {
        const error = new UnauthorizedAccess(`Customer\'s corporateUuid and HR\'s corporateUuid do not match.`);
        throw(error);
      }

      logger.info(`Found customer: {uuid: ${foundCustomer.uuid}, firstName: ${foundCustomer.firstName}, lastName: ${foundCustomer.lastName}, corporateUuid: ${foundCustomer.corporateUuid}}`);

      return Policy.findOne({where: {corporateUuid: options.corporateUuid}, attributes: POLICY_ATTRIBUTES});
    })
    .then(policy => {
      policy = policy.dataValues;
      if (!policy) {
        const error = new UnauthorizedAccess(`Policy not found with given policyId.`);
        throw(error);
      }
      policyCorporateUuid = policy.corporateUUID;
      if (options.corporateUuid !== policyCorporateUuid) {
        const error = new UnauthorizedAccess(`This policy UUID does not belong to corporates managed by this HR.`);
        throw(error);
      }

      logger.info(`located policy [${policy.policyNumber}] associated with corporateUuid [${policyCorporateUuid}]`);
      logger.debug(`{empid: ${options.empid}, corporateUuid: ${options.corporateUuid}, policy.policyId: ${policy.policyNumber}`);

      policyId = policy.policyNumber;
      return TPA.findOne({where: {uuid: policy.TPAUUID}});
    })
    .then(tpa => {
      logger.debug(`{tpa: ${tpa.uuid}, companyName: ${tpa.companyName}`);
      return tpaHelper.getPolicyEcard(tpa.uuid, options.empid, policyId);
    })
    .then(policyECard => {
      if (!policyECard) {
        const error = new BadRequest(`Policy ECard not found`, `No ECard was found for given policy ID.`);
        throw(error);
      }
      logger.info(`Received policy ecard from SOAP service.`);
      logger.debug(`eCard: ${JSON.stringify(policyECard)}`);

      resolve(policyECard);
    })
    .catch(err => {
      logger.error(err);
      reject(err);
    })
  })
}

const getPolicyECardByPolicyIdByEmpidByCorporateUuid = (managerUserUuid, policyId, customerEmpid, corporateUuid) => {
  return new Promise((resolve, reject) => {
    logger.debug(`${module.id} - ${getPolicyECardByPolicyIdByEmpidByCorporateUuid.name}()`);

    let executiveCorporateUuid = null;
    let policyCorporateUuid = null;
    let corporateUuids = [];

    Customer.findOne({where: {[Op.and]: [{empid: customerEmpid}, {corporateUuid: corporateUuid}]}})
    .then(customer => {
      if (!customer) {
        const error = new BadRequest(null, `Given empid does not belong to given corporate UUID. Please recheck.`);
        throw(error);
      }
      return Executive.findOne({where: {userUuid: managerUserUuid}});
    })
    .then(manager => {
      if (!manager) {
        const error = new UnauthorizedAccess(`Customer not found with given UUID.`, {userUuid: managerUserUuid});
        throw(error);
      }
      logger.info(`located executive [${manager.firstName} ${manager.lastName}] with UUID [${managerUserUuid}] and corporateUuid [${manager.corporateUuid}]`);
      return ExecutiveCorporateMapping.findAll({where: {executiveUuid: manager.uuid}});
    })
    .then(executiveCorporateMappings => {
      logger.debug(executiveCorporateMappings);
      if (!executiveCorporateMappings) {
        const error = new UnauthorizedAccess(`Executive has no corporates mapped.`);
        throw(error);
      }
      executiveCorporateMappings.forEach(ec => {
        logger.debug(`ec: ${JSON.stringify(ec)}`);
        if (ec) {
          corporateUuids.push(ec.corporateUuid);
        }
      })
      logger.debug(`corporateUuids: ${corporateUuids}`);
      if (!corporateUuids.includes(corporateUuid)) {
        const error = new UnauthorizedAccess(`This corporate UUID does not belong to corporates managed by this executive.`);
        throw(error);
      }

      return Policy.findOne({where: {policyId: policyId}, attributes: POLICY_ATTRIBUTES});
    })
    .then(policy => {
      if (!policy) {
        const error = new UnauthorizedAccess(`Policy not found with given policyId.`);
        throw(error);
      }
      policyCorporateUuid = policy.corporateUUID;
      if (!corporateUuids.includes(policyCorporateUuid)) {
        const error = new UnauthorizedAccess(`This policy UUID does not belong to corporates managed by this executive.`);
        throw(error);
      }
      logger.info(`located policy [${policy.policyNumber}] associated with corporateUuid [${policy.corporateUUID}]`);
      logger.debug(`{customerEmpid: ${customerEmpid}, policyCorporateUuid: ${policyCorporateUuid}, customerCorporateUuid: ${executiveCorporateUuid}, , policy.policyId: ${policy.policyNumber}`);

      return TPA.findOne({where: {uuid: policy.TPAUUID}});
    })
    .then(tpa => {
      return tpaHelper.getPolicyEcard(tpa.uuid, customerEmpid, policyId);
    })
    .then(policyECard => {
      if (!policyECard) {
        const error = new BadRequest(`Policy ECard not found`, `No ECard was found for given policy ID.`);
        throw(error);
      }
      logger.info(`Received policy ecard from SOAP service.`);
      logger.debug(`eCard: ${JSON.stringify(policyECard)}`);
      resolve(policyECard);
    })
    .catch(err => {
      logger.error(err);
      reject(err);
    })
  });
}

const getPolicyECardForManager = (managerUserUuid, options) => {
  return new Promise((resolve, reject) => {
    logger.debug(`${module.id} - ${getPolicyECardForManager.name}()`);

    let policyCorporateUuid = null;
    let policyId = null;

    Executive.findOne({where: {userUuid: managerUserUuid}})
    .then(manager => {
      if (!manager) {
        const error = new UnauthorizedAccess(`Executive not found with given uuid.`, {userUuid: managerUserUuid});
        throw(error);
      }
      logger.info(`Manager:{firstName: ${manager.firstName}, lastName: ${manager.lastName}}`);

      return Customer.findOne({where: {empid: options.empid, corporateUuid: options.corporateUuid}});
    })
    .then(foundCustomer => {
      if (!foundCustomer) {
        const error = new UnauthorizedAccess(`Customer not found with given empid.`, {empid: options.empid});
        throw(error);
      }
      logger.info(`Customer:{firstName: ${foundCustomer.firstName}, lastName: ${foundCustomer.lastName}, corporateUuid: ${foundCustomer.corporateUuid}}`);

      return Policy.findOne({where: {corporateUuid: foundCustomer.corporateUuid}, attributes: POLICY_ATTRIBUTES});
    })
    .then(policy => {
      if (!policy || !policy.dataValues) {
        const error = new UnauthorizedAccess(`Policy not found with given policyId.`);
        throw(error);
      }
      policy = policy.dataValues;
      logger.debug(`Found policy with policyId: ${JSON.stringify(policy.policyNumber)}`)
      if (!policy.policyNumber) {
        const error = new UnauthorizedAccess(`Policy not found with given policyId. Incorrect or undefined policyId provided.`);
        throw(error);
      }
      logger.info(`Found policy: {policyId: ${policy.policyNumber}, corporateUuid: ${policy.corporateUUID}}`);
      logger.debug(`{customer: ${options.empid}, policyCorporateUuid: ${policyCorporateUuid}, customerCorporateUuid: ${options.corporateUuid}, policy.policyId: ${policy.policyNumber}`);

      policyId = policy.policyNumber;
      return TPA.findOne({where: {uuid: policy.TPAUUID}});
    })
    .then(tpa => {
      logger.debug(`{tpa: ${JSON.stringify(tpa)}}`);
      return tpaHelper.getPolicyEcard(tpa.uuid, options.empid, policyId);
    })
    .then(policyECard => {
      if (!policyECard) {
        const error = new BadRequest(`Policy ECard not found`, `No ECard was found for given policy ID.`);
        throw(error);
      }
      logger.info(`Received policy ecard from SOAP service.`);
      logger.debug(`eCard: ${JSON.stringify(policyECard)}`);

      resolve(policyECard);
    })
    .catch(err => {
      logger.error(err);
      reject(err);
    })
  })
}

module.exports = {
  addAilmentsByPolicyId: addAilmentsByPolicyId,
  addAilmentsAsExecutiveByPolicyId: addAilmentsAsExecutiveByPolicyId,
  addNetworkHospitalsAsExecutiveByPolicyId: addNetworkHospitalsAsExecutiveByPolicyId,
  addNetworkHospitalsByPolicyId: addNetworkHospitalsByPolicyId,
  addPolicies: addPolicies,
  getAilmentsByPolicyId: getAilmentsByPolicyId,
  getNetworkHospitalsByPolicyId: getNetworkHospitalsByPolicyId,
  getPolicies: getPolicies,
  getPoliciesByTpa: getPoliciesByTpa,
  getPoliciesByCorporate: getPoliciesByCorporate,
  getPoliciesByInsuranceCompany: getPoliciesByInsuranceCompany,
  getPoliciesByTpaByCorporate: getPoliciesByTpaByCorporate,
  getPoliciesByTpaByInsuranceCompany: getPoliciesByTpaByInsuranceCompany,
  getPoliciesByCorporateByInsuranceCompany: getPoliciesByCorporateByInsuranceCompany,
  getPoliciesByTpaByCorporateByInsuranceCompany: getPoliciesByTpaByCorporateByInsuranceCompany,
  getPolicyForCustomerByPolicyId: getPolicyForCustomerByPolicyId,
  getPolicyForHrByPolicyId: getPolicyForHrByPolicyId,
  getPolicyForExecutiveByPolicyId: getPolicyForExecutiveByPolicyId,
  getPolicyByPolicyId: getPolicyByPolicyId,
  getPolicyECardForCustomerByPolicyIdByEmpid: getPolicyECardForCustomerByPolicyIdByEmpid,
  getPolicyECardForCustomer: getPolicyECardForCustomer,
  getPolicyECardForExecutiveByPolicyIdByEmpidByCorporateUuid: getPolicyECardForExecutiveByPolicyIdByEmpidByCorporateUuid,
  getPolicyECardForExecutive: getPolicyECardForExecutive,
  getPolicyECardForHrByPolicyIdByEmpid: getPolicyECardForHrByPolicyIdByEmpid,
  getPolicyECardForHr: getPolicyECardForHr,
  getPolicyECardByPolicyIdByEmpidByCorporateUuid: getPolicyECardByPolicyIdByEmpidByCorporateUuid,
  getPolicyECardForManager: getPolicyECardForManager,
  updatePolicy: updatePolicy
}
