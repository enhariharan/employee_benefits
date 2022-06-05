"use strict";

const {v4: uuidv4} = require('uuid');
const argon2 = require('argon2');
const {CorporateHR, Customer, Dependent, sequelize, User, Policy, EmployeeGrievance, InsuranceEnquiry} = require('../models');
const {Op} = require("sequelize");
const {logger} = require('../config/logger');
const customerStateJournalService  = require('./customerStateJournalService');
const dependentStateJournalService = require('./dependentStateJournalService');
const corporateHrsService = require('./corporateHrsService');
const customerStatus = require('./employeeStatus');
const VALID_CUSTOMER_STATUSES = require('./employeeStatus').status;
const VALID_CUSTOMER_APPROVAL_TYPES = require('./employeeStatus').approvalType;
const mailHelper = require('../helpers/mailHelper');
const employeeStatus = require("./employeeStatus");
const {ServerError} = require('../errors/serverError')
const {BadRequest} = require('../errors/invalidQueryParams');

const father = employeeStatus.DEPENDENT_RELATION_FATHER;
const fatherInLaw = employeeStatus.DEPENDENT_RELATION_FATHER_IN_LAW;
const mother = employeeStatus.DEPENDENT_RELATION_MOTHER;
const motherInLaw = employeeStatus.DEPENDENT_RELATION_MOTHER_IN_LAW;
const spouse = employeeStatus.DEPENDENT_RELATION_SPOUSE;
const husband = employeeStatus.DEPENDENT_RELATION_HUSBAND;
const wife = employeeStatus.DEPENDENT_RELATION_WIFE;

const getAllCustomers = (corporateUuid, status, approvalType) => {
  return new Promise((resolve, reject) => {
    logger.info(`+${module.id} - ${getAllCustomers.name}()`);
    logger.debug(`received params: {corporateUuid: ${corporateUuid}, status: ${status}, approvalType:${approvalType}}`);
    if (status) {
      logger.debug(`{status: ${status}}`);
    }
    if (approvalType) {
      logger.debug(`{approvalType: ${approvalType}}`);
    }

    let whereOptions = {};
    if (corporateUuid) {
      whereOptions.corporateUuid = corporateUuid;
    }
    if (status) {
      whereOptions.status = (status === 'all') ? {[Op.or]: VALID_CUSTOMER_STATUSES} : status;
    }
    if (approvalType) {
      whereOptions.approvalType = (approvalType === 'all') ? {[Op.or]: VALID_CUSTOMER_APPROVAL_TYPES} : approvalType;
    }
    logger.info(`Querying for customers with these options: ${JSON.stringify(whereOptions)}`);

    const scopeList = ['defaultScope', 'minimalFields'];
    const promise = (Object.keys(whereOptions))
      ? Customer.scope(scopeList).findAll({where: whereOptions})
      : Customer.scope(scopeList).findAll();

    promise
    .then(customers => {
      console.info('Successfully received all customers from DB.');
      resolve(customers);
    })
    .catch(err => {
      console.info('Error encountered while getting all customers from DB.');
      reject(err);
    });
  });
}

const getDependentsByEmpidByCorporateUuid = (empid, status, approvalType, corporateUuid) => {
  return new Promise((resolve, reject) => {
    logger.info(`+${module.id} - ${getDependentsByEmpidByCorporateUuid.name}()`);

    Customer.findOne({where: {empid: empid, corporateUuid: corporateUuid}})
    .then(c => {
      logger.info(`customer [${c.firstName} ${c.lastName}] found with empid [${c.empid}]`);

      let whereOptions = {};
      whereOptions.dependentOnCustomerUuid = c.uuid;
      if (status) {
        whereOptions.status = status;
      }
      if (approvalType) {
        whereOptions.approvalType = approvalType;
      }
      logger.info(`Querying for dependents with these options: ${JSON.stringify(whereOptions)}`);

      return Dependent.scope(['defaultScope', 'minimalFields']).findAll({where: whereOptions});
    })
    .then(d => {
      logger.info(`[${d.length}] dependents found`,);
      resolve(d);
    })
    .catch((error) => {
      reject(error);
    });
  });
}

const getDependentByUuid = (uuid) => {
  return new Promise((resolve, reject) => {
    logger.info(`+${module.id} - ${getDependentByUuid.name}()`);
    let _dto = {};
    _dto.empid = null;
    Dependent.findOne({where: {uuid: uuid}})
    .then(d => {
      logger.info(`Dependent ${JSON.stringify(d)}`);
      _dto = d.dataValues;
      return Customer.findOne({where: {uuid: d.dependentOnCustomerUuid}});
    })
    .then(c => {
      logger.info(`Customer [${c.firstName} ${c.lastName}] found`);
      _dto.empid = c.empid;
      logger.info(`Dependent ${JSON.stringify(_dto)}`);
      resolve(_dto);
    })
    .catch((error) => {
      reject(error);
    });
  });
}

const getCustomerByEmpIdByCorporateUuid = (empid, corporateUuid) => {
  return new Promise((resolve, reject) => {
    logger.info(`+${module.id} - ${getCustomerByEmpIdByCorporateUuid.name}()`);

    logger.verbose(`{empid: ${empid}, corporateUuid: ${corporateUuid}`);

    Customer.scope(['defaultScope', 'minimalFields']).findOne({where: {empid: empid, corporateUuid: corporateUuid}})
    .then(customer => {
      if (customer) {
        logger.verbose(`customer: {empid: ${customer.empid}, firstName: ${customer.firstName}, lastName: ${customer.lastName}`);
      }
      resolve(customer);
    })
    .catch(err => {
      logger.error(`Error encountered while getting all customers from DB: ${JSON.stringify(err)}`);
      reject(err);
    });
  });
}

