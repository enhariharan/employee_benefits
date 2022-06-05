"use strict";

const argon2 = require('argon2');
const JWT = require('jsonwebtoken');
const {BrokingCompany, Corporate, CorporateHR, Customer, Executive, User} = require('../models');
const jwtConfig = require('../config/jwtconfig');
const {logger} = require('../config/logger');
const {InvalidCredentials} = require('../errors/invalidCredentials');
const {ServerError} = require('../errors/serverError');

const ROLE_CUSTOMER = require('./employeeStatus').ROLE_CUSTOMER;
const ROLE_HR = require('./employeeStatus').ROLE_HR;
const ROLE_EXECUTIVE = require('./employeeStatus').ROLE_EXECUTIVE;
const ROLE_MANAGER = require('./employeeStatus').ROLE_MANAGER;
const ROLE_SRMANAGER = require('./employeeStatus').ROLE_SRMANAGER;
const ROLE_SUPERUSER = require('./employeeStatus').ROLE_SUPERUSER;

const STATUS_CREATED = require('./employeeStatus').STATUS_CREATED;
const STATUS_REJECTED = require('./employeeStatus').STATUS_REJECTED;
const STATUS_RESIGNED = require('./employeeStatus').STATUS_RESIGNED;
const DEFAULT_SUBDOMAIN = require('./employeeStatus').DEFAULT_SUBDOMAIN;

const maskPwd = x => JSON.stringify(x, (k, v) => {return (k === 'password') ? '<hidden>' : v;});

