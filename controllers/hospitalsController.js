"use strict";

const hospitalsService = require('../services/hospitalsService');
const {logger} = require('../config/logger');
const { validationResult } = require('express-validator');
const cron = require('../helpers/cron');
const {InvalidQueryParams} = require('../errors/invalidQueryParams');
const {Success} = require('../errors/success');

const getNonNetworkHospitals = (req, res) => {
  logger.debug(`${module.id} - ${getNonNetworkHospitals.name}()`);

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

  hospitalsService.getNonNetworkHospitals()
  .then(nonNetworkHospitals => {
    res.status(200).send(nonNetworkHospitals);
  })
  .catch(err => {
    res.status(400).send(err);
  });
};

const getNetworkHospitals = (req, res) => {
  logger.debug(`${module.id} - ${getNetworkHospitals.name}()`);

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

  let promise;
  let queryParams = {};

  if (!req.query || Object.keys(req.query).length === 0) {
    logger.info('no query params were provided, will return all hospitals. This may take time!!');
    promise = hospitalsService.getNetworkHospitals(null);
  } else {
    if (req.query.uuid) {
      queryParams.uuid = req.query.uuid;
    }
    if (req.query.corporateUuid) {
      queryParams.corporateUuid = req.query.corporateUuid;
    }
    if (req.query.hospitalName) {
      queryParams.hospitalName = req.query.hospitalName;
    }
    if (req.query.city) {
      queryParams.addressCity = req.query.city;
    }
    if (req.query.pincode) {
      queryParams.addressPincode = req.query.pincode;
    }
    if (req.query.startIndex) {
      queryParams.startIndex = req.query.startIndex;
    }
    if (req.query.endIndex) {
      queryParams.endIndex = req.query.endIndex;
    }
    promise = hospitalsService.getNetworkHospitals(queryParams);
  }

  promise
  .then(networkHospitals => {
    if (networkHospitals && networkHospitals.length !== 0) {
      logger.info(`Found [${networkHospitals.length}] network hospitals.`);
    }
    const message = (networkHospitals && networkHospitals.length) ? `${networkHospitals.length} networkHospitals returned.` : `No networkHospitals returned.`;
    const _dto = new Success(networkHospitals, message);
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

const addNonNetworkHospitals = (req, res) => {
  logger.debug(`${module.id} - ${addNonNetworkHospitals.name}()`);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new InvalidQueryParams(errors.array());
    res.status(err.status).json(err);
    return;
  }

  hospitalsService.addNonNetworkHospitals(req.body)
  .then(hospitals => {
    res.status(200).send(hospitals);
  })
  .catch((err) => {
    res.status(400).send(err);
  });
};

const addNetworkHospitalsFromSoap = (req, res) => {
  logger.debug(`${module.id} - ${addNetworkHospitalsFromSoap.name}()`);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new InvalidQueryParams(errors.array());
    res.status(err.status).json(err);
    return;
  }

  const startIndex = (req.query && req.query.startIndex  && req.query.startIndex > 0) ? req.query.startIndex : 1; // TODO: Change later. This should be be equal to the largest branchId from NetworkHospitals table plus 1.
  const endIndex = (req.query && req.query.endIndex) ? req.query.endIndex : startIndex + 100;

  hospitalsService.addNetworkHospitalsFromSoap(startIndex, endIndex, req.query.tpaUuid, req.query.insuranceCompanyUuid)
  .then(hospitals => {
    logger.info(`Received ${hospitals.length} network hospitals from soap`);
    res.status(200).send(hospitals);
  })
  .catch((err) => {
    res.status(400).send(err);
  });
};

const searchNetworkHospitals = (req, res) => {
  logger.debug(`+${module.id}.${searchNetworkHospitals.name}()`);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new InvalidQueryParams(errors.array());
    res.status(err.status).json(err);
    return;
  }

  let promise;
  if (req.query.hospitalName) {
    promise = hospitalsService.searchNetworkHospitalNames(req.query.hospitalName.trim());
  } else if (req.query.city) {
    promise = hospitalsService.searchNetworkHospitalCities(req.query.city.trim());
  } else if (req.query.pincode) {
    promise = hospitalsService.searchNetworkHospitalPincodes(req.query.pincode.trim());
  } else {
    promise = Promise.reject({status: 401, errCode: 'IncorrectQuery', message: 'Invalid query provided for search.'});
  }

  promise
  .then(searchResult => {
    logger.debug(searchResult);
    const _dto = new Success(searchResult);
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

const searchNonNetworkHospitals = (req, res) => {
  logger.debug(`${module.id} - ${searchNonNetworkHospitals.name}()`);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new InvalidQueryParams(errors.array());
    res.status(err.status).json(err);
    return;
  }

  hospitalsService.searchNonNetworkHospitals(req.query.name)
  .then(hospitals => {
    const _dto = new Success(hospitals);
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

const addNetworkHospitalByCron = (req, res) => {
  cron.loadNetworkHospital();
  const _dto = new Success('Network hospitals cron triggered succesfully', 'Network hospitals cron triggered succesfully');
  res.status(_dto.status).json(_dto);
};

module.exports = {
  getNonNetworkHospitals: getNonNetworkHospitals,
  getNetworkHospitals: getNetworkHospitals,
  addNonNetworkHospitals: addNonNetworkHospitals,
  addNetworkHospitalsFromSoap: addNetworkHospitalsFromSoap,
  searchNetworkHospitals: searchNetworkHospitals,
  searchNonNetworkHospitals: searchNonNetworkHospitals,
  addNetworkHospitalByCron: addNetworkHospitalByCron
};
