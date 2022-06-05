"use strict";

const customersService = require('../services/customersService');
const { validationResult } = require('express-validator');
const { logger } = require('../config/logger');
const {ROLE_SUPERUSER, ROLE_SRMANAGER, ROLE_MANAGER, ROLE_EXECUTIVE, ROLE_HR, ROLE_CUSTOMER} = require('../services/employeeStatus');
const {BadRequest, InvalidQueryParams} = require('../errors/invalidQueryParams');
const {UnauthorizedAccess} = require('../errors/invalidCredentials');
const {Success} = require('../errors/success');

const getAllCustomers = (req, res) => {
  logger.debug(`+${module.id} - ${getAllCustomers.name}()`);

  let corporateUuid = (req.query.corporateUuid) ? req.query.corporateUuid : null;
  let status = (req.query.status) ? req.query.status.toLowerCase() : null;
  let approvalType = (req.query.approvalType) ? req.query.approvalType.toLowerCase() : null;
  let promise;

  const credentials = req.decodedTokenData;
  switch (credentials.role) {
    case ROLE_CUSTOMER:
      promise = customersService.getCustomerByUserUuid(credentials.uuid);
      break;
    case ROLE_HR:
      promise = customersService.getCustomersByCorporateHrUuid(credentials.uuid, status, approvalType);
      break;
    case ROLE_SUPERUSER:
    case ROLE_SRMANAGER:
    case ROLE_MANAGER:
    case ROLE_EXECUTIVE:
      promise = customersService.getAllCustomers(corporateUuid, status, approvalType)
      break;
    default:
      const err = ({
        status: 401,
        errCode: 'InvalidCustomerRole',
        message: 'An invalid or empty role was provided for this customer object.'
      });
      res.status(err.status).send(err);
      return;
  }

  promise
  .then(customers => {
    const message = (customers.length === 1) ? `${customers.length} customer returned.` : `${customers.length} customers returned.`
    const _dto = new Success(customers, message);
    res.status(_dto.status).json(_dto);
  })
  .catch(err => {
    if (err && err.status) {
      res.status(err.status).json(err);
      return;
    }
    res.status(500).json(err);
  });
}

const getCustomerByEmpIdByCorporateUuid = (req, res) => {
  logger.debug(`+${module.id} - ${getCustomerByEmpIdByCorporateUuid.name}()`);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new InvalidQueryParams(errors.array());
    res.status(err.status).json(err);
    return;
  }

  customersService.getCustomerByEmpIdByCorporateUuid(req.params.empid, req.query.corporateUuid)
  .then(customer => {
    if (req.decodedTokenData.role === ROLE_CUSTOMER && req.decodedTokenData.uuid !== customer.userUuid) {
      const err = new UnauthorizedAccess('Provided empid does not match logged-in Customer\'s empid.');
      res.status(err.status).json(err);
      return;
    }
    const message = `${customer.firstName} ${customer.lastName} - Empid ${customer.empid}`;
    const _dto = new Success(customer, message);
    res.status(_dto.status).json(_dto);
  })
  .catch(err => {
    if (err && err.status) {
      res.status(err.status).json(err);
      return;
    }
    res.status(500).json(err);
  });
}