const getCustomersByCorporateHrUuid = (corporateHrUuid, status, approvalType) => {
  return new Promise((resolve, reject) => {
    logger.info(`+${module.id} - ${getCustomersByCorporateHrUuid.name}()`);

    CorporateHR.findOne({where: {userUuid: corporateHrUuid}})
    .then(hr => {
      let whereOptions = {};
      whereOptions.corporateUuid = hr.corporateUuid;
      if (status) {
        whereOptions.status = (status === 'all') ? {[Op.or]: VALID_CUSTOMER_STATUSES} : status;
      }
      if (approvalType) {
        whereOptions.approvalType = (approvalType === 'all') ? {[Op.or]: VALID_CUSTOMER_APPROVAL_TYPES} : approvalType;
      }
      logger.info(`Querying for customers with these options: ${JSON.stringify(whereOptions)}`);

      return Customer.scope(['defaultScope', 'minimalFields']).findAll({where: whereOptions});
    })
    .then(customers => {
      logger.info(`Query returned [${customers.length}] customers.`);
      resolve(customers);
    })
    .catch(err => {
      logger.error('Error encountered while getting all customers by corporateUuid.');
      reject(err);
    });
  });
}

const getCustomerByUserUuid = (userUuid) => {
  return new Promise((resolve, reject) => {
    logger.info(`+${module.id} - ${getCustomerByUserUuid.name}`);

    logger.debug(`+Searching for customer with userUuid [${userUuid}]`);
    Customer.scope(['defaultScope', 'minimalFields']).findOne({where: {userUuid: userUuid}})
    .then(customer => {
      if (customer) {
        logger.debug(`Found customer {empid: ${customer.empid}, firstName: ${customer.firstName}.`);
      }
      resolve(customer);
    })
    .catch(err => {
      logger.info(`Error encountered while getting customer [{userUuid: ${userUuid}}] from DB.`);
      logger.error(err);
      reject(err);
    });
  });
}

const getCustomerByUuid = (uuid) => {
  return new Promise((resolve, reject) => {
    logger.info(`+${module.id} - ${getCustomerByUuid.name}`);
    Customer.scope(['defaultScope', 'minimalFields']).findOne({where: {uuid: uuid}})
    .then(customer => {
      if (customer) {
        logger.debug(`Found customer {empid: ${customer.empid}, firstName: ${customer.firstName}.`);
      }
      resolve(customer);
    })
    .catch(err => {
      logger.info(`Error encountered while getting customer [{userUuid: ${uuid}}] from DB.`);
      logger.error(err);
      reject(err);
    });
  });
}

const _validateNewCustomers = (credentials, customers) => {
  return new Promise((resolve, reject) => {

    let _dupCustomerPromises = [];
    let _dupUserPromises = [];
    let _dupCustomers = [];
    customers.forEach(c => {
      c.uuid = uuidv4();
      c.status = (credentials.username === employeeStatus.CRONJOB_USERNAME && c.status) ? c.status : customerStatus.STATUS_CREATED;
      _dupCustomerPromises.push(Customer.findOne({where: {empid: c.empid, corporateUuid: c.corporateUuid}}));
      _dupUserPromises.push(User.findOne({where: {username: c.empid, corporateUuid: c.corporateUuid}}));

      // DoB is mandatory field in principle but it is not marked as NULL in DB intentionally (refer issue #70).
      // Therefore, if DoB is null then initialize DoB to 1872-02-29 in dd/mm/yyyy format.
      // refer issue #70
      const defaultDoB = '29/02/1872';
      if (!c.dob) {
        // refer issue #70
        logger.info(`Date of Birth was not provided for employee {empid: ${c.empid}, corporateUuid: ${c.corporateUuid}}. It is initialized to ${defaultDoB}`);
        c.dob = defaultDoB;
      }
    });

    Promise.all(_dupCustomerPromises)
    .then(customersFromDb => {
      customersFromDb.forEach(c => {
        if (c && c.uuid && c.userUuid && c.empid && c.corporateUuid) {
          logger.info(`Customer {uuid: ${c.uuid}, empid: ${c.empid}, corporateUuid: ${c.corporateUuid}, name: ${c.firstName} ${c.lastName} } is already present`);
          const dupe = customers.find(el => (el.empid === c.empid && el.corporateUuid === c.corporateUuid));
          _dupCustomers.push(dupe);
        }
      })

      const _logmsg = (_dupCustomers && _dupCustomers.length !== 0)
        ? 'Some customers provided for new addition are already present in table.'
        : 'All customers are new.';
      logger.info(_logmsg);
      return Promise.all(_dupUserPromises);
    })
    .then(usersFromDb => {
      let _dupUsers = [];
      usersFromDb.forEach(u => {
        if (u && u.uuid && u.username) {
          logger.info(`User {uuid: ${u.uuid}, username: ${u.username}} is already present`);
          _dupUsers.push(u);
        }
      })
      if (_dupUsers && _dupUsers.length !== 0) {
        logger.info(`Some customers (and users) provided for new addition are already present in table.`);
        let _uniqueCustomers = customers.filter(
          c => {
            return !_dupUsers.find(du => (du.username === c.empid) && (du.corporateUuid === c.corporateUuid))
          }
        );
        resolve(_uniqueCustomers, _dupCustomers);
      } else {
        logger.info(`All customers and users are new.`);
        resolve(customers, null);
      }
    })
    .catch(err => {
      logger.error(err);
      reject(err);
    })
  })
}

