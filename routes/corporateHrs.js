"use strict";

const express = require('express');
const router = express.Router();
const corporateHrs = require('../controllers/corporateHrsController');
const authService = require('../services/authService');
const corporateHrsService = require('../services/corporateHrsService');
const corporatesService = require('../services/corporatesService');
const {body, header, param, query} = require('express-validator');

const VALID_CORPORATEHR_STATUSES = require('../services/employeeStatus').status;
const VALID_CORPORATEHR_APPROVAL_TYPES = require('../services/employeeStatus').approvalType;

/**
 * @api {get} /corporatehrs/:empid/ Get a CorporateHr by empid
 * @apiName GetCorporateHrByEmpId
 * @apiVersion 1.0.0
 * @apiGroup CorporateHrs
 * @apiDescription Request CorporateHrs with a given empid. Gives back only logged in CorporateHr details if requesting user is logged in CorporateHr. Throws an authz error for other roles. Throws an authz error if logged in CorporateHr is not an HR and requests details of another CorporateHr.
 *
 * @apiParam {empid} empid Employee ID of CorporateHr.
 * @apiParam (UUID) corporateUuid Corporate UUID of CorporateHr.
 *
 * @apiExample {curl} Example usage:
 *     curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request GET http://localhost:3000/api/v1/corporatehrs/A12345?corporateUuid=uuid
 *
 * @apiSuccess {JSON} CorporateHr Example: {
 *    uuid: "123e4567-e89b-12d3-a456-426614174000",
 *    empid: "100001",
 *    corporateUuid: corporates[0].uuid,
 *    userUuid": "ba811091-12f2-47f7-9f66-e5b15bc04190",
 *    firstName: "emp",
 *    lastName: "11",
 *    gender: "M",
 *    email: "emp11@wpiro.com",
 *    "mobile": "+911234567890",
 *    "status": "created",
 *    "approvalType": "addition",
 *    "active": true,
 *    "createdAt": "2020-08-30T17:27:08.000Z",
 *    "updatedAt": "2020-08-30T17:27:08.000Z"
 * }
 *
 * @apiSuccessExample Success-Response:
 *     {
 *       "status": "200",
 *       "errCode": "Success",
 *       "data": {CorporateHr}
 *     }
 *
 * @apiError UnauthorizedAccess For any authn or authz errors.
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
router.get('/:empid',
  [
    header('Authorization').not().isEmpty().withMessage('Authorization JWT not provided'),
    param('empid').not().isEmpty().withMessage(`empid in req.params cannot be empty.`),
    query('corporateUuid').not().isEmpty().withMessage(`Cannot be empty.`),
    authService.authorize
  ],
  corporateHrs.getCorporateHrByEmpIdByCorporateUuid
);

/**
 * @api {get} /corporateHrs Get all corporateHrs
 * @apiName GetCorporateHrs
 * @apiVersion 1.0.0
 * @apiGroup CorporateHrs
 * @apiDescription Get all corporateHrs if requesting user is Manager or Executive. Gives back only logged in corporateHr if requesting user is logged in corporateHr. Gives back all corporateHr belonging to a Corporate if requesting user is logged in HR. Throws an authz error for other roles.
 *
 * CorporateHrs can also be queried filtered by their status. The possible values of status are as below:
 *   'created',                  // when employee is newly created
 *   'hr approved',                 // when approved by HR. Employee can login form here.
 *   'pending insurer approval', // when submitted for insurnace company approval
 *   'insurer approved',         // when approved by insurance
 *   'pending tpa approval',     // when submitted for tpa approval
 *   'tpa approved',             // when approved by TPA
 *   'active',                   // The system will move the employee from "tpa approved" to "active" when the approval process after approved is complete.
 *   'resigned',                 // employee cannot login anymore
 *   'rejected',                 // when employee onboarding is rejected for any reason. employee cannot login
 *   'inactive',                 // The system will move the employee from "tpa approved" to "resigned" when the approval process after approved is complete.
 *
 *   Here is how the statuses will change during the onboarding/deboarding workflows.
 *   Successful Onboarding:
 *   created >> hr approved >> pending insurer approval >> insurer approved >> pending tpa approval >> tpa approved >> active
 *
 *   Onboarding rejected during insurer approval:
 *   created >> hr approved >> pending insurer approval >> rejected
 *
 *   Onboarding rejected during TPA approval:
 *   created >> hr approved >> pending insurer approval >> insurer approved >> pending tpa approval >> rejected
 *
 *   Successful deboarding:
 *   resigned >> pending insurer approval >> insurer approved >> pending tpa approval >> tpa approved >> inactive
 *
 * CorporateHrs can also be queried based on :
 *   'addition', // Set when employee is in the middle of onboarding workflow.
 *   'deletion', // Set when employee is in the middle of deboarding workflow.
 *   'none'      // Set when all workflows are complete and employee is not part of any workflow.
 *
 * @apiParam {empid} empid Employee ID of the corporateHr.
 * @apiParam {UUID} corporateUuid Corporae UUID
 * @apiParam {string} status CorporateHr or Dependent status
 * @apiParam {string} approvaltype CorporateHr or Dependent approval type
 *
 * @apiExample {curl} Example usage:
 *   curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request GET http://localhost:3000/api/v1/corporateHrs
 *   curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request GET http://localhost:3000/api/v1/corporateHrs?status=<>
 *   curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request GET http://localhost:3000/api/v1/corporateHrs?approvaltype=<>
 *
 * @apiSuccess {JSON} CorporateHr A list of this JSON object:
 * {
 *    uuid: "123e4567-e89b-12d3-a456-426614174000",
 *    empid: "100001",
 *    corporateUuid: corporates[0].uuid,
 *    userUuid": "ba811091-12f2-47f7-9f66-e5b15bc04190",
 *    firstName: "emp",
 *    lastName: "11",
 *    gender: "M",
 *    email: "emp11@wpiro.com",
 *    "mobile": "+911234567890",
 *    "status": "created",
 *    "approvalType": "addition",
 *    "active": true,
 *    "createdAt": "2020-08-30T17:27:08.000Z",
 *    "updatedAt": "2020-08-30T17:27:08.000Z"
 * }
 *
 * @apiSuccessExample Success-Response:
 *     {
 *       "code": "200",
 *       "data": "[{corporateHr1}, {corporateHr2}, ...]"
 *     }
 *
 * @apiError UnauthorizedAccess For any authn or authz errors.
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
router.get('/',
  [
    header('Authorization').not().isEmpty().withMessage('Authorization JWT not provided'),
    query('status').optional().trim().not().isEmpty().withMessage('Cannot be empty.'),
    query('status').optional().trim().custom(value => (VALID_CORPORATEHR_STATUSES.includes(value) || value === 'all')).withMessage('Incorrect value.'),
    query('approvalType').optional().trim().not().isEmpty().withMessage('Cannot be empty.'),
    query('approvalType').optional().trim().custom(value => (VALID_CORPORATEHR_APPROVAL_TYPES.includes(value) || value === 'all')).withMessage('Incorrect value.'),
    authService.authorize
  ],
  corporateHrs.getCorporateHrs
);


/**
 * @api {put} /corporateHrs Updates a corporateHrs
 * @apiName UpdateCorporateHr
 * @apiVersion 1.0.0
 * @apiGroup CorporateHrs
 * @apiDescription Update a corporateHr if requesting user is Manager or Executive.
 * Gives back only logged in corporateHr if requesting user is logged in corporateHr.
 * Gives back all corporateHr belonging to a Corporate if requesting user is logged in HR.
 * Throws an authz error for other roles.
 *
 * @apiExample {curl} Example usage:
 *     curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request POST --data '{corporateHr}' http://localhost:3000/api/v1/corporateHrs
 * A corporateHr JSON looks like this:
 * {
 *    uuid: <UUID>,
 *    empid: "100001",
 *    corporateUuid: uuid,
 *    email: "emp11@wpiro.com",
 *    status: "hr approved"
 *    approvalType: "addition"
 * }
 *
 * @apiSuccess {JSON} CorporateHr A list of this JSON object:
 *     {
 *        'status': 200,
 *        'errCode':'Success',
 *        'data': <count-of-rows-updated>>,
 *     }
 *
 * @apiSuccessExample Success-Response:
 *     {
 *       "code": "200",
 *       "data": "[{corporateHr1}, {corporateHr2}, ...]"
 *     }
 *
 * @apiError UnauthorizedAccess For any authn or authz errors.
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
router.put('/',
  [
    header('Authorization').not().isEmpty().withMessage('Authorization JWT not provided'),
    body().not().isEmpty().withMessage('Cannot be empty.'),
    body('uuid').optional().trim().not().isEmpty().withMessage('Cannot be empty.'),
    body('uuid').trim().not().isEmpty().custom(value => {
      return corporateHrsService.getCorporateHrByUuid(value)
      .then(corporateHr => {
        if (!corporateHr) {
          return Promise.reject(`CorporateHr with uuid ${value} not found.`);
        }
      })
    }),
    authService.authorize
  ],
  corporateHrs.updateCorporateHr
);


/**
 * @api {post} /corporateHrs Add an array of corporateHrs
 * @apiName AddCorporateHrs
 * @apiVersion 1.0.0
 * @apiGroup CorporateHrs
 * @apiDescription Add an array of corporateHrs if submitting user is Manager or HR or Executive. Throws an authz error for other roles.
 *
 * @apiExample {curl} Example usage:
 *     curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request POST --data '[{corporateHr1}, {corporateHr2}, ...]' http://localhost:3000/api/v1/corporateHrs
 * A corporateHr JSON looks like this:
 * {
 *    empid: "100001",
 *    corporateUuid: corporates[0].uuid,
 *    firstName: "emp",
 *    lastName: "11",
 *    gender: "M",
 *    email: "emp11@wpiro.com",
 *    mobile: "+ 911234567890",
 *    email: "email@gmail.com",
 * }
 *
 * @apiSuccess {JSON} CorporateHrs An array of above JSON object but with added UUID.
 *
 * @apiSuccessExample Success-Response:
 *     {
 *        'status': 200,
 *        'errCode':'Success',
 *        'data': [corporateHrs],
 *     }
 *
 * @apiError NoCorporateHrsInRequestBody Empty request body sent.
 * @apiError UnauthorizedAccess For any authn or authz errors.
 *
 * @apiErrorExample Error-Response:
 *      {
 *        "status": 401,
 *        "errCode": 'EmptyOrInvalidJwtToken',
 *        "message": 'auth token is empty or invalid',
 *        "wwwAuthenticate": 'JWT',
 *        "data": req.headers,
 *      }
 */
router.post('/',
  [
    header('Authorization').not().isEmpty().withMessage('Authorization JWT not provided'),
    body().isArray({min: 1}).withMessage('Must send an array (of at least 1 JSON) of corporateHr objects'),
    body('*.empid').not().isEmpty().withMessage('Cannot be empty.'),
    body('*.corporateUuid').custom(value => {
      if (!value) { return  Promise.reject(`Cannot be empty.`); }
      return corporatesService.getCorporatesByUuid(value)
      .then(corp => {
        if (!corp) {
          return Promise.reject(`Corporate with uuid ${value} not found.`);
        }
      })
    }),
    body('*.firstName').not().isEmpty().withMessage('Cannot be empty.'),
    authService.authorize
  ],
  corporateHrs.addCorporateHrs
);


module.exports = router;