const getDependentsByEmpidByCorporateUuid = (req, res) => {
  logger.debug(`+${module.id} - ${getDependentsByEmpidByCorporateUuid.name}()`);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new InvalidQueryParams(errors.array());
    res.status(err.status).json(err);
    return;
  }

  let status = (req.query.status) ? req.query.status : null;
  let approvalType = (req.query.approvalType) ? req.query.approvalType : null;
  let corporateUuid = (req.query.corporateUuid) ? req.query.corporateUuid : null;
  let loggedInCustomer = null, requestedDependentsForCustomer = null;

  Promise.all([
      customersService.getCustomerByUserUuid(req.decodedTokenData.uuid),
      customersService.getCustomerByEmpIdByCorporateUuid(req.params.empid, corporateUuid)
    ])
  .then(customers => {
    logger.debug(`{customers: ${JSON.stringify(customers)}`);

    loggedInCustomer = customers[0];
    requestedDependentsForCustomer = customers[1];

    if (loggedInCustomer) {
      logger.debug(`{loggedInCustomer.uuid: ${loggedInCustomer.uuid}, loggedInCustomer.empid: ${loggedInCustomer.empid}`);
    }
    if (requestedDependentsForCustomer) {
      logger.debug(`{requestedDependentsForCustomer.uuid: ${requestedDependentsForCustomer.uuid}, requestedDependentsForCustomer.empid: ${requestedDependentsForCustomer.empid}`);
    }

    if (req.decodedTokenData.role === ROLE_CUSTOMER && loggedInCustomer && requestedDependentsForCustomer && loggedInCustomer.uuid !== requestedDependentsForCustomer.uuid) {
      const err = new UnauthorizedAccess('Provided empid does not match logged-in Customer\'s empid.');
      res.status(err.status).json(err);
      return;
    }

    return customersService.getDependentsByEmpidByCorporateUuid(requestedDependentsForCustomer.empid, status, approvalType, corporateUuid);
  })
  .then(dependents => {
    logger.info(`Received [${dependents.length}] dependents`);
    logger.verbose(JSON.stringify(dependents));
    const _dto = new Success({self: requestedDependentsForCustomer, dependents: dependents}, `${dependents.length} dependents returned.`);
    res.status(_dto.status).json(_dto);
  })
  .catch(err => {
    if (err && err.status) {
      res.status(err.status).json(err);
      return;
    }
    res.status(500).json(err);
  });
}

const getDependentByUuid = (req, res) => {
  logger.debug(`+${module.id} - ${getDependentByUuid.name}()`);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new InvalidQueryParams(errors.array());
    res.status(err.status).json(err);
    return;
  }

  customersService.getDependentByUuid(req.params.uuid)
  .then(dependent => {
    logger.debug(`{depenent: ${JSON.stringify(dependent)}`);
    logger.verbose(JSON.stringify(dependent));
    const _dto = new Success(dependent, `Details for ${dependent.firstName} ${dependent.lastName} returned`);
    res.status(_dto.status).json(_dto);
  })
  .catch(err => {
    if (err && err.status) {
      res.status(err.status).json(err);
      return;
    }
    res.status(500).json(err);
  });
}

const addCustomers = (req, res) => {
  logger.info(`+${module.id} - ${addCustomers.name}()`);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new InvalidQueryParams(errors.array());
    res.status(err.status).json(err);
    return;
  }

  const customers = req.body;
  const uniqueCustomers = [];
  const dupCustomers = [];
  let message = `${customers.length} customers received for add. `;

  // Check if there are duplicate customers in list and filter them out.
  // duplicate customers are those with same empid.
  customers.forEach(c => {
    const foundInUniqueCustomers = uniqueCustomers.find(uc => uc.empid === c.empid);
    if (foundInUniqueCustomers) {
      dupCustomers.push(c);
      uniqueCustomers.splice(uniqueCustomers.indexOf(foundInUniqueCustomers), 1);
    } else {
      uniqueCustomers.push(c);
    }
  })

  customersService.addCustomers( req.decodedTokenData, uniqueCustomers)
  .then( customers => {
    if (dupCustomers && dupCustomers.length > 0) {
      customers.dupCustomersInCsv = dupCustomers;
      message = message.concat(`${customers.dupCustomersInCsv.length} duplicates in CSV. `);
    }
    if (customers.dupCustomersInDb && customers.dupCustomersInDb.length > 0) {
      message = message.concat(`${customers.dupCustomersInDb.length} duplicates in DB. `);
    }
    if (customers.newCustomers && customers.newCustomers.length > 0) {
      message = message.concat(`${customers.newCustomers.length} added. `);
      delete customers.newCustomers; // Intentionally delete to reduce payload size. Ref. https://gitlab.com/vvsanilkumar/employee_benefits/-/issues/27
    }
    const _dto = new Success(customers, message);
    res.status(_dto.status).json(_dto);
  })
  .catch(err => {
    if (err && err.status) {
      res.status(err.status).json(err);
      return;
    }
    res.status(500).json(err);
  });
}

