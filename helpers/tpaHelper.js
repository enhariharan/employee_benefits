"use strict";

const tpasService = require('../services/tpasService');
const fhplProvider = require('../providers/fhplProvider');
const mediAssistProvider = require('../providers/mediAssistProvider');
const appConfig = require('../config/appConfig');
const providerIdsToTpaId = {};
const {ServerError} = require('../errors/serverError')

const getTPAName = (uuid) => {
    return Object.keys(appConfig.tpaIds).find(key => appConfig.tpaIds[key] === providerIdsToTpaId[uuid]);
};

const getTpaUuidByName = (tpaName) => {    
   return Object.keys(providerIdsToTpaId).find(key => providerIdsToTpaId[key] === appConfig.tpaIds[tpaName]);
};

const loadAllTPAIds = () => {
    tpasService.getAllTpas()
    .then((tpaData) => {
        tpaData.forEach(element => {
            providerIdsToTpaId[element.uuid] = element.tpaid;            
        });        
    })
    .catch((err) => {
        console.log(err);
    });   
};

const getPolicyEcard = (tpaId, empId, policyNumber) => {
     if(getTPAName(tpaId) === undefined){
        return new Promise((resolve, reject) => {
          reject(new ServerError('InvalidTPA', 'No TPA Found'));
        });
     }    
     if(getTPAName(tpaId) === 'fhpl') {
        return fhplProvider.getPolicyEcard(empId, policyNumber);
     }
     if(getTPAName(tpaId) === 'mediAssist'){
        return mediAssistProvider.getPolicyEcard(empId, policyNumber);
     }   

}

const getNetworkHospitalList = (tpaId, insurerName, startIndex, endIndex) => {

    if(getTPAName(tpaId) === undefined){
        return new Promise((resolve, reject) => {
          reject(new ServerError('InvalidTPA', 'No TPA Found'));
        });
     }   
     
     if(getTPAName(tpaId) === 'mediAssist'){
        return mediAssistProvider.getAllNetworkHospitals(insurerName, startIndex, endIndex);
     }
    
};

loadAllTPAIds();

module.exports = {
    getTpaUuidByName: getTpaUuidByName,
    getNetworkHospitalList: getNetworkHospitalList,
    getPolicyEcard: getPolicyEcard
}
