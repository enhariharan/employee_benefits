"use strict";

const rp = require('request-promise');
const appConfig = require('../config/appConfig');
const {v4:uuidv4} = require('uuid');



const headers = {
  "content-type": "application/json",
  "username": appConfig.tpa.mediAssist.username,
  "password": appConfig.tpa.mediAssist.password
}



const _convertDate = str => {
  if (!str) { return null; }
  let splitDate = str.split('/');
  if (!splitDate) { return null; }
  const dd = splitDate[0];
  const mm = splitDate[1]-1; // month is 0-indexed in JS Date()
  let yyyy = splitDate[2];
  yyyy = yyyy.substr(0, 4);  
  const convertedDate = new Date(yyyy, mm, dd, 0, 0, 0);
  if (!convertedDate) { return null; }
  return convertedDate;
};

const _convertIntoNetworkHospitalsJsonFormat = (hospitalList) => {
  let networkHospitals = [];
  hospitalList.forEach(js => {
    let networkHospital = {};
    networkHospital.uuid = uuidv4();    
    networkHospital.hospitalId = js.hosidnO1;
    networkHospital.branchCode = js.hospIRDACode; // TODO: Change this to a meaningful code later.
    networkHospital.name = js.hospitaL_NAME;
    networkHospital.addressBuildingName = js.addresS1;
    networkHospital.addressBuildingAddress = js.addressS2? js.addressS2: "" ;
    networkHospital.addressStreet = js.landmarK_1;
    networkHospital.addressCity = js.citY_NAME;
    networkHospital.addressDistrict = js.zonE_NAME;
    networkHospital.addressState = js.statE_NAME;
    networkHospital.addressPincode = js.piN_CODE;
    networkHospital.contactFirstName = '';
    networkHospital.contactLastName = '';
    networkHospital.contactMobile = '+91' + js.phonE_NO;
    networkHospital.contactEmail = js.email;
    networkHospital.contactGstNumber = '';
    networkHospital.levelOfCare = js.leveL_OF_CARE;
    networkHospital.networkType = true;
    networkHospital.createdAt = new Date();
    networkHospital.updatedAt = networkHospital.createdAt;
    networkHospitals.push(networkHospital);
  });

  return networkHospitals;
};

const __convertIntoClaimsJsonFormat = claimData => {
  let claims = []; 
  claimData.forEach(js => {
    let claim = {};
    claim.uuid = uuidv4();
    claim.claimId = js.tpA_CLAIM_NO;
    claim.policyUuid = uuidv4(); // Get from Policy table corresponding to policyId
    claim.ailmentUuid = uuidv4(); // TODO: Search from ailment table for matching ailment name and put that UUID here.
    claim.corporateName = js.grouP_NAME; // TODO: Get from Corporate corresponsing to UUID.
    claim.policyId = js.policY_NUMBER;
    claim.patientName = js.beneficiarY_NAME;
    claim.relationship = js.relation;
    claim.employeeName = js.employeE_NAME;
    claim.empid = js.employeE_NO;
    claim.hospitalName = js.hospitaL_NAME;
    claim.address = js.hospitaL_NAME + ', ' + js.hospitaL_CITY + ', ' + js.hospitaL_STATE
    claim.ailmentName = js.ailment;
    claim.treatmentType = js.leveL_OF_CARE; // TODO: This field is not present in the SOAP response
    claim.cashless = (js.typE_OF_CLAIM === 'CASHLESS');
    claim.reimbursement = !claim.cashless;
    claim.dateOfHospitalization = _convertDate(js.datE_OF_ADMISSION);
    claim.dateOfAdmission = _convertDate(js.datE_OF_ADMISSION);
    claim.dateOfDischarge = _convertDate(js.datE_OF_DISCHARGE);
    claim.dateOfSettlement = _convertDate(js.datE_OF_SETTLEMENT);
    claim.dateOfIntimation = _convertDate(js.claiM_REGISTERED_DATE);
    claim.status = js.status;
    claim.initialEstimate = js.estimateD_CLAIM_AMOUNT; // TODO: No direct field found for this.
    claim.amountSettled = js.paiD_AMOUNT;
    claim.amountApproved = js.paiD_AMOUNT;
    claim.amountDisallowed = parseInt(js.reporteD_AMOUNT - js.paiD_AMOUNT); // TODO: Not clear what to put here.
    claim.denialReason = js.reasoN_FOR_CLOSURE;
    claim.disallowanceReason = js.deductioN_REASONS; // TODO: Not sure what to put here.
    claim.insurerName = js.insurancE_COMPANY_NAME;
    claim.age = js.age;
    claim.claimRegisteredDate = _convertDate(js.claiM_REGISTERED_DATE);
    claim.hospitalCity = js.hospitaL_CITY;
    claim.hospitalState = js.hospitaL_STATE;
    claim.paidAmount = js.paiD_AMOUNT;
    claim.dateOfPayment = _convertDate(js.paiD_DATE);
    claim.ailmentDescription = js.ailmenT_DESC;
    claim.createdAt = new Date();
    claim.updatedAt = new Date();
    claims.push(claim);
  });

  return claims;
};

