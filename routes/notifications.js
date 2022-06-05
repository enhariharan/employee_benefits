"use strict";

const express = require('express');
const router = express.Router();
const notificationsCtrl = require('../controllers/notificationsController');
const authService = require('../services/authService');

/**
 * @api {get} /notifications/pendingActions Get all pending aciton notifications.
 * @apiName pendingActions
 * @apiVersion 1.0.0
 * @apiGroup Notifications
 * @apiDescription Get all pending action notifications.
 *
 * @apiExample {curl} Example usage:
 *   curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request GET 'http://localhost:3000/api/v1/notifications/pendingActions?corporateUuid=25c3962b-657c-48aa-9f5f-34c4a2ff49ab'
 * @apiSuccessExample Success-Response:
 * {
 *   "status": 200,
 *   "errCode": "Success",
 *   "data": {
 *      employeeActions: 3,
 *      dependentsActions: 2,
 *      policyActions: 0
 *    }
 * }
 *
 * @apiError UnauthorizedAccess For any authn errors only. No authz checks are done.
 *
 * @apiErrorExample Error-Response:
 *      {
 *        status: 401,
 *        errCode: 'EmptyOrInvalidJwtToken',
 *        message: 'auth token is empty or invalid',
 *        wwwAuthenticate: 'JWT',
 *        data: req.headers,
 *      }
 */

router.get('/pendingActions', authService.authorize, notificationsCtrl.getPendingActions);

module.exports = router;