const _validateNewDependents = (customer, dependents) => {
  return new Promise((resolve, reject) => {

    let _dupDependentPromises = [];
    let _dupDependents = [];
    let _uniqueDependents = [];

    logger.verbose(`customer: ${JSON.stringify(customer)}`)
    logger.verbose(`dependents: ${JSON.stringify(dependents)}`)

    dependents.forEach(d => {
      d.uuid = uuidv4();
      d.dependentOnCustomerUuid = customer.uuid;
      d.status = customerStatus.STATUS_CREATED;
      d.dob = _convertFromEbpFormatDate(d.dob).date;

      _dupDependentPromises.push(Dependent.findOne({where:
          {firstName: d.firstName, lastName: d.lastName, dependentOnCustomerUuid: customer.uuid}}));
    });

    Promise.all(_dupDependentPromises)
    .then(dependentsFromDb => {
      logger.verbose(`dependentsFromDb: ${JSON.stringify(dependentsFromDb)}`)
      dependentsFromDb.forEach(d => {
        if (d && d.uuid) {
          if (d.dependentOnCustomerUuid && d.corporateUuid) {
            logger.info(`Dependent {uuid: ${d.uuid}, dependentOnCustomerUuid: ${d.dependentOnCustomerUuid}, corporateUuid: ${d.corporateUuid}, name: ${d.firstName} ${d.lastName} } is already present.`);
            const dupe = dependents.find(el => (el.firstName === d.firstName && el.lastName === d.lastName && el.dependentOnCustomerUuid === d.dependentOnCustomerUuid));
            _dupDependents.push(dupe);
          }
        }
      })
      _uniqueDependents = dependents.filter(
        d => !_dupDependents.find(dup => dup.uuid === d.uuid)
      );
      if (_dupDependents.length === 0) { _dupDependents = null; }
      if (_uniqueDependents.length === 0) { _uniqueDependents = null; }
      if (!_uniqueDependents && !_dupDependents) {_uniqueDependents = dependents}
      logger.verbose(`_dupDependents: ${JSON.stringify(_dupDependents)}`)
      logger.verbose(`_uniqueDependents: ${JSON.stringify(_uniqueDependents)}`)
      resolve(_uniqueDependents, _dupDependents);
    })
    .catch(err => {
      logger.error(err);
      reject(err);
    })
  })
}

function _convertFromEbpFormatDate(dob) {
  // client sends customer.dob as a string in the format of "dd/mm/yyyy". So there is no timezone information whatsoever from the client.
  // Ideally the client must just convert the dob into UTC string so that tz info is also retained from client and
  // server can easily create Date object out of it and store.
  // But this was a decision taken in the client side to send only "dd/mm/yyyy". Server is having to adapt to this decision.
  // Therefore, server assumes the default timezone from the client to be IST (i.e., UTC+5.30). But this is not
  // correct. Server should not assume anything about client data and client must provide as much context as possible to identify it's data correctly (esp. dates).
  // This may lead to future issues when client calls come from all over the world.
  const [dd, mm, yyyy] = dob.split('/');
  const hhmmss = '15:00:00'; // assume hh to be 3pm IST so that conversion to most of UTC/GMT/US/EU/ANZ/Af/SAm timezones will not change value of dd
  const tzoffset = '+05:30';
  const date = new Date(`${yyyy}-${mm}-${dd}T${hhmmss}${tzoffset}`);
  return {dd: dd, mm: mm, yyyy: yyyy, ddmmyyyy: `${dd}${mm}${yyyy}`, date: date};
}

const _createNewUsersAndUpdatedCustomers = customers => {
  return new Promise((resolve, reject) => {
    let newUsers = [];
    let passwordPromises = [];
    customers.forEach(customer => {
      logger.debug(`Creating new user from Customer : ${JSON.stringify(customer)}`);
      let user = {};
      user.uuid = uuidv4();
      customer.userUuid = user.uuid;
      user.username = customer.empid;
      user.role = 'customer';
      user.corporateUuid = customer.corporateUuid;
      user.brokingCompanyUuid = null;
      user.email = customer.email ? customer.email : null;
      user.mobile = customer.mobile ? customer.mobile : null;

      const tempDate = _convertFromEbpFormatDate(customer.dob);
      user.password = tempDate.ddmmyyyy;
      customer.dob = tempDate.date;

      if (customer.dateOfJoining && typeof customer.dateOfJoining === 'string') {
        const date = new Date(customer.dateOfJoining);
        if (date instanceof Date) {
          customer.dateOfJoining = date;
        }
      }

      if (customer.dateOfExit && typeof customer.dateOfExit === 'string') {
        const date = new Date(customer.dateOfExit);
        if (date instanceof Date) {
          customer.dateOfExit = date;
        }
      }

      passwordPromises.push(argon2.hash(user.password));
      newUsers.push(user);
    })

    Promise.all(passwordPromises)
    .then(passwordHashes => {
      for (let i = 0; i < newUsers.length; i++) {
        newUsers[i].password = passwordHashes[i];
      }
      logger.info('Created newUsers for adding new user objects to DB.');
      resolve({newUsers: newUsers, updatedCustomers: customers});
    })
    .catch(err => {
      logger.info('Error while creating passwords.');
      logger.error(`${JSON.stringify(err)}`);
      reject(err);
    })
  });
}

const addCustomers = (credentials, customers) => {
  return new Promise((resolve, reject) => {
    logger.info(`+${module.id} - ${addCustomers.name}()`);

    let _uniqueCustomers = null;
    let _dupCustomers = null;
    let _updatedCustomers = null;
    _validateNewCustomers(credentials, customers)
    .then((uniqueCustomers, dupCustomers) => {
      logger.info('New customers have been validated');
      _uniqueCustomers = uniqueCustomers;
      if (!_uniqueCustomers || _uniqueCustomers.length === 0) {
        const error = new BadRequest({dupCustomers: dupCustomers}, 'All customers provided for addition into DB are already present');
        throw(error);
      }
      _dupCustomers = dupCustomers;
      return _createNewUsersAndUpdatedCustomers(_uniqueCustomers);
    })
    .then(newUserPromisesAndUpdatedCustomers => {
      logger.info('Adding new users and new customers under a single transaction.');
      _updatedCustomers = newUserPromisesAndUpdatedCustomers.updatedCustomers;
      return sequelize.transaction(t => {
        logger.info(`Adding [${newUserPromisesAndUpdatedCustomers.newUsers.length}] new users....`);
        return User.bulkCreate(newUserPromisesAndUpdatedCustomers.newUsers, {transation: t})
        .then(users => {
          logger.info(`Created [${users.length}] new Users`);
          logger.info(`Adding [${newUserPromisesAndUpdatedCustomers.updatedCustomers.length}] new customers....`);
          return Customer.bulkCreate(newUserPromisesAndUpdatedCustomers.updatedCustomers, {transation: t})
        });
      })
    })
    .then(result => {
      logger.info(`Transaction successfully committed.`)
      logger.debug(`${JSON.stringify(result)}`)
      logger.info(`Now going to create Journal entries for new customers.`)
      return customerStateJournalService.recordNewCustomers(credentials, _uniqueCustomers);
    })
    .then(ignoreResult => {
      logger.info(`Successfully recorded [${customers.length}] customers into journal.`);
      let dto = {}
      dto.newCustomers = _updatedCustomers;
      dto.dupCustomersInDb = _dupCustomers;
      if (credentials.username !== employeeStatus.CRONJOB_USERNAME) {
        sendCustomerPendingEmailToHr(_updatedCustomers[0].corporateUuid, _updatedCustomers.length)
      }
      resolve(dto);
    })
    .catch(err => {
      logger.error(`Error while adding customers: ${JSON.stringify(err)}`);
      logger.error(`${JSON.stringify(err)}`);
      reject(err);
    });
  });
}

