"use strict";

const sinon = require('sinon');
const dashboardService = require('../services/dashboardService')
const { Claim, Customer, CustomerStateJournal, DependentStateJournal, Dependent, Policy } = require('../models');

describe('dashboardService Test Suite', function() {
  before(function() {
    this.sandbox = sinon.createSandbox();
  });

  beforeEach(function() {
    this.sandbox.spy(dashboardService);
    this.sandbox.stub(Claim, 'findAll').resolves([{uuid: 'uuid'}]);
    this.sandbox.stub(Policy, 'findAll').resolves([{uuid: 'uuid'}]);
    this.sandbox.stub(Customer, 'findAll').resolves([{dataValues: {uuid: 'uuid'}}]);
    this.sandbox.stub(CustomerStateJournal, 'findAll').resolves([{dataValues: {uuid: 'uuid'}}]);
    this.sandbox.stub(DependentStateJournal, 'findAll').resolves([{dataValues: {uuid: 'uuid'}}]);
    this.sandbox.stub(Dependent, 'findAll').resolves([{dataValues: {uuid: 'uuid', relationShip: 'self'}}]);
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  it('getCorporateClaimAnalytics test', async function() {
    const corporateUuid = 'corporateUuid';
    const policyId = 'policyId';
    const startDate = 'startDate';
    const endDate = 'endDate';
    await dashboardService.getCorporateClaimAnalytics(corporateUuid, policyId, startDate, endDate);
    sinon.assert.calledOnce(Claim.findAll);
  });

  it('getCorporatePolicyAnalytics test', async function() {
    const corporateUuid = 'corporateUuid';
    const policyId = 'policyId';
    const startDate = 'startDate';
    const endDate = 'endDate';
    const result = await dashboardService.getCorporatePolicyAnalytics(corporateUuid, policyId, startDate, endDate);
    sinon.assert.calledOnce(Policy.findAll);
    sinon.assert.calledOnce(Customer.findAll);
    sinon.assert.calledOnce(CustomerStateJournal.findAll);
    sinon.assert.calledOnce(DependentStateJournal.findAll);
    // sinon.assert.calledOnce(Dependent.findAll);
  });
})
