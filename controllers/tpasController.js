"use strict";

const tpasService = require('../services/tpasService');
const { validationResult } = require('express-validator');
const {InvalidQueryParams} = require('../errors/invalidQueryParams');
const {Success} = require('../errors/success');

const getAllTpas = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new InvalidQueryParams(errors.array());
    res.status(err.status).json(err);
    return;
  }

  tpasService.getAllTpas()
  .then((tpas) => {
    const message = (tpas && tpas.length) ? `${tpas.length} TPAs returned.` : `No TPAs returned.`;
    const _dto = new Success(tpas, message);
    res.status(_dto.status).json(_dto);
  })
  .catch((err) => {
    if (err && err.status) {
      res.status(err.status).json(err);
      return;
    }
    res.status(500).json(err);
  });
};

const addTpas = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new InvalidQueryParams(errors.array());
    res.status(err.status).json(err);
    return;
  }

  tpasService.addTpas(req.body)
  .then((tpas) => {
    const message = (tpas && tpas.length) ? `${tpas.length} TPAs added.` : `No TPAs added.`;
    const _dto = new Success(tpas, message);
    res.status(_dto.status).json(_dto);
  })
  .catch((err) => {
    if (err && err.status) {
      res.status(err.status).json(err);
      return;
    }
    res.status(500).json(err);
  });
};

module.exports = {
  getAllTpas: getAllTpas,
  addTpas: addTpas,
};