"use strict";

const express = require('express');
const router = express.Router();
const dashboardCtrl = require('../controllers/dashboardController');
const authService = require('../services/authService');
const { header, query } = require('express-validator');



router.get('/claim/analytics',
  [
    header('Authorization').not().isEmpty().withMessage('Authorization JWT not provided'),
    query('corporateUuid').not().isEmpty().withMessage('corporateUuid cannot be empty'),
    query('policyId').not().isEmpty().withMessage('corporateUuid cannot be empty'),
    query('fromDate').not().isEmpty().withMessage('fromDate cannot be empty'),
    query('toDate').not().isEmpty().withMessage('toDate cannot be empty'),
    authService.authorize
  ],
  dashboardCtrl.getCorporateClaimAnalytics
);

router.get('/policy/analytics',
  [
    header('Authorization').not().isEmpty().withMessage('Authorization JWT not provided'),
    query('corporateUuid').not().isEmpty().withMessage('corporateUuid cannot be empty'),
    query('policyId').not().isEmpty().withMessage('policyId cannot be empty'),
    query('fromDate').not().isEmpty().withMessage('fromDate cannot be empty'),
    query('toDate').not().isEmpty().withMessage('toDate cannot be empty'),
    authService.authorize
  ],
  dashboardCtrl.getCorporatePolicyAnalytics
);

router.get('/cron/trigger',
 [
  query('token').not().isEmpty().withMessage('Token cannot be empty'),
  query('jobName').not().isEmpty().withMessage('jobName cannot be empty'),
 ], dashboardCtrl.triggerManualCron )


 router.get('/admin/password_hard_reset',
 [
  query('token').not().isEmpty().withMessage('Token cannot be empty'),
  query('empId').not().isEmpty().withMessage('EmpId cannot be empty'),
  query('corporateUuid').not().isEmpty().withMessage('CorporateUuid cannot be empty'),
  query('role').not().isEmpty().withMessage('Role cannot be empty'),
 ], dashboardCtrl.hardRestPassword)



module.exports = router;