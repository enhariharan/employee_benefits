"use strict";

const sinon = require('sinon');
const argon2 = require('argon2')
const executivesService = require('../services/executivesService')
const { Executive, User, ExecutiveCorporateMapping, EmployeeGrievance, InsuranceEnquiry } = require('../models');

describe('executivesService Test Suite', function() {
  before(function() {
    this.sandbox = sinon.createSandbox();
  });

  beforeEach(function() {
    this.sandbox.spy(executivesService);
    this.sandbox.stub(argon2, 'hash').resolves([{uuid: 'uuid'}]);
    this.sandbox.stub(EmployeeGrievance, 'update').resolves([{uuid: 'uuid'}]);
    this.sandbox.stub(Executive, 'bulkCreate').resolves([{uuid: 'uuid'}]);
    this.sandbox.stub(Executive, 'findAll').resolves([{uuid: 'uuid'}]);
    this.sandbox.stub(Executive, 'findOne').resolves([{uuid: 'uuid'}]);
    this.sandbox.stub(ExecutiveCorporateMapping, 'create').resolves([{uuid: 'uuid'}]);
    this.sandbox.stub(ExecutiveCorporateMapping, 'destroy').resolves([{uuid: 'uuid'}]);
    this.sandbox.stub(ExecutiveCorporateMapping, 'findAll').resolves([{uuid: 'uuid'}]);
    this.sandbox.stub(InsuranceEnquiry, 'update').resolves([{uuid: 'uuid'}]);
    this.sandbox.stub(User, 'bulkCreate').resolves([{uuid: 'uuid'}]);
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  it('getExecutives manager test', async function() {
    const credentials = {role: 'manager'};
    const queryParams = [{empid: 'empid', brokingCompanyUuid: 'brokingCompanyUuid'}];
    await executivesService.getExecutives(credentials, queryParams);
    sinon.assert.calledOnce(Executive.findAll);
  });

  it('getExecutives executive test', async function() {
    const credentials = {role: 'executive'};
    const queryParams = [{empid: 'empid', brokingCompanyUuid: 'brokingCompanyUuid'}];
    await executivesService.getExecutives(credentials, queryParams);
    sinon.assert.calledOnce(Executive.findAll);
  });

  it('getAllExecutivesByBrokingCompanyUuid test', async function() {
    const brokingCompanyUuid = 'brokingCompanyUuid';
    await executivesService.getAllExecutivesByBrokingCompanyUuid(brokingCompanyUuid);
    sinon.assert.calledOnce(Executive.findAll);
  });

  it('getExecutiveByEmpId test', async function() {
    const empid = 'empid';
    await executivesService.getExecutivesByEmpId(empid);
    sinon.assert.calledOnce(Executive.findAll);
  });

  it('getExecutiveMappedCorportatesByUUid test', async function() {
    const uuid = 'uuid';
    await executivesService.getExecutiveMappedCorportatesByUUid(uuid);
    sinon.assert.calledOnce(ExecutiveCorporateMapping.findAll);
  });

  it('getExecutiveByUserUuid test', async function() {
    const uuid = 'uuid';
    await executivesService.getExecutiveByUserUuid(uuid);
    sinon.assert.calledOnce(Executive.findOne);
  });

  it('addExecutives test', async function() {
    const executives = [{uuid: 'uuid'}];
    await executivesService.addExecutives(executives);
    sinon.assert.calledOnce(Executive.findOne);
    sinon.assert.calledOnce(argon2.hash);
    sinon.assert.calledOnce(User.bulkCreate);
    sinon.assert.calledOnce(Executive.bulkCreate);
  });

  it('updateCorporateExecutives test', async function() {
    const corporateUuid = 'corporateUuid';
    const executiveUuid = 'executiveUuid';
    await executivesService.updateCorporateExecutives(corporateUuid, executiveUuid);
    sinon.assert.calledOnce(ExecutiveCorporateMapping.destroy);
    sinon.assert.calledOnce(ExecutiveCorporateMapping.create);
  });

  it('updateEmployeeReportedIssue test', async function() {
    const executiveUuid = 'executiveUuid';
    const complaintId = 'complaintId';
    const status = 'status';
    const resolution = 'resolution';
    const resolvedDate = 'resolvedDate';

    await executivesService.updateEmployeeReportedIssue(executiveUuid, complaintId, status, resolution, resolvedDate);
    sinon.assert.calledOnce(EmployeeGrievance.update);
  });

  it('updateEmployeeReportedCallback test', async function() {
    const executiveUuid = 'executiveUuid';
    const requestId = 'requestId';
    const status = 'status';
    const comments = 'comments';

    await executivesService.updateEmployeeReportedCallback(executiveUuid, requestId, status, comments);
    sinon.assert.calledOnce(InsuranceEnquiry.update);
  });
})
