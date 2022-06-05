"use strict";

const {v4: uuidv4, v5:uuidv5} = require('uuid');
const {Op} = require('sequelize');
const {Ailment, Claim, Corporate, CorporateHR, Customer, Executive, ExecutiveCorporateMapping, Policy,PolicyAilmentMapping} = require('../models');
const soapService = require('./soapService')
const {logger} = require('../config/logger');
const mediAssistProvider = require('../providers/mediAssistProvider');
const fhplProvider = require("../providers/fhplProvider");
const {BadRequest, InvalidQueryParams} = require('../errors/invalidQueryParams');
const {UnauthorizedAccess} = require('../errors/invalidCredentials');
const {ROLE_SUPERUSER, ROLE_SRMANAGER, ROLE_MANAGER, ROLE_EXECUTIVE, ROLE_HR, ROLE_CUSTOMER} = require('./employeeStatus');

const CLAIMS_NAMESPACE = '1b25698b-37db-47e6-b4e6-7ef8e96391ff';
// const HOSPITAL_NAMESPACE = '0b4e38dc-e9a5-410a-97cd-146ab99f315b';


const ATTRIBUTES = [
  'uuid',
  'corporateName',
  'claimId',
  'policyId',
  'patientName',
  'relationship',
  'employeeName',
  'empid',
  'dateOfHospitalization',
  'hospitalName',
  'address',
  'ailmentName',
  'cashless',
  'reimbursement',
  'dateOfAdmission',
  'dateOfDischarge',
  'initialEstimate',
  'status',
  'dateOfSettlement',
  'amountSettled',
  'amountApproved',
  'denialReason',
  'amountDisallowed',
  'disallowanceReason'
];

const _getAllClaimsForExecutive = (executiveUuid, corporateUuid, empid, whereOptions) => {
  return new Promise((resolve, reject) => {
    Executive.findOne({where: {userUuid: executiveUuid}})
    .then(exec => {
      return ExecutiveCorporateMapping.findAll({where: {executiveUuid: exec.uuid}});
    })
    .then(ecMap => {
      logger.debug(`ecMap: ${JSON.stringify(ecMap)}`);
      let found = false;
      let ec = null;
      let corporateOptions = []
      for (ec of ecMap) {
        logger.debug(`ec: ${JSON.stringify(ec)}`);
        logger.debug(`corporateUuid: ${corporateUuid}, ec.corporateUuid: ${ec.corporateUuid}, (ec.corporateUuid === corporateUuid): ${(ec.corporateUuid === corporateUuid)}`);
        if (corporateUuid && ec.corporateUuid === corporateUuid) {
          found = true;
          break;
        } else {
          corporateOptions.push(ec.corporateUuid);
        }
      }
      if (!found && corporateUuid) {
        throw(new UnauthorizedAccess('Given Corporate UUID is not authorized for access by this Executive.'));
      }
      whereOptions.corporateUuid = (corporateUuid) ? corporateUuid : {[Op.or]: corporateOptions};

      return (empid && corporateUuid)
        ? Customer.findOne({where: {empid: empid, corporateUuid: corporateUuid}})
        : 'empid not provided';
    })
    .then(customer => {
      if (!customer) {
        throw(new BadRequest('A customer with given empid and corporateUuid was not found.'));
      }
      return Claim.findAll({where: whereOptions, attributes: ATTRIBUTES});
    })
    .then(claims => {
      resolve(claims);
    })
    .catch(err => {
      reject(err);
    })
  })
}