const addDependents = (req, res) => {
  logger.debug(`+${module.id} - ${addDependents.name}()`);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new InvalidQueryParams(errors.array());
    res.status(err.status).json(err);
    return;
  }

  const credentials = req.decodedTokenData;
  _addDependents(req.body, credentials, req.body[0].corporateUuid)
  .then(result => {
    const _dto = (result instanceof Success) ? result : new Success(result);
    res.status(_dto.status).json(_dto);
  })
  .catch(err => {
    if (err && err.status) {
      res.status(err.status).json(err);
      return;
    }
    res.status(500).json(err);
  });
}

const search = (req, res) => {
  logger.debug(`+${module.id} - ${search.name}()`);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new InvalidQueryParams(errors.array());
    res.status(err.status).json(err);
    return;
  }

  customersService.search(req.query.name)
  .then(result => {
    const _dto = new Success(result);
    res.status(_dto.status).json(_dto);
  })
  .catch(err => {
    if (err && err.status) {
      res.status(err.status).json(err);
      return;
    }
    res.status(500).json(err);
  });
}

const updateCustomer = (req, res) => {
  logger.debug(`+${module.id} - ${updateCustomer.name}()`);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new InvalidQueryParams(errors.array());
    res.status(err.status).json(err);
    return;
  }

  customersService.updateCustomer(req.decodedTokenData, req.body)
  .then(rowsUpdated => {
    const message = (rowsUpdated === 0) ? 'Nothing to update. Modified values appear to be same as existing values.' : `Customer updated.`;
    const _dto = new Success(rowsUpdated, message);
    res.status(_dto.status).json(_dto);
  })
  .catch(err => {
    if (err && err.status) {
      res.status(err.status).json(err);
      return;
    }
    res.status(500).json(err);
  });
}

const updateDependent = (req, res) => {
  logger.debug(`+${module.id} - ${updateDependent.name}()`);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new InvalidQueryParams(errors.array());
    res.status(err.status).json(err);
    return;
  }

  const credentials = req.decodedTokenData;
  customersService.updateDependent(credentials, req.body)
  .then(rowsUpdated => {
    const message = (rowsUpdated === 0) ? 'Nothing to update. Modified values appear to be same as existing values.' : `Dependent updated.`;
    const _dto = new Success(rowsUpdated, message);
    res.status(_dto.status).json(_dto);
  })
  .catch(err => {
    if (err && err.status) {
      res.status(err.status).json(err);
      return;
    }
    res.status(500).json(err);
  });
}


const updateDependentByUuid = (req, res) => {
  logger.debug(`+${module.id} - ${updateDependentByUuid.name}()`);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new InvalidQueryParams(errors.array());
    res.status(err.status).json(err);
    return;
  }

  customersService.updateDependentByUuid(req.decodedTokenData, req.body)
  .then(rowsUpdated => {
    logger.info(`result: ${JSON.stringify(rowsUpdated)}`);
    const message = (rowsUpdated === 0) ? 'Nothing to update. Modified values appear to be same as existing values.' : `Dependent updated.`;
    const _dto = new Success(rowsUpdated, message);
    res.status(_dto.status).json(_dto);
  })
  .catch(err => {
    if (err && err.status) {
      res.status(err.status).json(err);
      return;
    }
    res.status(500).json(err);
  });
}

const getDependentsByStatus = (req, res) => {
  logger.debug(`+${module.id} - ${getDependentsByStatus.name}()`);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new InvalidQueryParams(errors.array());
    res.status(err.status).json(err);
    return;
  }

  let queryParams = {status:  req.query.status, corporateUuid: req.query.corporateUuid};
  if (req.query.approvalType) {
    queryParams.approvalType = req.query.approvalType;
  }

  customersService.getDependentsByStatus(queryParams)
  .then(result => {
    const message = (result && result.length) ? `${result.length} dependents returned.` : `No dependents returned.`;
    const _dto = new Success(result, message);
    res.status(_dto.status).json(_dto);
  })
  .catch(err => {
    if (err && err.status) {
      res.status(err.status).json(err);
      return;
    }
    res.status(500).json(err);
  });
}

const addDependentsBulk = (req, res) => {
  logger.debug(`+${module.id} - ${addDependentsBulk.name}()`);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new InvalidQueryParams(errors.array());
    res.status(err.status).json(err);
    return;
  }

  const credentials = req.decodedTokenData;
  _addDependents(req.body, credentials, req.query.corporateUuid)
  .then(result => {
    const _dto = (result instanceof Success) ? result : new Success(result);
    res.status(_dto.status).json(_dto);
  })
  .catch(err => {
    if (err && err.status) {
      res.status(err.status).json(err);
      return;
    }
    res.status(500).json(err);
  });
}

