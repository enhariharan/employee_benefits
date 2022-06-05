"use strict";

const dashboardService = require('../services/dashboardService');
const {logger} = require('../config/logger');
const {validationResult} = require('express-validator');
const {InvalidQueryParams} = require('../errors/invalidQueryParams');
const {Success, SuccessCreated} = require('../errors/success');
const cron = require('../helpers/cron');

const ROLE_CUSTOMER = require('../services/employeeStatus').ROLE_CUSTOMER;
const ROLE_HR = require('../services/employeeStatus').ROLE_HR;
const ROLE_EXECUTIVE = require('../services/employeeStatus').ROLE_EXECUTIVE;
const ROLE_MANAGER = require('../services/employeeStatus').ROLE_MANAGER;
const ROLE_SRMANAGER = require('../services/employeeStatus').ROLE_SRMANAGER;
const ROLE_SUPERUSER = require('../services/employeeStatus').ROLE_SUPERUSER;

const getCorporateClaimAnalytics = (req, res) => {
    logger.info(`${module.filename} - ${getCorporateClaimAnalytics.name}()`);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new InvalidQueryParams(errors.array());
        res.status(err.status).json(err);
        return;
    }

  console.log('came');

    dashboardService.getCorporateClaimAnalytics(req.query.corporateUuid, req.query.policyId, req.query.fromDate, req.query.toDate)
    .then(claims => { // TODO: This flat list may contain null items also. Filter out null items.
        const message = (claims && claims.length) ? `${claims.length} claims returned.` : `No claims returned.`;
        const _dto = new Success(claims, message);
        res.status(_dto.status).json(_dto);
    })
    .catch(err => {
        if (err && err.status) {
            res.status(err.status).send(err);
            return;
        }
        res.status(500).send(err);
    });
};

const getCorporatePolicyAnalytics = (req, res) => {
    logger.info(`${module.filename} - ${getCorporatePolicyAnalytics.name}()`);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new InvalidQueryParams(errors.array());
        res.status(err.status).json(err);
        return;
    }

    dashboardService.getCorporatePolicyAnalytics(req.query.corporateUuid, req.query.policyId, req.query.fromDate, req.query.toDate)
    .then(policyInfo => { // TODO: This flat list may contain null items also. Filter out null items.
        let _dto = new SuccessCreated(policyInfo.message, policyInfo.message);
        if (policyInfo && policyInfo.success) {
            _dto = new Success(policyInfo.message);
        }
        res.status(_dto.status).json(_dto);
    })
    .catch(err => {
        if (err && err.status) {
            res.status(err.status).json(err);
            return;
        }
        res.status(500).json(err);
    });
};


const triggerManualCron = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new InvalidQueryParams(errors.array());
        res.status(err.status).json(err);
        return;
    }
    let validJobNames = ['policy_approval_cron', 'hr_approval_cron', 'pending_insurer_approval_cron', 'active_employees_cron', 'deactived_employees_cron'];
    if(req.query.token != 'nwry3GTye3' || validJobNames.indexOf(req.query.jobName) < 0){
        return res.status(500).json("Invalid");
    }
    switch(req.query.jobName){
        case 'policy_approval_cron' : cron.policyApprovalScheduler('mediAssist');
                         break;
        case 'hr_approval_cron' : cron.hrApprovedScheduler('mediAssist');
                                  break;
        case 'pending_insurer_approval_cron' : cron.pendingInsurerScheduler('mediAssist');
                                  break;
        case 'active_employees_cron' : cron.employeeActiveListEmailScheduler('mediAssist');
                                  break;
        case 'deactived_employees_cron' : cron.verifyDeactivatedEmployess('mediAssist');
                                  break;                      
    }
    return res.status(200).json("Success");

}


const hardRestPassword = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new InvalidQueryParams(errors.array());
        res.status(err.status).json(err);
        return;
    }
    let allowedRoles = [ROLE_HR, ROLE_EXECUTIVE, ROLE_MANAGER, ROLE_SRMANAGER];
    if(req.query.token != 'RhP7EUCXw9' || allowedRoles.indexOf(req.query.role) < 0){
        return res.status(500).json("Invalid Token/Role");
    }
    dashboardService.hardRestPassword(req.query.corporateUuid, req.query.empId, req.query.role)
    .then(resp => {  
        if(resp.success){
            const _dto = new Success(resp.data, "Password Reset Successful");
            res.status(_dto.status).json(_dto);
        } else {
            res.status(500).send(resp.message);
        }     
        
    })
    .catch(err => {
        if (err && err.status) {
            res.status(err.status).json(err);
            return;
        }
        res.status(500).json(err);
    });
    
}

module.exports = {
  getCorporateClaimAnalytics: getCorporateClaimAnalytics,
  getCorporatePolicyAnalytics: getCorporatePolicyAnalytics,
  triggerManualCron:triggerManualCron,
  hardRestPassword:hardRestPassword
}