const _getAllClaimsForHr = (corporateHrUuid, corporateUuid, empid, whereOptions) => {
  return new Promise((resolve, reject) => {
    CorporateHR.findOne({where: {userUuid: corporateHrUuid}})
    .then(chr => {
      if (!chr) {
        throw(new UnauthorizedAccess('HR with given UUID was not found'));
      }
      if (corporateUuid && chr.corporateUuid !== corporateUuid) {
        throw(new UnauthorizedAccess('Given Corporate UUID is not authorized for access by this HR.'));
      }
      if (!whereOptions.corporateUuid) {
        whereOptions.corporateUuid = chr.corporateUuid;
      }

      return (empid && corporateUuid)
        ? Customer.findOne({where: {empid: empid, corporateUuid: corporateUuid}})
        : 'empid not provided';
    })
    .then(customer => {
      if (!customer) {
        throw(new BadRequest({empid: empid}, 'A customer with given empid and corporateUuid was not found.'));
      }
      return Claim.findAll({where: whereOptions, attributes: ATTRIBUTES});
    })
    .then(claims => {
      if (!claims) {
        resolve([]);
      }
      resolve(claims);
    })
    .catch(err => {
      logger.error(err);
      reject(err);
    })
  })
}

const _getAllClaimsForCustomer = (corporateUuid, empid) => {
  return new Promise((resolve, reject) => {
    Customer.findOne({where: {empid: empid, corporateUuid: corporateUuid}})
    .then(customer => {
      if (empid && empid !== customer.empid) {
        throw(new UnauthorizedAccess('Given empid is not authorized for access by this Customer.'));
      }
      if (corporateUuid && corporateUuid !== customer.corporateUuid) {
        throw(new UnauthorizedAccess('Given Corporate UUID is not authorized for access by this Customer.'));
      }
      return Claim.findAll({where: {empid: empid, corporateUuid: corporateUuid}, attributes: ATTRIBUTES});
    })
    .then(claims => {
      resolve(claims);
    })
    .catch(err => {
      reject(err);
    })
  })
}

const getAllClaims = (credentials, queryParams) => {
  return new Promise( (resolve, reject) => {
    logger.debug(`${module.filename} - ${getAllClaims.name}()`);
    // First fill up all options to be given to "where" in findAll
    let whereOptions = {};
    Object.keys(queryParams).forEach(key => {
      switch (key) {
        case 'fromDate':
          whereOptions.dateOfHospitalization = (queryParams.toDate)
            ? {[Op.between]: [new Date(queryParams.fromDate), new Date(queryParams.toDate)]}
            : {[Op.gte]: new Date(queryParams.fromDate)};
          break;

        case 'toDate':
          whereOptions.dateOfHospitalization = (queryParams.fromDate)
            ? {[Op.between]: [new Date(queryParams.fromDate), new Date(queryParams.toDate)]}
            : {[Op.gte]: new Date(queryParams.toDate)};
          break;

        case 'empid':
          whereOptions.empid = queryParams.empid;
          break;

        case 'corporateUuid':
          whereOptions.corporateUuid = queryParams.corporateUuid;
          break;
      }
    });

    if (whereOptions.empid && !whereOptions.corporateUuid && ![ROLE_CUSTOMER, ROLE_HR].includes(credentials.role)) {
      throw(new InvalidQueryParams('empid cannot be empty and must be provided with corporateUuid'));
    }

    // Now address query as per role provided in credentials
    switch(credentials.role) {
      case ROLE_SUPERUSER:
      case ROLE_SRMANAGER:
      case ROLE_MANAGER:
        Claim.findAll({where: whereOptions, attributes: ATTRIBUTES})
        .then(claims => {resolve(claims);})
        .catch(err => {reject(err);})
        break;

      case ROLE_EXECUTIVE:
        _getAllClaimsForExecutive(credentials.uuid, queryParams.corporateUuid, queryParams.empid, whereOptions)
        .then(claims => {resolve(claims);})
        .catch(err => {reject(err);})
        break;

      case ROLE_HR: {
        _getAllClaimsForHr(credentials.uuid, queryParams.corporateUuid, queryParams.empid, whereOptions)
        .then(claims => {resolve(claims);})
        .catch(err => {reject(err);})
        break;
      }

      case ROLE_CUSTOMER: {
        whereOptions.corporateUuid = credentials.corporateUuid;
        _getAllClaimsForCustomer(credentials.corporateUuid, queryParams.empid)
        .then(claims => {resolve(claims);})
        .catch(err => {reject(err);})
        break;
      }
    }
  });
};

