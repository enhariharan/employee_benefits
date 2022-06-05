"use strict";

// TODO: Deprecated. Move all functions from this file into providers/fhplProvider.js and delete this file.

const {v4: uuidv4} = require('uuid');
const soap = require('soap');
const {logger} = require('../config/logger');

const TPA_SERVICE_URL = 'https://m.fhpl.net/Bunnyconnect/BCService.svc?wsdl';
const SOAP_REQ_OPTIONS = {forceSoap12Headers: true};
const {ServerError} = require('../errors/serverError');
const {BadRequest} = require('../errors/invalidQueryParams');

// TODO: **Deprecated** This method getAllClaimsByPolicyByDates() is Deprecated
const getAllClaimsByPolicyByDates = (policy, fromDate, toDate) => {
  return new Promise((resolve, reject) => {
    soap.createClient(TPA_SERVICE_URL, SOAP_REQ_OPTIONS, (err, client) => {
      if (err) {
        const error = new ServerError('CouldNotCreateSoapClient', `An error occurred while connecting to the SOAP Client. Please see details in data.`, err);
        reject(error);
        return;
      }
      if (!client) {
        const error = new ServerError('NullSoapClient', `SOAP connection was successful but received a NULL Client.`);
        reject(error);
        return;
      }

      client.on("request", xml => {
        logger.info('request converted to xml.');
        logger.info(`${xml}`);
      });
      client.on("response", xml => {
        logger.info('response received from SOAP service.');
        console.log('xml')
        console.log(xml)
        logger.info(`${xml}`);
      });

      // The server is using the soap1.2. To get the soap1.2 we need add few headers in our request.
      // These lines must be changed whenever the respective configuration of the SOAP server changes.
      if (client.wsdl.xmlnsInEnvelope.search('xmlns:wsa=\"http://www.w3.org/2005/08/addressing\"') === -1) {
        client.wsdl.xmlnsInEnvelope += ' xmlns:wsa=\"http://www.w3.org/2005/08/addressing\"';
      }
      client.clearSoapHeaders();
      client.addSoapHeader({'wsa:Action': 'http://tempuri.org/IBCService/GetTPA_ClaimsDetails'})
      const queryJson = {
        UserName: 'Visista',
        Password: 'visista123',
        Policyno: policy,
        Fromdate: fromDate,
        Todate: toDate
      };

      /**
       * @param {{GetTPA_ClaimsDetailsResult:Object}} result
       */
      client.GetTPA_ClaimsDetails(queryJson, (err, result) => {
        if (err) {
          const error = new ServerError('ErrorInSoapClientResponse', `The SOAP client returned an error to your request.`, err);
          reject(error);
          return;
        }
        if (!result) {
          const error = new ServerError('ErrorInSoapClientResponse', `Empty response received from SOAP service.`);
          reject(error);
          return;
        }

        const claimsJsonFromSoap = JSON.parse(result.GetTPA_ClaimsDetailsResult);
        const claimsJson = _convertIntoClaimsJsonFormat(claimsJsonFromSoap);
        resolve(claimsJson);
      });
    });
  });
}

