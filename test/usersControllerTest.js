"use strict";

const sinon = require('sinon');
const usersController = require('../controllers/usersController');
const usersService = require('../services/usersService');

describe('usersController Test Suite', () => {
  before(function () {
    this.sandbox = sinon.createSandbox();
  });

  beforeEach(function () {
    this.sandbox.spy(usersController);
    this.sandbox.stub(usersService, 'login').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
  });

  afterEach(function () {
    this.sandbox.restore();
  });

  it('login test', async function () {
    const req = {};
    req.headers = {authorization: 'mock.jwt.token'};
    req.body = {username: 'username', password: 'password', subdomain: 'test.subdomain'};
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

    await usersController.login(req, this.res);
    sinon.assert.calledOnce(usersService.login);
  });
});