const getClaimByClaimId = (claimId) => {
  return new Promise( (resolve, reject) => {
    logger.debug(`${module.filename} - ${getClaimByClaimId.name}()`);
    Claim.scope('defaultScope').findOne({
      where: {claimId: claimId},
      attributes: ATTRIBUTES
    })
    .then(claims => { resolve(claims); })
    .catch(err => {reject(err);})
  });
};

const addClaims = claims => {
  return new Promise( (resolve, reject) => {
    logger.debug(`${module.filename} - ${addClaims.name}()`);
    let promises = [];
    claims.forEach(c => {
      if (!c.uuid) { c.uuid = uuidv4(); }
      promises.push(_getDaoForClaim(c));
    });

    Promise.all(promises)
    .then(claimsDao => {
      return Claim.bulkCreate(claimsDao);
    })
    .then(result => {
      resolve(result);
    })
    .catch(err => {
      logger.error(err);
      reject(err);
    });
  });
};

const _getDaoForClaim = claim => {
  return new Promise((resolve, reject) => {
    let dao = {};
    let customerCorporateUuid = null;
    Claim.scope('defaultScope').findOne({
      where: {claimId: claim.claimId}
    })
    .then(c => {
      if (c && c.uuid) {
        throw(new BadRequest({claimId: claim.claimId}, 'The claim ID provided for the new claim is not unique and already present in the DB associated with another claim. Please retry with a unique claim ID.'));
      }

      dao.uuid = claim.uuid ? claim.uuid : uuidv4();
      dao.claimId = claim.claimId;
      dao.policyUuid = claim.policyUuid;
      dao.ailmentUuid = claim.ailmentUuid;
      dao.treatmentType = claim.treatmentType;
      dao.cashless = claim.cashless;
      dao.reimbursement = claim.reimbursement;
      dao.dateOfHospitalization = claim.dateOfHospitalization;
      dao.dateOfAdmission = claim.dateOfAdmission;
      dao.dateOfDischarge = claim.dateOfDischarge;
      dao.dateOfSettlement = claim.dateOfSettlement;
      dao.status = claim.status;
      dao.initialEstimate = claim.initialEstimate;
      dao.amountSettled = claim.amountSettled;
      dao.amountApproved = claim.amountApproved;
      dao.amountDisallowed = claim.amountDisallowed;
      dao.denialReason = claim.denialReason;
      dao.disallowanceReason = claim.disallowanceReason;

      return Customer.scope('defaultScope').findOne({
        where: {uuid: claim.customerUuid}
      });
    })
    .then(customer => {
      if (!customer) {
        throw(new BadRequest({customerUuid: claim.customerUuid}, 'The provided customer UUID was not found in DB.'));
      }

      customerCorporateUuid = customer.corporateUuid;
      dao.empid = customer.empid;
      dao.employeeName = customer.firstName + ' ' + (customer.lastName) ? customer.lastName : '';
      dao.address =  customer.addressBuildingName + ', ' +
       customer.addressBuildingAddress  + ', ' +
       customer.addressStreet + ', ' + customer.addressCity + ', ' + customer.addressDistrict + ', ' + customer.addressState + ', ' + customer.addressPincode;
      dao.relationship = claim.relationship;
      dao.patientName = claim.employeeName;
      dao.hospitalName = claim.hospitalName;
      return Corporate.scope('defaultScope').findOne({
        where: {uuid: customerCorporateUuid}
      })
    })
    .then(corporate => {
      if (!corporate) {
        throw(new BadRequest({corporateUuid: customerCorporateUuid}, 'No corporate was found with the given corporate UUID.'));
      }
      dao.corporateUuid = corporate.uuid;
      dao.corporateName = corporate.companyName;

      return Policy.scope('defaultScope').findOne({
        where: {uuid: claim.policyUuid}
      });
    })
    .then(policy => {
      if (!policy) {
        throw(new BadRequest({policyUuid: claim.policyUuid}, 'No policy was found with the given policy UUID.'));
      }
      dao.policyId = policy.policyId;

      const findAilmentPromise = Ailment.scope('defaultScope').findOne({
        where: {uuid: claim.ailmentUuid}
      });
      const findPolicyAilmentMappingsPromise = PolicyAilmentMapping.scope('defaultScope').findOne({
        where: {
          [Op.and]: [
            {PolicyUuid: claim.policyUuid},
            {AilmentUuid: claim.ailmentUuid},
          ]
        }
      });
      return Promise.all([findAilmentPromise, findPolicyAilmentMappingsPromise]);
    })
    .then(result => {
      if (!result || result.length !== 2) {
        throw(new BadRequest({policyUuid: claim.policyUuid, ailmentUuid: claim.ailmentUuid}, 'The provided ailments could not be mapped to this claim or to the provided policy ID.'));
      }
      if (!result[0] || !result[0].name) {
        throw(new BadRequest({ailmentUuid: claim.ailmentUuid}, 'The provided ailment could not be mapped to the provided policy ID.'));
      }
      if (!result[1] || !result[1].PolicyUuid || !result[1].AilmentUuid) {
        throw(new BadRequest({policyUuid: claim.policyUuid, ailmentUuid: claim.ailmentUuid}, 'The provided ailment could not be mapped to the provided policy ID.'));
      }
      dao.ailmentName = result[0].name;

      resolve(dao);
    })
    .catch(err => {
      logger.error(err);
      reject(err);
    });
  });
};