const getAllClaimsByPolicyByDates = (policyNo, fromDate, toDate) => {
  const options = {
    method: "POST",
    uri : appConfig.tpa.mediAssist.service_url+'/ClaimDetail',
    body: {
      "policyNo": policyNo,
      "startDate": fromDate,
      "endDate": toDate
    },
    headers: headers,
    json: true   
  };
  return new Promise((resolve, reject) => {
      rp(options)
        .then(function (body) {
          let claimsData = [];
          if(body && body.isSuccess && body.claimsData && body.claimsData.length){
             claimsData = __convertIntoClaimsJsonFormat(body.claimsData);
          }
          resolve(claimsData);
        })
        .catch(function (err) {
            reject(err);
        });
  });        
};

const getAllNetworkHospitals = (insurer, startIndex, endIndex) => {
  const options = {
    method: "POST",
    uri : appConfig.tpa.mediAssist.service_url+'/NetworkHospital',
    body: {
      "startIndex": startIndex,
      "endIndex": endIndex,
      "insurer": insurer
    },
    headers: headers,
    json: true   
  };  
  console.log(options.uri);
  return new Promise((resolve, reject) => {
    rp(options)
      .then(function (body) {       
        let hosptialsData = [];        
        if(body && body.isSuccess && body.providerData && body.providerData.length){
          hosptialsData = _convertIntoNetworkHospitalsJsonFormat(body.providerData);
        }
        resolve(hosptialsData);
      })
      .catch(function (err) {
          reject(err);
      });
  });
};


const getPolicyEcard = (empid, policyId) => {
  const options = {
    method: "POST",
    uri : appConfig.tpa.mediAssist.service_url+'/EcardUrl',
    body: {
      "employeeId": empid,
      "policyNo": policyId      
    },
    headers: headers,
    json: true   
  };  
  return new Promise((resolve, reject) => {
    rp(options)
      .then(function (body) {
        resolve(body);
      })
      .catch(function (err) {
          reject(err);
      });
   });
};

const getUpdatedEmployeesListByPolicyNo = (policyId, startDate, endDate, type) => {  
  const options = {
    method: "POST",
    uri : appConfig.tpa.mediAssist.employee_activation_status_url,
    body: {      
      "policyNo": policyId,
      "startDate": startDate,
      "endDate": endDate     
    },
    headers: headers,
    json: true,
    timeout: 180000   
  };  
  if(type === "Deactive"){
    options.body.isDeActivedata = true;
  }
  return new Promise((resolve, reject) => {
    rp(options)
      .then(function (body) {        
        resolve(body);
      })
      .catch(function (err) {          
          reject(err);
      });
   });
};


module.exports = {
  getAllClaimsByPolicyByDates: getAllClaimsByPolicyByDates,
  getAllNetworkHospitals: getAllNetworkHospitals,
  getPolicyEcard: getPolicyEcard,
  getUpdatedEmployeesListByPolicyNo: getUpdatedEmployeesListByPolicyNo
};