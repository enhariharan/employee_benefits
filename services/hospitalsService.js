"use strict";

const { NetworkHospital, NonNetworkHospital, Policy } = require('../models');
const {v4: uuidv4} = require('uuid');
const {Op} = require('sequelize');
const soapService = require('./soapService');
const {ServerError} = require("../errors/serverError");
const {logger} = require('../config/logger');

const getNetworkHospitals = queryParams => {
  return new Promise((resolve, reject) => {
    let promise = NetworkHospital.scope('defaultScope').findAll();

    if (!queryParams) {
      promise
      .then(hlist => {resolve(hlist);})
      .catch(error => {reject(error);});

    } else {
      if (queryParams.startIndex) {
        queryParams.startIndex = {[Op.gte]: queryParams.startIndex};
      }
      if (queryParams.endIndex) {
        queryParams.endIndex = {[Op.lte]: queryParams.endIndex};
      }
      if (queryParams.hospitalName) {
        queryParams.name = queryParams.hospitalName;
        delete queryParams['hospitalName'];
      }
      logger.debug(`queryParams: ${JSON.stringify(queryParams)}`);

      if (queryParams.corporateUuid) {
        logger.debug(`queryParams.corporateUuid: ${queryParams.corporateUuid}`);
        Policy.scope('defaultScope').findOne({where: {corporateUuid: queryParams.corporateUuid}})
        .then(policy => {
          queryParams.tpaUuid = policy.tpaUuid;
          delete queryParams['corporateUuid'];
          return NetworkHospital.scope('defaultScope').findAll({where: queryParams});
        })
        .then(hlist => {resolve(hlist);})
        .catch(error => {reject(error);});

      } else {
        NetworkHospital.scope('defaultScope').findAll({where: queryParams})
        .then(hlist => {resolve(hlist);})
        .catch(error => {reject(error);});
      }
    }
  });
};

const getNonNetworkHospitals = () => {
  return new Promise((resolve, reject) => {
    NonNetworkHospital.scope('defaultScope').findAll()
    .then(hlist => {resolve(hlist);})
    .catch(error => {reject(error);});
  });
};

const addNonNetworkHospitals = (nhlist) => {
  return new Promise((resolve, reject) => {
    logger.info(`+${module.id}.${addNonNetworkHospitals.name}()`);
    let result = {};
    nhlist.forEach(h => {
      h.uuid = uuidv4();
    });

    NonNetworkHospital.bulkCreate(nhlist)
    .then(hlist => {
      result.nonNetworkHospitals = hlist;
      resolve(result);
    })
    .catch(err => {
      logger.error(err);
      reject(err);
    });
  });
};

const addNetworkHospitalsFromSoap = (startIndex, endIndex, tpaUuid, insuranceCompanyUuid) => {
  return new Promise((resolve, reject) => {
    logger.debug(`+${module.id}.${addNetworkHospitalsFromSoap.name}()`);
    logger.info(`{startIndex,: ${startIndex}, endIndex: ${endIndex}, tpaUuid: ${tpaUuid}, insuranceCompanyUuid: ${insuranceCompanyUuid}}`, );

    soapService.getAllNetworkHospitals(startIndex, endIndex, tpaUuid, insuranceCompanyUuid)
    .then(hospitals => {
      logger.info(`received [${hospitals.length}] hospitals`);
      return NetworkHospital.bulkCreate(hospitals);
    })
    .then(hospitals => {
      logger.info('Successfully pushed into DB.');
      resolve(hospitals);
    })
    .catch(err => {
      logger.error(err);
      reject(err);
    });
  });
};

const searchNetworkHospitals = searchStr => {
  return new Promise((resolve, reject) => {
    logger.debug(`${module.id} - ${searchNetworkHospitals.name}()`);
    logger.info(`Searching for network hospitals containing [${searchStr}]`);

    NetworkHospital.scope('defaultScope').findAll({
      where: {
        [Op.or]: {
          name: {[Op.substring]: searchStr},
          addressBuildingName: {[Op.substring]: searchStr},
          addressBuildingAddress: {[Op.substring]: searchStr},
          addressStreet: {[Op.substring]: searchStr},
          addressCity: {[Op.startsWith]: searchStr},
          addressDistrict: {[Op.startsWith]: searchStr},
          addressState: {[Op.startsWith]: searchStr},
        }
      },
      attributes: ['name', 'addressBuildingName', 'addressBuildingAddress', 'addressStreet', 'addressCity',
        'addressDistrict', 'addressState'],
    })
    .then(hospitals => {
      logger.debug(hospitals);
      logger.info(`Search found [${hospitals.length}] records`);

      let result = [];
      for (let h in hospitals) {
        result.push(h.name);
      }
      resolve(result);
    })
    .catch(err => {
      const error = new ServerError('HospitalSearchError', 'Error occurred during search for hospitals.', err);
      reject(error);
    });
  });
};

