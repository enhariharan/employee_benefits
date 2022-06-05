"use strict";

const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = require('assert');
const server = require('../../app');

const { v4: uuidv4 } = require('uuid');
const { BrokingCompany, Corporate, Executive, User } = require('../../models');
const argon2 = require('argon2');

chai.use(chaiHttp);
chai.should();

describe('Users test suite', function (ignoreDone) {
  const brokingCompany = {
    uuid: uuidv4(),
    companyName: "test",
    branchAddressBuildingAddress: "test",
    branchAddressCity: "test",
    branchAddressState: "test",
    branchAddressPincode: "test"
  };
  const corporate = {
    uuid: uuidv4(),
    companyName: "test",
    branchAddressBuildingAddress: "test",
    branchAddressCity: "test",
    branchAddressState: "test",
    branchAddressPincode: "test"
  };
  const password = 'password';
  const user = {
    uuid: uuidv4(),
    username: 'sundarc',
    password: password,
    role: "manager",
    brokingCompanyUuid: brokingCompany.uuid
  };
  const executive = {
    uuid: uuidv4(),
    userUuid: user.uuid,
    brokingCompanyUuid: brokingCompany.uuid,
    empid: "test",
    supervisorEmpid: "test",
    designation: "manager",
    firstName: "Sundar",
    lastName: "C"
  };

  beforeEach('Setup table Users with a valid user', function (done) {
    Executive.destroy({/*logging: console.log,*/ where: {uuid: executive.uuid}})
    .then(ignoreVar => { return (user.uuid) ? User.destroy({where: {username: user.username}}) : null; })
    .then(ignoreVar => { return (corporate.uuid) ? Corporate.destroy({where: {uuid: corporate.uuid}}) : null; })
    .then(ignoreVar => { return (brokingCompany.uuid) ? BrokingCompany.destroy({where: {uuid: brokingCompany.uuid}}) : null; })
    .then(ignoreVar => { return argon2.hash(password); })
    .then(p => {
      if (!p) {
        throw 'Hashing password failed.';
      }
      user.password = p;
      return BrokingCompany.create(brokingCompany);
    })
    .then(ignoreVar => {return Corporate.create(corporate);})
    .then(ignoreVar => {return User.create(user);})
    .then(ignoreVar => {return Executive.create(executive);})
    .then(u => {
      if (!u) { throw 'Creating new user failed.'; }
      console.log('Creating new user succeeded.');
      done();
    })
    .catch(e => {
      console.log(e);
      done(e);
    })
  });

  afterEach('Clearing table Users after running test suite', function(done) {
    Executive.destroy({/*logging: console.log,*/ where: {uuid: executive.uuid}})
    .then(ignoreVar => { return (user.uuid) ? User.destroy({where: {username: user.username}}) : null; })
    .then(ignoreVar => { return (corporate.uuid) ? Corporate.destroy({where: {uuid: corporate.uuid}}) : null; })
    .then(ignoreVar => { return (brokingCompany.uuid) ? BrokingCompany.destroy({where: {uuid: brokingCompany.uuid}}) : null; })
    .then(ignoreVar => { done(); })
    .catch(e => {console.log(e); done(e);})
  });

  it('Should pass canary test', function (done) {
    chai.expect(true).to.be.true;
    done();
  });

  it('should login with a valid username and password', function (done) {
      chai.request(server)
      .post('/api/v1/users/login')
      .set("Content-Type", "application/json")
      .send({ "username": user.username, "password": password, "role": user.role, "subdomain": "test.subdomain.com"})
      .end( (err, res) => {
        if (err) {
          console.log('login failed.');
          console.log(err);
          done(err);
        }
        res.should.have.status(200);
        assert(res.body.status === 200);
        assert(res.body.errCode === 'Success');
        assert(res.body.data.user.uuid === user.uuid);
        assert(res.body.data.user.username === user.username);
        assert(res.body.data.user.role === user.role);
        assert(res.body.data.user.jwt);
        done();
      });
  });

  it('should fail with a invalid username', function (done) {
      chai.request(server)
      .post('/api/v1/users/login')
      .set("Content-Type", "application/json")
      .send({ "username": "invalidUserName", "password": password, "role": "hr", "subdomain": "test.subdomain.com"})
      .end( (err, res) => {
        if (err) {
          console.log('login failed.');
          console.log(err);
          done(err);
        }
        res.should.have.status(403);
        assert(res.body.status === 403);
        assert(res.body.errCode === 'IncorrectCredentials');
        assert(res.body.message === 'Incorrect username or password provided.');
        assert(res.body.data.username === 'invalidUserName');
        done();
      });
  });

  it('should fail with a valid username and incorrect password', function (done) {
      chai.request(server)
      .post('/api/v1/users/login')
      .set("Content-Type", "application/json")
      .send({ "username": user.username, "password": "password1", "role": "manager", "subdomain": "test.subdomain.com"})
      .end( (err, res) => {
        if (err) {
          console.log('login failed.');
          console.log(err);
          done(err);
        }
        res.should.have.status(401);
        assert(res.body.status === 401);
        assert(res.body.errCode === 'IncorrectCredentials');
        assert(res.body.message === 'Incorrect username or password provided.');
        assert(res.body.data.username === 'sundarc');
        done();
      });
  });
});
