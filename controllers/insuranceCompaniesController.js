"use strict";

const insuranceCompaniesService = require('../services/insuranceCompaniesService');
const { validationResult } = require('express-validator');

const getAllInsuranceCompanies = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      status: 400,
      errCode: 'InvalidQueryParams',
      message: 'Some query params are incorrect.',
      data: errors.array()
    })
    return;
  }

  insuranceCompaniesService.getAllInsuranceCompanies()
  .then((insuranceCompanies) => {
    res.status(200).send(insuranceCompanies);
  })
  .catch((err) => {
    res.status(400).send(err);
  });
};

const addInsuranceCompanies = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      status: 400,
      errCode: 'InvalidQueryParams',
      message: 'Some query params are incorrect.',
      data: errors.array()
    })
    return;
  }

  insuranceCompaniesService.addInsuranceCompanies(req.body)
  .then(insuranceCompanies => {
    res.status(200).json(insuranceCompanies);
  })
  .catch((err) => {
    res.status(500).send(err);
  });
};

module.exports = {
  getAllInsuranceCompanies: getAllInsuranceCompanies,
  addInsuranceCompanies: addInsuranceCompanies,
};
