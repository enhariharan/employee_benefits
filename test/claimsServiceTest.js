"use strict";

const sinon = require('sinon');
const claimsService = require('../services/claimsService')
const soapService = require('../services/soapService')
const {Ailment, Claim, Corporate, CorporateHR, Customer, Executive, ExecutiveCorporateMapping, Policy,PolicyAilmentMapping} = require('../models');
const mediAssistProvider = require('../providers/mediAssistProvider');

describe('claimsService Test Suite', function() {
  before(function() {
    this.sandbox = sinon.createSandbox();
  });

  beforeEach(function() {
    this.sandbox.spy(claimsService);
    this.sandbox.stub(Ailment, 'findOne').resolves({name: 'ailmentName'});
    this.sandbox.stub(Claim, 'findAll').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e', policyUuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
    this.sandbox.stub(Claim, 'findOne').resolves(null);
    this.sandbox.stub(Claim, 'bulkCreate').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e', policyUuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
    // this.sandbox.stub(Claim, 'findOne').resolves({uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e', policyUuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'});
    this.sandbox.stub(CorporateHR, 'findOne').resolves({corporateUuid: 'corporateUuid', companyName: 'Sample Broking Company Name'});
    this.sandbox.stub(Corporate, 'findOne').resolves({uuid: 'corporateUuid', companyName: 'Sample Broking Company Name'});
    this.sandbox.stub(Customer, 'findOne').resolves({empid: 'empid', corporateUuid: 'corporateUuid', companyName: 'Sample Broking Company Name'});
    this.sandbox.stub(Executive, 'findOne').resolves({uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e', companyName: 'Sample Broking Company Name'});
    this.sandbox.stub(ExecutiveCorporateMapping, 'findAll').resolves([{executiveUuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e', corporateUuid: 'corporateUuid'}]);
    this.sandbox.stub(Policy, 'findOne').resolves({policyId: 'policyId', corporateUuid: 'corporateUuid'});
    this.sandbox.stub(PolicyAilmentMapping, 'findOne').resolves({uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e', PolicyUuid: 'PolicyUuid', AilmentUuid: 'AilmentUuid'});
    this.sandbox.stub(soapService, 'getAllClaimsByPolicyByDates').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e', policyUuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
    this.sandbox.stub(mediAssistProvider, 'getAllClaimsByPolicyByDates').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e', policyUuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  it('getAllClaims Manager test', async function() {
    const credentials = {role: 'manager'};
    const queryParams = {fromDate: Date.now(), toDate: Date.now(), empid: 'empid', corporateUuid: 'corporateUuid'};
    await claimsService.getAllClaims(credentials, queryParams);
    sinon.assert.calledOnce(Claim.findAll);
  });

  it('getAllClaims Executive test', async function() {
    const credentials = {role: 'executive'};
    const queryParams = {fromDate: Date.now(), toDate: Date.now(), empid: 'empid', corporateUuid: 'corporateUuid'};
    await claimsService.getAllClaims(credentials, queryParams);
    sinon.assert.calledOnce(Executive.findOne);
    sinon.assert.calledOnce(ExecutiveCorporateMapping.findAll);
    sinon.assert.calledOnce(Customer.findOne);
    sinon.assert.calledOnce(Claim.findAll);
  });

  it('getAllClaims HR test', async function() {
    const credentials = {role: 'hr'};
    const queryParams = {fromDate: Date.now(), toDate: Date.now(), empid: 'empid', corporateUuid: 'corporateUuid'};
    await claimsService.getAllClaims(credentials, queryParams);
    sinon.assert.calledOnce(CorporateHR.findOne);
    sinon.assert.calledOnce(Customer.findOne);
    sinon.assert.calledOnce(Claim.findAll);
  });

  it('getAllClaims Customer test', async function() {
    const credentials = {role: 'customer'};
    const queryParams = {fromDate: Date.now(), toDate: Date.now(), empid: 'empid', corporateUuid: 'corporateUuid'};
    await claimsService.getAllClaims(credentials, queryParams);
    sinon.assert.calledOnce(Customer.findOne);
    sinon.assert.calledOnce(Claim.findAll);
  });

  it('getClaimByClaimId test', async function() {
    await claimsService.getClaimByClaimId('claimId');
    sinon.assert.calledOnce(Claim.findOne);
  });

  it('addClaims test', async function() {
    await claimsService.addClaims([{claimId: 'claimId', corporateUuid: 'corporateUuid', policyUuid: 'policyUuid'}]);
    sinon.assert.calledOnce(Customer.findOne);
    sinon.assert.calledOnce(Corporate.findOne);
    sinon.assert.calledOnce(Policy.findOne);
    sinon.assert.calledOnce(PolicyAilmentMapping.findOne);
    sinon.assert.calledOnce(Claim.findOne);
    sinon.assert.calledOnce(Claim.bulkCreate);
  });

  it('addClaimsFromSoapByPolicyByDates test', async function() {
    await claimsService.addClaimsFromSoapByPolicyByDates('policy', Date.now().toLocaleString(), Date.now().toLocaleString());
    sinon.assert.calledOnce(soapService.getAllClaimsByPolicyByDates);
    sinon.assert.calledOnce(Customer.findOne);
    sinon.assert.calledOnce(Corporate.findOne);
    sinon.assert.calledOnce(Claim.bulkCreate);
  });

  it('getAllSoapClaimsByPolicyByDates test', async function() {
    await claimsService.getAllSoapClaimsByPolicyByDates('policy', Date.now().toLocaleString(), Date.now().toLocaleString());
    sinon.assert.calledOnce(Claim.findAll);
  });

  it('mediAssistClaimsByPolicyByDates test', async function() {
    await claimsService.mediAssistClaimsByPolicyByDates('policy', Date.now().toLocaleString(), Date.now().toLocaleString());
    sinon.assert.calledOnce(mediAssistProvider.getAllClaimsByPolicyByDates);
  });
})
