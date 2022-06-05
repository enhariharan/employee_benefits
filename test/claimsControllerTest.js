"use strict";

const sinon = require('sinon');
const claimsController = require('../controllers/claimsController');
const claimsService = require('../services/claimsService');

describe('claimsController Test Suite', function () {
  before(function () {
    this.sandbox = sinon.createSandbox();
  });

  beforeEach(function () {
    this.sandbox.spy(claimsController);
    this.sandbox.stub(claimsService, 'getAllClaims').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
    this.sandbox.stub(claimsService, 'getClaimByClaimId').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
    this.sandbox.stub(claimsService, 'addClaims').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
    this.sandbox.stub(claimsService, 'addClaimsFromSoapByPolicyByDates').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
    this.sandbox.stub(claimsService, 'getAllSoapClaimsByPolicyByDates').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
    this.sandbox.stub(claimsService, 'mediAssistClaimsByPolicyByDates').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
  });

  afterEach(function () {
    this.sandbox.restore();
  });

  it('getAllClaims test', async function () {
    const req = {};
    req.headers = {};
    req.headers.authorization = 'mock.jwt.token';

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

    await claimsController.getAllClaims(req, this.res);
    sinon.assert.calledOnce(claimsService.getAllClaims);
  });

  it('getClaimByClaimId test', async function () {
    const req = {};
    req.body = {};
    req.headers = {};
    req.headers.authorization = 'mock.jwt.token';
    req.params = {};
    req.params.claimId = 'Claim00007';

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

    await claimsController.getClaimByClaimId(req, this.res);
    sinon.assert.calledOnce(claimsService.getClaimByClaimId);
  });

  it('addClaimsFromSoapByPolicyByDates test', async function () {
    const req = {};
    req.headers = {};
    req.headers.authorization = 'mock.jwt.token';
    req.query = {}
    req.query.policy = 'tempPolicyNumber';
    req.query.fromDate = Date.now();
    req.query.toDate = Date.now();

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

    await claimsController.addClaimsFromSoapByPolicyByDates(req, this.res);
    sinon.assert.calledOnce(claimsService.addClaimsFromSoapByPolicyByDates);
  });

  it('getClaimByClaimId test', async function () {
    const req = {};
    req.body = {};
    req.headers = {};
    req.headers.authorization = 'mock.jwt.token';
    req.params = {};
    req.params.claimId = 'Claim00007';

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

    await claimsController.getClaimByClaimId(req, this.res);
    sinon.assert.calledOnce(claimsService.getClaimByClaimId);
  });

  it('addClaims test', async function () {
    const req = {};
    req.headers = {};
    req.headers.authorization = 'mock.jwt.token';
    req.body = {
      claimId: "Claim00007",
      policyUuid: "afa43592-486f-4619-8b84-8807a1ee1454",
      customerUuid: "1b5dbdcb-b0d2-45c9-9b79-7b2434b333cc",
      ailmentUuid: "7b39c533-0be5-4ed8-a55c-70805ea3d3cc",
      corporateUuid: "b11d253e-3135-48d6-8292-c95f36ba683d",
      treatmentType: "treatment type 2",
      cashless: false,
      reimbursement: true,
      dateOfHospitalization: "2020-05-20T00:00:00.000Z",
      dateOfAdmission: "2019-05-20T00:00:00.000Z",
      dateOfDischarge: "2020-05-29T00:00:00.000Z",
      dateOfSettlement: "2020-05-29T00:00:00.000Z",
      status: "closed",
      initialEstimate: null,
      amountSettled: "100900.00",
      amountApproved: "100900.00",
      amountDisallowed: "540.00",
      denialReason: "",
      disallowanceReason: ""
    }

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

    await claimsController.addClaims(req, this.res);
    sinon.assert.calledOnce(claimsService.addClaims);
  });

  it('viewAllSoapClaimsByPolicyByDates test', async function () {
    const req = {};
    req.headers = {};
    req.headers.authorization = 'mock.jwt.token';
    req.query = {}
    req.query.policy = 'tempPolicyNumber';
    req.query.fromDate = Date.now();
    req.query.toDate = Date.now();

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

    await claimsController.viewAllSoapClaimsByPolicyByDates(req, this.res);
    sinon.assert.calledOnce(claimsService.getAllSoapClaimsByPolicyByDates);
  });

  it('mediAssistClaimsByPolicyByDates test', async function () {
    const req = {};
    req.headers = {};
    req.headers.authorization = 'mock.jwt.token';
    req.query = {}
    req.query.policy = 'tempPolicyNumber';
    req.query.fromDate = Date.now();
    req.query.toDate = Date.now();

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

    await claimsController.mediAssistClaimsByPolicyByDates(req, this.res);
    sinon.assert.calledOnce(claimsService.mediAssistClaimsByPolicyByDates);
  });
});
