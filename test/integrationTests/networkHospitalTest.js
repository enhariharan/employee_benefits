"use strict";

const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = require('assert');
const server = require('../../app');

const { v4: uuidv4 } = require('uuid');
const { BrokingCompany, Corporate, Executive, InsuranceCompany, NetworkHospital, TPA, User } = require('../../models');
const argon2 = require('argon2');

chai.use(chaiHttp);
chai.should();

describe('Network Hospitals test suite', function (ignoreDone) {
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
  const tpa = {
    uuid: uuidv4(),
    tpaid: 'NHTestTPA',
    companyName: 'test',
    branchAddressBuildingAddress: 'test',
    branchAddressCity: 'test',
    branchAddressState: 'test',
    branchAddressPincode: 'test'
  };
  const insuranceCompany = {
    uuid: uuidv4(),
    companyName: 'test',
    branchAddressBuildingAddress: 'test',
    branchAddressCity: 'test',
    branchAddressState: 'test',
    branchAddressPincode: 'test'
  };
  const networkHospital = {
    uuid: uuidv4(),
    hospitalId: (Math.random()*1000)+2000,
    tpaUuid: tpa.uuid,
    insuranceCompanyUuid: insuranceCompany.uuid,
    name: 'hospital name',
    branchCode: '1',
    addressBuildingName: 'Building 1',
    addressBuildingAddress: 'Address 1',
    addressStreet: 'Address Street',
    addressCity: 'Address city',
    addressDistrict: 'Address District',
    addressState: 'Address State',
    addressPincode: '500012',
    lat: 23.561234,
    long: 76.123456,
    contactFirstName: 'FirstName',
    contactLastName: 'LastName',
    contactMobile: '+911234567890',
    contactEmail: 'email@domain.com',
    contactGstNumber: 'ASCDE1234567CNV',
    levelOfCare: 'Test',
    networkType: 'Test',
  };
  let jwt;

  beforeEach('Setup tables with a valid network hospital', function (done) {
    NetworkHospital.destroy({/*logging: console.log, */where: {uuid: networkHospital.uuid}})
    .then(ignoreVar => { return Executive.destroy({/*logging: console.log, */where: {uuid: executive.uuid}}); })
    .then(ignoreVar => { return User.destroy({/*logging: console.log, */where: {uuid: user.uuid}}); })
    .then(ignoreVar => { return Corporate.destroy({/*logging: console.log, */where: {uuid: corporate.uuid}}); })
    .then(ignoreVar => { return InsuranceCompany.destroy({/*logging: console.log, */where: {uuid: insuranceCompany.uuid}}); })
    .then(ignoreVar => { return TPA.destroy({/*logging: console.log, */where: {uuid: tpa.uuid}}); })
    .then(ignoreVar => { return BrokingCompany.destroy({/*logging: console.log, */where: {uuid: brokingCompany.uuid}}); })
    .then(ignoreVar => { return argon2.hash(password); })
    .then(p => {
      if (!p) {throw 'Hashing password failed.';}
      user.password = p;
      return BrokingCompany.create(brokingCompany/*, {logging: console.log}*/);
    })
    .then(ignoreVar => {return TPA.create(tpa/*, {logging: console.log}*/);})
    .then(ignoreVar => {return InsuranceCompany.create(insuranceCompany/*, {logging: console.log}*/);})
    .then(ignoreVar => {return Corporate.create(corporate/*, {logging: console.log}*/);})
    .then(ignoreVar => {return User.create(user/*, {logging: console.log}*/);})
    .then(ignoreVar => {return Executive.create(executive/*, {logging: console.log}*/);})
    .then(ignoreVar => {return NetworkHospital.create(networkHospital/*, {logging: console.log}*/);})
    .then(u => {
      if (!u) { throw 'Creating new user failed.'; }
      console.log('Creating new network hospital succeeded.');
      // Login and get valid JWT token
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
        jwt = res.body.data.user.jwt;
        this.jwt = res.body.data.user.jwt;

        setTimeout(done, 10);
      });
    })
    .catch(e => {
      console.log(e);
      done(e);
    })
  });

  afterEach('Clear up  tables after running test suite', function(done) {
    NetworkHospital.destroy({/*logging: console.log, */where: {uuid: networkHospital.uuid}})
    .then(ignoreVar => { return Executive.destroy({/*logging: console.log, */where: {uuid: executive.uuid}}); })
    .then(ignoreVar => { return User.destroy({/*logging: console.log, */where: {uuid: user.uuid}}); })
    .then(ignoreVar => { return Corporate.destroy({/*logging: console.log, */where: {uuid: corporate.uuid}}); })
    .then(ignoreVar => { return InsuranceCompany.destroy({/*logging: console.log, */where: {uuid: insuranceCompany.uuid}}); })
    .then(ignoreVar => { return TPA.destroy({/*logging: console.log, */where: {uuid: tpa.uuid}}); })
    .then(ignoreVar => { return BrokingCompany.destroy({/*logging: console.log, */where: {uuid: brokingCompany.uuid}}); })
    .then(ignoreVar => { setTimeout(done, 10); })
    .catch(e => {console.log(e);})
  });

  it('Should pass canary test', function (done) {
    chai.expect(true).to.be.true;
    done();
  });

  it('search by city', function (done) {
    chai.request(server)
    .get(`/api/v1/networkHospitals/search?city=${networkHospital.addressCity}`)
    .set("Content-Type", "application/json")
    .set("Authorization", this.jwt)
    .end( (err, res) => {
      if (err) {
        console.log('login failed.');
        console.log(err);
        done(err);
      }
      res.should.have.status(200);
      assert(res.body.status === 200);
      assert(res.body.errCode.match(/Success/i));
      assert(res.body.data);
      assert(res.body.data.length >= 1);
      assert(res.body.data.find(city => city.match(networkHospital.addressCity)));
      setTimeout(done, 10);
    });
  });

  it('search by city substr', function (done) {
    chai.request(server)
    .get(`/api/v1/networkHospitals/search?city=Addr`)
    .set("Content-Type", "application/json")
    .set("Authorization", this.jwt)
    .end( (err, res) => {
      if (err) {
        console.log('login failed.');
        console.log(err);
        done(err);
      }
      res.should.have.status(200);
      assert(res.body.status === 200);
      assert(res.body.errCode.match(/Success/i));
      assert(res.body.data);
      assert(res.body.data.length >= 1);
      assert(res.body.data.find(city => city.match(networkHospital.addressCity)));
      setTimeout(done, 10);
    });
  });

  it('search by city substr with trailing and leading spaces', function (done) {
    chai.request(server)
    .get(`/api/v1/networkHospitals/search?city=%20%20%20%20%20%20%20Addr%20%20%20%20%20%20%20%20%20`)
    .set("Content-Type", "application/json")
    .set("Authorization", this.jwt)
    .end( (err, res) => {
      if (err) {
        console.log('login failed.');
        console.log(err);
        done(err);
      }
      res.should.have.status(200);
      assert(res.body.status === 200);
      assert(res.body.errCode.match(/Success/i));
      assert(res.body.data);
      assert(res.body.data.length >= 1);
      assert(res.body.data.find(city => city.match(networkHospital.addressCity)));
      setTimeout(done, 10);
    });
  });

  it('search by city case insensitive', function (done) {
    chai.request(server)
    .get(`/api/v1/networkHospitals/search?city=%20%20%20%20%20%20%20address city%20%20%20%20%20%20%20%20%20`)
    .set("Content-Type", "application/json")
    .set("Authorization", this.jwt)
    .end( (err, res) => {
      if (err) {
        console.log('login failed.');
        console.log(err);
        done(err);
      }
      res.should.have.status(200);
      assert(res.body.status === 200);
      assert(res.body.errCode.match(/Success/i));
      assert(res.body.data);
      assert(res.body.data.length >= 1);
      assert(res.body.data.find(city => city.match(networkHospital.addressCity)));
      setTimeout(done, 10);
    });
  });

  it('search by hospital name', function (done) {
    chai.request(server)
    .get(`/api/v1/networkHospitals/search?hospitalName=${networkHospital.name}`)
    .set("Content-Type", "application/json")
    .set("Authorization", this.jwt)
    .end( (err, res) => {
      if (err) {
        console.log('login failed.');
        console.log(err);
        done(err);
      }
      res.should.have.status(200);
      assert(res.body.status === 200);
      assert(res.body.errCode.match(/Success/i));
      assert(res.body.data);
      assert(res.body.data.length >= 1);
      assert(res.body.data.find(name => name.match(networkHospital.name)));
      setTimeout(done, 10);
    });
  });

  it('search by hospital name substr', function (done) {
    chai.request(server)
    .get(`/api/v1/networkHospitals/search?hospitalName=Hosp`)
    .set("Content-Type", "application/json")
    .set("Authorization", this.jwt)
    .end( (err, res) => {
      if (err) {
        console.log('login failed.');
        console.log(err);
        done(err);
      }
      res.should.have.status(200);
      assert(res.body.status === 200);
      assert(res.body.errCode.match(/Success/i));
      assert(res.body.data);
      assert(res.body.data.length >= 1);
      assert(res.body.data.find(name => name.match(networkHospital.name)));
      setTimeout(done, 10);
    });
  });

  it('search by hospital name substr with trailing and leading spaces', function (done) {
    chai.request(server)
    .get(`/api/v1/networkHospitals/search?hospitalName=%20%20%20%20%20%20%20Hosp%20%20%20%20%20%20%20%20%20`)
    .set("Content-Type", "application/json")
    .set("Authorization", this.jwt)
    .end( (err, res) => {
      if (err) {
        console.log('login failed.');
        console.log(err);
        done(err);
      }
      res.should.have.status(200);
      assert(res.body.status === 200);
      assert(res.body.errCode.match(/Success/i));
      assert(res.body.data);
      assert(res.body.data.length >= 1);
      assert(res.body.data.find(name => name.match(networkHospital.name)));
      setTimeout(done, 10);
    });
  });

  it('search by hospital name case insensitive', function (done) {
    chai.request(server)
    .get(`/api/v1/networkHospitals/search?hospitalName=%20%20%20%20%20%20%20hospital na%20%20%20%20%20%20%20%20%20`)
    .set("Content-Type", "application/json")
    .set("Authorization", this.jwt)
    .end( (err, res) => {
      if (err) {
        console.log('login failed.');
        console.log(err);
        done(err);
      }
      res.should.have.status(200);
      assert(res.body.status === 200);
      assert(res.body.errCode.match(/Success/i));
      assert(res.body.data);
      assert(res.body.data.length >= 1);
      assert(res.body.data.find(name => name.match(networkHospital.name)));
      setTimeout(done, 10);
    });
  });

  it('search by pincode', function (done) {
    chai.request(server)
    .get(`/api/v1/networkHospitals/search?pincode=${networkHospital.addressPincode}`)
    .set("Content-Type", "application/json")
    .set("Authorization", this.jwt)
    .end( (err, res) => {
      if (err) {
        console.log('login failed.');
        console.log(err);
        done(err);
      }
      res.should.have.status(200);
      assert(res.body.status === 200);
      assert(res.body.errCode.match(/Success/i));
      assert(res.body.data);
      assert(res.body.data.length >= 1);
      assert(res.body.data.find(p => p.match(networkHospital.addressPincode)));
      setTimeout(done, 10);
    });
  });

  it('search by pincode substr', function (done) {
    chai.request(server)
    .get(`/api/v1/networkHospitals/search?pincode=50001`)
    .set("Content-Type", "application/json")
    .set("Authorization", this.jwt)
    .end( (err, res) => {
      if (err) {
        console.log('login failed.');
        console.log(err);
        done(err);
      }
      res.should.have.status(200);
      assert(res.body.status === 200);
      assert(res.body.errCode.match(/Success/i));
      assert(res.body.data);
      assert(res.body.data.length >= 1);
      assert(res.body.data.find(p => p.match(networkHospital.addressPincode)));
      setTimeout(done, 10);
    });
  });

  it('search by pincode with trailing and leading spaces', function (done) {
    chai.request(server)
    .get(`/api/v1/networkHospitals/search?pincode=%20%20%20%20%20%20%20500012%20%20%20%20%20%20%20%20%20`)
    .set("Content-Type", "application/json")
    .set("Authorization", this.jwt)
    .end( (err, res) => {
      if (err) {
        console.log('login failed.');
        console.log(err);
        done(err);
      }
      res.should.have.status(200);
      assert(res.body.status === 200);
      assert(res.body.errCode.match(/Success/i));
      assert(res.body.data);
      assert(res.body.data.length >= 1);
      assert(res.body.data.find(p => p.match(networkHospital.addressPincode)));
      setTimeout(done, 10);
    });
  });

});
