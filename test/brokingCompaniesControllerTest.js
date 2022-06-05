"use strict";

const sinon = require('sinon');
const brokingCompaniesController = require('../controllers/brokingCompaniesController');
const brokingCompaniesService = require('../services/brokingCompaniesService');

describe('brokingCompaniesController Test Suite', function() {
  before(function() {
    this.sandbox = sinon.createSandbox();
  });

  beforeEach(function() {
    this.sandbox.spy(brokingCompaniesController);
    this.sandbox.stub(brokingCompaniesService, 'getAllBrokingCompanies').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e', companyName: 'Sample Broking Company Name'}]);
    this.sandbox.stub(brokingCompaniesService, 'addBrokingCompanies').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e', companyName: 'Sample Broking Company Name'}]);
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  it('Get Broking Companies controller must call authorize and service layer', async function() {
    const req = {};
    req.headers = {};
    req.headers.authorization = 'mock.jwt.token';

    this.res = {};
    this.res._status = 0;
    this.res._result = null;
    this.res._json = null;
    this.res.status = status => {this.res._status = status;return this.res;};
    this.res.send = result => {this.res._result = result; return this.res._result;};
    this.res.json = json => {this.res._json = json; return this.res._json;};

    await brokingCompaniesController.getAllBrokingCompanies(req, this.res);
    sinon.assert.calledOnce(brokingCompaniesService.getAllBrokingCompanies);
  });

  it('Add Broking Companies controller must call authorize and service layer', async function() {
    const req = {};
    req.headers = {};
    req.headers.authorization = 'mock.jwt.token';

    this.res = {};
    this.res._status = 0;
    this.res._result = null;
    this.res._json = null;
    this.res.status = status => {this.res._status = status;return this.res;};
    this.res.send = result => {this.res._result = result; return this.res._result;};
    this.res.json = json => {this.res._json = json; return this.res._json;};

    await brokingCompaniesController.addBrokingCompanies(req, this.res);
    sinon.assert.calledOnce(brokingCompaniesService.addBrokingCompanies);
  });
});