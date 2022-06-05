"use strict";

const policiesService = require('../services/policiesService');
const {logger} = require('../config/logger');
const { validationResult } = require('express-validator');
const {InvalidQueryParams} = require('../errors/invalidQueryParams');
const {Success} = require('../errors/success');

const ROLE_CUSTOMER = require('../services/employeeStatus').ROLE_CUSTOMER;
const ROLE_MANAGER = require('../services/employeeStatus').ROLE_MANAGER;
const ROLE_EXECUTIVE = require('../services/employeeStatus').ROLE_EXECUTIVE;
const ROLE_HR = require('../services/employeeStatus').ROLE_HR;

const getPolicies = (req, res) => {
  logger.info(`+${module.id} - ${getPolicies.name}()`);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new InvalidQueryParams(errors.array());
    res.status(err.status).json(err);
    return;
  }

  policiesService.getPolicies(req.decodedTokenData, req.query.corporateUuid || null)
  .then(policies => {
    let message = (policies && policies.length) ? `${policies.length} policies returned.` : `No policies returned.`;
    if (policies.length && policies.length === 1) {
      message = '1 policy returned';
    }
    const _dto = new Success(policies, message);
    res.status(_dto.status).json(_dto);
  })
  .catch(err => {
    if (err && err.status) {
      res.status(err.status).json(err);
      return;
    }
    res.status(500).json(err);
  });
};

const getPolicyByPolicyId = (req, res) => {
  logger.info(`+${module.id} - ${getPolicyByPolicyId.name}()`);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new InvalidQueryParams(errors.array());
    res.status(err.status).json(err);
    return;
  }

  let promise;
  const details = req.decodedTokenData;
  switch(details.role) {
    case ROLE_CUSTOMER:
      promise = policiesService.getPolicyForCustomerByPolicyId(details.uuid, req.params.policyId);
      break;
    case ROLE_HR:
      promise = policiesService.getPolicyForHrByPolicyId(details.uuid, req.params.policyId);
      break;
    case ROLE_EXECUTIVE:
      promise = policiesService.getPolicyForExecutiveByPolicyId(details.uuid, req.params.policyId);
      break;
    case ROLE_MANAGER:
      promise = policiesService.getPolicyByPolicyId(req.params.policyId);
      break;
    default:
      promise = Promise.reject({status: 401, errCode: 'UnauthorizedAccess', message: 'Invalid role provided for authentication.'});
  }

  promise
  .then(policy => {
    const _dto = new Success(policy, `Details for policy [${policy.policyActions}] returned.`);
    res.status(_dto.status).json(_dto);
  })
  .catch(err => {
    if (err && err.status) {
      res.status(err.status).json(err);
      return;
    }
    res.status(500).json(err);
  });
};

const getPolicyECardByPolicyId = (req, res) => {
  logger.info(`+${module.id} - ${getPolicyECardByPolicyId.name}()`);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new InvalidQueryParams(errors.array());
    res.status(err.status).json(err);
    return;
  }

  let promise;
  const details = req.decodedTokenData;
  switch (details.role) {
    case ROLE_CUSTOMER:
      promise = policiesService.getPolicyECardForCustomerByPolicyIdByEmpid(details.uuid, req.params.policyId);
      break;
    case ROLE_EXECUTIVE:
      promise = policiesService.getPolicyECardForExecutiveByPolicyIdByEmpidByCorporateUuid(details.uuid, req.params.policyId, req.query.empid, req.query.corporateUuid);
      break;
    case ROLE_HR:
      promise = policiesService.getPolicyECardForHrByPolicyIdByEmpid(details.uuid, req.params.policyId, req.query.empid);
      break;
    case ROLE_MANAGER:
      promise = policiesService.getPolicyECardByPolicyIdByEmpidByCorporateUuid(details.uuid, req.params.policyId, req.query.empid, req.query.corporateUuid);
      break;
    default:
      promise = Promise.reject({status: 401, errCode: 'UnauthorizedAccess', message: 'Invalid role provided for authentication.'});
  }

  promise
  .then(policy => {
    const _dto = new Success(policy, `Policy ECard returned.`);
    res.status(_dto.status).json(_dto);
  })
  .catch(err => {
    if (err && err.status) {
      res.status(err.status).json(err);
      return;
    }
    res.status(500).json(err);
  });
};

const getPolicyECard = (req, res) => {
  logger.debug(`+${module.id} - ${getPolicyECard.name}()`);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new InvalidQueryParams(errors.array());
    res.status(err.status).json(err);
    return;
  }

  let promise;

  const details = req.decodedTokenData;
  switch (details.role) {
    case ROLE_CUSTOMER:
      promise = policiesService.getPolicyECardForCustomer(details.uuid, {empid: req.query.empid, corporateUuid: req.query.corporateUuid});
      break;
    case ROLE_EXECUTIVE:
      promise = policiesService.getPolicyECardForExecutive(details.uuid, {empid: req.query.empid, corporateUuid: req.query.corporateUuid});
      break;
    case ROLE_HR:
      promise = policiesService.getPolicyECardForHr(details.uuid, {empid: req.query.empid, corporateUuid: req.query.corporateUuid});
      break;
    case ROLE_MANAGER:
      promise = policiesService.getPolicyECardForManager(details.uuid, {empid: req.query.empid, corporateUuid: req.query.corporateUuid});
      break;
    default:
      promise = Promise.reject({status: 401, errCode: 'UnauthorizedAccess', message: 'Invalid role provided for authentication.'});
  }

  promise
  .then(policyECard => {
    const _dto = new Success(policyECard, `Policy Ecard returned.`);
    res.status(_dto.status).json(_dto);
  })
  .catch(err => {
    if (err && err.status) {
      res.status(err.status).json(err);
      return;
    }
    res.status(500).json(err);
  });
};

