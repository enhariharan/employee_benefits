"use strict";

const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = require('assert');
const mediAssistHelper = require('../../helpers/mediAssistHelper');
const customersService = require('../../services/customersService');

const {Corporate} = require('../../models');

const { v4: uuidv4 } = require('uuid');
const employeeStatus = require('../../services/employeeStatus');

chai.use(chaiHttp);
chai.should();

describe('mediAssistHelper test suite', function (ignoreDone) {
  const corporate = {
    uuid: uuidv4(),
    companyName: "test",
    branchAddressBuildingAddress: "test",
    branchAddressCity: "test",
    branchAddressState: "test",
    branchAddressPincode: "test"
  };

  beforeEach('Setup tables with a valid network hospital', function (done) {
    Corporate.destroy({/*logging: console.log, */where: {uuid: corporate.uuid}})
    .then(ignoreVar => {return Corporate.create(corporate/*, {logging: console.log}*/);})
    .then(ignoredresult => {
      done();
    })
    .catch(e => {
      console.log(e);
      done(e);
    })
  });

  afterEach('Clear up  tables after running test suite', function(done) {
    Corporate.destroy({/*logging: console.log, */where: {uuid: corporate.uuid}})
    .then(ignoreVar => { setTimeout(done, 10); })
    .catch(e => {console.log(e);})
  });

  it('Should pass canary test', function (done) {
    chai.expect(true).to.be.true;
    done();
  });

  it('should be able to insert new customer from mediAssist into db', function (done) {
    const mediAssistJsonList = [{empCode : "abc123", firstName: "xyz", lastName: "abc", dob: "22/11/1988 00:00:00", gender: "male", sumInsured : 30000}];
    const credentials = {
      uuid: uuidv4(),
      username: employeeStatus.CRONJOB_USERNAME
    };
    mediAssistHelper.convertCustomerJsonIntoEbpFormat(mediAssistJsonList, corporate.uuid)
    .then(ebpJsonList => {
      return customersService.addCustomers(credentials,  ebpJsonList);
    })
    .then(customers => {
      assert(customers);
      assert(customers.newCustomers);
      assert(customers.newCustomers.length === 1);
      assert(customers.newCustomers[0].uuid);
      assert(customers.newCustomers[0].empid === mediAssistJsonList[0].empCode);
      assert(customers.newCustomers[0].firstName === mediAssistJsonList[0].firstName);
      assert(customers.newCustomers[0].lastName === mediAssistJsonList[0].lastName);
      assert(customers.newCustomers[0].gender === mediAssistJsonList[0].gender);
      assert(customers.newCustomers[0].sumInsured === mediAssistJsonList[0].sumInsured);
      done();
    })
  });

  it('should be able to insert new dependent from mediAssist into db', function (done) {
    const mediAssistJsonCustomerList = [{empCode : "abc123", firstName: "xyz", lastName: "abc", dob: "22/11/1988 00:00:00", gender: "male", sumInsured : 30000}];
    const mediAssistJsonDependentList = [
      {empCode : mediAssistJsonCustomerList[0].empCode, relation: "father", firstName: "father", lastName: "lastName", dob: "22/11/1968 00:00:00", gender: "male", sumInsured : 30000},
      {empCode : mediAssistJsonCustomerList[0].empCode, relation: "mother", firstName: "mother", lastName: "lastName", dob: "22/11/1968 00:00:00", gender: "female", sumInsured : 30000},
      {empCode : mediAssistJsonCustomerList[0].empCode, relation: "father-in-law", firstName: "fil", lastName: "lastName", dob: "22/11/1968 00:00:00", gender: "male", sumInsured : 30000},
      {empCode : mediAssistJsonCustomerList[0].empCode, relation: "mother-in-law", firstName: "mil", lastName: "lastName", dob: "22/11/1968 00:00:00", gender: "female", sumInsured : 30000},
      {empCode : mediAssistJsonCustomerList[0].empCode, relation: "spouse", firstName: "spouse", lastName: "lastName", dob: "22/11/1998 00:00:00", gender: "female", sumInsured : 30000},
      {empCode : mediAssistJsonCustomerList[0].empCode, relation: "son", firstName: "son", lastName: "lastName", dob: "22/11/2008 00:00:00", gender: "male", sumInsured : 30000},
      {empCode : mediAssistJsonCustomerList[0].empCode, relation: "daughter", firstName: "daughter", lastName: "lastName", dob: "22/11/2008 00:00:00", gender: "female", sumInsured : 30000},
    ];
    const credentials = {
      uuid: uuidv4(),
      username: employeeStatus.CRONJOB_USERNAME
    };
    mediAssistHelper.convertCustomerJsonIntoEbpFormat(mediAssistJsonCustomerList, corporate.uuid)
    .then(ebpJsonList => {
      return customersService.addCustomers(credentials,  ebpJsonList);
    })
    .then(customers => {
      assert(customers);
      assert(customers.newCustomers);
      assert(customers.newCustomers.length === 1);
      assert(customers.newCustomers[0].uuid);
      assert(customers.newCustomers[0].empid === mediAssistJsonCustomerList[0].empCode);
      assert(customers.newCustomers[0].firstName === mediAssistJsonCustomerList[0].firstName);
      assert(customers.newCustomers[0].lastName === mediAssistJsonCustomerList[0].lastName);
      assert(customers.newCustomers[0].gender === mediAssistJsonCustomerList[0].gender);
      assert(customers.newCustomers[0].sumInsured === mediAssistJsonCustomerList[0].sumInsured);
      return mediAssistHelper.convertDependentJsonIntoEbpFormat(mediAssistJsonDependentList, corporate.uuid);
    })
    .then(dependents => {
      return customersService.addDependentsBulk(credentials, dependents, corporate.uuid);
    })
    .then(dependents => {
      assert(dependents);
      assert(dependents.newDependents);
      assert(dependents.newDependents.length === mediAssistJsonDependentList.length);
      for (let i = 0; i<dependents.newDependents.length; i++) {
        assert(dependents.newDependents[i].uuid);
        assert(dependents.newDependents[i].empid === mediAssistJsonDependentList[i].empCode);
        assert(dependents.newDependents[i].firstName === mediAssistJsonDependentList[i].firstName);
        assert(dependents.newDependents[i].lastName === mediAssistJsonDependentList[i].lastName);
        assert(dependents.newDependents[i].gender === mediAssistJsonDependentList[i].gender);
        assert(dependents.newDependents[i].sumInsured === mediAssistJsonDependentList[i].sumInsured);
      }
      done();
    })
  });
});