const addDependents = (customer, dependents) => {
  return new Promise((resolve, reject) => {
    logger.info(`+${module.id} - ${addDependents.name}()`);

    let _uniqueDependents = null;
    let _dupDependents = null;

    _validateNewDependents(customer, dependents)
    .then((uniqueDependents, dupDependents) => {
      logger.info('New dependents have been validated');
      if (!uniqueDependents || uniqueDependents.length === 0) {
        const error = new BadRequest('All dependents provided for addition into DB are already present', 'All dependents provided for addition into DB are already present');
        throw(error);
      }
      _uniqueDependents = uniqueDependents;
      _dupDependents = dupDependents;
      return Dependent.bulkCreate(_uniqueDependents);
    })
    .then(result => {
      logger.info(`New dependents added to DB.`)
      logger.verbose(`${JSON.stringify(result)}`)
      logger.info(`Now going to create Journal entries for new dependentS.`)
      return dependentStateJournalService.recordNewDependents(customer.empid, _uniqueDependents);
    })
    .then(ignoreResult => {
      logger.info(`Successfully recorded [${_uniqueDependents.length}] dependents into journal.`);
      let dto = {}
      dto.newDependents = _uniqueDependents;
      dto.dupDependents = _dupDependents;
      resolve(dto);
    })
    .catch(err => {
      logger.error(`Error while adding dependents:`);
      logger.error(`${JSON.stringify(err)}`);
      reject(err);
    });
  });
}

const search = searchStr => {
  return new Promise((resolve, reject) => {
    logger.info(`+${module.id} - ${search.name}()`);
    logger.info(`Searching table [${Customer.getTableName()}] for customers whose firstName or lastName contains [${searchStr}]`);
    Customer.findAll({
      where: {
        [Op.or]: {
          firstName: {[Op.substring]: searchStr,},
          lastName: {[Op.substring]: searchStr,},
        },
      },
      attributes: ['uuid', 'empid', 'firstName', 'lastName'],
    })
    .then(customers => {
      logger.info(`Query returned ${customers.length} records.`);
      logger.debug(JSON.stringify(customers));
      resolve(customers);
    })
    .catch(err => {
      logger.error(err);
      const error = new ServerError('ErrorSearchingCustomers', `Error occurred while searching for customers containing [${searchStr}] in name`, err)
      reject(error);
    });
  });
}

const _getUpdateFields = (modified, orig) => {
  const fields = Object.keys(modified);
  if (fields && fields.length === 0) {
    return {};
  }

  let updateFields = {};
  let _orig = orig.dataValues; // We are relying on Sequelize providing a dataValues. If they change this internally, this method won't work.

  fields.forEach(field => {
    switch (field) {
      case 'uuid':
        break;

      case 'status':
        if (modified.status === _orig.status) {
          break;
        }
        const newStatus = employeeStatus.getEmployeeStatus(modified.status, modified.approvalType);
        if (newStatus instanceof BadRequest) {
          newStatus.data.uuid = modified.uuid;
          throw (newStatus);
        }
        updateFields.status = newStatus;

        const newApprovalType = employeeStatus.getApprovalType(updateFields.status, orig.status);
        if (newApprovalType instanceof BadRequest) {
          newStatus.data.uuid = modified.uuid;
          throw (newApprovalType);
        }
        updateFields.approvalType = newApprovalType ? newApprovalType : modified.approvalType;

        break;

      case 'approvalType': break; //ignore approvalType since it is already taken care in update for 'status'

      case 'dob':
        let origDt = new Date(Date.parse(_orig.dob));
        const tempDate = _convertFromEbpFormatDate(modified.dob);
        const modifiedDt = tempDate.date;

        if (!(modifiedDt.getTime() === origDt.getTime())) {
          updateFields.dob = modifiedDt;
        }
        break;

      case 'dateOfJoining':
        let origDoj = new Date(_orig.dateOfJoining);
        let modifiedDoj = new Date(modified.dateOfJoining);

        if (!(modifiedDoj.getTime() === origDoj.getTime())) {
          updateFields.dateOfJoining = modifiedDoj;
        }
        break;

      case 'dateOfExit':
        let origDoe = new Date(_orig.dateOfExit);
        let modifiedDoe = new Date(modified.dateOfExit);

        if (!(modifiedDoe.getTime() === origDoe.getTime())) {
          updateFields.dateOfExit = modifiedDoe;
        }
        break;

      default:
        if (modified[field] !== _orig[field]) {
          updateFields[field] = modified[field];
        }
        break;
    }
  })

  return updateFields;
}