// TODO: Deprecated. This function addClaimsFromSoapByPolicyByDates() is deprecated. DO NOT USE THIS.
const addClaimsFromSoapByPolicyByDates = (policy, fromDate, toDate) => {
  return new Promise( (resolve, reject) => {
    logger.debug(`${module.filename} - ${addClaimsFromSoapByPolicyByDates.name}()`);
    let _claimsFromSoap = null;
    let _customerPromises = [];
    let _corporatePromises = [];
    soapService.getAllClaimsByPolicyByDates(policy, fromDate, toDate)
    .then(claims => {
      _claimsFromSoap = claims;
      _claimsFromSoap.forEach(claim => {
        _customerPromises.push(
          Customer.scope('defaultScope').findOne({
            where: {empid: claim.empid}
          })
        );
        _corporatePromises.push(
          Corporate.scope('defaultScope').findOne({
            where: {companyName: claim.corporateName}
          })
        );
      });
      return Promise.all(_customerPromises);
    })
    .then(customers => {
      for (let i = 0; i < customers.length; i++) {
        _claimsFromSoap[i].corporateUuid = (customers[i] && customers[i].corporateUuid) ? customers[i].corporateUuid : _claimsFromSoap[i].corporateUuid;
      }
      return Promise.all(_corporatePromises);
    })
    .then(corporates => {
      for (let i = 0; i < corporates.length; i++) {
        _claimsFromSoap[i].corporateUuid =
          (corporates[i] && corporates[i].uuid && (corporates[i].uuid !== _claimsFromSoap[i].corporateUuid)) ?
            corporates[i].uuid :
            _claimsFromSoap[i].corporateUuid;
      }
      return Claim.bulkCreate(_claimsFromSoap);
    })
    .then(claims => {
      logger.debug('Successfully pushed into DB.');
      logger.debug(JSON.stringify(claims, null, 2));
      resolve(claims);
    })
    .catch(err => {
      logger.error(err);
      reject(err);
    })
  });
};

const getAllSoapClaimsByPolicyByDates = (policy, fromDate, toDate) => {
  return new Promise((resolve, reject) => {
    logger.debug(`${module.filename} - ${getAllSoapClaimsByPolicyByDates.name}()`);
    if (!policy) {
      Claim.scope('defaultScope').findAll()
      .then(claims => {
        resolve(claims);
      })
      .catch(err => {
        reject(err);
      })
    } else {
      const df = (!fromDate) ? new Date(2000, 0, 1, 0, 0, 0) : _convertToDate(fromDate);
      const dt = (!toDate) ? new Date() : _convertToDate(toDate);
      Claim.scope('defaultScope').findAll(
        {
          where: {
            [Op.and]: [
              {policyId: policy},
              {dateOfHospitalization: {[Op.gte]: df}},
              {dateOfHospitalization: {[Op.lte]: dt}},
            ]
          }, order: [['dateOfHospitalization', 'DESC']]
        }
      )
      .then(claims => {
        resolve(claims);
      })
      .catch(err => {
        reject(err);
      })
    }
  });
};

