"use strict";

const {v4: uuidv4} = require('uuid');
const {InsuranceCompany} = require('../models');

const getAllInsuranceCompanies = () => {
  return new Promise((resolve, reject) => {
    InsuranceCompany.scope('defaultScope').findAll()
    .then(insuranceCompanies => {
      let result = [];
      insuranceCompanies.forEach(b => {
        result.push(b);
      });
      resolve(result);
    })
    .catch((error) => {
      reject(error);
    });
  });
};

const getInsuranceCompanyNameByUuid = (uuid) => {
  return new Promise((resolve, reject) => {
    InsuranceCompany.scope('defaultScope', 'companyName').findOne({where: {uuid: uuid}})
    .then(insuranceCompany => {
      resolve(insuranceCompany);
    })
    .catch((error) => {
      reject(error);
    });
  });
};

const addInsuranceCompanies = (insuranceCompanies) => {
  return new Promise((resolve, reject) => {
    insuranceCompanies.forEach(b => {
      b.uuid = uuidv4();
    })
    InsuranceCompany.bulkCreate(insuranceCompanies)
    .then(insuranceCompanies => {
      console.info('Successfuly added [' + insuranceCompanies.length + '] insurance Companies.');
      resolve(insuranceCompanies);
    })
    .catch((error) => {
      console.error('Error while adding insuranceCompanies');
      reject(error);
    });
  });
};

module.exports = {
  getAllInsuranceCompanies: getAllInsuranceCompanies,
  getInsuranceCompanyNameByUuid: getInsuranceCompanyNameByUuid,
  addInsuranceCompanies: addInsuranceCompanies,
}