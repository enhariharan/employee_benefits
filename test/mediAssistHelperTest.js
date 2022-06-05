"use strict";

const chai = require('chai');
const mediAssistCustomerHelper = require('../helpers/mediAssistHelper')
const employeeStatus = require("../services/employeeStatus");

describe('mediAssistCustomerHelper Test Suite', function() {
  it('convertCustomerJsonIntoEbpFormat test must fail with no customersArray', async function() {
    mediAssistCustomerHelper.convertCustomerJsonIntoEbpFormat(null, 'uuid')
    .then(ignoreresult => {
      assert(false);
    })
    .catch(err => {
      chai.assert.equal(err.status, '400');
      chai.assert.equal(err.errCode, 'BadRequest');
      chai.assert.equal(err.message, 'customers JSON list in MediAssist JSON Format is not provided, cannot add new customers without it.');
      chai.assert.equal(err.data, 'customers JSON list is mandatory.');
    });
  });

  it('convertCustomerJsonIntoEbpFormat test must fail with no corporateUuid', async function() {
    mediAssistCustomerHelper.convertCustomerJsonIntoEbpFormat({empid: 'empid'}, null)
  .then(ignoreresult => {
      assert(false);
    })
    .catch(err => {
      chai.assert.equal(err.status, '400');
      chai.assert.equal(err.errCode, 'BadRequest');
      chai.assert.equal(err.message, 'corporateUuid is not provided, cannot add new customers without it.');
      chai.assert.equal(err.data, 'corporateUuid is mandatory.');
    });
  });

  it('convertCustomerJsonIntoEbpFormat test must fail if empId not provided', async function() {
    const mediAssistJsonList = [{firstName: "xyz", lastName: "abc", dob: "22/11/1988 00:00:00", gender: "male", sumInsured : 30000}];
    mediAssistCustomerHelper.convertCustomerJsonIntoEbpFormat(mediAssistJsonList, 'uuid')
    .then(ignoreresult => {
      assert(false);
    })
    .catch(err => {
      chai.assert.equal(err.status, '400');
      chai.assert.equal(err.errCode, 'BadRequest');
      chai.assert.equal(err.message, 'empCode is mandatory but not provided.');
      chai.assert.equal(err.data.firstName, mediAssistJsonList[0].firstName);
      chai.assert.equal(err.data.lastName, mediAssistJsonList[0].lastName);
      chai.assert.equal(err.data.dob, mediAssistJsonList[0].dob);
      chai.assert.equal(err.data.gender, mediAssistJsonList[0].gender);
      chai.assert.equal(err.data.sumInsured, mediAssistJsonList[0].sumInsured);
    });
  });

  it('convertCustomerJsonIntoEbpFormat test must fail if firstName not provided', async function() {
    const mediAssistJsonList = [{empCode: 'empCode', lastName: "abc", dob: "22/11/1988 00:00:00", gender: "male", sumInsured : 30000}];
    mediAssistCustomerHelper.convertCustomerJsonIntoEbpFormat(mediAssistJsonList, 'uuid')
    .then(ignoreresult => {
      assert(false);
    })
    .catch(err => {
      chai.assert.equal(err.status, '400');
      chai.assert.equal(err.errCode, 'BadRequest');
      chai.assert.equal(err.message, 'firstName is mandatory but not provided.');
      chai.assert.equal(err.data.firstName, mediAssistJsonList[0].firstName);
      chai.assert.equal(err.data.lastName, mediAssistJsonList[0].lastName);
      chai.assert.equal(err.data.dob, mediAssistJsonList[0].dob);
      chai.assert.equal(err.data.gender, mediAssistJsonList[0].gender);
      chai.assert.equal(err.data.sumInsured, mediAssistJsonList[0].sumInsured);
    });
  });

  it('convertCustomerJsonIntoEbpFormat test must pass for valid customerList', async function() {
    const mediAssistJsonList = [{empCode : "abc123", firstName: "xyz", lastName: "abc", dob: "22/11/1988 00:00:00", gender: "male", sumInsured : 30000}];
    mediAssistCustomerHelper.convertCustomerJsonIntoEbpFormat(mediAssistJsonList, 'corporateUuid')
  .then(result => {
    chai.assert.isArray(result);
    chai.assert.isAtLeast(result.length, 1);
    chai.assert.isAtMost(result.length, 1);
    chai.assert.equal(result[0].empid, mediAssistJsonList[0].empCode);
    chai.assert.equal(result[0].lastName, mediAssistJsonList[0].lastName);
    chai.assert.equal(result[0].sumInsured, mediAssistJsonList[0].sumInsured);
    chai.assert.equal(result[0].status, employeeStatus.STATUS_ACTIVE);
    const [dd, mm, yyyy] = result[0].dob.split('/');
    chai.assert.equal(dd, '22');
    chai.assert.equal(mm, '11');
    chai.assert.equal(yyyy, '1988');
    })
    .catch(err => {
      chai.assert.equal(err.status, 200);
    });
  });

  it('convertDependentJsonIntoEbpFormat test must fail with no dependentsArray', async function() {
    mediAssistCustomerHelper.convertDependentJsonIntoEbpFormat(null, 'uuid')
    .then(ignoreresult => {
      assert(false);
    })
    .catch(err => {
      chai.assert.equal(err.status, '400');
      chai.assert.equal(err.errCode, 'BadRequest');
      chai.assert.equal(err.message, 'dependents JSON list in MediAssist JSON Format is not provided, cannot add new dependents without it.');
      chai.assert.equal(err.data, 'dependents JSON list is mandatory.');
    });
  });

  it('convertDependentJsonIntoEbpFormat test must fail with no corporateUuid', async function() {
    mediAssistCustomerHelper.convertDependentJsonIntoEbpFormat({empid: 'empid'}, null)
    .then(ignoreresult => {
      assert(false);
    })
    .catch(err => {
      chai.assert.equal(err.status, '400');
      chai.assert.equal(err.errCode, 'BadRequest');
      chai.assert.equal(err.message, 'corporateUuid is not provided, cannot add new dependents without it.');
      chai.assert.equal(err.data, 'corporateUuid is mandatory.');
    });
  });

  it('convertDependentJsonIntoEbpFormat test must pass for valid dependentList', async function() {
    const mediAssistJsonList = [
      {empCode : "abc123", relation: "father", firstName: "xyz", lastName: "abc", dob: "22/11/1988 00:00:00", gender: "male", sumInsured : 30000},
      {empCode : "abc123", relation: "mother", firstName: "xyz", lastName: "abc", dob: "22/11/1988 00:00:00", gender: "female", sumInsured : 30000},
      {empCode : "abc123", relation: "father-in-law", firstName: "xyz", lastName: "abc", dob: "22/11/1988 00:00:00", gender: "male", sumInsured : 30000},
      {empCode : "abc123", relation: "mother-in-law", firstName: "xyz", lastName: "abc", dob: "22/11/1988 00:00:00", gender: "female", sumInsured : 30000},
      {empCode : "abc123", relation: "spouse", firstName: "xyz", lastName: "abc", dob: "22/11/1988 00:00:00", gender: "female", sumInsured : 30000},
      {empCode : "abc123", relation: "son", firstName: "xyz", lastName: "abc", dob: "22/11/1988 00:00:00", gender: "male", sumInsured : 30000},
      {empCode : "abc123", relation: "daughter", firstName: "xyz", lastName: "abc", dob: "22/11/1988 00:00:00", gender: "female", sumInsured : 30000},
    ];
    mediAssistCustomerHelper.convertDependentJsonIntoEbpFormat(mediAssistJsonList, 'corporateUuid')
    .then(result => {
      chai.assert.isArray(result);
      chai.assert.isAtLeast(result.length, 1);
      chai.assert.isAtMost(result.length, 7);
      for (let i=0; i<7; i++ ) {
        chai.assert.equal(result[i].empid, mediAssistJsonList[i].empCode);
        chai.assert.equal(result[i].relationship, mediAssistJsonList[i].relation);
        chai.assert.equal(result[i].firstName, mediAssistJsonList[i].firstName);
        chai.assert.equal(result[i].lastName, mediAssistJsonList[i].lastName);
        chai.assert.equal(result[i].gender, mediAssistJsonList[i].gender);
        chai.assert.equal(result[i].sumInsured, mediAssistJsonList[i].sumInsured);
        chai.assert.equal(result[i].status, employeeStatus.STATUS_ACTIVE);

        const [dd, mm, yyyy] = result[i].dob.split('/');
        chai.assert.equal(dd, '22');
        chai.assert.equal(mm, '11');
        chai.assert.equal(yyyy, '1988');
      }
    })
    .catch(err => {
      chai.assert.equal(err.status, '200');
    });
  });

  it('convertDependentJsonIntoEbpFormat test must fail for invalid relationship - 1', async function() {
    const mediAssistJsonList = [
      {empCode : "abc123", relation: "brother", firstName: "xyz", lastName: "abc", dob: "22/11/1988 00:00:00", gender: "male", sumInsured : 30000},
    ];
    mediAssistCustomerHelper.convertDependentJsonIntoEbpFormat(mediAssistJsonList, 'corporateUuid')
    .then(ignoreresult => {
      chai.assert(false)
    })
    .catch(err => {
      chai.assert.equal(err.status, '400');
      chai.assert.equal(err.errCode, 'BadRequest');
      chai.assert.equal(err.message, 'Dependent JSON has incorrect relationship.');
      chai.assert.equal(err.data.empid, mediAssistJsonList[0].empCode);
      chai.assert.equal(err.data.relationship, mediAssistJsonList[0].relation);
      chai.assert.equal(err.data.firstName, mediAssistJsonList[0].firstName);
      chai.assert.equal(err.data.lastName, mediAssistJsonList[0].lastName);
      chai.assert.equal(err.data.corporateUuid, 'corporateUuid');
    });
  });

  it('convertDependentJsonIntoEbpFormat test must fail for invalid relationship - 2', async function() {
    const mediAssistJsonList = [
      {empCode : "abc123", relation: "sister", firstName: "xyz", lastName: "abc", dob: "22/11/1988 00:00:00", gender: "female", sumInsured : 30000},
    ];
    mediAssistCustomerHelper.convertDependentJsonIntoEbpFormat(mediAssistJsonList, 'corporateUuid')
    .then(ignoreresult => {
      chai.assert(false)
    })
    .catch(err => {
      chai.assert.equal(err.status, '400');
      chai.assert.equal(err.errCode, 'BadRequest');
      chai.assert.equal(err.message, 'Dependent JSON has incorrect relationship.');
      chai.assert.equal(err.data.empid, mediAssistJsonList[0].empCode);
      chai.assert.equal(err.data.relationship, mediAssistJsonList[0].relation);
      chai.assert.equal(err.data.firstName, mediAssistJsonList[0].firstName);
      chai.assert.equal(err.data.lastName, mediAssistJsonList[0].lastName);
      chai.assert.equal(err.data.corporateUuid, 'corporateUuid');
    });
  });

  it('convertDependentJsonIntoEbpFormat test must fail for invalid relationship - 3', async function() {
    const mediAssistJsonList = [
      {empCode : "abc123", relation: "blaah", firstName: "xyz", lastName: "abc", dob: "22/11/1988 00:00:00", gender: "female", sumInsured : 30000},
    ];
    mediAssistCustomerHelper.convertDependentJsonIntoEbpFormat(mediAssistJsonList, 'corporateUuid')
    .then(ignoreresult => {
      chai.assert(false)
    })
    .catch(err => {
      chai.assert.equal(err.status, '400');
      chai.assert.equal(err.errCode, 'BadRequest');
      chai.assert.equal(err.message, 'Dependent JSON has incorrect relationship.');
      chai.assert.equal(err.data.empid, mediAssistJsonList[0].empCode);
      chai.assert.equal(err.data.relationship, mediAssistJsonList[0].relation);
      chai.assert.equal(err.data.firstName, mediAssistJsonList[0].firstName);
      chai.assert.equal(err.data.lastName, mediAssistJsonList[0].lastName);
      chai.assert.equal(err.data.corporateUuid, 'corporateUuid');
    });
  });

  it('convertDependentJsonIntoEbpFormat test must fail if relationship not provided', async function() {
    const mediAssistJsonList = [
      {empCode : "abc123", firstName: "xyz", lastName: "abc", dob: "22/11/1988 00:00:00", gender: "male", sumInsured : 30000},
    ];
    mediAssistCustomerHelper.convertDependentJsonIntoEbpFormat(mediAssistJsonList, 'corporateUuid')
    .then(ignoreresult => {
      chai.assert(false)
    })
    .catch(err => {
      chai.assert.equal(err.status, '400');
      chai.assert.equal(err.errCode, 'BadRequest');
      chai.assert.equal(err.message, 'Dependent relationship to customer is mandatory but not provided.');
      chai.assert.equal(err.data.empCode, mediAssistJsonList[0].empCode);
      chai.assert.equal(err.data.relationship, mediAssistJsonList[0].relation);
      chai.assert.equal(err.data.firstName, mediAssistJsonList[0].firstName);
      chai.assert.equal(err.data.lastName, mediAssistJsonList[0].lastName);
    });
  });

  it('convertDependentJsonIntoEbpFormat test must fail if empId not provided', async function() {
    const mediAssistJsonList = [{firstName: "xyz", lastName: "abc", dob: "22/11/1988 00:00:00", gender: "male", sumInsured : 30000}];
    mediAssistCustomerHelper.convertDependentJsonIntoEbpFormat(mediAssistJsonList, 'uuid')
    .then(ignoreresult => {
      assert(false);
    })
    .catch(err => {
      chai.assert.equal(err.status, '400');
      chai.assert.equal(err.errCode, 'BadRequest');
      chai.assert.equal(err.message, 'empCode is mandatory but not provided.');
      chai.assert.equal(err.data.firstName, mediAssistJsonList[0].firstName);
      chai.assert.equal(err.data.lastName, mediAssistJsonList[0].lastName);
      chai.assert.equal(err.data.dob, mediAssistJsonList[0].dob);
      chai.assert.equal(err.data.gender, mediAssistJsonList[0].gender);
      chai.assert.equal(err.data.sumInsured, mediAssistJsonList[0].sumInsured);
    });
  });

  it('convertDependentJsonIntoEbpFormat test must fail if firstName not provided', async function() {
    const mediAssistJsonList = [{empCode: 'empCode', lastName: "abc", dob: "22/11/1988 00:00:00", gender: "male", sumInsured : 30000}];
    mediAssistCustomerHelper.convertDependentJsonIntoEbpFormat(mediAssistJsonList, 'uuid')
    .then(ignoreresult => {
      assert(false);
    })
    .catch(err => {
      chai.assert.equal(err.status, '400');
      chai.assert.equal(err.errCode, 'BadRequest');
      chai.assert.equal(err.message, 'firstName is mandatory but not provided.');
      chai.assert.equal(err.data.firstName, mediAssistJsonList[0].firstName);
      chai.assert.equal(err.data.lastName, mediAssistJsonList[0].lastName);
      chai.assert.equal(err.data.dob, mediAssistJsonList[0].dob);
      chai.assert.equal(err.data.gender, mediAssistJsonList[0].gender);
      chai.assert.equal(err.data.sumInsured, mediAssistJsonList[0].sumInsured);
    });
  });

})
