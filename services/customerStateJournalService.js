"use strict";

const {logger} = require('../config/logger');
const {CustomerStateJournal} = require('../models');
const {ServerError} = require('../errors/serverError');

const recordNewCustomers = (credentials, customers) => {
  return new Promise((resolve, reject) => {   
    let records = [];
    customers.forEach(customer => {
      let entry = {
        userUuid: customer.uuid,
        corporateUuid: customer.corporateUuid,
        changedByUserUuid: credentials.uuid,
        oldState: '',
        newState: customer.status
      };
      records.push(entry);
    });    
    CustomerStateJournal.bulkCreate(records)
    .then(results => {
      if (!results) {
        const error = new ServerError('ErrorCreatingJournalEntry', `[${customers.length}] new users were added successfully but none of them were recorded in journal. This is an internal error.`)
        reject(error);
      }
      if (results.length !== customers.length) {
        const error = new ServerError('ErrorCreatingJournalEntry', `[${customers.length}] new users were added successfully but only [${results.length}] were recorded in journal. This is an internal error.`)
        reject(error);
      }
      logger.info(`Added [${customers.length}] new customers into journal.`);
      resolve(results);
    })
    .catch(err => {
      const error = new ServerError('ErrorRecordingNewUserAddition', `Error occurred while recording new user(s) addition into Journal. Please see "data" for more details`, err)
      logger.error(error);
      reject(error);
    })
  })
}

const recordUpdateCustomers = (credentials, customer, updatedFields) => {
  return new Promise((resolve, reject) => {  

    let entry = {
      userUuid: customer.uuid,
      corporateUuid: customer.corporateUuid,
      changedByUserUuid: credentials.uuid,
      oldState: updatedFields.oldState,
      newState: updatedFields.newState
    };
    CustomerStateJournal.create(entry)
    .then(result => {
      if (!result) {
        logger.error(`Journal entries were not created.`);
        const error = new ServerError('ErrorCreatingJournalEntry', `Journal entry was not created for customer ${customer.empid}`)
        reject(error);
      }
      resolve(result);
    })
    .catch(err => {
      const error = new ServerError('ErrorRecordingEmployeeUpdate', `Error occurred while recording user update into Journal. Please see "data" for more details`, err)
      logger.error(error);
      reject(error);
    })
  })
}

const recordUpdateCustomersBulk = (credentials, customers) => {
    return new Promise((resolve, reject) => {   
        let records = [];
        customers.forEach(customer => {
          let entry = {
            userUuid: customer.uuid,
            corporateUuid: customer.corporateUuid,
            changedByUserUuid: credentials.uuid,
            oldState: customer.oldStatus,
            newState: customer.status
          };
          records.push(entry);
        });    
        CustomerStateJournal.bulkCreate(records)
        .then(results => {
          if (!results) {
            const error = new ServerError('ErrorCreatingJournalEntry', `[${customers.length}] new users were added successfully but none of them were recorded in journal. This is an internal error.`)
            reject(error);
          }
          if (results.length !== customers.length) {
            const error = new ServerError('ErrorCreatingJournalEntry', `[${customers.length}] new users were added successfully but only [${results.length}] were recorded in journal. This is an internal error.`)
            reject(error);
          }
          logger.info(`Added [${customers.length}] new customers into journal.`);
          resolve(results);
        })
        .catch(err => {
          const error = new ServerError('ErrorRecordingNewUserAddition', `Error occurred while recording new user(s) addition into Journal. Please see "data" for more details`, err)
          logger.error(error);
          reject(error);
        })
      })
  }



module.exports = {
  recordNewCustomers: recordNewCustomers,
  recordUpdateCustomers: recordUpdateCustomers,
  recordUpdateCustomersBulk: recordUpdateCustomersBulk
}
