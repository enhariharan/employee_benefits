"use strict";

const sinon = require('sinon');
const notificationsController = require('../controllers/notificationsController');
const notificationsService = require('../services/notificationsService');

describe('notificationsController Test Suite', () => {
  before(function () {
    this.sandbox = sinon.createSandbox();
  });

  beforeEach(function () {
    this.sandbox.spy(notificationsController);
    this.sandbox.stub(notificationsService, 'getPendingActions').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
  });

  afterEach(function () {
    this.sandbox.restore();
  });

  it('getPendingActions test', async function () {
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

    await notificationsController.getPendingActions(req, this.res);
    sinon.assert.calledOnce(notificationsService.getPendingActions);
  });
});
