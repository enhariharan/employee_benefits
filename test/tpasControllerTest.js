"use strict";

const sinon = require('sinon');
const tpasController = require('../controllers/tpasController');
const tpasService = require('../services/tpasService');
const authService = require('../services/authService');

describe('tpasController Test Suite', () => {
  before(function () {
    this.sandbox = sinon.createSandbox();
  });

  beforeEach(function () {
    this.sandbox.spy(tpasController);
    this.sandbox.stub(tpasService, 'getAllTpas').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
    this.sandbox.stub(tpasService, 'addTpas').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
  });

  afterEach(function () {
    this.sandbox.restore();
  });

  it('getAllTpas test', async function () {
    const req = {};
    req.headers = {authorization: 'mock.jwt.token'};
    req.body = [{uuid: "afa43592-486f-4619-8b84-8807a1ee1454"}];
    req.params = {policyId: 'id'};

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
    await tpasController.getAllTpas(req, this.res);
    sinon.assert.calledOnce(tpasService.getAllTpas);
  });

  it('addTpas test', async function () {
    const req = {};
    req.headers = {authorization: 'mock.jwt.token'};
    req.body = [{uuid: "afa43592-486f-4619-8b84-8807a1ee1454"}];
    req.params = {policyId: 'id'};

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
    await tpasController.addTpas(req, this.res);
    sinon.assert.calledOnce(tpasService.addTpas);
  });
});
