"use strict";

const sinon = require('sinon');
const policiesService = require('../services/policiesService')
const {Ailment, Corporate, CorporateHR, Customer, Executive, ExecutiveCorporateMapping, InsuranceCompany, Policy, PolicyAilmentMapping, NetworkHospital, TPA, User } = require('../models');
const argon2 = require('argon2');
const soap = require('soap');

describe('policiesService Test Suite', function() {
  before(function() {
    this.sandbox = sinon.createSandbox();
  });

  beforeEach(function() {
    this.sandbox.spy(policiesService);
    this.sandbox.stub(Ailment, 'bulkCreate').resolves([{uuid: 'uuid'}]);
    this.sandbox.stub(Corporate, 'findOne').resolves({uuid: 'uuid', policyId: 'policyId', companyName: 'companyName'});
    this.sandbox.stub(Corporate, 'findAll').resolves([{uuid: 'uuid', policyId: 'policyId', companyName: 'companyName'}]);
    this.sandbox.stub(CorporateHR, 'create').resolves({uuid: 'uuid'});
    this.sandbox.stub(CorporateHR, 'findOne').resolves({uuid: 'uuid', corporateUuid: 'corporateUuid'});
    this.sandbox.stub(Customer, 'findOne').resolves({uuid: 'uuid', corporateUuid: 'corporateUuid'});
    this.sandbox.stub(Executive, 'findOne').resolves({uuid: 'uuid', designation: 'manager'});
    this.sandbox.stub(ExecutiveCorporateMapping, 'findAll').resolves([{uuid: 'uuid', executiveUuid: 'uuid', corporateUuid: 'uuid'}]);
    this.sandbox.stub(InsuranceCompany, 'findOne').resolves({uuid: 'uuid', policyId: 'policyId', companyName: 'companyName'});
    this.sandbox.stub(NetworkHospital, 'bulkCreate').resolves([{uuid: 'uuid'}]);
    this.sandbox.stub(NetworkHospital, 'findAll').resolves([{uuid: 'uuid'}]);
    this.sandbox.stub(Policy, 'create').resolves({uuid: 'uuid', policyId: 'policyId', clientSpoc1Empid: 'clientSpoc1Empid', clientSpoc2Empid: 'clientSpoc2Empid', clientSpoc3Empid: 'clientSpoc3Empid', TPAUUID: 'uuid', corporateUuid: 'corporateUuid'});
    this.sandbox.stub(Policy, 'update').resolves({uuid: 'uuid', policyId: 'policyId', clientSpoc1Empid: 'clientSpoc1Empid', clientSpoc2Empid: 'clientSpoc2Empid', clientSpoc3Empid: 'clientSpoc3Empid', TPAUUID: 'uuid', corporateUuid: 'corporateUuid'});
    this.sandbox.stub(PolicyAilmentMapping, 'create').resolves([{uuid: 'uuid'}]);
    this.sandbox.stub(PolicyAilmentMapping, 'findAll').resolves([{uuid: 'uuid', PolicyUuid: 'policyUuid', AilmentUuid: 'ailmentUuid'}]);
    this.sandbox.stub(TPA, 'findOne').resolves({uuid: 'uuid', TPAName: 'TPAName', companyName: 'companyName'});
    this.sandbox.stub(User, 'create').resolves({uuid: 'uuid'});
    this.sandbox.stub(argon2, 'hash').resolves('password');
    this.sandbox.stub(soap, 'createClient').resolves('password');
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  it('addAilmentsByPolicyId test', async function() {
    this.sandbox.stub(Policy, 'findOne').resolves({uuid: 'uuid', policyId: 'policyId'});
    await policiesService.addAilmentsByPolicyId('policyId', [{uuid: 'uuid'}]);
    sinon.assert.calledOnce(Policy.findOne);
    sinon.assert.calledOnce(Ailment.bulkCreate);
    sinon.assert.calledOnce(PolicyAilmentMapping.create);
  });

  it('addAilmentsAsExecutiveByPolicyId test', async function() {
    this.sandbox.stub(Policy, 'findOne').resolves({uuid: 'uuid', policyId: 'policyId', corporateUuid: 'uuid'});
    await policiesService.addAilmentsAsExecutiveByPolicyId('userUuid', 'policyId', [{uuid: 'uuid'}]);
    sinon.assert.calledOnce(Executive.findOne);
    sinon.assert.calledOnce(ExecutiveCorporateMapping.findAll);
    sinon.assert.calledOnce(Policy.findOne);
    sinon.assert.calledOnce(Ailment.bulkCreate);
    sinon.assert.calledOnce(PolicyAilmentMapping.create);
  });

  it('addNetworkHospitalsAsExecutiveByPolicyId test', async function() {
    this.sandbox.stub(Policy, 'findOne').resolves({uuid: 'uuid', policyId: 'policyId', corporateUuid: 'uuid'});
    await policiesService.addNetworkHospitalsAsExecutiveByPolicyId('userUuid', 'policyId', [{uuid: 'uuid'}]);
    sinon.assert.calledOnce(Executive.findOne);
    sinon.assert.calledOnce(ExecutiveCorporateMapping.findAll);
    sinon.assert.calledOnce(Policy.findOne);
    sinon.assert.calledOnce(NetworkHospital.bulkCreate);
  });

  it('addNetworkHospitalsByPolicyId test', async function() {
    this.sandbox.stub(Policy, 'findOne').resolves({uuid: 'uuid', policyId: 'policyId'});
    await policiesService.addNetworkHospitalsByPolicyId('policyId', [{uuid: 'uuid'}]);
    sinon.assert.calledOnce(Policy.findOne);
    sinon.assert.calledOnce(NetworkHospital.bulkCreate);
  });

  it('addPolicies new policies test', async function() {
    this.sandbox.stub(Policy, 'findOne').resolves(null);
    await policiesService.addPolicies([
      {uuid: 'uuid', policyId: 'policyId', clientSpoc1Empid: 'clientSpoc1Empid', clientSpoc2Empid: 'clientSpoc2Empid', clientSpoc3Empid: 'clientSpoc3Empid'}
      ]);
    sinon.assert.calledOnce(TPA.findOne);
    sinon.assert.calledOnce(InsuranceCompany.findOne);
    sinon.assert.calledOnce(Corporate.findOne);
    sinon.assert.calledOnce(Policy.findOne);
    sinon.assert.calledOnce(Policy.create);
    sinon.assert.calledThrice(argon2.hash);
    sinon.assert.calledThrice(User.create);
    sinon.assert.calledThrice(CorporateHR.create);
  });

  it('getAilmentsByPolicyId test', async function() {
    this.sandbox.stub(Policy, 'findOne').resolves({uuid: 'uuid', policyId: 'policyId'});
    await policiesService.getAilmentsByPolicyId('policyId');
    sinon.assert.calledOnce(Policy.findOne);
    sinon.assert.calledOnce(PolicyAilmentMapping.findAll);
  });

  it('getNetworkHospitalsByPolicyId test', async function() {
    this.sandbox.stub(Policy, 'findOne').resolves({uuid: 'uuid', policyId: 'policyId'});
    await policiesService.getNetworkHospitalsByPolicyId('policyId');
    sinon.assert.calledOnce(Policy.findOne);
    sinon.assert.calledOnce(NetworkHospital.findAll);
  });

  it('getPolicies manager test', async function() {
    this.sandbox.stub(Policy, 'findAll').resolves([{dataValues: {uuid: 'uuid', policyId: 'policyId', clientSpoc1Empid: 'clientSpoc1Empid', clientSpoc2Empid: 'clientSpoc2Empid', clientSpoc3Empid: 'clientSpoc3Empid', corporateUUID: 'uuid', TPAUUID: 'uuid', insuranceCompanyUUID: 'uuid'}}]);
    await policiesService.getPolicies({uuid: 'uuid', role: 'manager'}, 'corporateUuid');
    sinon.assert.calledOnce(Executive.findOne);
    sinon.assert.calledOnce(Corporate.findOne);
    sinon.assert.calledOnce(Policy.findAll);
    sinon.assert.calledOnce(TPA.findOne);
    sinon.assert.calledOnce(InsuranceCompany.findOne);
  });

  it('getPoliciesByTpa test', async function() {
    this.sandbox.stub(Policy, 'findAll').resolves([{uuid: 'uuid', policyId: 'policyId'}]);
    await policiesService.getPoliciesByTpa('tpaUuid');
    sinon.assert.calledOnce(TPA.findOne);
    sinon.assert.calledOnce(Policy.findAll);
  });

  it('getPoliciesByCorporate test', async function() {
    this.sandbox.stub(Policy, 'findAll').resolves([{uuid: 'uuid', policyId: 'policyId'}]);
    await policiesService.getPoliciesByCorporate('corporateUuid');
    sinon.assert.calledOnce(Corporate.findOne);
    sinon.assert.calledOnce(Policy.findAll);
  });

  it('getPoliciesByInsuranceCompany test', async function() {
    this.sandbox.stub(Policy, 'findAll').resolves([{uuid: 'uuid', policyId: 'policyId'}]);
    await policiesService.getPoliciesByInsuranceCompany('insuranceCompanyUuid');
    sinon.assert.calledOnce(InsuranceCompany.findOne);
    sinon.assert.calledOnce(Policy.findAll);
  });

  it('getPoliciesByTpaByCorporate test', async function() {
    this.sandbox.stub(Policy, 'findAll').resolves([{uuid: 'uuid', policyId: 'policyId'}]);
    await policiesService.getPoliciesByTpaByCorporate('tpaUuid', 'corporateUuid');
    sinon.assert.calledOnce(TPA.findOne);
    sinon.assert.calledOnce(Corporate.findOne);
    sinon.assert.calledOnce(Policy.findAll);
  });

  it('getPoliciesByTpaByInsuranceCompany test', async function() {
    this.sandbox.stub(Policy, 'findAll').resolves([{uuid: 'uuid', policyId: 'policyId'}]);
    await policiesService.getPoliciesByTpaByInsuranceCompany('tpaUuid', 'insuranceCompanyUuid');
    sinon.assert.calledOnce(TPA.findOne);
    sinon.assert.calledOnce(InsuranceCompany.findOne);
    sinon.assert.calledOnce(Policy.findAll);
  });

  it('getPoliciesByCorporateByInsuranceCompany test', async function() {
    this.sandbox.stub(Policy, 'findAll').resolves([{uuid: 'uuid', policyId: 'policyId'}]);
    await policiesService.getPoliciesByCorporateByInsuranceCompany('corporateUuid', 'insuranceCompanyUuid');
    sinon.assert.calledOnce(Corporate.findOne);
    sinon.assert.calledOnce(InsuranceCompany.findOne);
    sinon.assert.calledOnce(Policy.findAll);
  });

  it('getPoliciesByTpaByCorporateByInsuranceCompany test', async function() {
    this.sandbox.stub(Policy, 'findAll').resolves([{uuid: 'uuid', policyId: 'policyId'}]);
    await policiesService.getPoliciesByTpaByCorporateByInsuranceCompany('tpaUuid', 'corporateUuid', 'insuranceCompanyUuid');
    sinon.assert.calledOnce(TPA.findOne);
    sinon.assert.calledOnce(Corporate.findOne);
    sinon.assert.calledOnce(InsuranceCompany.findOne);
    sinon.assert.calledOnce(Policy.findAll);
  });

  it('getPolicyForCustomerByPolicyId test', async function() {
    this.sandbox.stub(Policy, 'findAll').resolves([{uuid: 'uuid', policyId: 'policyId'}]);
    await policiesService.getPolicyForCustomerByPolicyId('userUuid', 'policyId');
    sinon.assert.calledOnce(Customer.findOne);
    sinon.assert.calledOnce(Corporate.findOne);
    sinon.assert.calledOnce(Policy.findAll);
  });

  it('getPolicyForHrByPolicyId test', async function() {
    this.sandbox.stub(Policy, 'findAll').resolves([{uuid: 'uuid', policyId: 'policyId'}]);
    await policiesService.getPolicyForHrByPolicyId('userUuid', 'policyId');
    sinon.assert.calledOnce(CorporateHR.findOne);
    sinon.assert.calledOnce(Corporate.findOne);
    sinon.assert.calledOnce(Policy.findAll);
  });

  it('getPolicyForExecutiveByPolicyId test', async function() {
    this.sandbox.stub(Policy, 'findOne').resolves({uuid: 'uuid', policyId: 'policyId', corporateUuid: 'uuid'});
    await policiesService.getPolicyForExecutiveByPolicyId('userUuid', 'policyId');
    sinon.assert.calledOnce(Executive.findOne);
    sinon.assert.calledOnce(ExecutiveCorporateMapping.findAll);
    sinon.assert.calledOnce(Policy.findOne);
  });

  it('getPolicyByPolicyId test', async function() {
    this.sandbox.stub(Policy, 'findOne').resolves({uuid: 'uuid', policyId: 'policyId'});
    await policiesService.getPolicyByPolicyId('policyId');
    sinon.assert.calledOnce(Policy.findOne);
  });

  it('updatePolicy test', async function() {
    this.sandbox.stub(Policy, 'findOne').resolves({dataValues: {uuid: 'uuid', policyId: 'policyId', corporateUUID: 'corporateUUID'}});
    await policiesService.updatePolicy({uuid: 'uuid', role: 'manager'}, {uuid: 'uuid'});
    sinon.assert.calledOnce(Policy.findOne);
    sinon.assert.calledOnce(Policy.update);
  });
})
