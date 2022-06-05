"use strict";

const {logger} = require('../config/logger');
const {CustomerJournal} = require('../models');
const {ServerError} = require('../errors/serverError');

const recordNewCustomers = (credentials, customers) => {
  return new Promise((resolve, reject) => {
    logger.debug(`+ ${module.id}.${recordNewCustomers.name}()`);
    logger.info(`About to record addition of [${customers.length}] customers into journal.`);

    let records = [];
    customers.forEach(customer => {
      let entry = {
        field: 'uuid and empid',
        description: 'New employee created.',
        changedByUserUuid: credentials.uuid,
        changedByUsername: credentials.username,
        oldValue: '',
        newValue: `{uuid: ${customer.uuid}, empid: ${customer.empid}}`
      };
      records.push(entry);
    });
    logger.debug(`Created ${records.length} promise(s).`);
    CustomerJournal.bulkCreate(records)
    .then(results => {
      if (!results) {
        logger.error(`Journal entries were not at all created for any of the [${results.length}] new customers`);
        const error = new ServerError('ErrorCreatingJournalEntry', '] new users were added successfully but none of them were recorded in journal. This is an internal error.');
        reject(error);
      }
      if (results.length !== customers.length) {
        const error = new ServerError('ErrorCreatingJournalEntry', `[${customers.length}] new users were added successfully but only [${results.length}] were recorded in journal. This is an internal error.`);
        reject(error);
      }

      logger.info(`Added [${customers.length}] new customers into journal.`);
      resolve(results);
    })
    .catch(err => {
      const error = new ServerError('ErrorRecordingNewUserAddition', `Error occured while recording new user(s) addition into Journal. Please see "data" for more details`, err);
      logger.error(error);
      reject(error);
    })
  })
}

const recordUpdateCustomers = (credentials, customer, updatedFields) => {
  return new Promise((resolve, reject) => {
    logger.debug(`+ ${module.id} - ${recordUpdateCustomers.name}()`);

    let entry = {
      field: 'various',
      description: 'customer updated.',
      changedByUserUuid: credentials.uuid,
      changedByUsername: credentials.username,
      oldValue: '',
      newValue: `{uuid: ${customer.uuid}, empid: ${customer.empid}, updated: ${JSON.stringify(updatedFields)}}`
    };
    CustomerJournal.create(entry)
    .then(result => {
      if (!result) {
        logger.error(`Journal entries were not created.`);
        const error = new ServerError('ErrorCreatingJournalEntry', `Journal entry was not created for customer ${customer.empid}`);
        reject(error);
      }
      resolve(result);
    })
    .catch(err => {
      const error = new ServerError('ErrorRecordingEmployeeUpdate', `Error occurred while recording user update into Journal. Please see "data" for more details`, err);
      logger.error(error);
      reject(error);
    })
  })
}

const recordUpdateDependents = (credentials, dependent, updatedFields) => {
  return new Promise((resolve, reject) => {
    logger.debug(`+ ${module.id}.${recordUpdateDependents.name}()`);

    let entry = {
      field: 'various',
      description: 'customer dependents updated.',
      changedByUserUuid: credentials.uuid,
      changedByUsername: credentials.username,
      oldValue: '',
      newValue: `{uuid: ${dependent.uuid}, dependentOnCustomerUuid: ${dependent.dependentOnCustomerUuid}, updated: ${JSON.stringify(updatedFields)}}`
    };

    CustomerJournal.create(entry)
    .then(result => {
      if (!result) {
        logger.error(`Journal entries were not created.`);
        const error = new ServerError('ErrorCreatingJournalEntry', `Journal entry was not created for dependent ${dependent.uuid} - ${dependent.firstName} ${dependent.lastName}`);
        reject(error);
      }
      resolve(result);
    })
    .catch(err => {
      const error = new ServerError('ErrorRecordingEmployeeUpdate', `Error occurred while recording dependent update into Journal. Please see the "data" for more details`, err);
      logger.error(error);
      reject(error);
    })
  })
}

module.exports = {
  recordNewCustomers: recordNewCustomers,
  recordUpdateCustomers: recordUpdateCustomers,
  recordUpdateDependents: recordUpdateDependents
}
