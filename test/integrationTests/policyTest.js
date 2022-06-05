"use strict";

const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = require('assert');
const server = require('../../app');

const { v4: uuidv4 } = require('uuid');
const { BrokingCompany, Corporate, CorporateHR, Executive, InsuranceCompany, Policy, TPA, User } = require('../../models');
const argon2 = require('argon2');

chai.use(chaiHttp);
chai.should();

describe('Policies test suite', () => {
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
    tpaid: 'PolicyTestTPA',
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
  let user = {
    uuid: uuidv4(),
    username: 'testuser',
    password: password,
    role: 'manager',
    brokingCompanyUuid: brokingCompany.uuid
  };
  const executive = {
    uuid: uuidv4(),
    userUuid: user.uuid,
    brokingCompanyUuid: brokingCompany.uuid,
    empid: 'test',
    supervisorEmpid: 'test',
    designation: 'manager',
    firstName: 'Test',
    lastName: 'User'
  };
  const policy = {
    uuid: uuidv4(),
    tpaUuid: tpa.uuid,
    corporateUuid: corporate.uuid,
    insuranceCompanyUuid: insuranceCompany.uuid,
    policyId: 'testPolicyId1',
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
    policyId: 'testPolicyId2',
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

    let jwt;
    before('Setup tables with test data', function (done) {
      Policy.destroy({/*logging: console.log, */where: {uuid: policy.uuid}})
      .then(ignoreVar => { return Policy.destroy({/*logging: console.log, */where: {uuid: policy2.uuid}}) })
      .then(ignoreVar => { return Executive.destroy({/*logging: console.log, */where: {uuid: executive.uuid}}); })
      .then(ignoreVar => { return User.destroy({/*logging: console.log, */where: {uuid: user.uuid}}); })
      .then(ignoreVar => { return (policy.clientSpoc1Empid) ? User.destroy({/*logging: console.log, */where: {username: policy.clientSpoc1Empid}}) : null; })
      .then(ignoreVar => { return (policy.clientSpoc2Empid) ? User.destroy({/*logging: console.log, */where: {username: policy.clientSpoc2Empid}}) : null; })
      .then(ignoreVar => { return (policy.clientSpoc3Empid) ? User.destroy({/*logging: console.log, */where: {username: policy.clientSpoc3Empid}}) : null; })
      .then(ignoreVar => { return (policy.clientSpoc1Empid) ? CorporateHR.destroy({/*logging: console.log, */where: {empid: policy.clientSpoc1Empid}}) : null; })
      .then(ignoreVar => { return (policy.clientSpoc2Empid) ? CorporateHR.destroy({/*logging: console.log, */where: {empid: policy.clientSpoc2Empid}}) : null; })
      .then(ignoreVar => { return (policy.clientSpoc3Empid) ? CorporateHR.destroy({/*logging: console.log, */where: {empid: policy.clientSpoc3Empid}}) : null; })
      .then(ignoreVar => { return Corporate.destroy({/*logging: console.log, */where: {uuid: corporate.uuid}}); })
      .then(ignoreVar => { return InsuranceCompany.destroy({/*logging: console.log, */where: {uuid: insuranceCompany.uuid}}); })
      .then(ignoreVar => { return TPA.destroy({/*logging: console.log, */where: {uuid: tpa.uuid}}); })
      .then(ignoreVar => { return BrokingCompany.destroy({/*logging: console.log, */where: {uuid: brokingCompany.uuid}}); })
      .then(ignoreVar => { return argon2.hash(user.password); })
      .then(p => {
        if (!p) {throw 'Hashing password failed.';}
        user.password = p;
        return BrokingCompany.create(brokingCompany/*, {logging: console.log}*/);
      })
      .then(ignoreVar => {return TPA.create(tpa/*, {logging: console.log}*/);})
      .then(ignoreVar => {return InsuranceCompany.create(insuranceCompany/*, {logging: console.log}*/);})
      .then(ignoreVar => {return Corporate.create(corporate/*, {logging: console.log}*/);})
      .then(ignoreVar => {return User.create(user/*, {logging: console.log}*/);})
      .then(ignoreVar => {return Executive.create(executive/*, {logging: console.log}*/);})
      .then(ignoreVar => {return Policy.create(policy2/*, {logging: console.log}*/);})
      .then(u => {
        if (!u) { throw 'Creating new user failed.'; }
        console.log('Creating new user succeeded.');
        // Login and get valid JWT token
        chai.request(server)
        .post('/api/v1/users/login')
        .set("Content-Type", "application/json")
        .send({ "username": user.username, "password": "password", "role": user.role, "subdomain": "test.subdomain.com"})
        .end( (err, res) => {
          if (err) {
            console.log('login failed.');
            console.log(err);
            done(err);
          }
          res.should.have.status(200);
          assert(res.body.status === 200);
          assert(res.body.errCode === 'Success');
          assert(res.body.data.user.uuid === user.uuid);
          assert(res.body.data.user.username === user.username);
          assert(res.body.data.user.role === user.role);
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

    it('Manager should create a policy - no new users', function (done) {
      chai.request(server)
      .post('/api/v1/policies')
      .set("Content-Type", "application/json")
      .set("Authorization", this.jwt)
      .send([policy])
      .end( (err, res) => {
        if (err) {
          console.log('Add new policy failed.');
          console.log(err);
          done(err);
        }
        console.log(`res.body: ${JSON.stringify(res.body)}`);
        res.should.have.status(200);
        assert(res.body.status === 200);
        assert(res.body.errCode === 'Success');
        assert(res.body.data);
        assert(res.body.data.newPolicies);
        assert(res.body.data.newPolicies.length === 1);
        assert(res.body.data.newPolicies[0].uuid);
        assert(res.body.data.newPolicies[0].policyId === policy.policyId);
        assert(res.body.data.newPolicies[0].tpaUuid ===  policy.tpaUuid);
        assert(res.body.data.newPolicies[0].corporateUuid ===  policy.corporateUuid);
        assert(res.body.data.newPolicies[0].insuranceCompanyUuid ===  policy.insuranceCompanyUuid);
        assert(new Date(res.body.data.newPolicies[0].fromDate).getFullYear() ===  new Date(policy.fromDate).getFullYear());
        assert(new Date(res.body.data.newPolicies[0].fromDate).getMonth() ===  new Date(policy.fromDate).getMonth());
        assert(new Date(res.body.data.newPolicies[0].fromDate).getDate() ===  new Date(policy.fromDate).getDate());
        assert(new Date(res.body.data.newPolicies[0].toDate).getFullYear() ===  new Date(policy.toDate).getFullYear());
        assert(new Date(res.body.data.newPolicies[0].toDate).getMonth() ===  new Date(policy.toDate).getMonth());
        assert(new Date(res.body.data.newPolicies[0].toDate).getDate() ===  new Date(policy.toDate).getDate());
        assert(res.body.data.newPolicies[0].policyYear ===  policy.policyYear);
        assert(res.body.data.newPolicies[0].familyDefinition ===  policy.familyDefinition);
        assert(res.body.data.newPolicies[0].numberOfFamilies ===  policy.numberOfFamilies);
        assert(res.body.data.newPolicies[0].numberOfDependents ===  policy.numberOfDependents);
        assert(res.body.data.newPolicies[0].sumInsured ===  policy.sumInsured);
        assert(res.body.data.newPolicies[0].premiumPerFamily ===  policy.premiumPerFamily);
        assert(res.body.data.newPolicies[0].premiumPerDependent ===  policy.premiumPerDependent);
        assert(res.body.data.newPolicies[0].opd ===  policy.opd);
        assert(res.body.data.newPolicies[0].status ===  'created');
        setTimeout(done, 10);
      });
    });

    it('Manager should create a policy - New HR SPOC users', function(done) {
      policy.policyId = 'test2';
      policy.clientSpoc1Empid = 'policy3clientspoc1empid';
      policy.clientSpoc1Name = 'Shubha Singhal';
      policy.clientSpoc1Email = 'shubha@client.com';
      policy.clientSpoc1Designation = 'Executive';
      policy.clientSpoc1Mobile = '+919876543210';
      policy.clientSpoc2Empid = 'policy3clientspoc2empid';
      policy.clientSpoc2Name = 'Venkateshwara Rao';
      policy.clientSpoc2Designation = 'Manager';
      policy.clientSpoc2Email = 'venkat@client.com';
      policy.clientSpoc2Mobile = '+919876543210';
      policy.clientSpoc3Empid = 'policy3clientspoc3empid';
      policy.clientSpoc3Name = 'Ayyappa Goud';
      policy.clientSpoc3Designation = 'Director';
      policy.clientSpoc3Email = 'ayyappa@client.com';
      policy.clientSpoc3Mobile = '+919876543210';

      chai.request(server)
      .post('/api/v1/policies')
      .set("Content-Type", "application/json")
      .set("Authorization", this.jwt)
      .send([policy])
      .end( (err, res) => {
        if (err) {
          console.log('Add new policy failed.');
          console.log(err);
          done(err);
        }
        res.should.have.status(200);
        assert(res.body.status === 200);
        assert(res.body.errCode === 'Success');
        assert(res.body.data);
        assert(res.body.data.newPolicies);
        assert(res.body.data.newPolicies.length === 1);
        assert(res.body.data.newPolicies[0].uuid);
        assert(res.body.data.newPolicies[0].policyId === policy.policyId);
        assert(res.body.data.newPolicies[0].tpaUuid ===  policy.tpaUuid);
        assert(res.body.data.newPolicies[0].corporateUuid ===  policy.corporateUuid);
        assert(res.body.data.newPolicies[0].insuranceCompanyUuid ===  policy.insuranceCompanyUuid);
        assert(new Date(res.body.data.newPolicies[0].fromDate).getFullYear() ===  new Date(policy.fromDate).getFullYear());
        assert(new Date(res.body.data.newPolicies[0].fromDate).getMonth() ===  new Date(policy.fromDate).getMonth());
        assert(new Date(res.body.data.newPolicies[0].fromDate).getDate() ===  new Date(policy.fromDate).getDate());
        assert(new Date(res.body.data.newPolicies[0].toDate).getFullYear() ===  new Date(policy.toDate).getFullYear());
        assert(new Date(res.body.data.newPolicies[0].toDate).getMonth() ===  new Date(policy.toDate).getMonth());
        assert(new Date(res.body.data.newPolicies[0].toDate).getDate() ===  new Date(policy.toDate).getDate());
        assert(res.body.data.newPolicies[0].policyYear ===  policy.policyYear);
        assert(res.body.data.newPolicies[0].familyDefinition ===  policy.familyDefinition);
        assert(res.body.data.newPolicies[0].numberOfFamilies ===  policy.numberOfFamilies);
        assert(res.body.data.newPolicies[0].numberOfDependents ===  policy.numberOfDependents);
        assert(res.body.data.newPolicies[0].sumInsured ===  policy.sumInsured);
        assert(res.body.data.newPolicies[0].premiumPerFamily ===  policy.premiumPerFamily);
        assert(res.body.data.newPolicies[0].premiumPerDependent ===  policy.premiumPerDependent);
        assert(res.body.data.newPolicies[0].opd ===  policy.opd);
        assert(res.body.data.newPolicies[0].clientSpoc1Empid === policy.clientSpoc1Empid);
        assert(res.body.data.newPolicies[0].clientSpoc1Name === policy.clientSpoc1Name );
        assert(res.body.data.newPolicies[0].clientSpoc1Email === policy.clientSpoc1Email);
        assert(res.body.data.newPolicies[0].clientSpoc1Designation === policy.clientSpoc1Designation);
        assert(res.body.data.newPolicies[0].clientSpoc1Mobile === policy.clientSpoc1Mobile);
        assert(res.body.data.newPolicies[0].clientSpoc2Empid === policy.clientSpoc2Empid);
        assert(res.body.data.newPolicies[0].clientSpoc2Name === policy.clientSpoc2Name );
        assert(res.body.data.newPolicies[0].clientSpoc2Designation === policy.clientSpoc2Designation);
        assert(res.body.data.newPolicies[0].clientSpoc2Email === policy.clientSpoc2Email);
        assert(res.body.data.newPolicies[0].clientSpoc2Mobile === policy.clientSpoc2Mobile);
        assert(res.body.data.newPolicies[0].clientSpoc3Empid === policy.clientSpoc3Empid);
        assert(res.body.data.newPolicies[0].clientSpoc3Name === policy.clientSpoc3Name );
        assert(res.body.data.newPolicies[0].clientSpoc3Designation === policy.clientSpoc3Designation);
        assert(res.body.data.newPolicies[0].clientSpoc3Email === policy.clientSpoc3Email);
        assert(res.body.data.newPolicies[0].clientSpoc3Mobile === policy.clientSpoc3Mobile);
        assert(res.body.data.newPolicies[0].status ===  'created');

        Promise.all([
          User.findOne({where: {username: policy.clientSpoc1Empid, corporateUuid: policy.corporateUuid}}),
          CorporateHR.findOne({where: {empid: policy.clientSpoc1Empid, corporateUuid: policy.corporateUuid}}),
          User.findOne({where: {username: policy.clientSpoc2Empid, corporateUuid: policy.corporateUuid}}),
          CorporateHR.findOne({where: {empid: policy.clientSpoc2Empid, corporateUuid: policy.corporateUuid}}),
          User.findOne({where: {username: policy.clientSpoc3Empid, corporateUuid: policy.corporateUuid}}),
          CorporateHR.findOne({where: {empid: policy.clientSpoc3Empid, corporateUuid: policy.corporateUuid}})
        ])
        .then(results => {
          assert(results && results.length === 6);
          assert(results[0] && results[0].uuid && results[0].username === policy.clientSpoc1Empid && results[0].corporateUuid === policy.corporateUuid);
          assert(results[1] && results[1].uuid && results[1].empid === policy.clientSpoc1Empid && results[1].corporateUuid === policy.corporateUuid);
          assert(results[2] && results[2].uuid && results[2].username === policy.clientSpoc2Empid && results[2].corporateUuid === policy.corporateUuid);
          assert(results[3] && results[3].uuid && results[3].empid === policy.clientSpoc2Empid && results[3].corporateUuid === policy.corporateUuid);
          assert(results[4] && results[4].uuid && results[4].username === policy.clientSpoc3Empid && results[4].corporateUuid === policy.corporateUuid);
          assert(results[5] && results[5].uuid && results[5].empid === policy.clientSpoc3Empid && results[5].corporateUuid === policy.corporateUuid);

          setTimeout(done, 10);
        })
        .catch(err => {
          console.error(err);
          done(err);
        })
      })
    });

  it('Manager should update a policy', function(done) {
    const modifiedPolicy = {
      uuid: policy2.uuid,
      tpaUuid: 'modified',
      corporateUuid: 'modified',
      insuranceCompanyUuid: 'modified',
      policyId: 'modified',
      fromDate: new Date(),
      toDate: new Date(),
      policyYear: 'modified',
      familyDefinition: 'modified',
      numberOfFamilies :'modified',
      numberOfDependents: 2,
      sumInsured: 3000,
      premiumPerFamily: 3000,
      premiumPerDependent: 3000,
      opd: 'no',
      maternityCover: 'modified',
      maternityLimit: 3000,
      babyCoverDayOne: 'no',
      preExistingCover: 'no',
      secondYearExclusions: 'no',
      congenitalDiseasesInternal: 'no',
      congenitalDiseasesExternal: 'no',
      corporateBufferAndConditions: 'no',
      categories: 'c a t e g o r i e s 2',
      roomRentLimits: 'modified',
      copay: 3000,
      parentalSubLimit: 3000,
      parentalCopay: 3000,
      opdLimit: 3000,
      appendicitis: 3000,
      hernia: 3000,
      arthiritis: 3000,
      digestiveDisorders: 3000,
      cataract: 3000,
      gallBladderAndHisterectomy: 3000,
      kneeReplacement: 3000,
      jointReplacementIncludingVertrebalJoints: 3000,
      treatmentForKidneyStones: 3000,
      piles: 3000,
      hydrocele: 3000,
      lasikSurgery: 3000,
      wellnessProgram: 'modified',
      helpdeskSchedule: 'modified',
      visistaSpoc1Name: 'modified',
      visistaSpoc1Designation: 'modified',
      visistaSpoc1Email: 'modified',
      visistaSpoc1Mobile: 'modified',
      visistaSpoc2Name: 'modified',
      visistaSpoc2Designation: 'modified',
      visistaSpoc2Email: 'modified',
      visistaSpoc2Mobile: 'modified',
      visistaSpoc3Name: 'modified',
      visistaSpoc3Designation: 'modified',
      visistaSpoc3Email: 'modified',
      visistaSpoc3Mobile: 'modified',
      tpaSpoc1Name: 'modified',
      tpaSpoc1Designation: 'modified',
      tpaSpoc1Email: 'modified',
      tpaSpoc1Mobile: 'modified',
      tpaSpoc2Name: 'modified',
      tpaSpoc2Designation: 'modified',
      tpaSpoc2Email: 'modified',
      tpaSpoc2Mobile: 'modified',
      tpaSpoc3Name: 'modified',
      tpaSpoc3Designation: 'modified',
      tpaSpoc3Email: 'modified',
      tpaSpoc3Mobile: 'modified',
      clientSpoc1Empid: 'modified',
      clientSpoc1Name: 'modified',
      clientSpoc1Email: 'modified',
      clientSpoc1Designation: 'modified',
      clientSpoc1Mobile: 'modified',
      clientSpoc2Empid: 'modified',
      clientSpoc2Name: 'modified',
      clientSpoc2Designation: 'modified',
      clientSpoc2Email: 'modified',
      clientSpoc2Mobile: 'modified',
      clientSpoc3Empid: 'modified',
      clientSpoc3Name: 'modified',
      clientSpoc3Designation: 'modified',
      clientSpoc3Email: 'modified',
      clientSpoc3Mobile: 'modified',
      status: 'approved'
    };

    chai.request(server)
    .put('/api/v1/policies')
    .set("Content-Type", "application/json")
    .set("Authorization", this.jwt)
    .send(modifiedPolicy)
    .end( (err, res) => {
      if (err) {
        console.log('Add new policy failed.');
        console.log(err);
        done(err);
      }
      res.should.have.status(200);
      assert(res.body.status === 200);
      assert(res.body.errCode === 'Success');
      assert(res.body.data);

      Policy.findOne({where: {uuid: modifiedPolicy.uuid}})
      .then(policy => {
        assert(policy);
        console.log(`Modified Policy:::::::::::::::::::::::::::::::::::::::::::: ${JSON.stringify(policy)}`);
        console.log(`policy.appendicitis: ${policy.appendicitis}`);
        console.log(`modifiedPolicy.appendicitis: ${modifiedPolicy.appendicitis}`);
        assert(policy.uuid === modifiedPolicy.uuid);
        assert(policy.policyId === modifiedPolicy.policyId);
        assert(new Date(Date.parse(policy.fromDate)).getTime() === new Date(Date.parse(modifiedPolicy.fromDate)).getTime());
        assert(new Date(Date.parse(policy.toDate)).getTime() === new Date(Date.parse(modifiedPolicy.toDate)).getTime());
        assert(policy.policyYear === modifiedPolicy.policyYear);
        assert(policy.familyDefinition === modifiedPolicy.familyDefinition);
        assert(policy.numberOfFamilies === modifiedPolicy.numberOfFamilies);
        assert(parseInt(policy.numberOfDependents, 10) === parseInt(modifiedPolicy.numberOfDependents, 10));
        assert(parseInt(policy.sumInsured, 10) === parseInt(modifiedPolicy.sumInsured, 10));
        assert(parseInt(policy.premiumPerFamily, 10) === parseInt(modifiedPolicy.premiumPerFamily, 10));
        assert(parseInt(policy.premiumPerDependent, 10) === parseInt(modifiedPolicy.premiumPerDependent, 10));
        assert(policy.opd === modifiedPolicy.opd);
        assert(policy.maternityCover === modifiedPolicy.maternityCover);
        assert(parseInt(policy.maternityLimit, 10) === parseInt(modifiedPolicy.maternityLimit, 10));
        assert(policy.babyCoverDayOne === modifiedPolicy.babyCoverDayOne);
        assert(policy.preExistingCover === modifiedPolicy.preExistingCover);
        assert(policy.secondYearExclusions === modifiedPolicy.secondYearExclusions);
        assert(policy.congenitalDiseasesInternal === modifiedPolicy.congenitalDiseasesInternal);
        assert(policy.congenitalDiseasesExternal === modifiedPolicy.congenitalDiseasesExternal);
        assert(policy.corporateBufferAndConditions === modifiedPolicy.corporateBufferAndConditions);
        assert(policy.categories === modifiedPolicy.categories);
        assert(policy.roomRentLimits === modifiedPolicy.roomRentLimits);
        assert(parseInt(policy.copay, 10 ) === parseInt(modifiedPolicy.copay, 10));
        assert(parseInt(policy.parentalSubLimit, 10) === parseInt(modifiedPolicy.parentalSubLimit, 10));
        assert(parseInt(policy.parentalCopay, 10) === parseInt(modifiedPolicy.parentalCopay, 10));
        assert(parseInt(policy.opdLimit, 10) === parseInt(modifiedPolicy.opdLimit, 10));
        assert(parseInt(policy.appendicitis, 10) === parseInt(modifiedPolicy.appendicitis, 10));
        assert(parseInt(policy.hernia, 10) === parseInt(modifiedPolicy.hernia, 10));
        assert(parseInt(policy.arthiritis, 10) === parseInt(modifiedPolicy.arthiritis, 10));
        assert(parseInt(policy.digestiveDisorders, 10) === parseInt(modifiedPolicy.digestiveDisorders, 10));
        assert(parseInt(policy.cataract, 10) === parseInt(modifiedPolicy.cataract, 10));
        assert(parseInt(policy.gallBladderAndHisterectomy, 10) === parseInt(modifiedPolicy.gallBladderAndHisterectomy, 10));
        assert(parseInt(policy.kneeReplacement, 10) === parseInt(modifiedPolicy.kneeReplacement, 10));
        assert(parseInt(policy.jointReplacementIncludingVertrebalJoints, 10) === parseInt(modifiedPolicy.jointReplacementIncludingVertrebalJoints, 10));
        assert(parseInt(policy.treatmentForKidneyStones, 10) === parseInt(modifiedPolicy.treatmentForKidneyStones, 10));
        assert(parseInt(policy.piles, 10) === parseInt(modifiedPolicy.piles, 10));
        assert(parseInt(policy.hydrocele, 10) === parseInt(modifiedPolicy.hydrocele, 10));
        assert(parseInt(policy.lasikSurgery, 10) === parseInt(modifiedPolicy.lasikSurgery, 10));
        assert(policy.wellnessProgram === modifiedPolicy.wellnessProgram);
        assert(policy.helpdeskSchedule === modifiedPolicy.helpdeskSchedule);
        assert(policy.visistaSpoc1Name === modifiedPolicy.visistaSpoc1Name);
        assert(policy.visistaSpoc1Designation === modifiedPolicy.visistaSpoc1Designation);
        assert(policy.visistaSpoc1Email === modifiedPolicy.visistaSpoc1Email);
        assert(policy.visistaSpoc1Mobile === modifiedPolicy.visistaSpoc1Mobile);
        assert(policy.visistaSpoc2Name === modifiedPolicy.visistaSpoc2Name);
        assert(policy.visistaSpoc2Designation === modifiedPolicy.visistaSpoc2Designation);
        assert(policy.visistaSpoc2Email === modifiedPolicy.visistaSpoc2Email);
        assert(policy.visistaSpoc2Mobile === modifiedPolicy.visistaSpoc2Mobile);
        assert(policy.visistaSpoc3Name === modifiedPolicy.visistaSpoc3Name);
        assert(policy.visistaSpoc3Designation === modifiedPolicy.visistaSpoc3Designation);
        assert(policy.visistaSpoc3Email === modifiedPolicy.visistaSpoc3Email);
        assert(policy.visistaSpoc3Mobile === modifiedPolicy.visistaSpoc3Mobile);
        assert(policy.tpaSpoc1Name === modifiedPolicy.tpaSpoc1Name);
        assert(policy.tpaSpoc1Designation === modifiedPolicy.tpaSpoc1Designation);
        assert(policy.tpaSpoc1Email === modifiedPolicy.tpaSpoc1Email);
        assert(policy.tpaSpoc1Mobile === modifiedPolicy.tpaSpoc1Mobile);
        assert(policy.tpaSpoc2Name === modifiedPolicy.tpaSpoc2Name);
        assert(policy.tpaSpoc2Designation === modifiedPolicy.tpaSpoc2Designation);
        assert(policy.tpaSpoc2Email === modifiedPolicy.tpaSpoc2Email);
        assert(policy.tpaSpoc2Mobile === modifiedPolicy.tpaSpoc2Mobile);
        assert(policy.tpaSpoc3Name === modifiedPolicy.tpaSpoc3Name);
        assert(policy.tpaSpoc3Designation === modifiedPolicy.tpaSpoc3Designation);
        assert(policy.tpaSpoc3Email === modifiedPolicy.tpaSpoc3Email);
        assert(policy.tpaSpoc3Mobile === modifiedPolicy.tpaSpoc3Mobile);
        assert(policy.clientSpoc1Empid === modifiedPolicy.clientSpoc1Empid);
        assert(policy.clientSpoc1Name === modifiedPolicy.clientSpoc1Name);
        assert(policy.clientSpoc1Email === modifiedPolicy.clientSpoc1Email);
        assert(policy.clientSpoc1Designation === modifiedPolicy.clientSpoc1Designation);
        assert(policy.clientSpoc1Mobile === modifiedPolicy.clientSpoc1Mobile);
        assert(policy.clientSpoc2Empid === modifiedPolicy.clientSpoc2Empid);
        assert(policy.clientSpoc2Name === modifiedPolicy.clientSpoc2Name);
        assert(policy.clientSpoc2Designation === modifiedPolicy.clientSpoc2Designation);
        assert(policy.clientSpoc2Email === modifiedPolicy.clientSpoc2Email);
        assert(policy.clientSpoc2Mobile === modifiedPolicy.clientSpoc2Mobile);
        assert(policy.clientSpoc3Empid === modifiedPolicy.clientSpoc3Empid);
        assert(policy.clientSpoc3Name === modifiedPolicy.clientSpoc3Name);
        assert(policy.clientSpoc3Designation === modifiedPolicy.clientSpoc3Designation);
        assert(policy.clientSpoc3Email === modifiedPolicy.clientSpoc3Email);
        assert(policy.clientSpoc3Mobile === modifiedPolicy.clientSpoc3Mobile);
        assert(policy.status === modifiedPolicy.status);

        setTimeout(done, 10);
      })
      .catch(err => {
        console.error(err);
        done(err);
      })
    })
  });

  after('Clearing tables off test data', function(done) {
      Policy.destroy({/*logging: console.log, */where: {uuid: policy.uuid}})
      .then(ignoreVar => { return Policy.destroy({/*logging: console.log, */where: {uuid: policy2.uuid}}) })
      .then(ignoreVar => { return Executive.destroy({/*logging: console.log, */where: {uuid: executive.uuid}}); })
      .then(ignoreVar => { return User.destroy({/*logging: console.log, */where: {uuid: user.uuid}}); })
      .then(ignoreVar => { return (policy.clientSpoc1Empid) ? User.destroy({/*logging: console.log, */where: {username: policy.clientSpoc1Empid}}) : null; })
      .then(ignoreVar => { return (policy.clientSpoc2Empid) ? User.destroy({/*logging: console.log, */where: {username: policy.clientSpoc2Empid}}) : null; })
      .then(ignoreVar => { return (policy.clientSpoc3Empid) ? User.destroy({/*logging: console.log, */where: {username: policy.clientSpoc3Empid}}) : null; })
      .then(ignoreVar => { return (policy.clientSpoc1Empid) ? CorporateHR.destroy({/*logging: console.log, */where: {empid: policy.clientSpoc1Empid}}) : null; })
      .then(ignoreVar => { return (policy.clientSpoc2Empid) ? CorporateHR.destroy({/*logging: console.log, */where: {empid: policy.clientSpoc2Empid}}) : null; })
      .then(ignoreVar => { return (policy.clientSpoc3Empid) ? CorporateHR.destroy({/*logging: console.log, */where: {empid: policy.clientSpoc3Empid}}) : null; })
      .then(ignoreVar => { return Corporate.destroy({/*logging: console.log, */where: {uuid: corporate.uuid}}); })
      .then(ignoreVar => { return InsuranceCompany.destroy({/*logging: console.log, */where: {uuid: insuranceCompany.uuid}}); })
      .then(ignoreVar => { return TPA.destroy({/*logging: console.log, */where: {uuid: tpa.uuid}}); })
      .then(ignoreVar => { return BrokingCompany.destroy({/*logging: console.log, */where: {uuid: brokingCompany.uuid}}); })
      .then(ignoreVar => { setTimeout(done, 10); })
      .catch(e => {console.log(e);})
    });
  // });
});