const _addDependents = (dependents, credentials, corporateUuid) => {
  return new Promise((resolve, reject) => {
    let dupDependentsInCsv = [];
    let uniqueDependents = [];
    let message = `${dependents.length} dependents received for add. `;
    // Check if there are duplicate dependents in list and filter them out.
    // duplicate dependents are those with either (same firstName, same lastName and same empid).
    dependents.forEach(d => {
      const duplicateDependent = uniqueDependents.find(elem => elem.firstName === d.firstName && elem.lastName === d.lastName && elem.empid === d.empid);
      if (duplicateDependent) {
        logger.verbose(`[${JSON.stringify(duplicateDependent.firstName)}] is duplicated within CSV.`);
        dupDependentsInCsv.push(d);
      } else {
        logger.verbose(`[${JSON.stringify(d.firstName)}] is unique within the CSV.`);
        uniqueDependents.push(d);
      }

      // An employee can have only one relationship of ("father"|"mother"|"spouse"|"father-in-law"|"mother-in-law").
      // Find out these duplicates and add them to list of identified duplicates.
      const duplicateFatherDependents = dependents.filter(elem => elem.relationship.toLowerCase() === 'father' && elem.empid === d.empid);
      if (duplicateFatherDependents && duplicateFatherDependents.length > 1) {
        dupDependentsInCsv.concat(duplicateFatherDependents);
      }
      const duplicateMotherDependents = dependents.filter(elem => elem.relationship.toLowerCase() === 'mother' && elem.empid === d.empid);
      if (duplicateMotherDependents && duplicateMotherDependents.length > 1) {
        dupDependentsInCsv.concat(duplicateMotherDependents);
      }
      const duplicateSpouseDependents = dependents.filter(elem => elem.relationship.toLowerCase() === 'spouse' && elem.empid === d.empid);
      if (duplicateSpouseDependents && duplicateSpouseDependents.length > 1) {
        dupDependentsInCsv.concat(duplicateSpouseDependents);
      }
      const duplicateFatherInLawDependents = dependents.filter(elem => elem.relationship.toLowerCase() === 'father-in-law' && elem.empid === d.empid);
      if (duplicateFatherInLawDependents && duplicateFatherInLawDependents.length > 1) {
        dupDependentsInCsv.concat(duplicateFatherInLawDependents);
      }
      const duplicateMotherInLawDependents = dependents.filter(elem => elem.relationship.toLowerCase() === 'mother-in-law' && elem.empid === d.empid);
      if (duplicateMotherInLawDependents && duplicateMotherInLawDependents.length > 1) {
        dupDependentsInCsv.concat(duplicateMotherInLawDependents);
      }
    })

    const leftOverDupDependents = uniqueDependents.filter(
      d => dupDependentsInCsv.find(elem => elem.firstName === d.firstName && elem.lastName === d.lastName && elem.empid === d.empid)
    );
    dupDependentsInCsv = dupDependentsInCsv.concat(leftOverDupDependents);
    uniqueDependents = uniqueDependents.filter(
      d => !dupDependentsInCsv.find(elem => elem.firstName === d.firstName && elem.lastName === d.lastName && elem.empid === d.empid)
    );
    const promise = (uniqueDependents && uniqueDependents.length)
      ? customersService.addDependentsBulk(credentials, uniqueDependents, corporateUuid)
      : Promise.resolve({});

    promise
    .then(result => {
      logger.verbose(`result: ${JSON.stringify(result)}`);
      if (dupDependentsInCsv && dupDependentsInCsv.length > 0) {
        result.dupDependentsInCsv = dupDependentsInCsv;
        message = message.concat(`${result.dupDependentsInCsv.length} duplicates in CSV. `);
      }

      if (result.dupDependentsInDb && result.dupDependentsInDb.length > 0) {
        message = message.concat(`${result.dupDependentsInDb.length} duplicates in DB. `);
      }

      if (result.failedDependents && result.failedDependents.length > 0) {
        message = message.concat(`${result.failedDependents.length} failed to add due to incorrect empid. `);
      }

      if (result.newDependents) {
        message = message.concat(`${result.newDependents.length} new dependents added.`);
        delete result.newDependents; // Intentionally delete to reduce response size. Ref https://gitlab.com/vvsanilkumar/employee_benefits/-/issues/27
      }

      const _dto = new Success(result, message);
      logger.verbose(`dto: ${JSON.stringify(_dto)}`);
      resolve(_dto);
    })
    .catch(err => {
      reject(err);
    });
  })
}