const getNetworkHospitalsByPolicyId = (req, res) => {
  logger.debug(`+${module.id} - ${getNetworkHospitalsByPolicyId.name}()`);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new InvalidQueryParams(errors.array());
    res.status(err.status).json(err);
    return;
  }

  policiesService.getNetworkHospitalsByPolicyId(req.params.policyId)
  .then((policies) => {
    const _dto = new Success(policies);
    res.status(_dto.status).json(_dto);
  })
  .catch((err) => {
    res.send(err);
  });
};

const getNonNetworkHospitals = (req, res) => {
  logger.debug(`+${module.id} - ${getNonNetworkHospitals.name}()`);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new InvalidQueryParams(errors.array());
    res.status(err.status).json(err);
    return;
  }

  policiesService.getNonNetworkHospitals()
  .then(nonNetworkHospitals => {
    res.status(200).send(nonNetworkHospitals);
  })
  .catch(err => {
    res.status(400).send(err);
  });
};

const getAilmentsByPolicyId = (req, res) => {
  logger.debug(`+${module.id} - ${getAilmentsByPolicyId.name}()`);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new InvalidQueryParams(errors.array());
    res.status(err.status).json(err);
    return;
  }

  policiesService.getAilmentsByPolicyId(req.params.policyId)
  .then((policies) => {res.send(policies);})
  .catch(err => {res.send(err);});
};

const addPolicies = (req, res) => {
  logger.debug(`+${module.id} - ${addPolicies.name}()`);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new InvalidQueryParams(errors.array());
    res.status(err.status).json(err);
    return;
  }

  policiesService.addPolicies(req.body)
  .then(policies => {
    logger.debug(`${JSON.stringify(policies)}`);
    const message = (policies && policies.length) ? `${policies.length} policies added.` : `No policies added.`;
    const _dto = new Success(policies, message);
    res.status(_dto.status).json(_dto);
  })
  .catch((err) => {
    if (err && err.status) {
      res.status(err.status).json(err);
      return;
    }
    res.status(500).json(err);
  });
};

const updatePolicy = (req, res) => {
  logger.debug(`+${module.id} - ${updatePolicy.name}()`);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new InvalidQueryParams(errors.array());
    res.status(err.status).json(err);
    return;
  }

  policiesService.updatePolicy(req.decodedTokenData, req.body)
  .then(policy => {
    logger.debug(`${JSON.stringify(policy)}`);
    const _dto = new Success(policy, `Policy Updated.`);
    res.status(_dto.status).json(_dto);
  })
  .catch((err) => {
    if (err && err.status) {
      res.status(err.status).json(err);
      return;
    }
    res.status(500).json(err);
  });
};

const addNetworkHospitalsByPolicyId = (req, res) => {
  logger.debug(`+${module.id} - ${addNetworkHospitalsByPolicyId.name}()`);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new InvalidQueryParams(errors.array());
    res.status(err.status).json(err);
    return;
  }

  let promise;
  const details = req.decodedTokenData;
  switch(details.role) {
    case 'executive':
      promise = policiesService.addNetworkHospitalsAsExecutiveByPolicyId(details.userUuid, req.params.policyId, req.body);
      break;
    case 'manager':
      promise = policiesService.addNetworkHospitalsByPolicyId(req.params.policyId, req.body);
      break;
    default:
      promise = Promise.reject({status: 401, errCode: 'UnauthorizedAccess', message: 'Invalid role provided for authentication.'});
      break;
  }

  promise
  .then(networkHospitals => {
    const message = (networkHospitals && networkHospitals.length) ? `${networkHospitals.length} networkHospitals added.` : `No networkHospitals added.`;
    const _dto = new Success(networkHospitals, message);
    res.status(_dto.status).json(_dto);
  })
  .catch((err) => {
    if (err && err.status) {
      res.status(err.status).json(err);
      return;
    }
    res.status(500).json(err);
  });
};


const addAilmentsByPolicyId = (req, res) => {
  logger.debug(`+${module.id} - ${addAilmentsByPolicyId.name}()`);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new InvalidQueryParams(errors.array());
    res.status(err.status).json(err);
    return;
  }

  let promise;
  const details = req.decodedTokenData;
  switch(details.role) {
    case 'executive':
      promise = policiesService.addAilmentsAsExecutiveByPolicyId(details.userUuid, req.params.policyId, req.body);
      break;
    case 'manager':
      promise = policiesService.addAilmentsByPolicyId(req.params.policyId, req.body);
      break;
    default:
      promise = Promise.reject({status: 401, errCode: 'UnauthorizedAccess', message: 'Invalid role provided for authentication.'});
      break;
  }

  promise
  .then(ailments => {
    const _dto = new Success(ailments);
    res.status(_dto.status).json(_dto);
  })
  .catch((err) => {
    res.send(err);
  });
};

module.exports = {
  addAilmentsByPolicyId: addAilmentsByPolicyId,
  addNetworkHospitalsByPolicyId: addNetworkHospitalsByPolicyId,
  addPolicies: addPolicies,
  getAilmentsByPolicyId: getAilmentsByPolicyId,
  getNetworkHospitalsByPolicyId: getNetworkHospitalsByPolicyId,
  getPolicies: getPolicies,
  getPolicyByPolicyId: getPolicyByPolicyId,
  getPolicyECard: getPolicyECard,
  getPolicyECardByPolicyId: getPolicyECardByPolicyId,
  updatePolicy: updatePolicy
}
