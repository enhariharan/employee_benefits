"use strict"

const jwt = require('jsonwebtoken');
const jwtOptions = require('../config/jwtconfig');
const {User, Executive, CorporateHR, Customer} = require('../models');
const {logger} = require('../config/logger');
const {InvalidCredentials} = require('../errors/invalidCredentials');
const {ServerError} = require('../errors/serverError');

const AUTHORIZED_ROLES = require('./employeeStatus').AUTHORIZED_ROLES;
const ROLE_SUPERUSER = require('./employeeStatus').ROLE_SUPERUSER;
const ROLE_SRMANAGER = require('./employeeStatus').ROLE_SRMANAGER;
const ROLE_MANAGER = require('./employeeStatus').ROLE_MANAGER;
const ROLE_EXECUTIVE = require('./employeeStatus').ROLE_EXECUTIVE;
const ROLE_HR = require('./employeeStatus').ROLE_HR;
const ROLE_CUSTOMER = require('./employeeStatus').ROLE_CUSTOMER;
const ROLE_ALL = require('./employeeStatus').ROLE_ALL;

const _getRoles = req => {
  return new Promise((resolve, reject) => {
    let authObj;
    if (req.originalUrl.includes('/customers') && req.originalUrl.includes('/dependents') && req.method === 'POST') {
      authObj = AUTHZ_RULES.find(el => el.method.toUpperCase() === 'POST' && el.url.includes('/api/v1/customers/:empid/dependents'));
    } else {
      authObj = AUTHZ_RULES.find(el => el.method.toUpperCase() === req.method && req.originalUrl.includes(el.url));
    }
    if (authObj) {
      resolve(authObj.authorizedRoles);
    } else {
      reject('No authorization rule present for this API');
    }
  });
}

const authorize = (req, res, next) => {
  return new Promise((resolve, ignoreReject) => {
    logger.info(`+${module.id}.${authorize.name}()`);

    let _decodedTokenData;
    let _authorizedRoles;

    _getRoles(req)
    .then(authorizedRoles => {
      _authorizedRoles = authorizedRoles;
      logger.debug(`authorizedRoles: ${JSON.stringify(_authorizedRoles)}`);

      if (!req.headers.authorization || !req.headers.authorization.length) {
        throw new InvalidCredentials('Unauthorized access. No JWT token provided.');
      }

      if (!_authorizedRoles || _authorizedRoles.length === 0) {
        // Please refer to the detailed comment above.
        throw new InvalidCredentials('Unauthorized access. No JWT token provided.');
      }

      _authorizedRoles.forEach(role => {
        if (!AUTHORIZED_ROLES.includes(role)) {
          throw new InvalidCredentials('Unauthorized access. No JWT token provided.', role);
        }
      });

      const _token = req.headers.authorization;
      const _decoded = jwt.verify(_token, jwtOptions.secret);
      if (!_decoded || !_decoded.data) {
        throw new InvalidCredentials('Error in JWT token.');
      }
      _decodedTokenData = _decoded.data;
      logger.verbose(`decoded Token Data: {${JSON.stringify(_decodedTokenData)}`);

      if (_authorizedRoles.includes('*')) {
        req.decodedTokenData = _decodedTokenData;
        return null;
      } else {
        const _queryOptions = {uuid: _decodedTokenData.uuid};
        return User.findOne({where: _queryOptions})
      }
    })
    .then(user => {
      if (_authorizedRoles.includes('*')) {
        return null;
      } else {
        if (!user) {
          throw (new InvalidCredentials('Invalid JWT token. username is null.'));
        }
        logger.debug(`user {username: ${user.username}, role: ${user.role}} found`);
        logger.debug(`Authorized roles for this API: [${_authorizedRoles}], user.role: ${user.role}`);
        if (!_authorizedRoles.includes(user.role)) {
          logger.info(`{username: ${user.username}, role: ${user.role}} is not authorized to perform this operation.`);
          throw (new InvalidCredentials('Error in JWT token Or Invalid credentials Or Invalid role presented. You are not authorized to perform this operation.'));
        }

        switch (user.role) {
          case ROLE_SUPERUSER:
          case ROLE_SRMANAGER:
          case ROLE_MANAGER:
          case ROLE_EXECUTIVE:
            return Executive.findOne({where: {userUuid: _decodedTokenData.uuid}});
          case ROLE_HR:
            return CorporateHR.findOne({where: {userUuid: user.uuid}});
          case ROLE_CUSTOMER:
            return Customer.findOne({where: {userUuid: user.uuid}});
        }
      }
    })
    .then(record => {
      if (_authorizedRoles.includes('*')) {
        next();
      } else {
        logger.debug(record);
        if (!record) {
          const err = new ServerError('DBIntegrityErrorWithUsername',
            'There is an issue with database integrity. The given username was valid but no corresponding manager/executive/customer/hr record was found.');
          throw(err);
        }

        if (_decodedTokenData.role === ROLE_MANAGER || ROLE_EXECUTIVE) {
          _decodedTokenData.executiveUuid = record.dataValues.uuid;
        }
        req.decodedTokenData = _decodedTokenData;
        next();
      }
    })
    .catch(err => {
      logger.error(err);
      next(err);
    })
  });
};

