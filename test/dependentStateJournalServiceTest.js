"use strict";

const sinon = require('sinon');
const dependentStateJournalService = require('../services/dependentStateJournalService')
const { DependentStateJournal } = require('../models');

describe('dependentStateJournalService Test Suite', function() {
  before(function() {
    this.sandbox = sinon.createSandbox();
  });

  beforeEach(function() {
    this.sandbox.spy(dependentStateJournalService);
    this.sandbox.stub(DependentStateJournal, 'bulkCreate').resolves([{uuid: 'uuid'}]);
    this.sandbox.stub(DependentStateJournal, 'create').resolves([{uuid: 'uuid'}]);
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  it('recordNewDependents test', async function() {
    const credentials = {role: 'manager'};
    const dependents = [{uuid: 'uuid'}];
    await dependentStateJournalService.recordNewDependents(credentials, dependents);
    sinon.assert.calledOnce(DependentStateJournal.bulkCreate);
  });

  it('recordUpdateDependents test', async function() {
    const credentials = {role: 'manager'};
    const dependent = {uuid: 'uuid'};
    const updatedFields = [{uuid: 'uuid'}];
    await dependentStateJournalService.recordUpdateDependents(credentials, dependent, updatedFields);
    sinon.assert.calledOnce(DependentStateJournal.create);
  });

  it('recordUpdateDependentsBulk test', async function() {
    const credentials = {role: 'manager'};
    const dependents = [{uuid: 'uuid'}];
    await dependentStateJournalService.recordUpdateDependentsBulk(credentials, dependents);
    sinon.assert.calledOnce(DependentStateJournal.bulkCreate);
  });
})
