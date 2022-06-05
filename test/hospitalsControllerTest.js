"use strict";

const sinon = require('sinon');
const hospitalsController = require('../controllers/hospitalsController')
const hospitalsService = require('../services/hospitalsService');
const cron = require('../helpers/cron');
const authService = require('../services/authService');


describe('hospitalsController Test Suite', () => {
  before(function () {
    this.sandbox = sinon.createSandbox();
  });

  beforeEach(function () {
    this.sandbox.spy(hospitalsController);
    this.sandbox.stub(hospitalsService, 'getNonNetworkHospitals').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
    this.sandbox.stub(hospitalsService, 'getNetworkHospitals').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
    this.sandbox.stub(hospitalsService, 'addNonNetworkHospitals').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
    this.sandbox.stub(hospitalsService, 'addNetworkHospitalsFromSoap').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
    this.sandbox.stub(hospitalsService, 'searchNetworkHospitalNames').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
    this.sandbox.stub(hospitalsService, 'searchNetworkHospitalCities').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
    this.sandbox.stub(hospitalsService, 'searchNetworkHospitalPincodes').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
    this.sandbox.stub(hospitalsService, 'searchNonNetworkHospitals').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
    this.sandbox.stub(cron, 'loadNetworkHospital').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
  });

  afterEach(function () {
    this.sandbox.restore();
  });

  it('getNonNetworkHospitals test', async function () {
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

    this.sandbox.stub(authService, 'authorize').resolves({details: null});
    await hospitalsController.getNonNetworkHospitals(req, this.res);
    sinon.assert.calledOnce(hospitalsService.getNonNetworkHospitals);
  });

  it('getNetworkHospitals test', async function () {
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

    this.sandbox.stub(authService, 'authorize').resolves({details: null});
    await hospitalsController.getNetworkHospitals(req, this.res);
    sinon.assert.calledOnce(hospitalsService.getNetworkHospitals);
  });

  it('addNonNetworkHospitals test', async function () {
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

    this.sandbox.stub(authService, 'authorize').resolves({details: null});
    await hospitalsController.addNonNetworkHospitals(req, this.res);
    sinon.assert.calledOnce(hospitalsService.addNonNetworkHospitals);
  });

  it('addNetworkHospitalsFromSoap test', async function () {
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

    this.sandbox.stub(authService, 'authorize').resolves({details: null});
    await hospitalsController.addNetworkHospitalsFromSoap(req, this.res);
    sinon.assert.calledOnce(hospitalsService.addNetworkHospitalsFromSoap);
  });

  it('searchNetworkHospitals by Name test', async function () {
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

    req.query.hospitalName = 'name';
    await hospitalsController.searchNetworkHospitals(req, this.res);
    sinon.assert.calledOnce(hospitalsService.searchNetworkHospitalNames);
  });

  it('searchNetworkHospitals by city test', async function () {
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

    req.query.city = 'city';
    await hospitalsController.searchNetworkHospitals(req, this.res);
    sinon.assert.calledOnce(hospitalsService.searchNetworkHospitalCities);
  });

  it('searchNetworkHospitals by pincode test', async function () {
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

    req.query.pincode = 'pincode';
    await hospitalsController.searchNetworkHospitals(req, this.res);
    sinon.assert.calledOnce(hospitalsService.searchNetworkHospitalPincodes);
  });

  it('searchNonNetworkHospitals test', async function () {
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

    req.query.name = 'hospital name';
    await hospitalsController.searchNonNetworkHospitals(req, this.res);
    sinon.assert.calledOnce(hospitalsService.searchNonNetworkHospitals);
  });

  it('addNetworkHospitalByCron test', async function () {
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

    req.query.name = 'hospital name';
    this.sandbox.stub(authService, 'authorize').resolves({details: null});
    await hospitalsController.addNetworkHospitalByCron(req, this.res);
    sinon.assert.calledOnce(cron.loadNetworkHospital);
  });
});
