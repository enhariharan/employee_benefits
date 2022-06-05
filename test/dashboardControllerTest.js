"use strict";

const sinon = require('sinon');
const dashboardController = require('../controllers/dashboardController')
const dashboardService = require('../services/dashboardService')

describe('dashboardController Test Suite', () => {
  before(function () {
    this.sandbox = sinon.createSandbox();
  });

  beforeEach(function () {
    this.sandbox.spy(dashboardController);
    this.sandbox.stub(dashboardService, 'getCorporateClaimAnalytics').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
    this.sandbox.stub(dashboardService, 'getCorporatePolicyAnalytics').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
  });

  afterEach(function () {
    this.sandbox.restore();
  });

  it('getCorporateClaimAnalytics test', async function () {
    const req = {};
    req.query = {};

    this.res = {};
    this.res._status = 0;
    this.res._result = null;
    this.res.status = status => {
      this.res._status = status;
      return this.res;
    };
    this.res.send = result => {
      this.res._result = result;
      return this.res._result;
    };

    await dashboardController.getCorporateClaimAnalytics(req, this.res);
    sinon.assert.calledOnce(dashboardService.getCorporateClaimAnalytics);
  })

  it('getCorporatePolicyAnalytics test', async function () {
    const req = {};
    req.query = {};

    this.res = {};
    this.res._status = 0;
    this.res._result = null;
    this.res.status = status => {
      this.res._status = status;
      return this.res;
    };
    this.res.send = result => {
      this.res._result = result;
      return this.res._result;
    };

    await dashboardController.getCorporatePolicyAnalytics(req, this.res);
    sinon.assert.calledOnce(dashboardService.getCorporatePolicyAnalytics);
  })
})
