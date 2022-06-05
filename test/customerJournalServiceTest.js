"use strict";

const sinon = require('sinon');
const customerJournalService = require('../services/customerJournalService')
const {Corporate, CustomerJournal} = require('../models');

describe('customerJournalService Test Suite', function() {
  before(function() {
    this.sandbox = sinon.createSandbox();
  });

  beforeEach(function() {
    this.sandbox.spy(customerJournalService);
    this.sandbox.stub(CustomerJournal, 'bulkCreate').resolves([{uuid: 'uuid', corporateUuid: 'corporateUuid', companyName: 'Sample Broking Company Name'}]);
    this.sandbox.stub(CustomerJournal, 'create').resolves([{uuid: 'uuid', corporateUuid: 'corporateUuid', companyName: 'Sample Broking Company Name'}]);
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  it('recordNewCustomers test', async function() {
    const credentials = {uuid: 'uuid'};
    const customers = [{uuid: 'uuid1'}];
    await customerJournalService.recordNewCustomers(credentials, customers);
    sinon.assert.calledOnce(CustomerJournal.bulkCreate);
  });

  it('recordUpdateCustomers test', async function() {
    await customerJournalService.recordUpdateCustomers({role: 'manager'},'created');
    sinon.assert.calledOnce(CustomerJournal.create);
  });

  it('recordUpdateDependents test', async function() {
    this.sandbox.stub(Corporate, 'findOne').resolves({uuid: 'uuid', empid: 'empid', corporateUuid: 'corporateUuid', companyName: 'Sample Broking Company Name', dataValues: {uuid: 'uuid', empid: 'empid', corporateUuid: 'corporateUuid', companyName: 'Sample Broking Company Name'}});
    await customerJournalService.recordUpdateDependents({role: 'executive'},'created');
    sinon.assert.calledOnce(CustomerJournal.create);
  });
})