const allRoles = [ROLE_SUPERUSER, ROLE_SRMANAGER, ROLE_MANAGER, ROLE_EXECUTIVE, ROLE_HR, ROLE_CUSTOMER];
const allRolesMinusCustomer = [ROLE_SUPERUSER, ROLE_SRMANAGER, ROLE_MANAGER, ROLE_EXECUTIVE, ROLE_HR];
const allRolesMinusCustomerAndHr = [ROLE_SUPERUSER, ROLE_SRMANAGER, ROLE_MANAGER, ROLE_EXECUTIVE];
const managersOnly = [ROLE_SUPERUSER, ROLE_SRMANAGER, ROLE_MANAGER];
const customerAndHrOnly = [ROLE_CUSTOMER, ROLE_HR];
const AUTHZ_RULES = [
  {url: '/api/v1/brokingCompanies', method: 'GET', authorizedRoles: allRolesMinusCustomerAndHr},
  {url: '/api/v1/brokingCompanies', method: 'POST', authorizedRoles: allRolesMinusCustomerAndHr},

  {url: '/api/v1/claims', method: 'GET', authorizedRoles: allRoles},
  {url: '/api/v1/claims', method: 'POST', authorizedRoles: allRoles},

  {url: '/api/v1/corporateHrs', method: 'GET', authorizedRoles: allRolesMinusCustomer},
  {url: '/api/v1/corporateHrs', method: 'PUT', authorizedRoles: allRolesMinusCustomer},
  {url: '/api/v1/corporateHrs', method: 'POST', authorizedRoles: allRolesMinusCustomer},

  {url: '/api/v1/corporates', method: 'GET', authorizedRoles: allRolesMinusCustomer},
  {url: '/api/v1/corporates', method: 'POST', authorizedRoles: allRolesMinusCustomerAndHr},
  {url: '/api/v1/corporates', method: 'PUT', authorizedRoles: allRolesMinusCustomer},

  {url: '/api/v1/corporates/executives', method: 'GET', authorizedRoles: managersOnly},
  {url: '/api/v1/corporates/search', method: 'GET', authorizedRoles: allRoles},
  {url: '/api/v1/corporates/update_executive', method: 'PUT', authorizedRoles: managersOnly},

  {url: '/api/v1/customers/getReportedIssues', method: 'GET', authorizedRoles: customerAndHrOnly},
  {url: '/api/v1/customers/helpdesk', method: 'GET', authorizedRoles: customerAndHrOnly},
  {url: '/api/v1/customers/insurance_enquiry', method: 'POST', authorizedRoles: customerAndHrOnly},
  {url: '/api/v1/customers/report_issue', method: 'POST', authorizedRoles: customerAndHrOnly},
  {url: '/api/v1/customers/search', method: 'GET', authorizedRoles: allRolesMinusCustomer},
  {url: '/api/v1/customers', method: 'GET', authorizedRoles: allRoles},
  {url: '/api/v1/customers', method: 'PUT', authorizedRoles: allRolesMinusCustomer},
  {url: '/api/v1/customers', method: 'POST', authorizedRoles: allRolesMinusCustomer},
  {url: '/api/v1/customers/:empid/dependents', method: 'POST', authorizedRoles: allRoles},
  {url: '/api/v1/customers/bulk-status', method: 'PUT', authorizedRoles: allRolesMinusCustomer},
  {url: '/api/v1/customers/dependents', method: 'PUT', authorizedRoles: allRolesMinusCustomer},
  {url: '/api/v1/customers/dependents', method: 'GET', authorizedRoles: allRoles},
  {url: '/api/v1/customers/dependents/bulk-add', method: 'POST', authorizedRoles: allRolesMinusCustomer},
  {url: '/api/v1/customers/dependents/bulk-status', method: 'PUT', authorizedRoles: allRolesMinusCustomer},
  {url: '/api/v1/customers/dependents/list', method: 'GET', authorizedRoles: allRolesMinusCustomer},

  {url: '/api/v1/dashboard/claim/analytics', method: 'GET', authorizedRoles: allRolesMinusCustomer},

  {url: '/api/v1/executives', method: 'GET', authorizedRoles: allRolesMinusCustomerAndHr},
  {url: '/api/v1/executives', method: 'PUT', authorizedRoles: managersOnly},
  {url: '/api/v1/executives', method: 'POST', authorizedRoles: allRolesMinusCustomerAndHr},
  {url: '/api/v1/executives/callback_enquiry_list', method: 'GET', authorizedRoles: allRolesMinusCustomerAndHr},
  {url: '/api/v1/executives/issues_list', method: 'GET', authorizedRoles: allRolesMinusCustomerAndHr},
  {url: '/api/v1/executives/resolve_callback', method: 'PUT', authorizedRoles: allRolesMinusCustomerAndHr},
  {url: '/api/v1/executives/resolve_issue', method: 'PUT', authorizedRoles: allRolesMinusCustomerAndHr},


  {url: '/api/v1/insuranceCompanies', method: 'GET', authorizedRoles: [ROLE_ALL]},
  {url: '/api/v1/insuranceCompanies', method: 'POST', authorizedRoles: managersOnly},

  {url: '/api/v1/networkHospitals', method: 'GET', authorizedRoles: allRoles},
  {url: '/api/v1/networkHospitals/search', method: 'GET', authorizedRoles: allRoles},
  {url: '/api/v1/networkHospitals', method: 'POST', authorizedRoles: allRolesMinusCustomerAndHr},

  {url: '/api/v1/nonNetworkHospitals', method: 'GET', authorizedRoles: allRoles},
  {url: '/api/v1/nonNetworkHospitals', method: 'POST', authorizedRoles: allRolesMinusCustomerAndHr},
  {url: '/api/v1/nonNetworkHospitals/search', method: 'GET', authorizedRoles: allRoles},

  {url: '/api/v1/notifications/pendingActions', method: 'GET', authorizedRoles: allRolesMinusCustomer},

  {url: '/api/v1/policies/ecard', method: 'GET', authorizedRoles: allRoles},
  {url: '/api/v1/policies', method: 'GET', authorizedRoles: allRoles},
  {url: '/api/v1/policies', method: 'POST', authorizedRoles: allRolesMinusCustomerAndHr},
  {url: '/api/v1/policies', method: 'PUT', authorizedRoles: allRolesMinusCustomerAndHr},

  {url: '/api/v1/dashboard/policy/analytics', method: 'GET', authorizedRoles: allRolesMinusCustomer},

  {url: '/api/v1/tpas', method: 'GET', authorizedRoles: [ROLE_ALL]},
  {url: '/api/v1/tpas', method: 'POST', authorizedRoles: managersOnly},
  
];

module.exports = {
  authorize: authorize,
};