const updateCustomer = (credentials, modifiedCustomer) => {
  return new Promise((resolve, reject) => {
    logger.info(`+${module.id} - ${updateCustomer.name}()`);
    logger.debug(`To modify: ${JSON.stringify(modifiedCustomer)}`);
    logger.info(`Received [${Object.keys(modifiedCustomer).length - 1}] field(s) to update.`);

    let _updateFields = null;
    let _rowsUpdated = 0;
    let _existingCustomer = null;
    let _updateStatus = null;

    Customer.findOne({where: {uuid: modifiedCustomer.uuid}})
    .then(customer => {
      logger.debug(`original: ${JSON.stringify(customer)}`);
      _existingCustomer = customer;
      logger.verbose(`_existingCustomer: ${JSON.stringify(_existingCustomer)}`);
      if (modifiedCustomer.empid && modifiedCustomer.empid !== _existingCustomer.empid) {
        logger.debug(`Checking if customer with new empid [${modifiedCustomer.empid}] is already present.`);
        return Customer.findOne({where: {empid: modifiedCustomer.empid, corporateUuid: customer.corporateUuid}});
      } else {
        logger.debug(`returning null`);
        return Promise.resolve(null);
      }
    })
    .then(duplicateCustomer => {
      logger.debug(`duplicateCustomer: ${duplicateCustomer}`);
      if (duplicateCustomer) {
        logger.debug(`Duplicate customer found for new empid [${duplicateCustomer.empid}].`);
        const error = new BadRequest({empid: duplicateCustomer.empid, firstName: duplicateCustomer.firstName, lastName: duplicateCustomer.lastName}, `The employee id provided for modify already belongs to another customer.`);
        throw(error);
      }

      _updateFields = _getUpdateFields(modifiedCustomer, _existingCustomer);
      if(modifiedCustomer.status && modifiedCustomer.status !== _existingCustomer.status){
          _updateStatus ={
              oldState : _existingCustomer.status,
              newState : modifiedCustomer.status
          }
      }
      logger.info(`updateFields: ${JSON.stringify(_updateFields)}`);
      if (!Object.keys(_updateFields).length) {
        resolve(0);
      }

      let options = {};
      options.where = {uuid: modifiedCustomer.uuid};
      // options.returning = true; // According to Sequelize docs, this option works only on PostgreSQL.

      return Customer.update(_updateFields, options);
    })
    .then((rowsUpdated, updatedCustomers) => { // updatedCustomers seen only on PostgreSQL
      _rowsUpdated = rowsUpdated;
      logger.info(`Finished updating [${rowsUpdated}] customers.`);
      logger.verbose(`updatedCustomers: ${JSON.stringify(updatedCustomers)}.`);
      if(_updateStatus){
        return customerStateJournalService.recordUpdateCustomers(credentials, modifiedCustomer, _updateStatus);
      } else {
        resolve(_rowsUpdated);
      }      
    })
    .then(result => {
      logger.info('Finished updating journal for customer modification.');
      logger.verbose(`result: [${JSON.stringify(result)}]`);
      resolve(_rowsUpdated);
    })
    .catch(err => {
      logger.error(err);
      if (err.status) {
        reject(err);
      } else {
        const error = new ServerError('ErrorUpdatingCustomers', `Error occurred while updating modifiedCustomer. This is a server error. Please see data for actual error.`, err)
        reject(error);
      }
    });
  });
}

const updateDependent = (credentials, modifiedDependant) => {
  return new Promise((resolve, reject) => {
    logger.info(`+${module.id} - ${updateDependent.name}()`);
    logger.info(`dependent: ${JSON.stringify(modifiedDependant)}`);

    let _updateFields = null;
    let _existingDependent = null;
    let _rowsUpdated;
    let _updateStatus = null;

    Dependent.findOne({where: {uuid: modifiedDependant.uuid}})
    .then(dependent => {
      _existingDependent = dependent;
      logger.debug(`existing dependent: ${JSON.stringify(_existingDependent)}`);

      _updateFields = _getUpdateFields(modifiedDependant, _existingDependent);
      if(modifiedDependant.status && modifiedDependant.status !== _existingDependent.status){
        _updateStatus = {
          oldState : _existingDependent.status,
          newState : modifiedDependant.status
        }
      }
      logger.info(`updateFields: ${JSON.stringify(_updateFields)}`);
      if (!Object.keys(_updateFields).length) {
        resolve(0);
      }

      let options = {};
      options.where = {uuid: modifiedDependant.uuid};
      // options.returning = true; // According to Sequelize docs, this option works only on PostgreSQL.
      return Dependent.update(_updateFields, options);
    })
    .then((rowsUpdated, ignoreUpdatedDependents) => { // ignoreUpdatedDependents seen only on PostgreSQL
      _rowsUpdated = rowsUpdated;
      logger.info(`rowsUpdated: [${JSON.stringify(_rowsUpdated)}]`);
      logger.info(`Finished updating [${_rowsUpdated}] dependents.`);
      // logger.verbose(`updatedCustomers: ${JSON.stringify(ignoreUpdatedDependents)}.`); // ignoreUpdatedDependents seen only on PostgreSQL

      if (_updateStatus) {
        return dependentStateJournalService.recordUpdateDependents(credentials, _existingDependent, _updateStatus);
      } else {
        resolve(_rowsUpdated);
      }
    })
    .then(result => {
      logger.info(`result: [${JSON.stringify(result)}]`);
      resolve(_rowsUpdated);
    })
    .catch(err => {
      logger.error(err);
      if (err.status) {
        reject(err);
        return;
      }
      const error = new ServerError('ErrorUpdatingDependents', `Error occur while updating modifiedDependant. This is a server error. Please see data for actual error.`, err)
      reject(error);
    });
  });
}

