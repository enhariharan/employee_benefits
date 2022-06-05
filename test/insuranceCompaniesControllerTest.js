"use strict";

const sinon = require('sinon');
const insuranceCompaniesController = require('../controllers/insuranceCompaniesController');
const insuranceCompaniesService = require('../services/insuranceCompaniesService');
const authService = require('../services/authService');

describe('insuranceCompaniesController Test Suite', () => {
  before(function () {
    this.sandbox = sinon.createSandbox();
  });

  beforeEach(function () {
    this.sandbox.spy(insuranceCompaniesController);
    this.sandbox.stub(insuranceCompaniesService, 'getAllInsuranceCompanies').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
    this.sandbox.stub(insuranceCompaniesService, 'addInsuranceCompanies').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
  });

  afterEach(function () {
    this.sandbox.restore();
  });

  it('getAllInsuranceCompanies test', async function () {
    const req = {};
    req.body = {};
    req.headers = {};
    req.headers.authorization = 'mock.jwt.token';
    req.query = {};
    req.query.status = 'created';
    req.query.approvalType = 'active';

    this.res = {};
    this.res._status = 0;
    this.res._result = null;
    this.res._json = null;
    this.res.status = status => {
      this.res._status = status;
      return this.res;
    };
    this.res.send = result => {
      this.res._result = result;
      return this.res._result;
    };
    this.res.json = json => {
      this.res._json = json;
      return this.res._json;
    };

    this.sandbox.stub(authService, 'authorize').resolves({details: null});
    await insuranceCompaniesController.getAllInsuranceCompanies(req, this.res);
    sinon.assert.calledOnce(insuranceCompaniesService.getAllInsuranceCompanies);
  });

  it('addInsuranceCompanies test', async function () {
    const req = {};
    req.body = {};
    req.headers = {};
    req.headers.authorization = 'mock.jwt.token';
    req.query = {};
    req.query.status = 'created';
    req.query.approvalType = 'active';

    this.res = {};
    this.res._status = 0;
    this.res._result = null;
    this.res._json = null;
    this.res.status = status => {
      this.res._status = status;
      return this.res;
    };
    this.res.send = result => {
      this.res._result = result;
      return this.res._result;
    };
    this.res.json = json => {
      this.res._json = json;
      return this.res._json;
    };

    this.sandbox.stub(authService, 'authorize').resolves({details: null});
    await insuranceCompaniesController.addInsuranceCompanies(req, this.res);
    sinon.assert.calledOnce(insuranceCompaniesService.addInsuranceCompanies);
  });
});
