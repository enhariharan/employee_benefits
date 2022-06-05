"use strict";

const sinon = require('sinon');
const executivesController = require('../controllers/executivesController');
const commonService = require('../services/commonService');
const executivesService = require('../services/executivesService');

describe('executivesController test suite', () => {
  before(function () {
    this.sandbox = sinon.createSandbox();
  });

  beforeEach(function () {
    this.sandbox.spy(executivesController);
    this.sandbox.stub(executivesService, 'getExecutives').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
    this.sandbox.stub(executivesService, 'addExecutives').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
    this.sandbox.stub(executivesService, 'updateCorporateExecutives').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
    this.sandbox.stub(executivesService, 'getExecutiveMappedCorportatesByUUid').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
    this.sandbox.stub(commonService, 'getAllEmployeeReportedIssues').resolves({status: 200});
    this.sandbox.stub(commonService, 'getAllEmployeeRequestedCallbacks').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
    this.sandbox.stub(executivesService, 'updateEmployeeReportedIssue').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
    this.sandbox.stub(executivesService, 'updateEmployeeReportedCallback').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
  });

  afterEach(function () {
    this.sandbox.restore();
  });

  it('getExecutives test', async function () {
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

    await executivesController.getExecutives(req, this.res);
    sinon.assert.calledOnce(executivesService.getExecutives);
  })

  it('addExecutives test', async function () {
    const req = {};
    req.headers = {};
    req.headers.authorization = 'mock.jwt.token';
    req.body = [{uuid: "afa43592-486f-4619-8b84-8807a1ee1454"}]

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

    await executivesController.addExecutives(req, this.res);
    sinon.assert.calledOnce(executivesService.addExecutives);
  })

  it('updateCorporateExecutives test', async function () {
    const req = {};
    req.body = {};
    req.headers = {};
    req.headers.authorization = 'mock.jwt.token';
    req.query = {};
    req.query.corporateUuid = 'uuid';
    req.params = {};
    req.params.empid = 'empid';

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

    await executivesController.updateCorporateExecutives(req, this.res);
    sinon.assert.calledOnce(executivesService.updateCorporateExecutives);
  })

  it('getAllEmployeeReportedIssues test', async function () {
    const req = {decodedTokenData: {role: 'executive', executiveUuid: 'uuid'}};
    req.body = {};
    req.headers = {};
    req.headers.authorization = 'mock.jwt.token';
    req.query = {};
    req.query.corporateUuid = 'uuid';
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

    await executivesController.getAllEmployeeReportedIssues(req, this.res);
    sinon.assert.calledOnce(executivesService.getExecutiveMappedCorportatesByUUid);
    sinon.assert.calledOnce(commonService.getAllEmployeeReportedIssues);
  })

  it('getAllEmployeeRequestedCallbacks test', async function () {
    const req = {decodedTokenData: {role: 'executive', executiveUuid: 'uuid'}};
    req.body = {};
    req.headers = {};
    req.headers.authorization = 'mock.jwt.token';
    req.query = {};
    req.query.corporateUuid = 'uuid';
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

    await executivesController.getAllEmployeeRequestedCallbacks(req, this.res);
    sinon.assert.calledOnce(executivesService.getExecutiveMappedCorportatesByUUid);
    sinon.assert.calledOnce(commonService.getAllEmployeeRequestedCallbacks);
  })

  it('updateEmployeeReportedIssue test', async function () {
    const req = {decodedTokenData: {role: 'executive', executiveUuid: 'uuid'}};
    req.body = {};
    req.headers = {};
    req.headers.authorization = 'mock.jwt.token';
    req.query = {};
    req.query.corporateUuid = 'uuid';
    req.params = {};
    req.params.empid = 'empid';

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

    await executivesController.updateEmployeeReportedIssue(req, this.res);
    sinon.assert.calledOnce(executivesService.updateEmployeeReportedIssue);
  })

  it('updateEmployeeReportedCallback test', async function () {
    const req = {decodedTokenData: {role: 'executive', executiveUuid: 'uuid'}};
    req.body = {};
    req.headers = {};
    req.headers.authorization = 'mock.jwt.token';
    req.query = {};
    req.query.corporateUuid = 'uuid';
    req.params = {};
    req.params.empid = 'empid';

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

    await executivesController.updateEmployeeReportedCallback(req, this.res);
    sinon.assert.calledOnce(executivesService.updateEmployeeReportedCallback);
  })
})
