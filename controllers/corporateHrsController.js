"use strict";

const { validationResult } = require('express-validator');
const { logger } = require('../config/logger');
const corporateHrsService = require('../services/corporateHrsService');
const {InvalidQueryParams} = require('../errors/invalidQueryParams');
const {Success} = require('../errors/success');

const addCorporateHrs = (req, res) => {
  logger.info(`+${module.id} - ${addCorporateHrs.name}()`);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new InvalidQueryParams(errors.array());
    res.status(err.status).json(err);
    return;
  }

  corporateHrsService.addCorporateHrs(req.decodedTokenData, req.body)
  .then( corporateHrs => {
    const _dto = new Success(corporateHrs, `${corporateHrs.length} corporateHrs added.`);
    res.status(_dto.status).json(_dto);
  })
  .catch(err => {
    if (err && err.status) {
      res.status(err.status).json(err);
      return;
    }
    res.status(500).json(err);
  });
}

const getCorporateHrs = (req, res) => {
  logger.debug(`+${module.id} - ${getCorporateHrs.name}()`);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new InvalidQueryParams(errors.array());
    res.status(err.status).json(err);
    return;
  }

  let status = (req.query.status) ? req.query.status.toLowerCase() : null;
  let approvalType = (req.query.approvalType) ? req.query.approvalType.toLowerCase() : null;

  corporateHrsService.getCorporateHrs(req.decodedTokenData, status, approvalType)
  .then(corporateHrs => {
    const _dto = new Success(corporateHrs, `${corporateHrs.length} corporateHrs returned.`);
    res.status(_dto.status).json(_dto);
  })
  .catch(err => {
    if (err && err.status) {
      res.status(err.status).json(err);
      return;
    }
    res.status(500).json(err);
  });
}

const getCorporateHrByEmpIdByCorporateUuid = (req, res) => {
  logger.debug(`+${module.id} - ${getCorporateHrByEmpIdByCorporateUuid.name}()`);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new InvalidQueryParams(errors.array());
    res.status(err.status).json(err);
    return;
  }

  corporateHrsService.getCorporateHrByEmpIdByCorporateUuid(req.params.empid, req.query.corporateUuid)
  .then(chr => {
    const _dto = new Success(chr, `Details for HR ${chr.firstName} ${chr.lastName} received.`);
    res.status(_dto.status).json(_dto);
  })
  .catch(err => {
    if (err && err.status) {
      res.status(err.status).json(err);
      return;
    }
    res.status(500).json(err);
  });
}

const updateCorporateHr = (req, res) => {
  logger.debug(`+${module.id} - ${updateCorporateHr.name}()`);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new InvalidQueryParams(errors.array());
    res.status(err.status).json(err);
    return;
  }

  corporateHrsService.updateCorporateHr(req.decodedTokenData, req.body)
  .then(rowsUpdated => {
    const message = (rowsUpdated === 0) ? 'Nothing to update. Modified values appear to be same as existing values.' : `CorporateHR updated.`;
    const _dto = new Success(rowsUpdated, message);
    res.status(_dto.status).json(_dto);
  })
  .catch(err => {
    if (err && err.status) {
      res.status(err.status).json(err);
      return;
    }
    res.status(500).json(err);
  });
}


module.exports = {
  addCorporateHrs: addCorporateHrs,
  getCorporateHrs: getCorporateHrs,
  getCorporateHrByEmpIdByCorporateUuid: getCorporateHrByEmpIdByCorporateUuid,
  updateCorporateHr: updateCorporateHr
};
