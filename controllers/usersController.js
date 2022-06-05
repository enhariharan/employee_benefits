"use strict";

const usersService = require('../services/usersService');
const { logger } = require('../config/logger');
const loginDomains = require('../helpers/logindomains').loginDomains;
const { validationResult } = require('express-validator');
const { InvalidQueryParams } = require('../errors/invalidQueryParams');
const { InvalidCredentials } = require('../errors/invalidCredentials');
const { Success } = require('../errors/success');
const { DEFAULT_SUBDOMAIN } = require('../services/employeeStatus');

const maskPwd = x => JSON.stringify(x, (k, v) => {return (k === 'password') ? '<hidden>' : v;});

const login = (req, res) => {
  logger.info(`+${module.filename}.${login.name}()`);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new InvalidQueryParams(errors.array());
    res.status(err.status).json(err);
    return;
  }

  let _credentials = req.body;
  let _rcvdSubDomain = (_credentials.username === 'admin') ? DEFAULT_SUBDOMAIN : req.body.subdomain;
  _credentials.subdomain = loginDomains.subdomains.find(element => _rcvdSubDomain.includes(element.subdomain) );
  logger.info(`credentials: ${maskPwd(_credentials)}`);
  if (!_credentials.subdomain) {
    const err = new InvalidCredentials(`Invalid Subdomain - [${_rcvdSubDomain}]`);
    res.status(err.status).json(err);
    return;
  }

  usersService.login(_credentials)
  .then(result => {
    logger.info(`${req.body.username} logged in.`);
    const success = new Success(result, `${req.body.username} is now logged in. Welcome.`);
    res.status(success.status).json(success);
  })
  .catch(err => {
    logger.error(err);
    if (err && err.status) {
      res.status(err.status).json(err);
      return;
    }
    res.status(500).json(err);
  });
};

module.exports = {
  login: login
}