const updateDependentsStatusBulk = (req, res) => {
  logger.debug(`+${module.id} - ${updateDependentsStatusBulk.name}()`);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new InvalidQueryParams(errors.array());
    res.status(err.status).json(err);
    return;
  }

  customersService.updateDependentsStatusBulk(req.decodedTokenData, req.body, req.query.corporateUuid)
  .then(result => {
    const _dto = new Success(result);
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

const updateCustomerStatusBulk = (req, res) => {
  logger.debug(`+${module.id} - ${updateCustomerStatusBulk.name}()`);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new InvalidQueryParams(errors.array());
    res.status(err.status).json(err);
    return;
  }

  customersService.updateCustomerStatusBulk(req.decodedTokenData, req.body, req.query.corporateUuid)
  .then(result => {
    const _dto = new Success(result);
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

const getHelpDeskInfo = (req, res) => {
  logger.debug(`+${module.id} - ${getHelpDeskInfo.name}()`);

  customersService.getHelpDeskInfo(req.decodedTokenData.corporateUuid)
  .then(result => {
    const _dto = new Success(result);
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

const getEmployeeReportedIssues = (req, res) => {
  logger.debug(`+${module.id} - ${getEmployeeReportedIssues.name}()`);

  customersService.getEmployeeReportedIssues(req.decodedTokenData.uuid, req.decodedTokenData.corporateUuid)
  .then(result => {
    const _dto = new Success(result);
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

const reportEmployeeGrievance = (req, res) => {
  logger.debug(`+${module.id} - ${reportEmployeeGrievance.name}()`);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new InvalidQueryParams(errors.array());
    res.status(err.status).json(err);
    return;
  }

  customersService.reportEmployeeGrievance(req.decodedTokenData.uuid, req.decodedTokenData.corporateUuid, req.body.issueType, req.body.description)
  .then(result => {
    const _dto = new Success(result);
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


const insuranceEnquiryCallback = (req, res) => {
  logger.debug(`+${module.id} - ${insuranceEnquiryCallback.name}()`);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new InvalidQueryParams(errors.array());
    res.status(err.status).json(err);
    return;
  }

  if (isNaN(new Date(req.body.callBackRequestedTime).getTime())) {
    const err = new BadRequest(errors.array(), 'Invalid Date');
    res.status(err.status).json(err);
    return;
  }

  customersService.insuranceEnquiryCallback(req.decodedTokenData.uuid, req.decodedTokenData.corporateUuid, req.body.insuranceType, req.body.callBackRequestedTime)
  .then(result => {
    const _dto = new Success(result);
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


module.exports = {
  addCustomers: addCustomers,
  addDependents: addDependents,
  addDependentsBulk: addDependentsBulk,
  updateDependentsStatusBulk: updateDependentsStatusBulk,
  updateCustomerStatusBulk: updateCustomerStatusBulk,
  getAllCustomers: getAllCustomers,
  getCustomerByEmpIdByCorporateUuid: getCustomerByEmpIdByCorporateUuid,
  getDependentByUuid: getDependentByUuid,
  getDependentsByEmpidByCorporateUuid: getDependentsByEmpidByCorporateUuid,
  getDependentsByStatus: getDependentsByStatus,
  search: search,
  updateCustomer: updateCustomer,
  updateDependent: updateDependent,
  updateDependentByUuid: updateDependentByUuid,
  getHelpDeskInfo: getHelpDeskInfo,
  getEmployeeReportedIssues: getEmployeeReportedIssues,
  reportEmployeeGrievance: reportEmployeeGrievance,
  insuranceEnquiryCallback: insuranceEnquiryCallback
};
