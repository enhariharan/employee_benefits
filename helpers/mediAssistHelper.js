"use strict";

const employeeStatus = require('../services/employeeStatus');
const {BadRequest} = require("../errors/invalidQueryParams");


/**
 * This function converts an array of JSON objects for customer provided in a MediAssist format into the JSON format
 * understood by EBP.
 *
 * The format from MediAssist will be of the  following format:
 *  {
 *    empCode: "abc123",
 *    firstName: "xyz",
 *    lastName: "abc",
 *    dob: "22/11/1988  00:00:00",
 *    gender: "male/female/etc",
 *    sumInsured: 30000
 *  };
 *
 * The format for EBP can be referred to from the documentation provided in routes/customers.js (search for "@api {post} /customers")
 */
const  convertCustomerJsonIntoEbpFormat = (customersInMediAssistFormat, corporateUuid) => {
  return new Promise((resolve, ignorereject) => {
    if (!corporateUuid) {
      const data = 'corporateUuid is mandatory.';
      const message = `corporateUuid is not provided, cannot add new customers without it.`;
      throw (new BadRequest(data, message));
    }

    if (!customersInMediAssistFormat || customersInMediAssistFormat.length === 0) {
      const data = 'customers JSON list is mandatory.';
      const message = `customers JSON list in MediAssist JSON Format is not provided, cannot add new customers without it.`;
      throw (new BadRequest(data, message));
    }

    const customersInEBPFormat = [];
    customersInMediAssistFormat.forEach(c => {
      const customer = {};
      if (!c.empCode) {
        const data = c;
        const message = `empCode is mandatory but not provided.`;
        throw (new BadRequest(data, message));
      }
      customer.empid = c.empCode;
      customer.corporateUuid = corporateUuid;

      if (!c.firstName) {
        const data = c;
        const message = `firstName is mandatory but not provided.`;
        throw (new BadRequest(data, message));
      }
      customer.firstName = c.firstName;

      if (c.lastName) {
        customer.lastName = c.lastName;
      }

      if (c.gender) {
        customer.gender = c.gender;
      }

      if (c.sumInsured) {
        customer.sumInsured = c.sumInsured;
      }

      customer.status = employeeStatus.STATUS_ACTIVE;
      customer.approvalType = employeeStatus.APPROVAL_TYPE_NONE;

      // finally convert date of birth to the format understood by EBP - "yyyy-mm-dd"
      // DoB is mandatory field in principle but it is not marked as NULL in DB intentionally (refer issue #70).
      // Therefore, if DoB is null then initialize DoB to 1872-02-29 in dd/mm/yyyy format.
      const defaultDoB = '29/02/1872';
      if (!c.dob) {
        c.dob = defaultDoB;
      }
      const [dd, mm, yyyy] = c.dob.split('/');
      let year = yyyy.trim();
      year = (year.length > 4) ? year.substr(0, 4) : year;
      customer.dob = `${dd}/${mm}/${year}`;

      customersInEBPFormat.push(customer);
    });
    resolve(customersInEBPFormat);
  });
}

/**
 * This function converts an array of JSON objects for dependent provided in a MediAssist format into the JSON format
 * understood by EBP.
 *
 * The format from MediAssist will be of the  following format:
 *  {
 *    empCode: "abc123",
 *    relation: "father/mother/spouse/etc",
 *    firstName: "xyz",
 *    lastName: "abc",
 *    dob: "22/11/1988  00:00:00",
 *    gender: "male/female/etc",
 *    sumInsured: 30000
 *  };
 *
 * The format for EBP can be referred to from the documentation provided in routes/customers.js (search for "@api {post} /customers/:empid/dependents")
 */
const  convertDependentJsonIntoEbpFormat = (dependentsInMediAssistFormat, corporateUuid) => {
  return new Promise((resolve, ignorereject) => {
    if (!corporateUuid) {
      const data = 'corporateUuid is mandatory.';
      const message = `corporateUuid is not provided, cannot add new dependents without it.`;
      throw (new BadRequest(data, message));
    }

    if (!dependentsInMediAssistFormat || dependentsInMediAssistFormat.length === 0) {
      const data = 'dependents JSON list is mandatory.';
      const message = `dependents JSON list in MediAssist JSON Format is not provided, cannot add new dependents without it.`;
      throw (new BadRequest(data, message));
    }

    const dependentsInEBPFormat = [];
    dependentsInMediAssistFormat.forEach(d => {
      const dependent = {};
      if (!d.empCode) {
        const data = d;
        const message = `empCode is mandatory but not provided.`;
        throw (new BadRequest(data, message));
      }
      dependent.empid = d.empCode;

      dependent.corporateUuid = corporateUuid;

      if (!d.firstName) {
        const data = d;
        const message = `firstName is mandatory but not provided.`;
        throw (new BadRequest(data, message));
      }
      dependent.firstName = d.firstName;

      if (d.lastName) {
        dependent.lastName = d.lastName;
      }

      if (d.lastName) {
        dependent.gender = d.gender;
      }

      if (d.sumInsured) {
        dependent.sumInsured = d.sumInsured;
      }

      dependent.status = employeeStatus.STATUS_ACTIVE;
      dependent.approvalType = employeeStatus.APPROVAL_TYPE_NONE;

      if (!d.relation) {
        const data = d;
        const message = `Dependent relationship to customer is mandatory but not provided.`;
        throw (new BadRequest(data, message));
      }

      if (!employeeStatus.DEPENDENT_RELATIONS.includes(d.relation)) {
        const data = {
          empid: dependent.empid,
          corporateUuid: dependent.corporateUuid,
          firstName: dependent.firstName,
          lastName: dependent.lastName,
          relationship: d.relation
        };
        const message = `Dependent JSON has incorrect relationship.`;
        throw (new BadRequest(data, message));
      }
      dependent.relationship = d.relation;

      // finally convert date of birth to the format understood by EBP - "yyyy-mm-dd"
      if (!d.dob) {
        const data = {
          empid: dependent.empid,
          corporateUuid: corporateUuid,
          firstName: dependent.firstName,
          lastName: dependent.lastName
        };
        const message = `Date of birth is empty or incorrect. Please provide \'dob\'`;
        throw (new BadRequest(data, message));
      }

      const [dd, mm, yyyy] = d.dob.split('/');
      let year = yyyy.trim();
      year = (year.length > 4) ? year.substr(0, 4) : year;
      dependent.dob = `${dd}/${mm}/${year}`;

      dependentsInEBPFormat.push(dependent);
    }); // forEach()
    resolve(dependentsInEBPFormat);
  });
}

module.exports = {
  convertCustomerJsonIntoEbpFormat: convertCustomerJsonIntoEbpFormat,
  convertDependentJsonIntoEbpFormat: convertDependentJsonIntoEbpFormat
}
