"use strict";

const sinon = require('sinon');
const policiesController = require('../controllers/policiesController');
const policiesService = require('../services/policiesService');

describe('policiesController Test Suite', () => {
  before(function () {
    this.sandbox = sinon.createSandbox();
  });

  beforeEach(function () {
    this.sandbox.spy(policiesController);
    this.sandbox.stub(policiesService, 'addAilmentsByPolicyId').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
    this.sandbox.stub(policiesService, 'addNetworkHospitalsByPolicyId').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
    this.sandbox.stub(policiesService, 'addPolicies').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
    this.sandbox.stub(policiesService, 'getAilmentsByPolicyId').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
    this.sandbox.stub(policiesService, 'getNetworkHospitalsByPolicyId').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
    this.sandbox.stub(policiesService, 'getPolicies').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
    this.sandbox.stub(policiesService, 'getPolicyByPolicyId').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
    this.sandbox.stub(policiesService, 'getPolicyForExecutiveByPolicyId').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
    this.sandbox.stub(policiesService, 'getPolicyForHrByPolicyId').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
    this.sandbox.stub(policiesService, 'getPolicyForCustomerByPolicyId').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
    this.sandbox.stub(policiesService, 'getPolicyECardForManager').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
    this.sandbox.stub(policiesService, 'getPolicyECardForExecutive').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
    this.sandbox.stub(policiesService, 'getPolicyECardForHr').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
    this.sandbox.stub(policiesService, 'getPolicyECardForCustomer').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
    this.sandbox.stub(policiesService, 'getPolicyECardByPolicyIdByEmpidByCorporateUuid').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
    this.sandbox.stub(policiesService, 'getPolicyECardForExecutiveByPolicyIdByEmpidByCorporateUuid').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
    this.sandbox.stub(policiesService, 'getPolicyECardForHrByPolicyIdByEmpid').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
    this.sandbox.stub(policiesService, 'getPolicyECardForCustomerByPolicyIdByEmpid').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
    this.sandbox.stub(policiesService, 'updatePolicy').resolves([{uuid: '13d1111d-a20b-4804-a59e-1264ddb92a9e'}]);
  });

  afterEach(function () {
    this.sandbox.restore();
  });

  it('addAilmentsByPolicyId test', async function () {
    const req = {decodedTokenData: {role: 'manager'}};
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

    await policiesController.addAilmentsByPolicyId(req, this.res);
    sinon.assert.calledOnce(policiesService.addAilmentsByPolicyId);
  });

  it('addNetworkHospitalsByPolicyId test', async function () {
    const req = {decodedTokenData: {role: 'manager'}};
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

    await policiesController.addNetworkHospitalsByPolicyId(req, this.res);
    sinon.assert.calledOnce(policiesService.addNetworkHospitalsByPolicyId);
  });

  it('addPolicies test', async function () {
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

    await policiesController.addPolicies(req, this.res);
    sinon.assert.calledOnce(policiesService.addPolicies);
  });

  it('getAilmentsByPolicyId test', async function () {
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

    await policiesController.getAilmentsByPolicyId(req, this.res);
    sinon.assert.calledOnce(policiesService.getAilmentsByPolicyId);
  });

  it('getPolicies test', async function () {
    const req = {};
    req.headers = {authorization: 'mock.jwt.token'};
    req.body = [{uuid: "afa43592-486f-4619-8b84-8807a1ee1454"}];
    req.params = {policyId: 'id'};
    req.query = {corporateUuid: 'uuid'};

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

    await policiesController.getPolicies(req, this.res);
    sinon.assert.calledOnce(policiesService.getPolicies);
  });

  it('getPolicyByPolicyId for Manager test', async function () {
    const req = {decodedTokenData: {role: 'manager'}};
    req.headers = {authorization: 'mock.jwt.token'};
    req.body = [{uuid: "afa43592-486f-4619-8b84-8807a1ee1454"}];
    req.params = {policyId: 'id'};
    req.query = {corporateUuid: 'uuid'};

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

    await policiesController.getPolicyByPolicyId(req, this.res);
    sinon.assert.calledOnce(policiesService.getPolicyByPolicyId);
  });

  it('getPolicyByPolicyId for executive test', async function () {
    const req = {decodedTokenData: {role: 'executive'}};
    req.headers = {authorization: 'mock.jwt.token'};
    req.body = [{uuid: "afa43592-486f-4619-8b84-8807a1ee1454"}];
    req.params = {policyId: 'id'};
    req.query = {corporateUuid: 'uuid'};

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

    await policiesController.getPolicyByPolicyId(req, this.res);
    sinon.assert.calledOnce(policiesService.getPolicyForExecutiveByPolicyId);
  });


  it('getPolicyByPolicyId for hr test', async function () {
    const req = {decodedTokenData: {role: 'hr'}};
    req.headers = {authorization: 'mock.jwt.token'};
    req.body = [{uuid: "afa43592-486f-4619-8b84-8807a1ee1454"}];
    req.params = {policyId: 'id'};
    req.query = {corporateUuid: 'uuid'};

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

    await policiesController.getPolicyByPolicyId(req, this.res);
    sinon.assert.calledOnce(policiesService.getPolicyForHrByPolicyId);
  });

  it('getPolicyByPolicyId for customer test', async function () {
    const req = {decodedTokenData: {role: 'customer'}};
    req.headers = {authorization: 'mock.jwt.token'};
    req.body = [{uuid: "afa43592-486f-4619-8b84-8807a1ee1454"}];
    req.params = {policyId: 'id'};
    req.query = {corporateUuid: 'uuid'};

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

    await policiesController.getPolicyByPolicyId(req, this.res);
    sinon.assert.calledOnce(policiesService.getPolicyForCustomerByPolicyId);
  });

  it('getPolicyECard for manager test', async function () {
    const req = {decodedTokenData: {role: 'manager'}};
    req.headers = {authorization: 'mock.jwt.token'};
    req.body = [{uuid: "afa43592-486f-4619-8b84-8807a1ee1454"}];
    req.params = {policyId: 'id'};
    req.query = {corporateUuid: 'uuid'};

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

    await policiesController.getPolicyECard(req, this.res);
    sinon.assert.calledOnce(policiesService.getPolicyECardForManager);
  });

  it('getPolicyECard for executive test', async function () {
    const req = {decodedTokenData: {role: 'executive'}};
    req.headers = {authorization: 'mock.jwt.token'};
    req.body = [{uuid: "afa43592-486f-4619-8b84-8807a1ee1454"}];
    req.params = {policyId: 'id'};
    req.query = {corporateUuid: 'uuid'};

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

    await policiesController.getPolicyECard(req, this.res);
    sinon.assert.calledOnce(policiesService.getPolicyECardForExecutive);
  });

  it('getPolicyECard for hr test', async function () {
    const req = {decodedTokenData: {role: 'hr'}};
    req.headers = {authorization: 'mock.jwt.token'};
    req.body = [{uuid: "afa43592-486f-4619-8b84-8807a1ee1454"}];
    req.params = {policyId: 'id'};
    req.query = {corporateUuid: 'uuid'};

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

    await policiesController.getPolicyECard(req, this.res);
    sinon.assert.calledOnce(policiesService.getPolicyECardForHr);
  });

  it('getPolicyECard for customer test', async function () {
    const req = {decodedTokenData: {role: 'customer'}};
    req.headers = {authorization: 'mock.jwt.token'};
    req.body = [{uuid: "afa43592-486f-4619-8b84-8807a1ee1454"}];
    req.params = {policyId: 'id'};
    req.query = {corporateUuid: 'uuid'};

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

    await policiesController.getPolicyECard(req, this.res);
    sinon.assert.calledOnce(policiesService.getPolicyECardForCustomer);
  });

  it('getPolicyECardByPolicyId for Manager test', async function () {
    const req = {decodedTokenData: {role: 'manager'}};
    req.headers = {authorization: 'mock.jwt.token'};
    req.body = [{uuid: "afa43592-486f-4619-8b84-8807a1ee1454"}];
    req.params = {policyId: 'id'};
    req.query = {corporateUuid: 'uuid', empid: 'empid'};

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

    await policiesController.getPolicyECardByPolicyId(req, this.res);
    sinon.assert.calledOnce(policiesService.getPolicyECardByPolicyIdByEmpidByCorporateUuid);
  });

  it('getPolicyECardByPolicyId for Executive test', async function () {
    const req = {decodedTokenData: {role: 'executive'}};
    req.headers = {authorization: 'mock.jwt.token'};
    req.body = [{uuid: "afa43592-486f-4619-8b84-8807a1ee1454"}];
    req.params = {policyId: 'id'};
    req.query = {corporateUuid: 'uuid', empid: 'empid'};

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

    await policiesController.getPolicyECardByPolicyId(req, this.res);
    sinon.assert.calledOnce(policiesService.getPolicyECardForExecutiveByPolicyIdByEmpidByCorporateUuid);
  });

  it('getPolicyECardByPolicyId for HR test', async function () {
    const req = {decodedTokenData: {role: 'hr'}};
    req.headers = {authorization: 'mock.jwt.token'};
    req.body = [{uuid: "afa43592-486f-4619-8b84-8807a1ee1454"}];
    req.params = {policyId: 'id'};
    req.query = {corporateUuid: 'uuid', empid: 'empid'};

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

    await policiesController.getPolicyECardByPolicyId(req, this.res);
    sinon.assert.calledOnce(policiesService.getPolicyECardForHrByPolicyIdByEmpid);
  });

  it('getPolicyECardByPolicyId for Customer test', async function () {
    const req = {decodedTokenData: {role: 'customer'}};
    req.headers = {authorization: 'mock.jwt.token'};
    req.body = [{uuid: "afa43592-486f-4619-8b84-8807a1ee1454"}];
    req.params = {policyId: 'id'};
    req.query = {corporateUuid: 'uuid', empid: 'empid'};

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

    await policiesController.getPolicyECardByPolicyId(req, this.res);
    sinon.assert.calledOnce(policiesService.getPolicyECardForCustomerByPolicyIdByEmpid);
  });

  it('updatePolicy test', async function () {
    const req = {};
    req.headers = {authorization: 'mock.jwt.token'};
    req.body = [{uuid: "afa43592-486f-4619-8b84-8807a1ee1454"}];
    req.params = {policyId: 'id'};
    req.query = {corporateUuid: 'uuid', empid: 'empid'};

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

    await policiesController.updatePolicy(req, this.res);
    sinon.assert.calledOnce(policiesService.updatePolicy);
  });
});
