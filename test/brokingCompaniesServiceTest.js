"use strict"

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require("sinon-chai");
const { BrokingCompany } = require('../models');
chai.should();
chai.use(sinonChai);

const brokingCompaniesService = require('../services/brokingCompaniesService');

describe('brokingCompaniesService Test Suite', function() {
  before(function() {
    this.sandbox = sinon.createSandbox();
  });

  beforeEach(function() {
    this.sandbox.spy(brokingCompaniesService);
    this.sandbox.stub(BrokingCompany, 'findAll').resolves({data: 'mock return value'});
    this.sandbox.stub(BrokingCompany, 'bulkCreate').resolves([{data: 'mock return value'}]);
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  it('should be able to get broking companies from DB', async function() {
    await brokingCompaniesService.getAllBrokingCompanies()
    .then(ignoreBC => {
      sinon.assert.calledOnce(BrokingCompany.findAll);
    })
    .catch(ignoreErr => {
      sinon.assert.calledOnce(BrokingCompany.findAll);
    });
  });

  it('should be able to add broking companies from DB', async function() {
    brokingCompaniesService.addBrokingCompanies([{data: 'mock broking company'}])
    .then(ignoreBC => {
      sinon.assert.calledOnce(BrokingCompany.bulkCreate);
    })
    .catch(ignoreErr => {
      sinon.assert.calledOnce(BrokingCompany.bulkCreate);
    });
  });
});
