"use strict";

const sinon = require('sinon');
const notificationsService = require('../services/notificationsService')
const { Customer, Dependent, Policy, ExecutiveCorporateMapping } = require('../models');

describe('notificationsService Test Suite', function() {
  before(function() {
    this.sandbox = sinon.createSandbox();
  });

  beforeEach(function() {
    this.sandbox.spy(notificationsService);
    this.sandbox.stub(Customer, 'count').resolves([{uuid: 'uuid'}]);
    this.sandbox.stub(Dependent, 'count').resolves([{uuid: 'uuid'}]);
    this.sandbox.stub(Policy, 'count').resolves([{uuid: 'uuid'}]);
    this.sandbox.stub(ExecutiveCorporateMapping, 'findAll').resolves([{uuid: 'uuid'}]);
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  it('getPendingActions executive test', async function() {
    await notificationsService.getPendingActions({uuid: 'uuid', role: 'executive'});
    sinon.assert.calledOnce(ExecutiveCorporateMapping.findAll);
    sinon.assert.calledOnce(Customer.count);
    sinon.assert.calledOnce(Dependent.count);
  });

  it('getPendingActions hr test', async function() {
    await notificationsService.getPendingActions({uuid: 'uuid', role: 'hr'});
    sinon.assert.calledOnce(Customer.count);
    sinon.assert.calledOnce(Dependent.count);
  });

  it('getPendingActions manager test', async function() {
    await notificationsService.getPendingActions({uuid: 'uuid', role: 'manager'});
    sinon.assert.calledOnce(Policy.count);
  });
})
