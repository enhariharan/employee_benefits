"use strict";

const {TPA} = require('../models');
const {v4: uuidv4} = require('uuid');

const getAllTpas = () => {
  return new Promise(
    (resolve, reject) => {
      TPA.scope('defaultScope').findAll()
      .then(tpas => {
        resolve(tpas);
      })
      .catch(error => {
        reject(error);
      });
    });
};

const getTpaNameByUuid = uuid => {
  return new Promise(
    (resolve, reject) => {
      TPA.scope('defaultScope', 'companyName').findOne({where: {uuid: uuid}})
      .then(tpa => {
        resolve(tpa);
      })
      .catch(error => {
        reject(error);
      });
    });
};

const getTpaByDisplayName = displayName => {
  return new Promise(
    (resolve, reject) => {
      TPA.scope('defaultScope', 'companyName').findOne({where: {displayName: displayName}})
      .then(tpa => {
        resolve(tpa);
      })
      .catch(error => {
        reject(error);
      });
    });
};

const getTpaByCompanyName = companyName => {
  return new Promise(
    (resolve, reject) => {
      TPA.scope('defaultScope', 'companyName').findOne({where: {companyName: companyName}})
      .then(tpa => {
        resolve(tpa);
      })
      .catch(error => {
        reject(error);
      });
    });
};

const getTpaByTpaId = tpaid => {
  return new Promise(
    (resolve, reject) => {
      TPA.scope('defaultScope', 'companyName').findOne({where: {tpaid: tpaid}})
      .then(tpa => {
        resolve(tpa);
      })
      .catch(error => {
        reject(error);
      });
    });
};

const addTpas = (tpas) => {
  return new Promise(
    (resolve, reject) => {
      tpas.forEach(t => {
        t.uuid = uuidv4();
      });
      TPA.bulkCreate(tpas)
      .then(tpas => {
        resolve(tpas);
      })
      .catch(error => {
        console.error(error);
        reject(error);
      });
    });
};

module.exports = {
  getAllTpas: getAllTpas,
  getTpaByCompanyName: getTpaByCompanyName,
  getTpaByDisplayName: getTpaByDisplayName,
  getTpaByTpaId: getTpaByTpaId,
  getTpaNameByUuid: getTpaNameByUuid,
  addTpas: addTpas
};