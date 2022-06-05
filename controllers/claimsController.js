"use strict";

const claimsService = require('../services/claimsService');
const {logger} = require('../config/logger');
const { validationResult } = require('express-validator');
const {InvalidQueryParams} = require('../errors/invalidQueryParams');
const {Success} = require('../errors/success');

const getAllClaims = (req, res) => {
  logger.debug(`${module.id} - ${getAllClaims.name}()`);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new InvalidQueryParams(errors.array());
    res.status(err.status).json(err);
    return;
  }

  const credentials = req.decodedTokenData;
  claimsService.getAllClaims(credentials, req.query)
  .then(claims => { // TODO: This flat list may contain null items also. Filter out null items.
    const _dto = new Success(claims, `${claims.length} claims returned.`)
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

const getClaimByClaimId = (req, res) => {
  logger.debug(`${module.id} - ${getClaimByClaimId.name}()`);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new InvalidQueryParams(errors.array());
    res.status(err.status).json(err);
    return;
  }

  claimsService.getClaimByClaimId(req.params.claimId)
  .then((claim) => {
    const _dto = new Success(claim, `Claim ${claim.claimId} returned.`)
    res.status(_dto.status).json(_dto);
  })
  .catch((err) => {
    if (err && err.status) {
      res.status(err.status).send(err);
      return;
    }
    res.status(500).send(err);
  });
};

const addClaims = (req, res) => {
  logger.debug(`${module.id} - ${addClaims.name}()`);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new InvalidQueryParams('req body cannot be empty');
    res.status(err.status).json(err);
    return;
    }

  claimsService.addClaims(req.body)
  .then(claims => {
    const _dto = new Success(claims, `${claims.length} claims added.`)
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

const addClaimsFromSoapByPolicyByDates = (req, res) => {
  if (!req || !req.query || !req.query.policy) {
    const err = new InvalidQueryParams('policy number cannot be empty');
    res.status(err.status).json(err);
    return;
  }

  const policy = req.query.policy;
  const fromDate = (req.query.fromDate) ? req.query.fromDate : new Date('2019-01-01T00:00:00');
  const toDate = (req.query.toDate) ? req.query.toDate : new Date();

  claimsService.addClaimsFromSoapByPolicyByDates(policy, fromDate, toDate)
  .then(claims => {
    const _dto = new Success(claims, `${claims.length} claims added.`);
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

const viewAllSoapClaimsByPolicyByDates = (req, res) => {
  let policy = null;
  let fromDate = null;
  let toDate = null;

  console.log(req.query);
  if (req && req.query) {
    if (req.query.policy) { policy = req.query.policy; }
    if (req.query.fromDate) { fromDate = req.query.fromDate; }
    if (req.query.toDate) { toDate = req.query.toDate; }
  }

  claimsService.getAllSoapClaimsByPolicyByDates(policy, fromDate, toDate)
  .then(claims => {
    const _dto = new Success(claims, `${claims.length} claims returned.`);
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

const mediAssistClaimsByPolicyByDates = (req, res) => {
  logger.debug(`${module.filename} - ${mediAssistClaimsByPolicyByDates.name}()`);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new InvalidQueryParams(errors, 'Policy query params are incorrect. policy is mandatory. fromDate and toDate are optional but cannot be sent empty.');
    res.status(err.status).json(err);
    return;
  }

  const policy = req.query.policy;
  const fromDate = (req.query.fromDate) ? req.query.fromDate : new Date('2019-01-01T00:00:00');
  const toDate = (req.query.toDate) ? req.query.toDate : new Date();
  claimsService.mediAssistClaimsByPolicyByDates(policy, fromDate, toDate)
  .then(claims => {
    const _dto = new Success(claims, `${claims.length} claims added.`);
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

const fhplClaimsByPolicyByDates = (req, res) => {
  logger.debug(`${module.filename} - ${fhplClaimsByPolicyByDates.name}()`);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new InvalidQueryParams(errors, 'Policy query params are incorrect. policy is mandatory. fromDate and toDate are optional but cannot be sent empty.');
    res.status(err.status).json(err);
    return;
  }

  const policy = req.query.policy;
  const fromDate = (req.query.fromDate) ? req.query.fromDate : new Date('2019-01-01T00:00:00');
  const toDate = (req.query.toDate) ? req.query.toDate : new Date();
  claimsService.fhplClaimsByPolicyByDates(policy, fromDate, toDate)
  .then(claims => {
    const _dto = new Success(claims, `${claims.length} claims added.`);
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

module.exports = {
  getAllClaims: getAllClaims,
  getClaimByClaimId: getClaimByClaimId,
  addClaims: addClaims,
  addClaimsFromSoapByPolicyByDates: addClaimsFromSoapByPolicyByDates,  // TODO: Deprecated
  viewAllSoapClaimsByPolicyByDates: viewAllSoapClaimsByPolicyByDates,
  mediAssistClaimsByPolicyByDates: mediAssistClaimsByPolicyByDates,
  fhplClaimsByPolicyByDates: fhplClaimsByPolicyByDates
}
