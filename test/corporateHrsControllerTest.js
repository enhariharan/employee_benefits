"use strict";

const sinon = require('sinon');
const corporateHrsController = require('../controllers/corporateHrsController');
const corporateHrsService = require('../services/corporateHrsService');

describe('corporateHrsController Test Suite', () => {
  before(function () {
    this.sandbox = sinon.createSandbox();
  });

  beforeEach(function () {
    this.sandbox.spy(corporateHrsController);
    this.sandbox.stub(corporateHrsService, 'addCorporateHrs').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
    this.sandbox.stub(corporateHrsService, 'getCorporateHrs').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
    this.sandbox.stub(corporateHrsService, 'getCorporateHrByEmpIdByCorporateUuid').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
    this.sandbox.stub(corporateHrsService, 'updateCorporateHr').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
  });

  afterEach(function () {
    this.sandbox.restore();
  });

  it('addCorporateHrs test', async function () {
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

    await corporateHrsController.addCorporateHrs(req, this.res);
    sinon.assert.calledOnce(corporateHrsService.addCorporateHrs);
  })

  it('getCorporateHrs test', async function () {
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

    await corporateHrsController.getCorporateHrs(req, this.res);
    sinon.assert.calledOnce(corporateHrsService.getCorporateHrs);
  })

  it('getCorporateHrByEmpIdByCorporateUuid test', async function () {
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

    await corporateHrsController.getCorporateHrByEmpIdByCorporateUuid(req, this.res);
    sinon.assert.calledOnce(corporateHrsService.getCorporateHrByEmpIdByCorporateUuid);
  })

  it('updateCorporateHr test', async function () {
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

    await corporateHrsController.updateCorporateHr(req, this.res);
    sinon.assert.calledOnce(corporateHrsService.updateCorporateHr);
  })
})
