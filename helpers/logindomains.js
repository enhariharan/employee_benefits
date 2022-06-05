"use strict";

const fs = require('fs'); // No need to call close() on any sync APIs used below. Ref: http://stackoverflow.com/questions/21176733/ddg#21177492
const {logger} = require('../config/logger');
const {BrokingCompany} = require('../models');
const {BadRequest} = require('../errors/invalidQueryParams');

const env = process.env.NODE_ENV || 'development';

const developmentSubdomainConfig = process.env["DEVELOPMENT_SUBDOMAIN_CONFIG_FILE"];
const devSubdomains = developmentSubdomainConfig ? fs.readFileSync(developmentSubdomainConfig, {flag: 'r+'}) : null;
const development = devSubdomains ? JSON.parse(devSubdomains) : null;

const testSubdomainConfig = process.env["TEST_SUBDOMAIN_CONFIG_FILE"];
const testSubdomains = testSubdomainConfig ? fs.readFileSync(testSubdomainConfig, {flag: 'r+'}) : null;
const test = testSubdomains ? JSON.parse(testSubdomains) : null;

const stagingSubdomainConfig = process.env["STAGING_SUBDOMAIN_CONFIG_FILE"];
const stagingSubdomains = stagingSubdomainConfig ? fs.readFileSync(stagingSubdomainConfig, {flag: 'r+'}) : null;
const staging = stagingSubdomains ? JSON.parse(stagingSubdomains) : null;

const productionSubdomainConfig = process.env["PRODUCTION_SUBDOMAIN_CONFIG_FILE"];
const prodSubdomains = productionSubdomainConfig ? fs.readFileSync(productionSubdomainConfig, {flag: 'r+'}) : null;
const production = prodSubdomains ? JSON.parse(prodSubdomains) : null;

const loginDomains = {
  development,
  test,
  staging,
  production
};

const addSubdomain = options => {
  return new Promise( (resolve, reject) => {
    logger.info(`${module.filename} - ${addSubdomain.name}()`);
    logger.debug(`options: ${JSON.stringify(options)}`);

    let newSubdomain = {};
    BrokingCompany.findOne({where: {uuid: options.brokingCompanyUuid}})
    .then(bc => {
      newSubdomain.subdomain = `${options.corporateDisplayName.toLowerCase()}.${bc.displayName.toLowerCase()}`;
      newSubdomain.corporateName = options.corporateName;
      newSubdomain.brokingCompanyName =  bc.companyName;

      let data, found;
      switch(env) {
        case 'development':
          if (!development || !development.subdomains) { reject(`No subdomains defined for env [${env}]`); }
          found = development.subdomains.find(sd => sd.subdomain === newSubdomain.subdomain);
          if (found) {
            reject(new BadRequest(found, 'Given subdomain is already present.'));
          } else {
            development.subdomains.push(newSubdomain);
            data = JSON.stringify(development);
            fs.writeFileSync(developmentSubdomainConfig, data);
            resolve(newSubdomain);
          }
          break;
        case 'test':
          if (!test.subdomains) { reject(`No subdomains defined for env [${env}]`); }
          found = test.subdomains.find(sd => sd.subdomain === newSubdomain.subdomain);
          if (found) {
            reject(new BadRequest(found, 'Given subdomain is already present.'));
          } else {
            development.subdomains.push(newSubdomain);
            data = JSON.stringify(test);
            fs.writeFileSync(testSubdomainConfig, data);
            resolve(newSubdomain);
          }
          break;
        case 'staging':
          if (!staging.subdomains) { reject(`No subdomains defined for env [${env}]`); }
          found = staging.subdomains.find(sd => sd.subdomain === newSubdomain.subdomain);
          if (found) {
            reject(new BadRequest(found, 'Given subdomain is already present.'));
          } else {
            staging.subdomains.push(newSubdomain);
            data = JSON.stringify(staging);
            fs.writeFileSync(stagingSubdomainConfig, data);
            resolve(newSubdomain);
          }
          break;
        case 'production':
          if (!production.subdomains) { reject(`No subdomains defined for env [${env}]`); }
          found = production.subdomains.find(sd => sd.subdomain === newSubdomain.subdomain);
          if (found) {
            reject(new BadRequest(found, 'Given subdomain is already present.'));
          } else {
            production.subdomains.push(newSubdomain);
            data = JSON.stringify(production);
            fs.writeFileSync(productionSubdomainConfig, data);
            resolve(newSubdomain);
          }
          break;
      }
    })
    .catch(err => {
      logger.error(`${JSON.stringify(err)}`);
      reject(err);
    })
  });
};

const _getDefaultSubdomain = env => {
  switch (env) {
    case 'development': return development.defaultSubdomain;
    case 'staging': return staging.defaultSubdomain;
    case 'test':  return test.defaultSubdomain;
    case 'production':  return production.defaultSubdomain;
  }
}

module.exports = {
  loginDomains: loginDomains[env],
  addSubdomain: addSubdomain,
  getDefaultSubdomain : _getDefaultSubdomain
}
