'use strict';

const logindomains = require("../helpers/logindomains");
const {BadRequest} = require("../errors/invalidQueryParams");
const {logger} = require('../config/logger');

const created = 'created';
const hrApproved = 'hr approved';
const pendingInsurerApproval = 'pending insurer approval';
const insurerApproved = 'insurer approved';
const pendingTpaApproval = 'pending tpa approval';
const tpaApproved = 'tpa approved';
const active = 'active';
const resigned = 'resigned';
const rejected = 'rejected';
const inactive = 'inactive';

const _customerStatus = [
  created,                // when employee is newly created
  hrApproved,             // when approved by HR. Employee can login from here.
  pendingInsurerApproval, // when submitted for insurance company approval
  insurerApproved,        // when approved by insurance
  pendingTpaApproval,     // when submitted for tpa approval
  tpaApproved,            // when approved by TPA
  active,                 // The system will move the employee from "tpa approved" to "active" when the approval process after approved is complete.
  resigned,               // employee cannot login anymore
  rejected,               // when employee onboarding is rejected for any reason. employee cannot login
  inactive                // The system will move the employee from "tpa approved" to "resigned" when the approval process after approved is complete.
];

const addition = 'addition';
const deletion = 'deletion';
const none = 'none';
const _approvalType = [
  addition, // Set when employee is in the middle of onboarding workflow.
  deletion, // Set when employee is in the middle of deboarding workflow.
  none      // Set when all workflows are complete and employee is not part of any workflow.
];

const superuser = 'superuser';
const seniormanager = 'srmanager';
const manager = 'manager';
const executive = 'executive';
const hr = 'hr';
const customer = 'customer';
const allRoles = '*';
const _authorizedRoles = [superuser, seniormanager, manager, executive, hr, customer, allRoles]

const spouse = 'spouse';
const wife = 'wife';
const husband = 'husband';
const son = 'son';
const daughter = 'daughter';
const father = 'father';
const mother = 'mother';
const fatherInLaw = 'father-in-law';
const motherInLaw = 'mother-in-law';
const _dependentRelations = [spouse, wife, husband, son, daughter, father, mother, fatherInLaw, motherInLaw];

const _cronJobUserName = 'ebpcronjobuser';

const _getEmployeeStatus = (currentStatus, currentApprovalType) => {
  const _error = () => {
    const data = {status: currentStatus, approvalType: currentApprovalType}
    const message = `Incorrect combination of status and approvalType provided.`;
    return new BadRequest(data, message);
  };
  switch(currentStatus) {
    case created:
      switch (currentApprovalType) {
        case addition: return created;
        case deletion: return _error();
        case none: return created;
        default: return _error();
      }
    case hrApproved:
      switch (currentApprovalType) {
        case addition: return hrApproved;
        case deletion: return hrApproved;
        case none: return _error();
        default: return _error();
      }
    case pendingInsurerApproval:
      switch (currentApprovalType) {
        case addition: return pendingInsurerApproval;
        case deletion: return pendingInsurerApproval;
        case none: return _error();
        default: return _error();
      }

    case insurerApproved:
      switch (currentApprovalType) {
        case addition: return insurerApproved;
        case deletion: return insurerApproved;
        case none: return _error();
        default: return _error();
      }

    case pendingTpaApproval:
      switch (currentApprovalType) {
        case addition: return pendingTpaApproval;
        case deletion: return pendingTpaApproval;
        case none: return _error();
        default: return _error();
      }

    case tpaApproved:
      switch (currentApprovalType) {
        case addition: return active;
        case deletion: return inactive;
        case none: return _error();
        default: return _error();
      }

    case active:
      switch (currentApprovalType) {
        case addition: return active;
        case deletion: return _error();
        case none: return active;
        default: return _error();
      }

    case resigned:
      switch (currentApprovalType) {
        case addition: return _error();
        case deletion: return resigned;
        case none: return _error();
        default: return _error();
      }

    case rejected:
      switch (currentApprovalType) {
        case addition: return rejected;
        case deletion: return rejected;
        case none: return _error();
        default: return _error();
      }

    case inactive:
      switch (currentApprovalType) {
        case addition: return _error();
        case deletion: return _error();
        case none: return inactive;
        default: return _error();
      }

    default: return _error();
  }
}

const _getApprovalType = (currentStatus, previousStatus) => {
  logger.debug(`{currentStatus: ${currentStatus}, previousStatus: ${previousStatus}`)
  const _error = () => {
    const data = {status: currentStatus}
    const message = `Incorrect status. An approvalType cannot be provided for this status.`;
    return new BadRequest(data, message);
  }

  switch(currentStatus) {
    case created: return addition;
    case hrApproved:
      switch(previousStatus) {
        case created:
          return addition;
        case resigned:
          return deletion;
        default:
          return _error();
      }
    case resigned: return deletion;
    case active: return none;
    case inactive: return none;
    case pendingTpaApproval:
    case insurerApproved:
    case tpaApproved:
    case rejected:
    case pendingInsurerApproval: return null;
    default: return _error();
  }
}

const env = process.env.NODE_ENV || 'development';
const _default_subdomain = logindomains.getDefaultSubdomain(env);

module.exports = {
  DEFAULT_SUBDOMAIN: _default_subdomain,

  status: _customerStatus,
  STATUS_CREATED: created,
  STATUS_HR_APPROVED: hrApproved,
  STATUS_PENDING_INSURER_APPROVAL: pendingInsurerApproval,
  STATUS_INSURER_APPROVED: insurerApproved,
  STATUS_PENDING_TPA_APPROVAL: pendingTpaApproval,
  STATUS_TPA_APPROVED: tpaApproved,
  STATUS_ACTIVE: active,
  STATUS_RESIGNED: resigned,
  STATUS_REJECTED: rejected,
  STATUS_INACTIVE: inactive,

  approvalType: _approvalType,
  APPROVAL_TYPE_ADDITION: addition,
  APPROVAL_TYPE_DELETION: deletion,
  APPROVAL_TYPE_NONE: none,

  AUTHORIZED_ROLES: _authorizedRoles,
  ROLE_SUPERUSER: superuser,
  ROLE_SRMANAGER: seniormanager,
  ROLE_MANAGER: manager,
  ROLE_EXECUTIVE: executive,
  ROLE_HR: hr,
  ROLE_CUSTOMER: customer,
  ROLE_ALL: allRoles,

  DEPENDENT_RELATIONS: _dependentRelations,
  DEPENDENT_RELATION_SPOUSE: spouse,
  DEPENDENT_RELATION_WIFE: wife,
  DEPENDENT_RELATION_HUSBAND: husband,
  DEPENDENT_RELATION_SON: son,
  DEPENDENT_RELATION_DAUGHTER: daughter,
  DEPENDENT_RELATION_FATHER: father,
  DEPENDENT_RELATION_MOTHER: mother,
  DEPENDENT_RELATION_FATHER_IN_LAW: fatherInLaw,
  DEPENDENT_RELATION_MOTHER_IN_LAW: motherInLaw,

  CRONJOB_USERNAME: _cronJobUserName,

  getEmployeeStatus: _getEmployeeStatus,
  getApprovalType: _getApprovalType
};