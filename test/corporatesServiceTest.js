"use strict";

const sinon = require('sinon');
const corporatesService = require('../services/corporatesService')
const {BrokingCompany, Corporate, CorporateHR, Executive, ExecutiveCorporateMapping} = require('../models');

describe('corporatesService Test Suite', function() {
  before(function() {
    this.sandbox = sinon.createSandbox();
  });

  beforeEach(function() {
    this.sandbox.spy(corporatesService);
    this.sandbox.stub(Executive, 'findOne').resolves({uuid: 'uuid', corporateUuid: 'corporateUuid', companyName: 'Sample Broking Company Name'});
    this.sandbox.stub(BrokingCompany, 'findOne').resolves({uuid: 'uuid', empid: 'empid', corporateUuid: 'corporateUuid', companyName: 'Sample Broking Company Name', dataValues: {uuid: 'uuid', empid: 'empid', corporateUuid: 'corporateUuid', companyName: 'Sample Broking Company Name'}});
    this.sandbox.stub(CorporateHR, 'create').resolves({uuid: 'uuid', empid: 'empid', corporateUuid: 'corporateUuid', companyName: 'Sample Broking Company Name', dataValues: {uuid: 'uuid', empid: 'empid', corporateUuid: 'corporateUuid', companyName: 'Sample Broking Company Name'}});
    this.sandbox.stub(CorporateHR, 'findOne').resolves({uuid: 'uuid', empid: 'empid', corporateUuid: 'corporateUuid', companyName: 'Sample Broking Company Name', dataValues: {uuid: 'uuid', empid: 'empid', corporateUuid: 'corporateUuid', companyName: 'Sample Broking Company Name'}});
    this.sandbox.stub(Corporate, 'create').resolves({uuid: 'uuid', empid: 'empid', corporateUuid: 'corporateUuid', companyName: 'Sample Broking Company Name', dataValues: {uuid: 'uuid', empid: 'empid', corporateUuid: 'corporateUuid', companyName: 'Sample Broking Company Name'}});
    this.sandbox.stub(Corporate, 'findAll').resolves([{uuid: 'uuid', empid: 'empid', corporateUuid: 'corporateUuid', companyName: 'Sample Broking Company Name', dataValues: {uuid: 'uuid', empid: 'empid', corporateUuid: 'corporateUuid', companyName: 'Sample Broking Company Name'}}]);
    this.sandbox.stub(ExecutiveCorporateMapping, 'create').resolves([{uuid: 'uuid', empid: 'empid', corporateUuid: 'corporateUuid', executiveUuid: 'executiveUuid', companyName: 'Sample Broking Company Name', dataValues: {uuid: 'uuid', empid: 'empid', corporateUuid: 'corporateUuid', companyName: 'Sample Broking Company Name'}}]);
    this.sandbox.stub(ExecutiveCorporateMapping, 'findAll').resolves([{uuid: 'uuid', empid: 'empid', corporateUuid: 'corporateUuid', executiveUuid: 'executiveUuid', companyName: 'Sample Broking Company Name', dataValues: {uuid: 'uuid', empid: 'empid', corporateUuid: 'corporateUuid', companyName: 'Sample Broking Company Name'}}]);
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  it('getCorporateNames test', async function() {
    await corporatesService.getCorporateNames('uuid');
    sinon.assert.calledOnce(Corporate.findAll);
  });

  it('getCorporates manager test', async function() {
    await corporatesService.getCorporates({role: 'manager'},'created');
    sinon.assert.calledOnce(Corporate.findAll);
  });

  it('getCorporates executive test', async function() {
    this.sandbox.stub(Corporate, 'findOne').resolves({uuid: 'uuid', empid: 'empid', corporateUuid: 'corporateUuid', companyName: 'Sample Broking Company Name', dataValues: {uuid: 'uuid', empid: 'empid', corporateUuid: 'corporateUuid', companyName: 'Sample Broking Company Name'}});
    await corporatesService.getCorporates({role: 'executive'},'created');
    sinon.assert.calledOnce(Executive.findOne);
    sinon.assert.calledOnce(ExecutiveCorporateMapping.findAll);
    sinon.assert.calledOnce(Corporate.findOne);
  });

  it('getCorporates hr test', async function() {
    this.sandbox.stub(Corporate, 'findOne').resolves({uuid: 'uuid', empid: 'empid', corporateUuid: 'corporateUuid', companyName: 'Sample Broking Company Name', dataValues: {uuid: 'uuid', empid: 'empid', corporateUuid: 'corporateUuid', companyName: 'Sample Broking Company Name'}});
    await corporatesService.getCorporates({role: 'hr'},'created');
    sinon.assert.calledOnce(CorporateHR.findOne);
    sinon.assert.calledOnce(Corporate.findOne);
  });

  it('getCorporatesByUuid test', async function() {
    this.sandbox.stub(Corporate, 'findOne').resolves({uuid: 'uuid', empid: 'empid', corporateUuid: 'corporateUuid', companyName: 'Sample Broking Company Name', dataValues: {uuid: 'uuid', empid: 'empid', corporateUuid: 'corporateUuid', companyName: 'Sample Broking Company Name'}});
    await corporatesService.getCorporatesByUuid('uuid');
    sinon.assert.calledOnce(Corporate.findOne);  });

  it('getCorporateByCompanyName test', async function() {
    this.sandbox.stub(Corporate, 'findOne').resolves({uuid: 'uuid', empid: 'empid', corporateUuid: 'corporateUuid', companyName: 'Sample Broking Company Name', dataValues: {uuid: 'uuid', empid: 'empid', corporateUuid: 'corporateUuid', companyName: 'Sample Broking Company Name'}});
    await corporatesService.getCorporateByCompanyName('companyName');
    sinon.assert.calledOnce(Corporate.findOne);  });

  it('getCorporateByDisplayName test', async function() {
    this.sandbox.stub(Corporate, 'findOne').resolves({uuid: 'uuid', empid: 'empid', corporateUuid: 'corporateUuid', companyName: 'Sample Broking Company Name', dataValues: {uuid: 'uuid', empid: 'empid', corporateUuid: 'corporateUuid', companyName: 'Sample Broking Company Name'}});
    await corporatesService.getCorporateByDisplayName('displayName');
    sinon.assert.calledOnce(Corporate.findOne);  });

  it('getCorporateNameByUuid test', async function() {
    this.sandbox.stub(Corporate, 'findOne').resolves({uuid: 'uuid', empid: 'empid', corporateUuid: 'corporateUuid', companyName: 'Sample Broking Company Name', dataValues: {uuid: 'uuid', empid: 'empid', corporateUuid: 'corporateUuid', companyName: 'Sample Broking Company Name'}});
    await corporatesService.getCorporateNameByUuid('uuid');
    sinon.assert.calledOnce(Corporate.findOne);  });

  it('addCorporates test', async function() {
    const userUuid = 'uuid';
    const corporates = [{displayName: 'displayName', companyName: 'companyName'}];
    this.sandbox.stub(Corporate, 'findOne').resolves(null);
    await corporatesService.addCorporates(userUuid, corporates);
    sinon.assert.calledOnce(Executive.findOne);
    sinon.assert.calledOnce(BrokingCompany.findOne);
    sinon.assert.calledOnce(Corporate.findOne);
    sinon.assert.calledOnce(Corporate.create);
    sinon.assert.calledOnce(ExecutiveCorporateMapping.create);
  });

  it('addHRsByCorporate test', async function() {
    const corporateUuid = 'uuid';
    const hrlist = [{userUuid: 'userUuid', firstName: 'firstName', lastName: 'lastName', empid: 'empid', corporateUuid: corporateUuid}];
    await corporatesService.addHRsByCorporate(corporateUuid, hrlist);
    sinon.assert.calledOnce(CorporateHR.create);
  });

  it('searchCorporates test', async function() {
    await corporatesService.searchCorporates('searchStr');
    sinon.assert.calledOnce(Corporate.findAll);
  });

  it('updateCorporate test', async function() {
    this.sandbox.stub(Corporate, 'findOne').resolves({uuid: 'uuid', companyName: 'Sample Broking Company Name', dataValues: {uuid: 'uuid', companyName: 'Sample Broking Company Name'}});
    const credentials = {brokingCompanyuuid: 'brokingCompanyuuid'};
    const modifiedCorporate = {uuid: 'uuid'}
    await corporatesService.updateCorporate(credentials, modifiedCorporate);
    sinon.assert.calledOnce(Corporate.findOne);
  });
})
