"use strict";

const sinon = require('sinon');
const tpasService = require('../services/tpasService')
const {TPA} = require('../models');

describe('tpasService Test Suite', function() {
  before(function() {
    this.sandbox = sinon.createSandbox();
  });

  beforeEach(function() {
    this.sandbox.spy(tpasService);
    this.sandbox.stub(TPA, 'findAll').resolves([{uuid: 'uuid'}]);
    this.sandbox.stub(TPA, 'findOne').resolves([{uuid: 'uuid'}]);
    this.sandbox.stub(TPA, 'bulkCreate').resolves([{uuid: 'uuid'}]);
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  it('getAllTpas test', async function() {
    await tpasService.getAllTpas();
    sinon.assert.calledOnce(TPA.findAll);
  });

  it('getTpaNameByUuid test', async function() {
    await tpasService.getTpaNameByUuid();
    sinon.assert.calledOnce(TPA.findOne);
  });

  it('addTpas test', async function() {
    await tpasService.addTpas([{uuid: 'uuid'}]);
    sinon.assert.calledOnce(TPA.bulkCreate);
  });
})
