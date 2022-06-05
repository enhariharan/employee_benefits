"use strict";

const sinon = require('sinon');
const corporateHrsService = require('../services/corporateHrsService')
const {CorporateHR, User} = require('../models');
const argon2 = require('argon2');

describe('corporateHrsService Test Suite', function() {
  before(function() {
    this.sandbox = sinon.createSandbox();
  });

  beforeEach(function() {
    this.sandbox.spy(corporateHrsService);
    this.sandbox.stub(User, 'findOne').resolves({corporateUuid: 'corporateUuid', companyName: 'Sample Broking Company Name'});
    this.sandbox.stub(User, 'bulkCreate').resolves({corporateUuid: 'corporateUuid', companyName: 'Sample Broking Company Name'});
    this.sandbox.stub(CorporateHR, 'findAll').resolves({corporateUuid: 'corporateUuid', companyName: 'Sample Broking Company Name'});
    this.sandbox.stub(CorporateHR, 'findOne').resolves({uuid: 'uuid', empid: 'empid', corporateUuid: 'corporateUuid', companyName: 'Sample Broking Company Name', dataValues: {uuid: 'uuid', empid: 'empid', corporateUuid: 'corporateUuid', companyName: 'Sample Broking Company Name'}});
    this.sandbox.stub(CorporateHR, 'bulkCreate').resolves({corporateUuid: 'corporateUuid', companyName: 'Sample Broking Company Name'});
    this.sandbox.stub(CorporateHR, 'update').resolves({corporateUuid: 'corporateUuid', companyName: 'Sample Broking Company Name'});
    this.sandbox.stub(argon2, 'hash').resolves({corporateUuid: 'corporateUuid', companyName: 'Sample Broking Company Name'});
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  it('addCorporateHrs test', async function() {
    const credentials = {role: 'manager'};
    const corporateHrs = [{firstName: 'firstName', lastName: 'lastName', empid: 'empid', corporateUuid: 'corporateUuid'}];
    await corporateHrsService.addCorporateHrs(credentials, corporateHrs);
    sinon.assert.calledOnce(User.findOne);
    sinon.assert.calledTwice(CorporateHR.findOne);
    sinon.assert.calledOnce(argon2.hash);
    sinon.assert.calledOnce(User.bulkCreate);
    sinon.assert.calledOnce(CorporateHR.bulkCreate);
  });

  it('getCorporateHrByCorporateUuid test', async function() {
    await corporateHrsService.getCorporateHrByCorporateUuid('uuid');
    sinon.assert.calledOnce(CorporateHR.findAll);
  });

  it('getCorporateHrByEmpIdByCorporateUuid test', async function() {
    await corporateHrsService.getCorporateHrByEmpIdByCorporateUuid('empid','corporateUuid');
    sinon.assert.calledOnce(CorporateHR.findOne);
  });

  it('getCorporateHrs test', async function() {
    const credentials = {role: 'manager'};
    const status = 'created';
    const approvalType = 'none';
    await corporateHrsService.getCorporateHrs(credentials,status, approvalType);
    sinon.assert.calledOnce(CorporateHR.findAll);
  });

  it('getCorporateHrByUserUuid test', async function() {
    await corporateHrsService.getCorporateHrByUserUuid('uuid');
    sinon.assert.calledOnce(CorporateHR.findOne);
  });

  it('getCorporateHrByUuid test', async function() {
    await corporateHrsService.getCorporateHrByUuid('uuid');
    sinon.assert.calledOnce(CorporateHR.findOne);
  });

  it('updateCorporateHr test', async function() {
    const credentials = {role: 'manager'};
    const modifiedCorporateHr = {firstName: 'firstName', lastName: 'lastName', empid: 'empid', corporateUuid: 'corporateUuid', status: 'approved'};
    await corporateHrsService.updateCorporateHr(credentials, modifiedCorporateHr);
    sinon.assert.calledOnce(CorporateHR.findOne);
    sinon.assert.calledOnce(CorporateHR.update);
  });
})
