"use strict";

const chai = require('chai');
const expect = chai.expect;
const employeeStatus = require('../services/employeeStatus');

const created = employeeStatus.STATUS_CREATED;
const hrApproved = employeeStatus.STATUS_HR_APPROVED;
const pendingInsurerApproval = employeeStatus.STATUS_PENDING_INSURER_APPROVAL;
const InsurerApproved = employeeStatus.STATUS_INSURER_APPROVED;
const pendingTPAApproval = employeeStatus.STATUS_PENDING_TPA_APPROVAL;
const TPAApproved = employeeStatus.STATUS_TPA_APPROVED;
const active = employeeStatus.STATUS_ACTIVE;
const resigned = employeeStatus.STATUS_RESIGNED;
const rejected = employeeStatus.STATUS_REJECTED;
const inactive = employeeStatus.STATUS_INACTIVE;
const addition = employeeStatus.APPROVAL_TYPE_ADDITION;
const deletion = employeeStatus.APPROVAL_TYPE_DELETION;
const none = employeeStatus.APPROVAL_TYPE_NONE;

describe('employeeStatus test suite', () => {
  it('Should pass canary test', function (done) {
    expect(true).to.be.true;
    done();
  })

  it('unit test cases for getEmployeeStatus()', function (done) {
    expect(employeeStatus.getEmployeeStatus(created, addition)).to.equal(created);
    expect(employeeStatus.getEmployeeStatus(created, none)).to.equal(created);
    expect(employeeStatus.getEmployeeStatus(created, deletion)).to.be.a('BadRequest');
    expect(employeeStatus.getEmployeeStatus(created, deletion)).to.deep.include({data:{status: created, approvalType: deletion}});
    expect(employeeStatus.getEmployeeStatus(created, deletion)).to.deep.include({message:`Incorrect combination of status and approvalType provided.`});
    expect(employeeStatus.getEmployeeStatus(created, 'invalid approval type')).to.be.a('BadRequest');

    expect(employeeStatus.getEmployeeStatus(hrApproved, addition)).to.equal(hrApproved);
    expect(employeeStatus.getEmployeeStatus(hrApproved, deletion)).to.equal(hrApproved);
    expect(employeeStatus.getEmployeeStatus(hrApproved, none)).to.be.a('BadRequest');
    expect(employeeStatus.getEmployeeStatus(hrApproved, none)).to.deep.include({data:{status: hrApproved, approvalType: none}});
    expect(employeeStatus.getEmployeeStatus(hrApproved, none)).to.deep.include({message:`Incorrect combination of status and approvalType provided.`});
    expect(employeeStatus.getEmployeeStatus(hrApproved, 'invalid approval type')).to.be.a('BadRequest');

    expect(employeeStatus.getEmployeeStatus(pendingInsurerApproval, addition)).to.equal(pendingInsurerApproval);
    expect(employeeStatus.getEmployeeStatus(pendingInsurerApproval, deletion)).to.equal(pendingInsurerApproval);
    expect(employeeStatus.getEmployeeStatus(pendingInsurerApproval, none)).to.be.a('BadRequest');
    expect(employeeStatus.getEmployeeStatus(pendingInsurerApproval, none)).to.deep.include({data:{status: pendingInsurerApproval, approvalType: none}});
    expect(employeeStatus.getEmployeeStatus(pendingInsurerApproval, none)).to.deep.include({message:`Incorrect combination of status and approvalType provided.`});
    expect(employeeStatus.getEmployeeStatus(pendingInsurerApproval, 'invalid approval type')).to.be.a('BadRequest');

    expect(employeeStatus.getEmployeeStatus(InsurerApproved, addition)).to.equal(InsurerApproved);
    expect(employeeStatus.getEmployeeStatus(InsurerApproved, deletion)).to.equal(InsurerApproved);
    expect(employeeStatus.getEmployeeStatus(InsurerApproved, none)).to.be.a('BadRequest');
    expect(employeeStatus.getEmployeeStatus(InsurerApproved, none)).to.deep.include({data:{status: InsurerApproved, approvalType: none}});
    expect(employeeStatus.getEmployeeStatus(InsurerApproved, none)).to.deep.include({message:`Incorrect combination of status and approvalType provided.`});
    expect(employeeStatus.getEmployeeStatus(InsurerApproved, 'invalid approval type')).to.be.a('BadRequest');

    expect(employeeStatus.getEmployeeStatus(pendingTPAApproval, addition)).to.equal(pendingTPAApproval);
    expect(employeeStatus.getEmployeeStatus(pendingTPAApproval, deletion)).to.equal(pendingTPAApproval);
    expect(employeeStatus.getEmployeeStatus(pendingTPAApproval, none)).to.be.a('BadRequest');
    expect(employeeStatus.getEmployeeStatus(pendingTPAApproval, none)).to.deep.include({data:{status: pendingTPAApproval, approvalType: none}});
    expect(employeeStatus.getEmployeeStatus(pendingTPAApproval, none)).to.deep.include({message:`Incorrect combination of status and approvalType provided.`});
    expect(employeeStatus.getEmployeeStatus(pendingTPAApproval, 'invalid approval type')).to.be.a('BadRequest');

    expect(employeeStatus.getEmployeeStatus(TPAApproved, addition)).to.equal(active);
    expect(employeeStatus.getEmployeeStatus(TPAApproved, deletion)).to.equal(inactive);
    expect(employeeStatus.getEmployeeStatus(TPAApproved, none)).to.be.a('BadRequest');
    expect(employeeStatus.getEmployeeStatus(TPAApproved, none)).to.deep.include({data:{status: TPAApproved, approvalType: none}});
    expect(employeeStatus.getEmployeeStatus(TPAApproved, none)).to.deep.include({message:`Incorrect combination of status and approvalType provided.`});
    expect(employeeStatus.getEmployeeStatus(TPAApproved, 'invalid approval type')).to.be.a('BadRequest');

    expect(employeeStatus.getEmployeeStatus(active, addition)).to.equal(active);
    expect(employeeStatus.getEmployeeStatus(active, deletion)).to.be.a('BadRequest');
    expect(employeeStatus.getEmployeeStatus(active, deletion)).to.deep.include({data:{status: active, approvalType: deletion}});
    expect(employeeStatus.getEmployeeStatus(active, deletion)).to.deep.include({message:`Incorrect combination of status and approvalType provided.`});
    expect(employeeStatus.getEmployeeStatus(active, none)).to.be.equal(active);
    expect(employeeStatus.getEmployeeStatus(active, 'invalid approval type')).to.be.a('BadRequest');

    expect(employeeStatus.getEmployeeStatus(resigned, addition)).to.be.a('BadRequest');
    expect(employeeStatus.getEmployeeStatus(resigned, addition)).to.deep.include({data:{status: resigned, approvalType: addition}});
    expect(employeeStatus.getEmployeeStatus(resigned, addition)).to.deep.include({message:`Incorrect combination of status and approvalType provided.`});
    expect(employeeStatus.getEmployeeStatus(resigned, deletion)).to.equal(resigned);
    expect(employeeStatus.getEmployeeStatus(resigned, none)).to.be.a('BadRequest');
    expect(employeeStatus.getEmployeeStatus(resigned, none)).to.deep.include({data:{status: resigned, approvalType: none}});
    expect(employeeStatus.getEmployeeStatus(resigned, none)).to.deep.include({message:`Incorrect combination of status and approvalType provided.`});
    expect(employeeStatus.getEmployeeStatus(resigned, 'invalid approval type')).to.be.a('BadRequest');

    expect(employeeStatus.getEmployeeStatus(rejected, addition)).to.be.equal(rejected);
    expect(employeeStatus.getEmployeeStatus(rejected, deletion)).to.equal(rejected);
    expect(employeeStatus.getEmployeeStatus(rejected, none)).to.be.a('BadRequest');
    expect(employeeStatus.getEmployeeStatus(rejected, none)).to.deep.include({data:{status: rejected, approvalType: none}});
    expect(employeeStatus.getEmployeeStatus(rejected, none)).to.deep.include({message:`Incorrect combination of status and approvalType provided.`});
    expect(employeeStatus.getEmployeeStatus(rejected, 'invalid approval type')).to.be.a('BadRequest');

    expect(employeeStatus.getEmployeeStatus(inactive, addition)).to.be.a('BadRequest');
    expect(employeeStatus.getEmployeeStatus(inactive, deletion)).to.be.a('BadRequest');
    expect(employeeStatus.getEmployeeStatus(inactive, none)).to.be.equal(inactive);
    expect(employeeStatus.getEmployeeStatus(inactive, 'invalid approval type')).to.be.a('BadRequest');

    expect(employeeStatus.getEmployeeStatus('invalidStatus', addition)).to.be.a('BadRequest');
    expect(employeeStatus.getEmployeeStatus('invalidStatus', addition)).to.deep.include({data:{status: 'invalidStatus', approvalType: addition}});
    expect(employeeStatus.getEmployeeStatus('invalidStatus', addition)).to.deep.include({message:`Incorrect combination of status and approvalType provided.`});

    expect(employeeStatus.getEmployeeStatus('invalidStatus', deletion)).to.be.a('BadRequest');
    expect(employeeStatus.getEmployeeStatus('invalidStatus', deletion)).to.deep.include({data:{status: 'invalidStatus', approvalType: deletion}});
    expect(employeeStatus.getEmployeeStatus('invalidStatus', deletion)).to.deep.include({message:`Incorrect combination of status and approvalType provided.`});

    expect(employeeStatus.getEmployeeStatus('invalidStatus', none)).to.be.a('BadRequest');
    expect(employeeStatus.getEmployeeStatus('invalidStatus', none)).to.deep.include({data:{status: 'invalidStatus', approvalType: none}});
    expect(employeeStatus.getEmployeeStatus('invalidStatus', none)).to.deep.include({message:`Incorrect combination of status and approvalType provided.`});

    done();
  })

  it('unit test cases for getApprovalType()', function (done) {
    expect(employeeStatus.getApprovalType(created)).to.equal(addition);
    expect(employeeStatus.getApprovalType(hrApproved, created)).to.equal(addition);
    expect(employeeStatus.getApprovalType(hrApproved, resigned)).to.equal(deletion);
    expect(employeeStatus.getApprovalType(hrApproved, active)).to.deep.include({data:{status: 'hr approved'}});
    expect(employeeStatus.getApprovalType(hrApproved, active)).to.deep.include({message:`Incorrect status. An approvalType cannot be provided for this status.`});
    expect(employeeStatus.getApprovalType(resigned)).to.equal(deletion);
    expect(employeeStatus.getApprovalType(active)).to.equal(none);
    expect(employeeStatus.getApprovalType(inactive)).to.equal(none);
    expect(employeeStatus.getApprovalType('invalidStatus')).to.be.a('BadRequest');
    expect(employeeStatus.getApprovalType('invalidStatus')).to.deep.include({data:{status: 'invalidStatus'}});
    expect(employeeStatus.getApprovalType('invalidStatus')).to.deep.include({message:`Incorrect status. An approvalType cannot be provided for this status.`});

    done();
  })
})