const updateDependentByUuid = (credentials, modified) => {
  return new Promise((resolve, reject) => {
    logger.info(`+${module.id} - ${updateDependentByUuid.name}()`);
    logger.info(`dependent: ${JSON.stringify(modified)}`);

    let _updateFields = null;
    let _orig = null;
    let _rowsUpdated = 0;
    let _updateStatus = null;

    Dependent.findOne({where: {uuid: modified.uuid}})
    .then(dependent => {
      _orig = dependent;
      logger.debug(`existing dependent: ${JSON.stringify(_orig)}`);

      _updateFields = _getUpdateFields(modified, _orig);
      if(modified.status && modified.status !== _orig.status){
        _updateStatus = {
          oldState : _orig.status,
          newState : modified.status
        }
      }
      logger.info(`updateFields: ${JSON.stringify(_updateFields)}`);
      if (!Object.keys(_updateFields).length) {
        resolve(0);
      }

      let _options = {};
      _options.where = {uuid: modified.uuid};
      // options.returning = true; // According to Sequelize docs, this option works only on PostgreSQL.
      return Dependent.update(_updateFields, _options);
    })
    .then((rowsUpdated, ignoreUpdatedDependents) => { // ignoreUpdatedDependents seen only on PostgreSQL
      // logger.verbose(`updatedCustomers: ${JSON.stringify(ignoreUpdatedDependents)}.`); // ignoreUpdatedDependents seen only on PostgreSQL
      _rowsUpdated = rowsUpdated;
      logger.info(`Finished updating [${_rowsUpdated}] dependents.`);
      if (_updateStatus) {
        return dependentStateJournalService.recordUpdateDependents(credentials, _orig, _updateStatus);
      } else {
        resolve(_rowsUpdated);
      }

    })
    .then(result => {
      logger.info('Finished updating journal for dependent modification.');
      logger.debug(`result: [${JSON.stringify(result)}]`);
      resolve(_rowsUpdated);
    })
    .catch(err => {
      logger.error(err);
      if (err.status) {
        reject(err);
        return;
      }
      const error = new ServerError('ErrorUpdatingDependents', `Error occur while updating modifiedDependant. This is a server error. Please see data for actual error.`, err)
      reject(error);
    });
  });
}

const getDependentsByStatus = (queryParams) => {
  return new Promise((resolve, reject) => {
    logger.info(`+${module.id} - ${getDependentsByStatus.name}()`);
    let whereOptions = {
      corporateUuid: queryParams.corporateUuid
    };

    if (queryParams.approvalType !== undefined){
      whereOptions.approvalType = queryParams.approvalType
    }

    if (queryParams.status !== 'all') {
      whereOptions.status = queryParams.status;
    }

    Dependent.scope(['defaultScope', 'minimalFields']).findAll({where: whereOptions})
    .then(dependents => {
      if (!dependents || dependents.length === 0) {
        throw(new BadRequest(whereOptions, 'No dependents found matching given criteria.'));
      }
      let customerUuids = dependents.map((dep) => { return dep.dependentOnCustomerUuid});
      Customer.scope(['defaultScope', 'minimalFields']).findAll({
        where: { uuid: {[Op.or] : customerUuids}},
        includes: ["empid", "uuid"]
      })
      .then(customerData => {
        let customerId = {};
        customerData.forEach(cust => {
          customerId[cust.uuid] = cust.empid;
        }); 
        dependents.forEach(dep => {
          dep.dataValues.empid = customerId[dep.dependentOnCustomerUuid];
        });     
        resolve(dependents);
      }).catch(err => {
        console.log(err);
        const error = new ServerError('ErrorFetchDependents', `Error occurred while fetching customers for given dependents.`, err)
        reject(error);
      });
    })
    .catch(err => {
      const error = (err.errCode && err.status) ? err : new ServerError('ErrorFetchDependents', `Error occur while fetching dependents.`, err);
      reject(error);
    });
  });
};

const _isUniqueRelationship = relationship => {
  return [father, fatherInLaw, mother, motherInLaw, spouse, husband, wife].includes(relationship);
}

const addDependentsBulk = (credentials, dependentList, corporateUuid) => {
  return new Promise((resolve, reject) => {
    logger.info(`+${module.id} - ${addDependentsBulk.name}()`);

    let empList = dependentList.map((el) => { return el.empid;});
    logger.debug(`empList: ${JSON.stringify(empList)}`);

    let dto = {};
    let validDependents = [];
    let inValidDependents = [];
    let dupDependentsInDb = [];

    Customer.findAll({
      where : {
        empid: { [Op.or] : empList},
        corporateUuid: corporateUuid,
      },
      attributes: ['empid', 'uuid', 'corporateUuid']
    }).then(cusList => {
      logger.debug(`cusList: ${JSON.stringify(cusList)}`);
      let countDuplicateDependents = [];
      dependentList.forEach(d => {
        let customer = cusList.filter(cus => {return (cus.empid === d.empid) && (cus.corporateUuid === corporateUuid)});
        logger.debug(`dependent: {firstName: ${d.firstName}, lastName: ${d.lastName}, relationship: ${d.relationship}}`)
        if (customer && customer.length) {
          logger.verbose(`customer: ${JSON.stringify(customer)}`)
          d.uuid = uuidv4();
          d.status = (credentials.username === employeeStatus.CRONJOB_USERNAME && d.status) ? d.status : customerStatus.STATUS_CREATED;
          d.dependentOnCustomerUuid = customer[0].uuid;
          d.corporateUuid = corporateUuid;
          d.dob = _convertFromEbpFormatDate(d.dob).date;

          // Now check if any valid dependent is already present in db and mark it as duplicates.
          // A dependent is considered duplicate if it satisfies any of these below conditions:
          // 1. Dependent has a relation (spouse, mother, father, mother-in-law, father-in-law) and a record with same relation is already present in DB [OR]
          // 2. Dependent has the same firstName, lastName and same dependentOnCustomerUuid as a record in DB
          const relationship = d.relationship.toLowerCase();
          if (_isUniqueRelationship(relationship)) {
            const sameRelationship = {relationship: relationship};
            const promiseCountDependentsByRelationship = Dependent.count({where: sameRelationship});
            countDuplicateDependents.push(promiseCountDependentsByRelationship);
          }
          const sameFirstNameLastNameCustomerUuid = {
            firstName: d.firstName, lastName: d.lastName, dependentOnCustomerUuid: d.dependentOnCustomerUuid
          };
          const promiseCountDependentsByFirstNameLastNameCustomerUuid = Dependent.count({where: sameFirstNameLastNameCustomerUuid});
          countDuplicateDependents.push(promiseCountDependentsByFirstNameLastNameCustomerUuid);
          logger.debug(`Queued dependent: {firstName: ${d.firstName}, lastName: ${d.lastName}, relationship: ${d.relationship}, dependentOnCustomerUuid: ${d.dependentOnCustomerUuid} to check for dupes`)
          validDependents.push(d);
        } else {
          inValidDependents.push(d);
        }
      });

      if (inValidDependents) {
        dto.failedDependents = inValidDependents;
      }

      return (validDependents.length > 0)
        ? Promise.all(countDuplicateDependents)
        : dto;
    })
    .then(result => {
      logger.verbose(`List of counts of duplicate dependents: ${JSON.stringify(result)}`)
      if (result && result.constructor && result.constructor === Array) { // This means countDependentByFirstNameLastNameCustomerEmpid was executed
        // Remove dependents already present in DB from validDependents.
        result.forEach((count, index) => {
          if (count && validDependents && validDependents[index]) {
            logger.verbose(`validDependents[${index}]: {${JSON.stringify(validDependents[index].firstName)} is a duplicate`);
            dupDependentsInDb.push(validDependents[index]);
          }
        })
        validDependents = validDependents.filter(
          d => !dupDependentsInDb.find(dup => dup.uuid === d.uuid)
        );
        logger.verbose(`Residual validDependents: ${JSON.stringify(validDependents)}`);

        if (dupDependentsInDb.length) {
          dto.dupDependentsInDb = dupDependentsInDb;
          logger.info(`Found ${dto.dupDependentsInDb.length} duplicate dependents in DB.`);
        }
        if (inValidDependents) {
          dto.failedDependents = inValidDependents;
          logger.info(`Found ${dto.failedDependents.length} failed dependents.`);
        }

        return (validDependents.length > 0)
          ? Dependent.bulkCreate(validDependents)
          : result;
      }
      else { // This means only result.failedDependents was returned from previous promise
        return dto;
      }
    })
    .then(result => {
      if (result && result.constructor && result.constructor === Array) { // This means dependents were bulk created
        dto.newDependents = validDependents;
        logger.info(`Found ${dto.newDependents.length} new dependents.`);
        return dependentStateJournalService.recordNewDependents(credentials, validDependents);
      } else { // This means only result.failedDependents was returned from previous promise
        return dto;
      }
    })
    .then(ignored => {
      resolve(dto);
    })
    .catch(err => {
      reject(err);
    });
  });
};

