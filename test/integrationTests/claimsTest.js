"use strict";

const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = require('assert');
const server = require('../../app');

const { v4: uuidv4 } = require('uuid');
const { BrokingCompany, Claim, Corporate, Customer, Executive, InsuranceCompany, Policy, TPA, User } = require('../../models');
const argon2 = require('argon2');

chai.use(chaiHttp);
chai.should();

describe('Claims test suite', () => {
  const password = 'password';
  const insuranceCompany = {
    uuid: uuidv4(),
    companyName: 'test',
    branchAddressBuildingAddress: 'test',
    branchAddressCity: 'test',
    branchAddressState: 'test',
    branchAddressPincode: 'test'
  };
  const tpa = {
    uuid: uuidv4(),
    tpaid: 'ClaimsTestTPA',
    companyName: 'test',
    branchAddressBuildingAddress: 'test',
    branchAddressCity: 'test',
    branchAddressState: 'test',
    branchAddressPincode: 'test'
  };
  const brokingCompany = {
    uuid: uuidv4(),
    companyName: 'test',
    branchAddressBuildingAddress: 'test',
    branchAddressCity: 'test',
    branchAddressState: 'test',
    branchAddressPincode: 'test'
  };
  const corporate = {
    uuid: uuidv4(),
    companyName: 'test',
    branchAddressBuildingAddress: 'test',
    branchAddressCity: 'test',
    branchAddressState: 'test',
    branchAddressPincode: 'test'
  }
  let userEx = {
    uuid: uuidv4(),
    username: 'testuser',
    password: password,
    role: 'manager',
    brokingCompanyUuid: brokingCompany.uuid
  };
  const executive = {
    uuid: uuidv4(),
    userUuid: userEx.uuid,
    brokingCompanyUuid: brokingCompany.uuid,
    empid: 'test',
    supervisorEmpid: 'test',
    designation: 'manager',
    firstName: 'Test',
    lastName: 'User'
  };
  let userCust = {
    uuid: uuidv4(),
    username: 'testCustomer',
    password: password,
    role: 'customer',
    corporateUuid: corporate.uuid
  };
  const customer = {
    uuid: uuidv4(),
    userUuid: userCust.uuid,
    corporateUuid: corporate.uuid,
    empid: 'testCustomer',
    firstName: 'Test',
    lastName: 'Customer',
    status: 'approved',
    approvalType: 'approved',
    dob: new Date()
  };
  const policy = {
    uuid: uuidv4(),
    tpaUuid: tpa.uuid,
    corporateUuid: corporate.uuid,
    insuranceCompanyUuid: insuranceCompany.uuid,
    policyId: 'test',
    fromDate: new Date(),
    toDate: new Date(),
    policyYear: '2021',
    familyDefinition: 'test',
    numberOfFamilies :'test',
    numberOfDependents: 2,
    sumInsured: 1000,
    premiumPerFamily: 1000,
    premiumPerDependent: 1000,
    opd: 'yes',
    maternityCover: 'test',
    maternityLimit: 1000,
    babyCoverDayOne: 'yes',
    preExistingCover: 'yes',
    secondYearExclusions: 'yes',
    congenitalDiseasesInternal: 'yes',
    congenitalDiseasesExternal: 'yes',
    corporateBufferAndConditions: 'yes',
    categories: 'c a t e g o r i e s',
    roomRentLimits: 'test',
    copay: 1000,
    parentalSubLimit: 1000,
    parentalCopay: 1000,
    opdLimit: 1000,
    appendicitis: 1000,
    hernia: 1000,
    arthiritis: 1000,
    digestiveDisorders: 1000,
    cataract: 1000,
    gallBladderAndHisterectomy: 1000,
    kneeReplacement: 1000,
    jointReplacementIncludingVertrebalJoints: 1000,
    treatmentForKidneyStones: 1000,
    piles: 1000,
    hydrocele: 1000,
    lasikSurgery: 1000,
    wellnessProgram: 'test',
    helpdeskSchedule: 'test',
    visistaSpoc1Name: 'test',
    visistaSpoc1Designation: 'test',
    visistaSpoc1Email: 'test',
    visistaSpoc1Mobile: 'test',
    visistaSpoc2Name: 'test',
    visistaSpoc2Designation: 'test',
    visistaSpoc2Email: 'test',
    visistaSpoc2Mobile: 'test',
    visistaSpoc3Name: 'test',
    visistaSpoc3Designation: 'test',
    visistaSpoc3Email: 'test',
    visistaSpoc3Mobile: 'test',
    tpaSpoc1Name: 'test',
    tpaSpoc1Designation: 'test',
    tpaSpoc1Email: 'test',
    tpaSpoc1Mobile: 'test',
    tpaSpoc2Name: 'test',
    tpaSpoc2Designation: 'test',
    tpaSpoc2Email: 'test',
    tpaSpoc2Mobile: 'test',
    tpaSpoc3Name: 'test',
    tpaSpoc3Designation: 'test',
    tpaSpoc3Email: 'test',
    tpaSpoc3Mobile: 'test',
    clientSpoc1Empid: 'test',
    clientSpoc1Name: 'test',
    clientSpoc1Email: 'test',
    clientSpoc1Designation: 'test',
    clientSpoc1Mobile: 'test',
    clientSpoc2Empid: 'test',
    clientSpoc2Name: 'test',
    clientSpoc2Designation: 'test',
    clientSpoc2Email: 'test',
    clientSpoc2Mobile: 'test',
    clientSpoc3Empid: 'test',
    clientSpoc3Name: 'test',
    clientSpoc3Designation: 'test',
    clientSpoc3Email: 'test',
    clientSpoc3Mobile: 'test',
    status: 'created'
  };

  const policy2 = {
    uuid: uuidv4(),
    tpaUuid: tpa.uuid,
    corporateUuid: corporate.uuid,
    insuranceCompanyUuid: insuranceCompany.uuid,
    policyId: 'test2',
    fromDate: new Date(),
    toDate: new Date(),
    policyYear: '2021',
    familyDefinition: 'test',
    numberOfFamilies :'test',
    numberOfDependents: 2,
    sumInsured: 1000,
    premiumPerFamily: 1000,
    premiumPerDependent: 1000,
    opd: 'yes',
    maternityCover: 'test',
    maternityLimit: 1000,
    babyCoverDayOne: 'yes',
    preExistingCover: 'yes',
    secondYearExclusions: 'yes',
    congenitalDiseasesInternal: 'yes',
    congenitalDiseasesExternal: 'yes',
    corporateBufferAndConditions: 'yes',
    categories: 'c a t e g o r i e s',
    roomRentLimits: 'test',
    copay: 1000,
    parentalSubLimit: 1000,
    parentalCopay: 1000,
    opdLimit: 1000,
    appendicitis: 1000,
    hernia: 1000,
    arthiritis: 1000,
    digestiveDisorders: 1000,
    cataract: 1000,
    gallBladderAndHisterectomy: 1000,
    kneeReplacement: 1000,
    jointReplacementIncludingVertrebalJoints: 1000,
    treatmentForKidneyStones: 1000,
    piles: 1000,
    hydrocele: 1000,
    lasikSurgery: 1000,
    wellnessProgram: 'test',
    helpdeskSchedule: 'test',
    visistaSpoc1Name: 'test',
    visistaSpoc1Designation: 'test',
    visistaSpoc1Email: 'test',
    visistaSpoc1Mobile: 'test',
    visistaSpoc2Name: 'test',
    visistaSpoc2Designation: 'test',
    visistaSpoc2Email: 'test',
    visistaSpoc2Mobile: 'test',
    visistaSpoc3Name: 'test',
    visistaSpoc3Designation: 'test',
    visistaSpoc3Email: 'test',
    visistaSpoc3Mobile: 'test',
    tpaSpoc1Name: 'test',
    tpaSpoc1Designation: 'test',
    tpaSpoc1Email: 'test',
    tpaSpoc1Mobile: 'test',
    tpaSpoc2Name: 'test',
    tpaSpoc2Designation: 'test',
    tpaSpoc2Email: 'test',
    tpaSpoc2Mobile: 'test',
    tpaSpoc3Name: 'test',
    tpaSpoc3Designation: 'test',
    tpaSpoc3Email: 'test',
    tpaSpoc3Mobile: 'test',
    clientSpoc1Empid: 'test',
    clientSpoc1Name: 'test',
    clientSpoc1Email: 'test',
    clientSpoc1Designation: 'test',
    clientSpoc1Mobile: 'test',
    clientSpoc2Empid: 'test',
    clientSpoc2Name: 'test',
    clientSpoc2Designation: 'test',
    clientSpoc2Email: 'test',
    clientSpoc2Mobile: 'test',
    clientSpoc3Empid: 'test',
    clientSpoc3Name: 'test',
    clientSpoc3Designation: 'test',
    clientSpoc3Email: 'test',
    clientSpoc3Mobile: 'test',
    status: 'created'
  };
  const ailment = {
    uuid: uuidv4()
  }

  let fromDate = new Date(); fromDate.setDate(27); fromDate.setMonth(7); fromDate.setFullYear(2020);
  let toDate = new Date(); toDate.setDate(30); toDate.setMonth(7); toDate.setFullYear(2020);

  const claim1 = {
    uuid: uuidv4(),
    claimId: "claimId1",
    policyUuid: policy.uuid,
    customerUuid: customer.uuid,
    ailmentUuid: ailment.uuid,
    corporateUuid: corporate.uuid,
    corporateName: corporate.companyName,
    policyId: policy.policyId,
    patientName: customer.firstName + ' ' + customer.lastName,
    relationship: 'self',
    employeeName: customer.firstName + ' ' + customer.lastName,
    empid: customer.empid,
    hospitalName: 'Test',
    address: 'Test',
    ailmentName: 'Test',
    treatmentType: 'Test',
    cashless: true,
    reimbursement: true,
    dateOfHospitalization: fromDate.toISOString(),
    dateOfAdmission: new Date(),
    dateOfDischarge: new Date(),
    dateOfSettlement: new Date(),
    status: 'active',
    initialEstimate: 1000.00,
    amountSettled: 1000.00,
    amountApproved: 1000.00,
    amountDisallowed: 1000.00,
    denialReason: 'Test',
    disallowanceReason:'Test',
    age: '21',
    insurerName: 'Test',
    claimRegisteredDate: new Date(),
    hospitalCity: 'Test',
    hospitalState: 'Test',
    paidAmount:1000.00,
    dateOfPayment: new Date(),
    ailmentDescription: 'Test',
  };

  const claim2 = {
    uuid: uuidv4(),
    claimId: "claimId2",
    policyUuid: policy.uuid,
    customerUuid: customer.uuid,
    ailmentUuid: ailment.uuid,
    corporateUuid: corporate.uuid,
    corporateName: corporate.companyName,
    policyId: policy.policyId,
    patientName: customer.firstName + ' ' + customer.lastName,
    relationship: 'self',
    employeeName: customer.firstName + ' ' + customer.lastName,
    empid: customer.empid,
    hospitalName: 'Test',
    address: 'Test',
    ailmentName: 'Test',
    treatmentType: 'Test',
    cashless: true,
    reimbursement: true,
    dateOfHospitalization: toDate.toISOString(),
    dateOfAdmission: new Date(),
    dateOfDischarge: new Date(),
    dateOfSettlement: new Date(),
    status: 'active',
    initialEstimate: 1000.00,
    amountSettled: 1000.00,
    amountApproved: 1000.00,
    amountDisallowed: 1000.00,
    denialReason: 'Test',
    disallowanceReason:'Test',
    age: '21',
    insurerName: 'Test',
    claimRegisteredDate: new Date(),
    hospitalCity: 'Test',
    hospitalState: 'Test',
    paidAmount:1000.00,
    dateOfPayment: new Date(),
    ailmentDescription: 'Test',
  };

  let jwt;
  before('Setup tables with test data', function (done) {
    Claim.destroy({/*logging: console.log, */where: {uuid: claim1.uuid}})
    .then(ignoreVar => { return Claim.destroy({/*logging: console.log, */where: {uuid: claim2.uuid}}) })
    .then(ignoreVar => { return Policy.destroy({/*logging: console.log, */where: {policyId: policy.policyId}}) })
    .then(ignoreVar => { return Policy.destroy({/*logging: console.log, */where: {policyId: policy2.policyId}}) })
    .then(ignoreVar => { return Executive.destroy({/*logging: console.log, */where: {uuid: executive.uuid}}); })
    .then(ignoreVar => { return User.destroy({/*logging: console.log, */where: {uuid: userEx.uuid}}); })
    .then(ignoreVar => { return Customer.destroy({/*logging: console.log, */where: {uuid: customer.uuid}}); })
    .then(ignoreVar => { return User.destroy({/*logging: console.log, */where: {uuid: userCust.uuid}}); })
    .then(ignoreVar => { return Corporate.destroy({/*logging: console.log, */where: {uuid: corporate.uuid}}); })
    .then(ignoreVar => { return InsuranceCompany.destroy({/*logging: console.log, */where: {uuid: insuranceCompany.uuid}}); })
    .then(ignoreVar => { return TPA.destroy({/*logging: console.log, */where: {uuid: tpa.uuid}}); })
    .then(ignoreVar => { return BrokingCompany.destroy({/*logging: console.log, */where: {uuid: brokingCompany.uuid}}); })
    .then(ignoreVar => { return argon2.hash(password); })
    .then(p => {
      if (!p) {throw 'Hashing password failed.';}
      userEx.password = p;
      userCust.password = p;
      return BrokingCompany.create(brokingCompany/*, {logging: console.log}*/);
    })
    .then(ignoreVar => {return TPA.create(tpa/*, {logging: console.log}*/);})
    .then(ignoreVar => {return InsuranceCompany.create(insuranceCompany/*, {logging: console.log}*/);})
    .then(ignoreVar => {return Corporate.create(corporate/*, {logging: console.log}*/);})
    .then(ignoreVar => {return User.create(userEx/*, {logging: console.log}*/);})
    .then(ignoreVar => {return Executive.create(executive/*, {logging: console.log}*/);})
    .then(ignoreVar => {return User.create(userCust/*, {logging: console.log}*/);})
    .then(ignoreVar => {return Customer.create(customer/*, {logging: console.log}*/);})
    .then(ignoreVar => {return Policy.create(policy2/*, {logging: console.log}*/);})
    .then(ignoreVar => {return Claim.create(claim1/*, {logging: console.log}*/);})
    .then(ignoreVar => {return Claim.create(claim2/*, {logging: console.log}*/);})
    .then(u => {
      if (!u) { throw 'Creating new user failed.'; }
      console.log('Creating new user succeeded.');
      // Login and get valid JWT token
      chai.request(server)
      .post('/api/v1/users/login')
      .set("Content-Type", "application/json")
      .send({ "username": userEx.username, "password": password, "role": userEx.role, "subdomain": "test.subdomain.com"})
      .end( (err, res) => {
        if (err) {
          console.log('login failed.');
          console.log(err);
          done(err);
        }
        res.should.have.status(200);
        assert(res.body.status === 200);
        assert(res.body.errCode === 'Success');
        assert(res.body.data.user.uuid === userEx.uuid);
        assert(res.body.data.user.username === userEx.username);
        assert(res.body.data.user.role === userEx.role);
        assert(res.body.data.user.jwt);
        jwt = res.body.data.user.jwt;
        this.jwt = res.body.data.user.jwt;

        setTimeout(done, 10);
      });
    })
    .catch(e => {
      console.log(e);
      done(e);
    })
  });

  it('Should pass canary test', function (done) {
    chai.expect(true).to.be.true;
    done();
  });

  it('Should get Claims.', function (done) {
    chai.request(server)
    .get('/api/v1/claims')
    .set("Content-Type", "application/json")
    .set("Authorization", this.jwt)
    .end( (err, res) => {
      if (err) {
        console.log('Get claims failed.');
        console.log(err);
        done(err);
      }
      res.should.have.status(200);
      assert(res.body.status === 200);
      assert(res.body.errCode === 'Success');
      assert(res.body.data);
      assert(res.body.data.length !== 0);
      assert(res.body.data[0]);
      assert(res.body.data[0].uuid);
      assert(res.body.data[0].claimId && res.body.data[0].claimId.length !== 0);
      setTimeout(done, 10);
    });
  });

  it('Get Claims - empid cannot tbe provided empty', function (done) {
    chai.request(server)
    .get('/api/v1/claims?empid=test')
    .set("Content-Type", "application/json")
    .set("Authorization", this.jwt)
    .end( (err, res) => {
      if (err) {
        console.log('Get claims failed.');
        console.log(err);
        done(err);
      }
      res.should.have.status(400);
      assert(res.body.status === 400);
      assert(res.body.errCode === 'InvalidQueryParams');
      assert(res.body.message === 'Some query params are incorrect.');
      assert(res.body.data);
      assert(res.body.data.length !== 0);
      assert(res.body.data[0]);
      assert(res.body.data[0].message === 'empid cannot be empty and must be provided with corporateUuid');
      setTimeout(done, 10);
    });
  });

  it('Get Claims - empid cannot be providedalone', function (done) {
    chai.request(server)
    .get('/api/v1/claims?empid=test')
    .set("Content-Type", "application/json")
    .set("Authorization", this.jwt)
    .end( (err, res) => {
      if (err) {
        console.log('Get claims failed.');
        console.log(err);
        done(err);
      }
      res.should.have.status(400);
      assert(res.body.status === 400);
      assert(res.body.errCode === 'InvalidQueryParams');
      assert(res.body.data);
      assert(res.body.data.length !== 0);
      assert(res.body.data[0]);
      assert(res.body.data[0].message === 'empid cannot be empty and must be provided with corporateUuid');
      setTimeout(done, 10);
    });
  });

  it('Get Claims - corporateUuid cannot be provided empty', function (done) {
    chai.request(server)
    .get('/api/v1/claims?corporateUuid=')
    .set("Content-Type", "application/json")
    .set("Authorization", this.jwt)
    .end( (err, res) => {
      if (err) {
        console.log('Get claims failed.');
        console.log(err);
        done(err);
      }
      res.should.have.status(400);
      assert(res.body.status === 400);
      assert(res.body.errCode === 'InvalidQueryParams');
      assert(res.body.message === 'Some query params are incorrect.');
      assert(res.body.data);
      assert(res.body.data.length !== 0);
      assert(res.body.data[0]);
      assert(res.body.data[0].message === 'corporateUuid cannot be empty');
      setTimeout(done, 10);
    });
  });

  it('Should get Claims given empid and corp UUID.', function (done) {
    chai.request(server)
    .get(`/api/v1/claims?empid=${customer.empid}&corporateUuid=${corporate.uuid}`)
    .set("Content-Type", "application/json")
    .set("Authorization", this.jwt)
    .end( (err, res) => {
      if (err) {
        console.log('Get claims failed.');
        console.log(err);
        done(err);
      }
      res.should.have.status(200);
      assert(res.body.status === 200);
      assert(res.body.errCode === 'Success');
      assert(res.body.data);
      assert(res.body.data.length);
      assert(res.body.data[0]);
      assert(res.body.data[0].uuid === claim1.uuid || res.body.data[0].uuid === claim2.uuid);
      assert(res.body.data[0].claimId === claim1.claimId || res.body.data[0].claimId === claim2.claimId);
      setTimeout(done, 10);
    });
  });

  it('Should get Claims given fromDate and toDate.', function (done) {
    chai.request(server)
    .get(`/api/v1/claims?fromDate=${claim1.dateOfHospitalization}&toDate=${claim2.dateOfHospitalization}`)
    .set("Content-Type", "application/json")
    .set("Authorization", this.jwt)
    .end( (err, res) => {
      if (err) {
        console.log('Get claims failed.');
        console.log(err);
        done(err);
      }
      res.should.have.status(200);
      assert(res.body.status === 200);
      assert(res.body.errCode === 'Success');
      assert(res.body.data);
      assert(res.body.data.length === 2);
      assert(res.body.data[0]);
      assert(res.body.data[0].uuid === claim1.uuid || res.body.data[0].uuid === claim2.uuid);
      assert(res.body.data[0].claimId === claim1.claimId || res.body.data[0].claimId === claim2.claimId);
      assert(res.body.data[1].uuid === claim1.uuid || res.body.data[1].uuid === claim2.uuid);
      assert(res.body.data[1].claimId === claim1.claimId || res.body.data[1].claimId === claim2.claimId);
      setTimeout(done, 10);
    });
  });

  after('Clearing tables off test data', function(done) {
    Claim.destroy({/*logging: console.log, */where: {uuid: claim1.uuid}})
    .then(ignoreVar => { return Claim.destroy({/*logging: console.log, */where: {uuid: claim2.uuid}}); })
    .then(ignoreVar => { return Policy.destroy({/*logging: console.log, */where: {policyId: policy.policyId}}); })
    .then(ignoreVar => { return Policy.destroy({/*logging: console.log, */where: {policyId: policy2.policyId}}); })
    .then(ignoreVar => { return Executive.destroy({/*logging: console.log, */where: {uuid: executive.uuid}}); })
    .then(ignoreVar => { return User.destroy({/*logging: console.log, */where: {uuid: userEx.uuid}}); })
    .then(ignoreVar => { return Corporate.destroy({/*logging: console.log, */where: {uuid: corporate.uuid}}); })
    .then(ignoreVar => { return InsuranceCompany.destroy({/*logging: console.log, */where: {uuid: insuranceCompany.uuid}}); })
    .then(ignoreVar => { return TPA.destroy({/*logging: console.log, */where: {uuid: tpa.uuid}}); })
    .then(ignoreVar => { return BrokingCompany.destroy({/*logging: console.log, */where: {uuid: brokingCompany.uuid}}); })
    .then(ignoreVar => { setTimeout(done, 10); })
    .catch(e => {console.log(e);})
  });
});
