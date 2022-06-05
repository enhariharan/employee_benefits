"use strict";

const {v4: uuidv4} = require('uuid');
const {BrokingCompany} = require('../models');

const getAllBrokingCompanies = () => {
  return new Promise( (resolve, reject) => {
      BrokingCompany.findAll()
        .then(brokingCompanies => {
          let result = [];
          brokingCompanies.forEach(b => {
            result.push(b);
          });
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
    });
};

const addBrokingCompanies = brokingCompanies => {
  return new Promise(
    (resolve, reject) => {
      brokingCompanies.forEach(b => {
        b.uuid = uuidv4();
      })
      BrokingCompany.bulkCreate(brokingCompanies)
        .then(brokingCompanies => {
          resolve(brokingCompanies);
        })
        .catch((error) => {
          reject(error);
        });
    });
};

const getBrokingCompanyByCompanyName = companyName => {
  return new Promise( (resolve, reject) => {
    BrokingCompany.findOne({where: {companyName: companyName}})
    .then(brokingCompany => {resolve(brokingCompany);})
    .catch((error) => {reject(error);});
  });
};

const getBrokingCompanyByDisplayName = displayName => {
  return new Promise( (resolve, reject) => {
    BrokingCompany.findOne({where: {displayName: displayName}})
    .then(brokingCompany => {resolve(brokingCompany);})
    .catch((error) => {reject(error);});
  });
};

const getBrokingCompanyByUuid = uuid => {
  return new Promise( (resolve, reject) => {
    BrokingCompany.findOne({where: {uuid: uuid}})
    .then(brokingCompany => {resolve(brokingCompany);})
    .catch((error) => {reject(error);});
  });
};

module.exports = {
  addBrokingCompanies: addBrokingCompanies,
  getAllBrokingCompanies: getAllBrokingCompanies,
  getBrokingCompanyByCompanyName: getBrokingCompanyByCompanyName,
  getBrokingCompanyByDisplayName: getBrokingCompanyByDisplayName,
  getBrokingCompanyByUuid: getBrokingCompanyByUuid
};