const searchNetworkHospitalNames = searchStr => {
  return new Promise((resolve, reject) => {
    logger.debug(`${module.id} - ${searchNetworkHospitalNames.name}()`);
    logger.info(`Searching for names of network hospitals containing [${searchStr}]`);
    NetworkHospital.scope('defaultScope').findAll({
      where: {name: {[Op.substring]: searchStr}},
      attributes: ['name'],
      group: 'name',
      order: [['name', 'ASC']]
    })
    .then(hospitalNames => {
      logger.debug(hospitalNames);
      logger.info(`Search found [${hospitalNames.length}] records`);
      let searchResults = [];
      hospitalNames.forEach(h => {searchResults.push(h.name);})
      resolve(searchResults);
    })
    .catch(err => {
      const error = new ServerError('HospitalSearchError', 'Error occurred during search for hospital names.', err);
      reject(error);
    });
  });
};

const searchNetworkHospitalCities = searchStr => {
  return new Promise((resolve, reject) => {
    logger.debug(`${module.id} - ${searchNetworkHospitalCities.name}()`);
    logger.info(`Searching for cities of network hospitals containing [${searchStr}]`);
    NetworkHospital.scope('defaultScope').findAll({
      where: {addressCity: {[Op.startsWith]: searchStr}},
      attributes: ['addressCity'],
      group: 'addressCity',
      order: [['addressCity', 'ASC']]
    })
    .then(cities => {
      logger.debug(cities);
      logger.info(`Search found [${cities.length}] records`);
      let searchResults = [];
      cities.forEach(c => {searchResults.push(c.addressCity);})
      resolve(searchResults);
    })
    .catch(err => {
      const error = new ServerError('HospitalSearchError', 'Error occurred during search for hospital cities.', err);
      reject(error);
    });
  });
};

const searchNetworkHospitalPincodes = searchStr => {
  return new Promise((resolve, reject) => {
    logger.debug(`${module.id} - ${searchNetworkHospitalPincodes.name}()`);
    logger.info(`Searching for pincodes of network hospitals containing [${searchStr}]`);
    NetworkHospital.scope('defaultScope').findAll({
      where: {addressPincode: {[Op.startsWith]: searchStr}},
      attributes: ['addressPincode'],
      group: 'addressPincode',
      order: [['addressPincode', 'ASC']]
    })
    .then(pincodes => {
      logger.debug(pincodes);
      logger.info(`Search found [${pincodes.length}] records`);
      let searchResults = [];
      pincodes.forEach(p => {searchResults.push(p.addressPincode);})
      resolve(searchResults);
    })
    .catch(err => {
      const error = new ServerError('HospitalSearchError', 'Error occurred during search for hospital pin-codes.', err);
      reject(error);
    });
  });
};

const searchNonNetworkHospitals = searchStr => {
  return new Promise((resolve, reject) => {
    logger.debug(`${module.id} - ${searchNonNetworkHospitals.name}()`);
    logger.info(`Searching for non-network hospitals containing [${searchStr}]`);
    NonNetworkHospital.scope('defaultScope').findAll({
      where: {
        [Op.or]: {
          name: {[Op.substring]: searchStr},
          addressBuildingName: {[Op.substring]: searchStr},
          addressBuildingAddress: {[Op.substring]: searchStr},
          addressStreet: {[Op.substring]: searchStr},
          addressCity: {[Op.startsWith]: searchStr},
          addressDistrict: {[Op.startsWith]: searchStr},
          addressState: {[Op.startsWith]: searchStr},
        }
      },
      attributes: ['name', 'addressBuildingName', 'addressBuildingAddress', 'addressStreet', 'addressCity',
        'addressDistrict', 'addressState'],
    })
    .then(hospitals => {
      logger.info(`Search found [${hospitals.length}] records`);
      resolve(hospitals);
    })
    .catch(err => {
      const error = new ServerError('HospitalSearchError', 'Error occurred during search for hospitals.', err);
      reject(error);
    });
  });
};


module.exports = {
  getNetworkHospitals: getNetworkHospitals,
  getNonNetworkHospitals: getNonNetworkHospitals,
  addNonNetworkHospitals: addNonNetworkHospitals,
  addNetworkHospitalsFromSoap: addNetworkHospitalsFromSoap,
  searchNetworkHospitalNames: searchNetworkHospitalNames,
  searchNetworkHospitalCities: searchNetworkHospitalCities,
  searchNetworkHospitalPincodes: searchNetworkHospitalPincodes,
  searchNonNetworkHospitals: searchNonNetworkHospitals,
};