const updateDependentsStatusBulk = (credentials, dependentList, corporateUuid) => {
  return new Promise((resolve, reject) => {
    logger.debug(`+${module.id} - ${updateDependentsStatusBulk.name}()`);

    let empList = dependentList.map((el) => { return el.uuid;});
    logger.verbose(empList);
    let result = {};
    let validDependents = [];
    let inValidDependents = [];
    Dependent.findAll({
      where : {
        uuid: { [Op.or] : empList},
        corporateUuid: corporateUuid
      }     
    })
    .then(depList => {
      logger.verbose(`depList: ${JSON.stringify(depList)}`)
      dependentList.forEach(d => {
        let dependent = depList.filter(dep => { return dep.uuid === d.uuid});
        if (dependent && dependent.length && VALID_CUSTOMER_STATUSES.includes(d.status)) {
          let validDependent = dependent[0].dataValues;
          validDependent.oldState = d.status;

          const newStatus = employeeStatus.getEmployeeStatus(d.status, d.approvalType);
          if (newStatus instanceof BadRequest) {
            // do nothing
          } else {
            validDependent.status = newStatus;
          }

          const newApprovalType = employeeStatus.getApprovalType(d.status, validDependent.oldState);
          if (newApprovalType instanceof BadRequest) {
            // do nothing
          } else {
            validDependent.approvalType = newApprovalType ? newApprovalType : d.approvalType;
          }
          if(validDependents.status === employeeStatus.STATUS_INACTIVE){
            validDependents.active = 0;
          }
          validDependents.push(validDependent);
        } else {
          inValidDependents.push(d);
        }
      });

      if (validDependents.length > 0) {
        return Dependent.bulkCreate(validDependents, {updateOnDuplicate: [ "active", "status", "approvalType"]});
      } else {
        result.failedDependents = inValidDependents;
        resolve(result);
      }      
    })
    .then(ignored => {
      return dependentStateJournalService.recordUpdateDependentsBulk(credentials, validDependents);
    })
    .then(ignored =>{
      result.failedDependents = inValidDependents;
      resolve(result);
    })
    .catch(err => {      
      console.log(err);
      reject(err);
    }); 
  });
};

const updateCustomerStatusBulk = (credentials, customersList, corporateUuid) => {
  return new Promise((resolve, reject) => {
    logger.info(`+${module.id} - ${updateCustomerStatusBulk.name}()`);
    let empList = customersList.map((el) => { return el.uuid;});
    let result = {};
    let validCustomers = [];
    let inValidCustomers = [];
    Customer.findAll({
      where : {
        uuid: { [Op.or] : empList},
        corporateUuid: corporateUuid
      }     
    }).then(cusList => {          
      customersList.forEach(c => {
        let customer = cusList.filter(cust => { return cust.uuid === c.uuid});
        if (customer && customer.length && VALID_CUSTOMER_STATUSES.includes(c.status)) {
          let validCustomer = customer[0].dataValues;
          validCustomer.oldState = c.status;

          const newStatus = employeeStatus.getEmployeeStatus(c.status, c.approvalType);
          if (newStatus instanceof BadRequest) {
            // do nothing
          } else {
            validCustomer.status = newStatus;
          }

          const newApprovalType = employeeStatus.getApprovalType(c.status, validCustomer.oldState);
          if (newApprovalType instanceof BadRequest) {
            // do nothing
          } else {
            validCustomer.approvalType = newApprovalType ? newApprovalType : c.approvalType;
          }
          if(validCustomer.status === employeeStatus.STATUS_INACTIVE){
            validCustomer.active = 0;
          }


          logger.debug(`validCustomer.status: ${validCustomer.status}`);
          logger.debug(`validCustomer.approvalType: ${validCustomer.approvalType}`);
          validCustomers.push(validCustomer);
        } else {
          inValidCustomers.push(c);
        }
      });
      if (validCustomers.length > 0) {
        return Customer.bulkCreate(validCustomers, {updateOnDuplicate: ["active", "status", "approvalType"]});
      } else {
        result.failedCustomers = inValidCustomers;
        resolve(result);
      }      
    })
    .then(ignored => {
      return customerStateJournalService.recordUpdateCustomersBulk(credentials, validCustomers);
    })
    .then(ignored =>{
      result.failedCustomers = inValidCustomers;
      resolve(result);
    })
    .catch(err => {
      logger.error(err);
      reject(err);
    }); 
  });
};

