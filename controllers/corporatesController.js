"use strict";

const corporatesService = require('../services/corporatesService');
const corporateHrsService = require('../services/corporateHrsService');
const commonService = require('../services/commonService');
const {logger} = require('../config/logger');
const { validationResult } = require('express-validator');
const {InvalidQueryParams} = require('../errors/invalidQueryParams');
const {Success} = require('../errors/success');

const getCorporates = (req, res) => {
  logger.info(`+${module.id}.${getCorporates.name}()`);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new InvalidQueryParams(errors.array());
    res.status(err.status).json(err);
    return;
  }

  const status = req.query.status;

  corporatesService.getCorporates(req.decodedTokenData, status)
  .then(corporates => {
    const _dto = new Success(corporates, `${corporates.length} corporates found.`)
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

const addCorporates = (req, res) => {
  logger.info(`+${module.id}.${addCorporates.name}()`);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = "Adding new Corporate failed. Some params provided in request were incorrect.";
    const err = new InvalidQueryParams(errors.array(), message);
    res.status(err.status).json(err);
    return;
  }

  corporatesService.addCorporates(req.decodedTokenData, req.body)
  .then(corporates => {
    const _dto = new Success(corporates, `${corporates.length} corporates added.`)
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

const addHRsByCorporate = (req, res) => {
  logger.info(`+${module.id}.${addHRsByCorporate.name}()`);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new InvalidQueryParams(errors.array());
    res.status(err.status).json(err);
    return;
  }

  const hrList = req.body;
  const corporateUuid = req.params.uuid;
  const credentials = req.decodedTokenData;

  hrList.forEach(hr => {hr.corporateUuid = corporateUuid;});

  corporateHrsService.addCorporateHrs(credentials, hrList)
  .then(corporateHrs => {
    const _dto = new Success(corporateHrs, `${corporateHrs.length} HRs added.`)
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

const searchCorporates = (req, res) => {
  logger.info(`+${module.id}.${searchCorporates.name}()`);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new InvalidQueryParams(errors.array());
    res.status(err.status).json(err);
    return;
  }

  corporatesService.searchCorporates(req.query.name)
  .then(searchResult => {
    logger.debug(searchResult);
    const _dto = new Success(searchResult)
    res.status(_dto.status).send(_dto);
  })
  .catch(err => {
    if (err.status) {
      res.status(err.status).send(err);
      return;
    }
    res.status(500).send(err);
  });
}

const updateCorporate = (req, res) => {
  logger.debug(`+${module.id} - ${updateCorporate.name}()`);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new InvalidQueryParams(errors.array());
    res.status(err.status).json(err);
    return;
  }

  corporatesService.updateCorporate(req.decodedTokenData, req.body)
  .then(result => {
    const _dto = new Success(result, `Update was successful.`)
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

const getAllCorporatesExecutivesList = (req, res) => {
  logger.debug(`+${module.id} - ${getAllCorporatesExecutivesList.name}()`);

  commonService.getAllCorporatesExecutivesList()
  .then(result => {
    const message = (result && result.length) ? `${result.length} entities returned.` : `No entities returned`;
    const _dto = new Success(result, message)
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

const updateCorporateExecutive = (req, res) => {
  logger.debug(`+${module.id} - ${updateCorporate.name}()`);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new InvalidQueryParams(errors);
    res.status(err.status).json(err);
    return;
  }

  corporatesService.updateCorporateExecutive(req.decodedTokenData, req.body)
  .then(result => {
    const _dto = new Success(result, `corporate executive update was successful.`)
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
  getCorporates: getCorporates,
  addCorporates: addCorporates,
  addHRsByCorporate: addHRsByCorporate,
  searchCorporates: searchCorporates,
  updateCorporate: updateCorporate,
  getAllCorporatesExecutivesList: getAllCorporatesExecutivesList,
  updateCorporateExecutive: updateCorporateExecutive
}