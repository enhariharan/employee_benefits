"use strict";

const sinon = require('sinon');
const hospitalsService = require('../services/hospitalsService')
const soapService = require('../services/soapService')
const { NetworkHospital, NonNetworkHospital, Policy } = require('../models');

describe('hospitalsService Test Suite', function() {
  before(function() {
    this.sandbox = sinon.createSandbox();
  });

  beforeEach(function() {
    this.sandbox.spy(hospitalsService);
    this.sandbox.stub(soapService, 'getAllNetworkHospitals').resolves([{uuid: 'uuid'}]);
    this.sandbox.stub(NetworkHospital, 'bulkCreate').resolves([{uuid: 'uuid'}]);
    this.sandbox.stub(NetworkHospital, 'findAll').resolves([{uuid: 'uuid'}]);
    this.sandbox.stub(NonNetworkHospital, 'bulkCreate').resolves([{uuid: 'uuid'}]);
    this.sandbox.stub(NonNetworkHospital, 'findAll').resolves([{uuid: 'uuid'}]);
    this.sandbox.stub(Policy, 'findOne').resolves([{uuid: 'uuid'}]);
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  it('getNetworkHospitals null test', async function() {
    await hospitalsService.getNetworkHospitals(null);
    sinon.assert.calledOnce(NetworkHospital.findAll);
  });

  it('getNetworkHospitals corporateUuid test', async function() {
    const queryParams = {startIndex: 1, endIndex: 10, hospitalName: 'hospitalName', corporateUuid: 'corporateUuid'};
    await hospitalsService.getNetworkHospitals(queryParams);
    sinon.assert.calledTwice(NetworkHospital.findAll);
    sinon.assert.calledOnce(Policy.findOne);
  });

  it('getNonNetworkHospitals executive test', async function() {
    const credentials = {role: 'executive'};
    const queryParams = [{empid: 'empid', brokingCompanyUuid: 'brokingCompanyUuid'}];
    await hospitalsService.getNonNetworkHospitals(credentials, queryParams);
    sinon.assert.calledOnce(NonNetworkHospital.findAll);
  });

  it('addNonNetworkHospitals test', async function() {
    const executives = [{uuid: 'uuid'}];
    await hospitalsService.addNonNetworkHospitals(executives);
    sinon.assert.calledOnce(NonNetworkHospital.bulkCreate);

  });

  it('addNetworkHospitalsFromSoap test', async function() {
    const corporateUuid = 'corporateUuid';
    const executiveUuid = 'executiveUuid';
    await hospitalsService.addNetworkHospitalsFromSoap(corporateUuid, executiveUuid);
    sinon.assert.calledOnce(soapService.getAllNetworkHospitals);
    sinon.assert.calledOnce(NetworkHospital.bulkCreate);
  });

  it('searchNetworkHospitalNames test', async function() {
    await hospitalsService.searchNetworkHospitalNames('hospitalName');
    sinon.assert.calledOnce(NetworkHospital.findAll);
  });

  it('searchNetworkHospitalCities test', async function() {
    await hospitalsService.searchNetworkHospitalCities('cityName');
    sinon.assert.calledOnce(NetworkHospital.findAll);
  });

  it('searchNetworkHospitalPincodes test', async function() {
    await hospitalsService.searchNetworkHospitalPincodes('pinCode');
    sinon.assert.calledOnce(NetworkHospital.findAll);
  });

  it('searchNonNetworkHospitals test', async function() {
    await hospitalsService.searchNonNetworkHospitals('searchStr');
    sinon.assert.calledOnce(NonNetworkHospital.findAll);
  });
})