const getAllNetworkHospitals = (startIndex, endIndex, tpaUuid, insuranceCompanyUuid) => {
  return new Promise((resolve, reject) => {
    logger.debug('soapService.getAllNetworkHospitals()');
    logger.info(`{startIndex,: ${startIndex}, endIndex: ${endIndex}, tpaUuid: ${tpaUuid}, insuranceCompanyUuid: ${insuranceCompanyUuid}}`, );
    soap.createClient(TPA_SERVICE_URL, SOAP_REQ_OPTIONS, (err, client) => {
      if (err) {
        const error = new ServerError('CouldNotCreateSoapClient', `An error occurred while connecting to the SOAP Client. Please see details in data.`, err);
        reject(error);
        return;
      }

      if (!client) {
        const error = new ServerError('NullSoapClient', `SOAP connection was successful but received a NULL Client.`);
        reject(error);
        return;
      }

      client.on("request", ignorexml => {
        logger.info('request converted to xml.');
        // logger.debug(ignorexml);
      });
      client.on("response", ignorexml => {
        logger.info('response received from SOAP service.');
        // logger.debug(ignorexml);
      });

      // The server is using the soap1.2. To get the soap1.2 we need add few headers in our request.
      // These lines must be changed whenever the respective configuration of the SOAP server changes.
      if (client.wsdl.xmlnsInEnvelope.search('xmlns:wsa=\"http://www.w3.org/2005/08/addressing\"') === -1) {
        client.wsdl.xmlnsInEnvelope += ' xmlns:wsa=\"http://www.w3.org/2005/08/addressing\"';
      }
      client.clearSoapHeaders();
      client.addSoapHeader({'wsa:Action': 'http://tempuri.org/IBCService/GetNetworkHospitalDetails'})
      const queryJson = {
        UserName: 'Visista',
        Password: 'visista123',
        StartIndex: startIndex,
        EndIndex: endIndex,
      };

      /**
       * @type {Object} result
       * @property {Object} result.GetNetworkHospitalDetailsResult
       * @property {Object} result.GetNetworkHospitalDetailsResult.Table1
       */
      client.GetNetworkHospitalDetails(queryJson, (err, result) => {
        if (err) {
          const error = new ServerError('ErrorInSoapClientResponse', `The SOAP client returned an error to your request.`, err);
          reject(error);
          return;
        }
        if (!result) {
          const error = new ServerError('ErrorInSoapClientResponse', `Empty response received from SOAP service.`);
          reject(error);
          return;
        }

        const networkHospitalsJsonFromSoap = JSON.parse(result.GetNetworkHospitalDetailsResult);
        const networkHospitalsJson = _convertIntoNetworkHospitalsJsonFormat(
          networkHospitalsJsonFromSoap.Table1,
          tpaUuid,
          insuranceCompanyUuid
        );
        resolve(networkHospitalsJson);
      });
    });
  });
}

const getPolicyEcardFromSoap = (empid, policyId, tpaServiceUrl) => {
  return new Promise((resolve, reject) => {
    logger.debug(`+${module.id}.${getPolicyEcardFromSoap.name}()`);
    soap.createClient(tpaServiceUrl, SOAP_REQ_OPTIONS, (err, client) => {
      if (err) {
        const error = new ServerError('CouldNotCreateSoapClient', `An error occurred while connecting to the SOAP Client. Please see details in data.`, err);
        reject(error);
      }

      if (!client) {
        const error = new ServerError('NullSoapClient', `SOAP connection was successful but received a NULL Client.`);
        reject(error);
      }

      client.on("request", xml => {
        logger.info('request converted to xml.');
        logger.info(xml);
      });
      client.on("response", xml => {
        logger.info('response received from SOAP service.');
        logger.info(xml);
      });

      // The server is using the soap1.2. To get the soap1.2 we need add few headers in our request.
      // These lines must be changed whenever the respective configuration of the SOAP server changes.
      if (client.wsdl.xmlnsInEnvelope.search('xmlns:wsa=\"http://www.w3.org/2005/08/addressing\"') === -1) {
        client.wsdl.xmlnsInEnvelope += ' xmlns:wsa=\"http://www.w3.org/2005/08/addressing\"';
      }
      client.clearSoapHeaders();
      client.addSoapHeader({'wsa:Action': 'http://tempuri.org/IBCService/GetEnrollmentDetailsAndEcard'})
      const queryJson = {
        UserName: 'Visista',
        Password: 'visista123',
        PolicyNumber: policyId,
        EmployeeID: empid,
      };

      logger.info(`Querying SOAP service to get e-card.`);

      /**
       * @type {Object} result
       * @property {Object} result.GetEnrollmentDetailsAndEcardResult
       */
      client.GetEnrollmentDetailsAndEcard(queryJson, (err, result) => {
        if (err) {
          const error = new ServerError('ErrorInSoapClientResponse', `The SOAP client returned an error to your request.`, err);
          reject(error);
          return
        }
        if (!result) {
          const error = new ServerError('ErrorInSoapClientResponse', `Empty response received from SOAP service.`);
          reject(error);
        }

        let resultJsonFromSoap = JSON.parse(result.GetEnrollmentDetailsAndEcardResult);
        logger.debug(`${JSON.stringify(resultJsonFromSoap)}`);

        if (resultJsonFromSoap && resultJsonFromSoap[0] && resultJsonFromSoap[0].EcardLink) {
          resolve({isSuccess: true, ecardUrl: resultJsonFromSoap[0].EcardLink});
        } else {
          const error = new BadRequest('Policy e-card not received from TPA.', 'Policy e-card not received from TPA.');
          reject(error);
        }
      });
    });
  });
}

