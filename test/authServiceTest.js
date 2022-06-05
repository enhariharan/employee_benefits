"use strict"

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require("sinon-chai");
const jwt = require('jsonwebtoken');
chai.should();
chai.use(sinonChai);

const authService = require('../services/authService');
const { CorporateHR, Customer, Executive, User } = require('../models');

describe('AuthService Test Suite', function() {
  before(function() {
    this.sandbox = sinon.createSandbox();
  });

  beforeEach(function() {
    this.sandbox.stub(Executive, 'findOne').resolves({role: 'manager', data: 'mock return value'});
    this.sandbox.stub(CorporateHR, 'findOne').resolves({role: 'hr', data: 'mock return value'});
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  it('should throw error when req.headers.authorization is empty ', function(done) {
    const originalUrl = 'https://www.visista4u.com/api/v1/customers';
    const method = 'GET';
    const body = {username: 'username', password: 'password', role: 'manager'};
    const req = {headers: {}, originalUrl: originalUrl, method: method, body: body};
    const res = {};
    const next = err => {
      chai.expect(err).to.be.not.null;
      chai.expect(err.status).to.be.not.null;
      chai.expect(err.status).to.be.eql(401);
      chai.expect(err.errCode).to.be.not.null;
      chai.expect(err.errCode).to.be.eql('UnauthorizedAccess');
      chai.expect(err.message).to.be.not.null;
      chai.expect(err.message).to.be.eql('Unauthorized access. No JWT token provided.');
      chai.expect(err.wwwAuthenticate).to.be.not.null;
      chai.expect(err.wwwAuthenticate).to.be.eql('JWT');
      done();
    }
    authService.authorize(req, res, next);
  });

  it('should call JWT.verify() exactly once', function(done) {
    const originalUrl = 'https://www.visista4u.com/api/v1/customers';
    const method = 'GET';
    const body = {username: 'username', password: 'password', role: 'manager'};
    const req = {headers: {authorization: 'jwt'}, originalUrl: originalUrl, method: method, body: body};
    const res = {};
    const next = ignored => {
      this.sandbox.assert.calledOnce(jwt.verify);
      done();
    }
    this.sandbox.stub(jwt, 'verify').returns({data: {username: 'username', password: 'password', role: 'AnIncorrectRole'}});

    authService.authorize(req, res, next);
  });

  it('should call User.findOne() exactly once.', function(done) {
    const originalUrl = 'https://www.visista4u.com/api/v1/customers';
    const method = 'GET';
    const body = {username: 'username', password: 'password', role: 'manager'};
    const req = {headers: {authorization: 'jwt'}, originalUrl: originalUrl, method: method, body: body};
    const res = {};
    const next = ignored => {
      this.sandbox.assert.calledOnce(jwt.verify);
      this.sandbox.assert.calledOnce(User.findOne);
      done();
    }
    this.sandbox.stub(jwt, 'verify').returns({data: 'mock return value', userName: 'fakeUserName'});
    this.sandbox.stub(User, 'findOne').resolves({role: 'executive', data: 'mock return value'});

    authService.authorize(req, res, next);
  });

  it('should pass for executive login.', function(done) {
    const originalUrl = 'https://www.visista4u.com/api/v1/customers';
    const method = 'GET';
    const body = {username: 'username', password: 'password', role: 'executive'};
    const req = {headers: {authorization: 'jwt'}, originalUrl: originalUrl, method: method, body: body};
    const res = {};
    const next = ignored => {
      this.sandbox.assert.calledOnce(jwt.verify);
      this.sandbox.assert.calledOnce(User.findOne);
      this.sandbox.assert.calledOnce(Executive.findOne);
      done();
    }
    this.sandbox.stub(jwt, 'verify').returns({data: 'mock return value', userName: 'fakeUserName'});
    this.sandbox.stub(User, 'findOne').resolves({role: 'executive', data: 'mock return value'});
    authService.authorize(req, res, next);
  });

  it('should pass for manager login.', function(done) {
    const originalUrl = 'https://www.visista4u.com/api/v1/customers';
    const method = 'GET';
    const body = {username: 'username', password: 'password', role: 'executive'};
    const req = {headers: {authorization: 'jwt'}, originalUrl: originalUrl, method: method, body: body};
    const res = {};
    const next = ignored => {
      this.sandbox.assert.calledOnce(jwt.verify);
      this.sandbox.assert.calledOnce(User.findOne);
      this.sandbox.assert.calledOnce(Executive.findOne);
      done();
    }
    this.sandbox.stub(jwt, 'verify').returns({data: 'mock return value', userName: 'fakeUserName'});
    this.sandbox.stub(User, 'findOne').resolves({role: 'manager', data: 'mock return value'});
    authService.authorize(req, res, next);
  });

  it('should pass for hr login.', function(done) {
    const originalUrl = 'https://www.visista4u.com/api/v1/customers';
    const method = 'GET';
    const body = {username: 'username', password: 'password', role: 'executive'};
    const req = {headers: {authorization: 'jwt'}, originalUrl: originalUrl, method: method, body: body};
    const res = {};
    const next = ignored => {
      this.sandbox.assert.calledOnce(jwt.verify);
      this.sandbox.assert.calledOnce(User.findOne);
      sinon.assert.calledOnce(CorporateHR.findOne);
      done();
    }
    this.sandbox.stub(jwt, 'verify').returns({data: 'mock return value', userName: 'fakeUserName'});
    this.sandbox.stub(User, 'findOne').resolves({role: 'hr', data: 'mock return value'});
    authService.authorize(req, res, next);
  });

  it('should pass for customer login.', function(done) {
    const originalUrl = 'https://www.visista4u.com/api/v1/customers';
    const method = 'GET';
    const body = {username: 'username', password: 'password', role: 'executive'};
    const req = {headers: {authorization: 'jwt'}, originalUrl: originalUrl, method: method, body: body};
    const res = {};
    const next = ignored => {
      this.sandbox.assert.calledOnce(jwt.verify);
      this.sandbox.assert.calledOnce(User.findOne);
      this.sandbox.assert.calledOnce(Customer.findOne);
      done();
    }
    this.sandbox.stub(jwt, 'verify').returns({data: 'mock return value', userName: 'fakeUserName'});
    this.sandbox.stub(User, 'findOne').resolves({role: 'customer', data: 'mock return value'});
    this.sandbox.stub(Customer, 'findOne').resolves({role: 'customer', data: 'mock return value'});
    authService.authorize(req, res, next);
  });

  it('should fail with HTTP code 500 when user is present but customer/manager/hr/executive record is not present', function(done) {
    const originalUrl = 'https://www.visista4u.com/api/v1/customers';
    const method = 'GET';
    const body = {username: 'username', password: 'password', role: 'executive'};
    const req = {headers: {authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InV1aWQiOiJjNDVkNzJlOS0yNzJjLTRlOGEtYjRlZC0yNDFiYmI5ZDAzNjUiLCJjb3Jwb3JhdGVVdWlkIjpudWxsLCJicm9raW5nQ29tcGFueVV1aWQiOiJhMTM4Nzg5NC1mMTgyLTQ1ZDktYTllMi0zYTkzNmY5ODRmYzAiLCJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6Im1hbmFnZXIiLCJlbWFpbCI6IiIsIm1vYmlsZSI6IiIsImp3dCI6bnVsbCwiZW1waWQiOiIxMDAwMDAifSwiaWF0IjoxNTk5OTA5NzYxLCJleHAiOjE1OTk5OTYxNjF9.0JsUTuiwJ6icp2aQxz4q_vk0IfVZxFm0Anv9uS93G4s'}, originalUrl: originalUrl, method: method, body: body};
    const res = {};
    const next = err => {
      this.sandbox.assert.calledOnce(jwt.verify);
      this.sandbox.assert.calledOnce(User.findOne);
      this.sandbox.assert.calledOnce(Customer.findOne);
      chai.expect(err).to.be.not.null;
      chai.expect(err.status).to.be.eql(500);
      chai.expect(err.errCode).to.be.eql('DBIntegrityErrorWithUsername');
      chai.expect(err.message).to.be.eql('There is an issue with database integrity. The given username was valid but no corresponding manager/executive/customer/hr record was found.');
      chai.expect(err.wwwAuthenticate).to.be.eql('JWT');
      done();
    }
    this.sandbox.stub(jwt, 'verify').returns({data: 'mock return value', userName: 'fakeUserName'});
    this.sandbox.stub(User, 'findOne').resolves({role: 'customer', data: 'mock return value'});
    this.sandbox.stub(Customer, 'findOne').resolves(undefined);
    authService.authorize(req, res, next);
  });
});