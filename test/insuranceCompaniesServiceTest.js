"use strict";

const sinon = require('sinon');
const insuranceCompaniesService = require('../services/insuranceCompaniesService')
const {InsuranceCompany} = require('../models');

describe('insuranceCompaniesService Test Suite', function() {
  before(function() {
    this.sandbox = sinon.createSandbox();
  });

  beforeEach(function() {
    this.sandbox.spy(insuranceCompaniesService);
    this.sandbox.stub(InsuranceCompany, 'findAll').resolves([{uuid: 'uuid'}]);
    this.sandbox.stub(InsuranceCompany, 'findOne').resolves([{uuid: 'uuid'}]);
    this.sandbox.stub(InsuranceCompany, 'bulkCreate').resolves([{uuid: 'uuid'}]);
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  it('getAllInsuranceCompanies test', async function() {
    await insuranceCompaniesService.getAllInsuranceCompanies(null);
    sinon.assert.calledOnce(InsuranceCompany.findAll);
  });

  it('getInsuranceCompanyNameByUuid test', async function() {
    const queryParams = {startIndex: 1, endIndex: 10, hospitalName: 'hospitalName', corporateUuid: 'corporateUuid'};
    await insuranceCompaniesService.getInsuranceCompanyNameByUuid(queryParams);
    sinon.assert.calledOnce(InsuranceCompany.findOne);
  });

  it('addInsuranceCompanies test', async function() {
    const executives = [{uuid: 'uuid'}];
    await insuranceCompaniesService.addInsuranceCompanies(executives);
    sinon.assert.calledOnce(InsuranceCompany.bulkCreate);

  });
})