// TODO: **Deprecated** This method _convertIntoClaimsJsonFormat() is Deprecated
const _convertIntoClaimsJsonFormat = jsonFromSoap => {
  let claims = [];
  /**
   * @type {Object} js
   * @property {string} js.CLAIM_ID
   * @property {string} js.COMPANY_NAME
   * @property {string} js.POLICY_NO
   * @property {string} js.PATIENT_NAME
   * @property {string} js.PATIENT_RELATION
   * @property {string} js.EMPLOYEE_NAME
   * @property {string} js.EMPLOYEE_NO
   * @property {string} js.HOSPITAL_NAME
   * @property {string} js.HOSPITAL_NAME
   * @property {string} js.HOSPITAL_CITY
   * @property {string} js.HOSPITAL_STATE
   * @property {string} js.AILMENT
   * @property {string} js.FINAL_DIAGNOSIS
   * @property {string} js.TYPE_OF_CLAIM
   * @property {string} js.DATE_OF_ADMISSION
   * @property {string} js.DATE_OF_ADMISSION
   * @property {string} js.DATE_OF_DISCHARGE
   * @property {string} js.DATE_OF_SETTLEMENT
   * @property {string} js.INTIMATION_DATE
   * @property {string} js.CLAIM_STATUS
   * @property {string} js.PRE_AUTH_AMOUNT
   * @property {string} js.AMOUNT_PAID_TO_PROVIDER
   * @property {string} js.APPROVED_AMOUNT
   * @property {string} js.REASON_FOR_CLOSURE
   * @property {string} js.DEDUCTION_REASONS
   */
  jsonFromSoap.forEach(js => {
    let claim = {};
    claim.uuid = uuidv4();
    claim.claimId = js.CLAIM_ID;
    claim.policyUuid = uuidv4(); // Get from Policy table corresponding to policyId
    claim.ailmentUuid = uuidv4(); // TODO: Search from ailment table for matching ailment name and put that UUID here.
    claim.corporateUuid = uuidv4(); // TODO: Get  corporate UUID corresponding to employee UUID.
    claim.corporateName = js.COMPANY_NAME; // TODO: Get from Corporate corresponsing to UUID.
    claim.policyId = js.POLICY_NO;
    claim.patientName = js.PATIENT_NAME;
    claim.relationship = js.PATIENT_RELATION;
    claim.employeeName = js.EMPLOYEE_NAME;
    claim.empid = js.EMPLOYEE_NO;
    claim.hospitalName = js.HOSPITAL_NAME;
    claim.address = js.HOSPITAL_NAME + ', ' + js.HOSPITAL_CITY + ', ' + js.HOSPITAL_STATE
    claim.ailmentName = js.AILMENT;
    claim.treatmentType = js.FINAL_DIAGNOSIS; // TODO: This field is not present in the SOAP response
    claim.cashless = (js.TYPE_OF_CLAIM === 'PP');
    claim.reimbursement = !claim.cashless;
    claim.dateOfHospitalization = _convertDate(js.DATE_OF_ADMISSION);
    claim.dateOfAdmission = _convertDate(js.DATE_OF_ADMISSION);
    claim.dateOfDischarge = _convertDate(js.DATE_OF_DISCHARGE);
    claim.dateOfSettlement = _convertDate(js.DATE_OF_SETTLEMENT);
    claim.dateOfIntimation = _convertDate(js.INTIMATION_DATE);
    claim.status = js.CLAIM_STATUS;
    claim.initialEstimate = js.PRE_AUTH_AMOUNT; // TODO: No direct field found for this.
    claim.amountSettled = js.AMOUNT_PAID_TO_PROVIDER;
    claim.amountApproved = js.APPROVED_AMOUNT;
    claim.amountDisallowed = claim.initialEstimate - claim.amountApproved; // TODO: Not clear what to put here.
    claim.denialReason = js.REASON_FOR_CLOSURE;
    claim.disallowanceReason = js.DEDUCTION_REASONS; // TODO: Not sure what to put here.
    claim.createdAt = new Date();
    claim.updatedAt = new Date();

    claims.push(claim);
  });

  return claims;
};

