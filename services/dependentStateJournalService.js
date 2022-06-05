"use strict";

const {ServerError} = require("../errors/serverError");
const {logger} = require('../config/logger');
const {DependentStateJournal} = require('../models');

const recordNewDependents = (credentials, dependents) => {
  return new Promise((resolve, reject) => {
    let records = [];
    dependents.forEach(dependent => {
        let entry = {
          dependentUuid: dependent.uuid,
          userUuid: dependent.dependentOnCustomerUuid,
          corporateUuid: dependent.corporateUuid,
          changedByUserUuid: credentials.uuid,
          oldState: '',
          newState: dependent.status
        };
        records.push(entry);
      });
    logger.debug(`Created ${records.length} promise(s).`);
    DependentStateJournal.bulkCreate(records)
    .then(results => {
      if (!results) {
        logger.error(`Journal entries were not at all created for any of the [${results.length}] new dependents`);
        const error = new ServerError('ErrorCreatingJournalEntry', `[${dependents.length}] new dependents added but none were recorded in journal.`)
        reject(error);
      }
      if (results.length !== dependents.length) {
        const error = new ServerError('ErrorCreatingJournalEntry', `[${dependents.length}] new dependents added but only [${results.length}] were recorded in journal.`)
        reject(error);
      }

      logger.info(`Added [${dependents.length}] new dependents into journal.`);
      resolve(results);
    })
    .catch(err => {
      const error = new ServerError('ErrorRecordingNewDependentAddition', `Error occurred while recording new user(s) into Journal. Please see "data" for more details`, err)
      logger.error(error);
      reject(error);
    })
  })
}

const recordUpdateDependents = (credentials, dependent, updatedFields) => {
  return new Promise((resolve, reject) => {   

    let entry = {
      dependentUuid: dependent.uuid,
      userUuid: dependent.dependentOnCustomerUuid,
      corporateUuid: dependent.corporateUuid,
      changedByUserUuid: credentials.uuid,
      oldState: updatedFields.oldState,
      newState: updatedFields.newState
    };
    DependentStateJournal.create(entry)
    .then(result => {
      if (!result) {
        logger.error(`Journal entries were not created.`);
        const error = new ServerError('ErrorCreatingJournalEntry', `Journal entry was not created for dependent ${dependent.uuid} - ${dependent.firstName} ${dependent.lastName} `);
        reject(error);
      }
      resolve(result);
    })
    .catch(err => {
      const error = new ServerError('ErrorRecordingDependentUpdate', `Error occurred while recording dependent update into Journal. Please see "data" for more details`, err);
      logger.error(error);
      reject(error);
    })
  })
}

const recordUpdateDependentsBulk = (credentials, dependents) => {
    return new Promise((resolve, reject) => {   
        let records = [];
        dependents.forEach(dependent => {
          let entry = {
            dependentUuid: dependent.uuid,
            userUuid: dependent.dependentOnCustomerUuid,
            corporateUuid: dependent.corporateUuid,
            changedByUserUuid: credentials.uuid,
            oldState: dependent.oldStatus,
            newState: dependent.status
          };
          records.push(entry);
        });    
        DependentStateJournal.bulkCreate(records)
        .then(results => {
          if (!results) {
            const error = new ServerError('ErrorCreatingJournalEntry', `[${dependents.length}] new dependents added but none were recorded in journal.`);
            reject(error);
          }
          if (results.length !== dependents.length) {
            const error = new ServerError('ErrorCreatingJournalEntry', `[${dependents.length}] new dependents added but only [${results.length}] were recorded in journal.`);
            reject(error);
          }
    
          logger.info(`Added [${dependents.length}] new dependents into journal.`);
          resolve(results);
        })
        .catch(err => {
          const error = new ServerError('ErrorRecordingNewDependentAddition', 'Error occurred while recording new user(s) into Journal. Please see "data" for more details', err);
          logger.error(error);
          reject(error);
        })
      })
  }


module.exports = {
  recordNewDependents: recordNewDependents,
  recordUpdateDependents: recordUpdateDependents,
  recordUpdateDependentsBulk: recordUpdateDependentsBulk
}