const getHelpDeskInfo = (corporateUuid) => {
  return new Promise((resolve, reject) => {
    logger.info(`+${module.id} - ${getHelpDeskInfo.name}()`);
    Policy.findAll({where: {
      corporateUuid: corporateUuid,
      active: 1
    }})
    .then(policyData => {
      let policyDetails = {helpDeskSchedule:"", spocs: []};
      if(policyData && policyData.length){        
        let policyInfo = policyData[0].dataValues;            
        policyDetails.helpDeskSchedule = policyInfo.helpdeskSchedule;        
        if(policyInfo.clientSpoc1Empid){
            policyDetails.spocs.push({
              empId: policyInfo.clientSpoc1Empid,
              name:  policyInfo.clientSpoc1Name,
              designation: policyInfo.clientSpoc1Designation,
              email:  policyInfo.clientSpoc1Email,
              mobile: policyInfo.clientSpoc1Mobile
            });
        }
        if(policyInfo.clientSpoc2Empid){
          policyDetails.spocs.push({
            empId: policyInfo.clientSpoc2Empid,
            name:  policyInfo.clientSpoc2Name,
            designation: policyInfo.clientSpoc2Designation,
            email:  policyInfo.clientSpoc2Email,
            mobile: policyInfo.clientSpoc2Mobile
          })
        }
        if(policyInfo.clientSpoc3Empid){
          policyDetails.spocs.push({
            empId: policyInfo.clientSpoc3Empid,
            name:  policyInfo.clientSpoc3Name,
            designation: policyInfo.clientSpoc3Designation,
            email:  policyInfo.clientSpoc3Email,
            mobile: policyInfo.clientSpoc3Mobile
          })
        }

      }      
      resolve(policyDetails);
    }).catch(err => {      
      console.log(err);
      reject(err);
    });
  });
}

const getEmployeeReportedIssues = (customerUuid, corporateUuid) => {
  return new Promise((resolve, reject) => {
    logger.info(`+${module.id} - ${getEmployeeReportedIssues.name}()`);
    EmployeeGrievance.findAll({
      where: {
      corporateUuid: corporateUuid,
      employeeUuid: customerUuid      
     },
     attributes: ['employeeUuid', 'corporateUuid', 'issueType', 'status', 'issueDescription', 'dateOfReport']
  })
  .then(grievanceData => {
    resolve(grievanceData)   

  }).catch(err => {      
    console.log(err);
    reject(err);
  });
});
}

const reportEmployeeGrievance = (customerUuid, corporateUuid, issueType, description) => {
  return new Promise((resolve, reject) => {
    logger.info(`+${module.id} - ${reportEmployeeGrievance.name}()`);
    let grievance = {
      employeeUuid: customerUuid,
      corporateUuid: corporateUuid,
      issueType: issueType,
      issueDescription: description,
      status: 'Pending'
    }
    
    EmployeeGrievance.create(grievance)
    .then(ignoreResult => {
      resolve('Complaint registered successfully');
    })
    .catch(err => {
      console.log(err);
      const error = new ServerError('ErrorCreatingGrievance', `Complaint is not created for customer`, err)
      reject(error);
    })
  });
};

const insuranceEnquiryCallback = (customerUuid, corporateUuid, insuranceType, callBackRequestedTime) => {
  return new Promise((resolve, reject) => {
    logger.info(`+${module.id} - ${insuranceEnquiryCallback.name}()`);
    let enquiry = {
      employeeUuid: customerUuid,
      corporateUuid: corporateUuid,
      insuranceType: insuranceType,
      callBackRequestedTime: callBackRequestedTime,
      status: 'Pending'
    }
    
    InsuranceEnquiry.create(enquiry)
    .then(ignoreResult => {
      resolve('Callback registered successfully');
    })
    .catch(err => {
      const error = new ServerError('ErrorCreatingEnquiry', `Enquiry is not created for customer`, err)
      reject(error);
    })
  });
};



const sendCustomerPendingEmailToHr = (corporateUuid, count) => {
  logger.info(`+${module.id} - ${sendCustomerPendingEmailToHr.name}()`);
  corporateHrsService.getCorporateHrByCorporateUuid(corporateUuid)
   .then((hrList) => {
     if(hrList && hrList.length) {
       let emails = hrList.map((el) => { return el.email;});
       mailHelper.sendCustomerPendingMailToHr(emails,count);
     }
   })
   .catch((err) => {
      console.log(err);
   });
};

module.exports = {
  addCustomers: addCustomers,
  addDependents: addDependents,
  addDependentsBulk: addDependentsBulk,
  getAllCustomers: getAllCustomers,
  getCustomersByCorporateHrUuid: getCustomersByCorporateHrUuid,
  getCustomerByEmpIdByCorporateUuid: getCustomerByEmpIdByCorporateUuid,
  getCustomerByUserUuid: getCustomerByUserUuid,
  getCustomerByUuid: getCustomerByUuid,
  getDependentByUuid: getDependentByUuid,
  getDependentsByEmpidByCorporateUuid: getDependentsByEmpidByCorporateUuid,
  getDependentsByStatus: getDependentsByStatus,
  search: search,
  updateCustomer: updateCustomer,
  updateCustomerStatusBulk: updateCustomerStatusBulk,
  updateDependent: updateDependent,
  updateDependentByUuid: updateDependentByUuid,
  updateDependentsStatusBulk: updateDependentsStatusBulk,
  getHelpDeskInfo: getHelpDeskInfo,
  getEmployeeReportedIssues: getEmployeeReportedIssues,
  reportEmployeeGrievance: reportEmployeeGrievance,
  insuranceEnquiryCallback: insuranceEnquiryCallback
}