const mediAssistClaimsByPolicyByDates = (policy, fromDate, toDate) => {
  return new Promise( (resolve, reject) => {
    logger.debug(`${module.filename} - ${mediAssistClaimsByPolicyByDates.name}()`);
    let claimsList = null;
    mediAssistProvider.getAllClaimsByPolicyByDates(policy, fromDate, toDate)
    .then(claims => {
      let getPolicyPromises = [];
      claimsList = claims;      
      getPolicyPromises.push(Policy.findOne({where: {policyId: policy}}));
      return Promise.all(getPolicyPromises);
    })
    .then(policies => {
      claimsList.forEach(claim => {
           claim.uuid = uuidv5(policies[0].corporateUuid+'--'+claim.policyId+'--'+claim.claimId, CLAIMS_NAMESPACE); // Generate unique uuid for each claim
           claim.corporateUuid = policies[0].corporateUuid;
           claim.policyUuid = policies[0].uuid;
      });
      return Claim.bulkCreate(claimsList, { updateOnDuplicate: ATTRIBUTES});
    })
    .then(claims => {
      logger.debug('Successfully pushed into DB.');
      resolve(claims);
    })
    .catch(err => {
      console.log(err);
      logger.error(err);
      reject(err);
    })
  });
}

const fhplClaimsByPolicyByDates = (policy, fromDate, toDate) => {
  return new Promise( (resolve, reject) => {
    logger.debug(`${module.filename} - ${fhplClaimsByPolicyByDates.name}()`);
    let claimsList = null;
    fhplProvider.getAllClaimsByPolicyByDates(policy, fromDate, toDate)
    .then(claims => {
      let getPolicyPromises = [];
      claimsList = claims;
      getPolicyPromises.push(Policy.findOne({where: {policyId: policy}}));
      return Promise.all(getPolicyPromises);
    })
    .then(policies => {
      claimsList.forEach(claim => {
           claim.uuid = uuidv5(policies[0].corporateUuid+'--'+claim.policyId+'--'+claim.claimId, CLAIMS_NAMESPACE); // Generate unique uuid for each claim
           claim.corporateUuid = policies[0].corporateUuid;
           claim.policyUuid = policies[0].uuid;
      });
      return Claim.bulkCreate(claimsList, { updateOnDuplicate: ATTRIBUTES});
    })
    .then(claims => {
      logger.debug('Successfully pushed into DB.');
      resolve(claims);
    })
    .catch(err => {
      console.log(err);
      logger.error(err);
      reject(err);
    })
  });
}

const _convertToDate = (dateStr) => {
  logger.debug('received Date: ' + dateStr);
  const splitDate = dateStr.split('-');
  const yyyy = splitDate[0];
  const mm = splitDate[1]-1; // JS Date() uses 0-indexed months. Hence reducing received value by 1.
  const dd = splitDate[2];
  const newDate = new Date(yyyy, mm, dd, 0, 0, 0);
  logger.debug('new Date: ' + newDate);
  return newDate;
};

module.exports = {
  getAllClaims: getAllClaims,
  getClaimByClaimId: getClaimByClaimId,
  addClaims: addClaims,
  addClaimsFromSoapByPolicyByDates: addClaimsFromSoapByPolicyByDates, // TODO: Deprecated
  getAllSoapClaimsByPolicyByDates: getAllSoapClaimsByPolicyByDates,
  mediAssistClaimsByPolicyByDates: mediAssistClaimsByPolicyByDates,
  fhplClaimsByPolicyByDates: fhplClaimsByPolicyByDates
}
