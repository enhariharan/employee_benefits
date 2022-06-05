'use strict';

const env = process.env.NODE_ENV || 'development';
const allowedNodeEnv = ['development', 'test', 'staging'];

module.exports = {
  up: (queryInterface, ignoreSequelize) => {
    if (!allowedNodeEnv.includes(env)) { // This seeder is needed only in production
      return new Promise((resolve, ignoreReject) => {
        console.log(`This seeder works only in ${JSON.stringify(allowedNodeEnv)} environments`);
        resolve(true);
      });
    }
    return queryInterface.bulkUpdate('TPAs', {tpaServiceUrl: 'https://m.fhpl.net/Bunnyconnect/BCService.svc?wsdl'});
  },

  down: (queryInterface, ignoreSequelize) => {
    if (!allowedNodeEnv.includes(env)) { // This seeder is needed only in production
      return new Promise((resolve, ignoreReject) => {
        console.log(`This seeder works only in ${JSON.stringify(allowedNodeEnv)} environments`);
        resolve(true);
      });
    }
    return queryInterface.bulkUpdate('TPAs', {tpaServiceUrl: ''});
  }
};
