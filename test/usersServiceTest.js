"use strict";

const sinon = require('sinon');
const usersService = require('../services/usersService')
const {BrokingCompany, Corporate, CorporateHR, Customer, Executive, User} = require('../models');
const argon2 = require('argon2');

describe('usersService Test Suite', function() {
  before(function() {
    this.sandbox = sinon.createSandbox();
  });

  beforeEach(function() {
    this.sandbox.spy(usersService);
    this.sandbox.stub(BrokingCompany, 'findOne').resolves([{uuid: 'uuid'}]);
    this.sandbox.stub(Corporate, 'findOne').resolves([{uuid: 'uuid'}]);
    this.sandbox.stub(User, 'findOne').resolves([{uuid: 'uuid', username: 'username', password: 'password', role: 'manager'}]);
    this.sandbox.stub(Customer, 'findOne').resolves([{uuid: 'uuid'}]);
    this.sandbox.stub(CorporateHR, 'findOne').resolves([{uuid: 'uuid'}]);
    this.sandbox.stub(Executive, 'findOne').resolves([{uuid: 'uuid'}]);
    this.sandbox.stub(argon2, 'verify').resolves([{uuid: 'uuid'}]);
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  it('login test', async function() {
    await usersService.login({username: 'username', password: 'password', subdomain: 'test.subdomain'});
    sinon.assert.calledOnce(BrokingCompany.findOne);
    sinon.assert.calledOnce(Corporate.findOne);
    sinon.assert.calledTwice(User.findOne);
    sinon.assert.calledOnce(Customer.findOne);
    sinon.assert.calledOnce(CorporateHR.findOne);
    sinon.assert.calledOnce(Executive.findOne);
    sinon.assert.calledOnce(argon2.verify);
  });
})