const _verifyLogin = (_corporateName, _brokingCompanyName, credentials) => {
  return new Promise((resolve, reject) => {

    logger.debug(`_corporateName: ${_corporateName}, _brokingCompanyName: ${_brokingCompanyName}, credentials: ${maskPwd(credentials)}`);

    let _dto = {};
    _dto.user = {};
    let _corporateUuid = null;
    let _brokingCompanyUuid = null;
    let _foundUser, _foundUserByCustomer, _foundUserByCorporateHR, _foundUserByBrokingCompany;
    const subdomain = credentials.subdomain.subdomain;
    const isDefaultSubdomain = (subdomain === DEFAULT_SUBDOMAIN);

    Promise.all([
      BrokingCompany.findOne({where: {companyName: _brokingCompanyName}}),
      Corporate.findOne({where: {companyName: _corporateName}})
    ])
    .then(result => {
      const brokingCompany = result[0];
      const corporate = result[1];
      if (!brokingCompany) {
        throw(new InvalidCredentials('A Broking Company name matching the given domain was not found in DB.'));
      }
      if (!corporate && !isDefaultSubdomain) { // "www.visista4u" is not mapped to any corporate by design
        throw(new InvalidCredentials('A Corporate name matching the given domain was not found in DB.'));
      }

      logger.verbose(`Broking company: ${brokingCompany.companyName}`);
      if (corporate) {
        logger.verbose(`Corporate: ${corporate.companyName}`);
      }

      _brokingCompanyUuid = brokingCompany.uuid;
      if (corporate) {
        _corporateUuid = corporate.uuid;
      }

      logger.info(`Login credentials: ${maskPwd(credentials)}`);
      const findUserPromises = [];
      if (isDefaultSubdomain) { // Refer https://gitlab.com/vvsanilkumar/employee_benefits/-/merge_requests/63
        findUserPromises.push(null); // CorporateHR
        findUserPromises.push(null); // Customer
        findUserPromises.push(User.findOne({where: {username: credentials.username, brokingCompanyUuid: _brokingCompanyUuid}})); // Executive or Manager
      } else {
        findUserPromises.push(User.findOne({where: {username: credentials.username, corporateUuid: _corporateUuid, role: ROLE_HR}})); // CorporateHR
        findUserPromises.push(User.findOne({where: {username: credentials.username, corporateUuid: _corporateUuid, role: ROLE_CUSTOMER}})); // Customer
        findUserPromises.push(null); // Executive or Manager
      }
      return Promise.all(findUserPromises)
    })
    .then(result => {
      const UserByCorporateHR = result[0];
      const UserByCustomer = result[1];
      const UserByBrokingCompany = result[2];

      logger.verbose(`UserByCorporateHR: ${maskPwd(UserByCorporateHR)}`);
      logger.verbose(`UserByCustomer: ${maskPwd(UserByCustomer)}`);
      logger.verbose(`UserByBrokingCompany: ${maskPwd(UserByBrokingCompany)}`);

      if (!UserByCorporateHR && !UserByCustomer && !UserByBrokingCompany) {
        throw(new InvalidCredentials('Incorrect username or password.', {username: `${credentials.username}`}));
      }
      const _verifyPasswordPromises = [false, false, false];
      if (UserByCorporateHR) {
        _foundUserByCorporateHR = UserByCorporateHR;
        logger.info(`HR user found: {uuid: ${_foundUserByCorporateHR.uuid}, username: ${_foundUserByCorporateHR.username}, role: ${_foundUserByCorporateHR.role}`);
        _verifyPasswordPromises[0] = argon2.verify(_foundUserByCorporateHR.password, credentials.password);
      }
      if (UserByCustomer) {
        _foundUserByCustomer = UserByCustomer;
        logger.info(`Customer user found: {uuid: ${_foundUserByCustomer.uuid}, username: ${_foundUserByCustomer.username}, role: ${_foundUserByCustomer.role}`);
        _verifyPasswordPromises[1] = argon2.verify(_foundUserByCustomer.password, credentials.password);
      }
      if (UserByBrokingCompany) {
        _foundUserByBrokingCompany = UserByBrokingCompany;
        logger.info(`Mgr/Exec user found: {uuid: ${_foundUserByBrokingCompany.uuid}, username: ${_foundUserByBrokingCompany.username}, role: ${_foundUserByBrokingCompany.role}`);
        _verifyPasswordPromises[2] = argon2.verify(_foundUserByBrokingCompany.password, credentials.password);
      }

      return Promise.all(_verifyPasswordPromises);
    })
    .then(passwordCheckResults => {
      if (!passwordCheckResults || passwordCheckResults.length === 0) {
        logger.error(`password checks failed`);
        throw(new InvalidCredentials('Password verification failed.', {username: `${credentials.username}`}));
      }
      let _isCorrectPasswordForCorporateHR = passwordCheckResults[0];
      let _isCorrectPasswordForCustomer = passwordCheckResults[1];
      let _isCorrectPasswordForMgrOrExec = passwordCheckResults[2];

      if (_isCorrectPasswordForCorporateHR) {
        _foundUser = _foundUserByCorporateHR;
      } else if (_isCorrectPasswordForCustomer) {
        _foundUser = _foundUserByCustomer;
      } else if (_isCorrectPasswordForMgrOrExec) {
        _foundUser = _foundUserByBrokingCompany;
      } else {
        throw(new InvalidCredentials('Incorrect username or password provided.', {username: credentials.username}));
      }
      logger.debug(`Password is correct. Preparing JWT token.`);

      _dto.user.uuid = _foundUser.uuid;
      _dto.user.corporateUuid = _foundUser.corporateUuid;
      _dto.user.brokingCompanyUuid = _foundUser.brokingCompanyUuid;
      _dto.user.username = _foundUser.username;
      _dto.user.role = _foundUser.role;
      _dto.user.email = _foundUser.email ? _foundUser.email : '';
      _dto.user.mobile = _foundUser.mobile ? _foundUser.mobile : '';
      _dto.user.jwt = null;

      logger.verbose(`Creating promises to get complete user records`);
      const promises = [
        CorporateHR.findOne({where: {userUuid: _dto.user.uuid, corporateUuid: _dto.user.corporateUuid}}),
        Customer.findOne({where: {userUuid: _dto.user.uuid, corporateUuid: _dto.user.corporateUuid}}),
        Executive.findOne({where: {userUuid: _dto.user.uuid, brokingCompanyUuid: _dto.user.brokingCompanyUuid}})
      ];
      return Promise.all(promises);
    })
    .then(results => {
      logger.verbose(`results: ${JSON.stringify(results)}`);

      const hr = results[0];
      const customer = results[1];
      const executiveOrManager = results[2];

      if (!results || results.length === 0 || (!customer && !hr && !executiveOrManager)) {
        throw(new ServerError('DBIntegrityError','username is valid but no corresponding record was found in Executive, HR, or customers.'));
      }

      switch (_dto.user.role) {
        case ROLE_CUSTOMER:
          if (customer) {
            if ([STATUS_REJECTED, STATUS_RESIGNED, STATUS_CREATED].includes(customer.status)) {
              throw(new InvalidCredentials(`Present status of ${_dto.user.role} '${credentials.username}' - [${customer.status}] - is not sufficient to login.`));
            }
            _dto.user.brokingCompanyUuid = null;
            _dto.user.corporateUuid = customer.corporateUuid;
            _dto.user.empid = customer.empid;
          }
          break;

        case ROLE_HR:
          if (hr) {
            if ([STATUS_REJECTED, STATUS_RESIGNED, STATUS_CREATED].includes(hr.status)) {
              throw(new InvalidCredentials(`Present status of ${_dto.user.role} '${credentials.username}' - [${hr.status}] - is not sufficient to login.`));
            }
            _dto.user.brokingCompanyUuid = null;
            _dto.user.corporateUuid = hr.corporateUuid;
            _dto.user.empid = hr.empid;
          }
          break;

        case ROLE_EXECUTIVE:
        case ROLE_MANAGER:
        case ROLE_SRMANAGER:
        case ROLE_SUPERUSER:
          if (executiveOrManager) {
            _dto.user.brokingCompanyUuid = executiveOrManager.brokingCompanyUuid;
            _dto.user.corporateUuid = null;
            _dto.user.empid = executiveOrManager.empid;
          }
          break;
      }
      logger.verbose(`_dto: ${JSON.stringify(_dto)}`);

      return JWT.sign({data: _dto.user}, jwtConfig.secret, jwtConfig.options, (err, jwtToken) => {
        _dto.user.jwt = jwtToken;
        logger.info(`JWT token is prepared.`);
        resolve(_dto);
      });
    })
    .catch(err => {
      logger.error(err);
      reject(err);
    });
  })
}

const login = credentials => {
  return new Promise((resolve, reject) => {
    logger.info(`${module.filename} - ${login.name}()`);

    const _corporateName = credentials.subdomain.corporateName;
    const _brokingCompanyName = credentials.subdomain.brokingCompanyName;
    _verifyLogin(_corporateName, _brokingCompanyName, credentials)
    .then(loginCredentials => {
      resolve(loginCredentials);
    })
    .catch(err => {
      reject(err);
    })

  });
};

module.exports = {
  login: login,
};
