"use strict";

const brokingCompaniesService = require('../services/brokingCompaniesService');
const { validationResult } = require('express-validator');
const {Success} = require('../errors/success');
const {InvalidQueryParams} = require('../errors/invalidQueryParams');

const getAllBrokingCompanies = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new InvalidQueryParams(errors.array());
    res.status(err.status).json(err);
    return;
  }

  brokingCompaniesService.getAllBrokingCompanies()
  .then( brokingCompanies => {
    const _dto = new Success(brokingCompanies, `${brokingCompanies.length} broking companies returned.`);
    res.status(_dto.status).json(_dto);
  })
  .catch(err => {
    if (err && err.status) {
      res.status(err.status).send(err);
      return;
    }
    res.status(500).send(err);
  });
};

const addBrokingCompanies = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = "Adding new Broking Company failed. Some params provided in request were incorrect.";
    const err = new InvalidQueryParams(errors.array(), message);
    res.status(err.status).json(err);
    return;
  }

  brokingCompaniesService.addBrokingCompanies(req.body)
  .then( brokingCompanies => {
    const count = brokingCompanies && brokingCompanies.length ? brokingCompanies.length : 0;
    const _dto = new Success(brokingCompanies, `${count} broking companies added.`);
    res.status(_dto.status).json(_dto);
  })
  .catch(err => {
    if (err && err.status) {
      res.status(err.status).json(err);
      return;
    }
    res.status(500).json(err);
  });
};

module.exports = {
  addBrokingCompanies: addBrokingCompanies,
  getAllBrokingCompanies: getAllBrokingCompanies
};