const _convertIntoNetworkHospitalsJsonFormat = (jsonFromSoap, tpaUuid, insuranceCompanyUuid) => {
  let networkHospitals = [];
  // logger.debug(JSON.stringify(jsonFromSoap, null, 2));
  logger.info(`{tpaUuid: ${tpaUuid}, insuranceCompanyUuid: ${insuranceCompanyUuid}}`, );
  /**
   * @type {Object} js
   * @property {string} js.HospitalId
   * @property {string} js.HospitalName
   * @property {string} js.AddressLine1
   * @property {string} js.AddressLine2
   * @property {string} js.CityName
   * @property {string} js.stateName
   * @property {string} js.Pincode
   * @property {string} js..STDCode
   * @property {string} js.PhoneNumber
   * @property {string} js.LevelOfCare
   * @property {string} js.NetworkType
   * @property {string} js.STDCode
   * @property {string} js.Email
   */
  jsonFromSoap.forEach(js => {
    let networkHospital = {};
    networkHospital.uuid = uuidv4();
    networkHospital.tpaUuid = tpaUuid;
    networkHospital.insuranceCompanyUuid = insuranceCompanyUuid;
    networkHospital.hospitalId = js.HospitalId;
    networkHospital.branchCode = js.HospitalId; // TODO: Change this to a meaningful code later.
    networkHospital.name = js.HospitalName;
    networkHospital.addressBuildingName = js.HospitalName;
    networkHospital.addressBuildingAddress = js.AddressLine1;
    networkHospital.addressStreet = js.AddressLine2;
    networkHospital.addressCity = js.CityName;
    networkHospital.addressDistrict = '';
    networkHospital.addressState = js.stateName;
    networkHospital.addressPincode = js.Pincode;
    networkHospital.contactFirstName = '';
    networkHospital.contactLastName = '';
    networkHospital.contactMobile = '+91' + js.STDCode + js.PhoneNumber;
    networkHospital.contactEmail = js.Email;
    networkHospital.contactGstNumber = '';
    networkHospital.levelOfCare = js.LevelOfCare;
    networkHospital.networkType = js.NetworkType;
    networkHospital.createdAt = new Date();
    networkHospital.updatedAt = networkHospital.createdAt;

    networkHospitals.push(networkHospital);
  });

  return networkHospitals;
};

// converts date from given type (dd/mm/YYYY) to UTC format as given by Date().
const _convertDate = str => {
  if (!str) {
    return null;
  }
  let splitDate = str.split('/');
  if (!splitDate) {
    return null;
  }
  const dd = splitDate[0];
  const mm = splitDate[1] - 1; // month is 0-indexed in JS Date()
  const yyyy = splitDate[2];
  const convertedDate = new Date(yyyy, mm, dd, 0, 0, 0);
  if (!convertedDate) {
    return null;
  }
  return convertedDate;
};

module.exports = {
  getAllClaimsByPolicyByDates: getAllClaimsByPolicyByDates, // TODO: Deprecated
  getAllNetworkHospitals: getAllNetworkHospitals,
  getPolicyEcardFromSoap: getPolicyEcardFromSoap
}