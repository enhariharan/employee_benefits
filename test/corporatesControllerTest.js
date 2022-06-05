"use strict";

const sinon = require('sinon');
const corporatesController = require('../controllers/corporatesController');
const corporatesService = require('../services/corporatesService');
const corporateHrsService = require('../services/corporateHrsService');
const commonService = require('../services/commonService');

describe('corporatesController Test Suite', () => {
  before(function () {
    this.sandbox = sinon.createSandbox();
  });

  beforeEach(function () {
    this.sandbox.spy(corporatesController);
    this.sandbox.stub(corporatesService, 'addCorporates').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
    this.sandbox.stub(corporatesService, 'getCorporates').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
    this.sandbox.stub(corporateHrsService, 'addCorporateHrs').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
    this.sandbox.stub(corporatesService, 'searchCorporates').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
    this.sandbox.stub(corporatesService, 'updateCorporate').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
    this.sandbox.stub(commonService, 'getAllCorporatesExecutivesList').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
    // this.sandbox.stub(CorporateHR, 'findOne').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
    // this.sandbox.stub(User, 'findOne').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
  });

  afterEach(function () {
    this.sandbox.restore();
  });

  it('addCorporates test', async function () {
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

    await corporatesController.addCorporates(req, this.res);
    sinon.assert.calledOnce(corporatesService.addCorporates);
  })

  it('getCorporates test', async function () {
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

    await corporatesController.getCorporates(req, this.res);
    sinon.assert.calledOnce(corporatesService.getCorporates);
  })

  it('addHRsByCorporate test', async function () {
    const req = {decodedTokenData: {role: 'manager'}};
    req.params = {uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'};
    req.headers = {};
    req.headers.authorization = 'mock.jwt.token';
    req.body = [{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}];

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

    await corporatesController.addHRsByCorporate(req, this.res);
    sinon.assert.calledOnce(corporateHrsService.addCorporateHrs);
  })

  it('updateCorporate test', async function () {
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

    await corporatesController.updateCorporate(req, this.res);
    sinon.assert.calledOnce(corporatesService.updateCorporate);
  })

  it('getAllCorporatesExecutivesList test', async function () {
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

    await corporatesController.getAllCorporatesExecutivesList(req, this.res);
    sinon.assert.calledOnce(commonService.getAllCorporatesExecutivesList);
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

    await corporatesController.updateCorporate(req, this.res);
    sinon.assert.calledOnce(corporatesService.updateCorporate);
  })
})
