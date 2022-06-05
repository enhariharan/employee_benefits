'use strict';

const express = require('express');
const router = express.Router();
const claims = require('../controllers/claimsController');
const authService = require('../services/authService');
const customersService = require("../services/customersService");
const { body, header, param, query } = require('express-validator');

/**
 * @api {get} /claims Get all claims
 * @apiName GetAllClaims
 * @apiVersion 1.0.0
 * @apiGroup Claims
 * @apiDescription Get all claims if requesting user is Manager, Executive, HR, or customer. Throws an authz error for other roles. For customer, shows all claims created by the customer. For HR, shows all claims created by all employees in the corporate. For executive, shows claims under the corporates managed by that executive.
 *
 * @apiExample {curl} Example usage:
 *     curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request GET http://localhost:3000/claims
 *     curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request GET http://localhost:3000/claims?empid=<empid>&corporateUuid=<uuid>
 *
 * @apiParam {String} [empid] Optional employee id to get an executive by employee id.
 * @apiParam {String} [corporateUuid] Optional corporate UUID. This should be provided if empid is provided.
 * @apiParam {Date} [fromdate] Optional From Date to filter claims.
 * @apiParam {Date} [todate] Optional To Date to filter claims.
 *
 * @apiSuccess {JSON} Listing of all claims.
 *
 * @apiSuccessExample Success-Response:
 * {
 *   "status": 200,
 *   "errCode": "Success",
 *   "message": "For HR, ?corporateUuid= will return valid entries only if the uuid belongs to HR's corporate [and] ?empid= will return valid entry only if empid belongs to employee of the same corporate as the HR. For customer/employee, ?corporateUuid= and ?empid= are ignored. For executive, both queries are entertained only if they belong to an entity managed by him/her.",
 *   "data": [
 *  {
 *    "uuid": "816e782d-6ac1-45a8-83be-d4e3d57f9f32",
 *    "claimId": "Claim00004",
 *    "policyUuid": "9e09b6f1-6485-45a5-a410-6e03feff621c",
 *    "ailmentUuid": "49fbcbc3-57b0-4ddb-8df0-bad567871fb2",
 *    "corporateUuid": "b11d253e-3135-48d6-8292-c95f36ba683d",
 *    "corporateName": "Tata Consultancy Services",
 *    "policyId": "LIC223456",
 *    "patientName": "Amit K",
 *    "relationship": "self",
 *    "employeeName": "Amit K",
 *    "empid": "100001",
 *    "hospitalName": "Hospital 1",
 *    "address": "Address Line 1 Apartment 1 Street one Hyderabad Hyderabad telangana  *500036",
 *    "ailmentName": "Cataract",
 *    "treatmentType": "treatment type 3",
 *    "cashless": true,
 *    "reimbursement": false,
 *    "dateOfHospitalization": "2020-01-01T00:00:00.000Z",
 *    "dateOfAdmission": "2019-11-30T00:00:00.000Z",
 *    "dateOfDischarge": "2020-01-12T00:00:00.000Z",
 *    "dateOfSettlement": "2020-01-12T00:00:00.000Z",
 *    "status": "in progress",
 *    "initialEstimate": null,
 *    "amountSettled": "100000.00",
 *    "amountApproved": "100000.00",
 *    "amountDisallowed": "0.00",
 *    "denialReason": "",
 *    "disallowanceReason": "ailment not covered under policy.",
 *    "createdAt": "2020-05-29T17:38:55.000Z",
 *    "updatedAt": "2020-05-29T17:38:55.000Z"
 *  }
 *]
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
    header('Authorization').not().isEmpty().withMessage('cannot be empty'),
    query('corporateUuid').optional().not().isEmpty().withMessage('cannot be empty'),
    query('empid').optional().not().isEmpty().withMessage('cannot be empty'),
    query('fromDate').optional().not().isEmpty().withMessage('cannot be empty'),
    query('toDate').optional().not().isEmpty().withMessage('cannot be empty'),
    authService.authorize
  ],
  claims.getAllClaims
);

/**
 * @api {get} /claims/:claimId Request claim by claim id.
 * @apiName GetClaimByClaimId
 * @apiVersion 1.0.0
 * @apiGroup Claims
 * @apiDescription Request claim by claim id if requesting user is Manager, Executive, HR, or customer. Throws an authz error for other roles. For customer, shows the claim if created by this customer only. For executive, shows claim if it belongs to the corporates managed by that executive. For HR, shows the claim if it belongs to an employee of the same corporate as the HR.
 *
 * @apiExample {curl} Example usage:
 *     curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request GET http://localhost:3000/claims/Claim001/
 *
 * @apiSuccess {JSON} Listing of claim.
 *
 * @apiSuccessExample Success-Response:
 *     {
 *       "status": 200,
 *       "errCode": "Success",
 *       "data": "{claim}"
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
router.get('/:claimId/',
  [
    header('Authorization').not().isEmpty().withMessage('Cannot be empty'),
    param('claimId').not().isEmpty().withMessage('Cannot be empty'),
    authService.authorize
  ],
  claims.getClaimByClaimId
);

/**
 * @api {post} /claims Add an array of new claims
 * @apiName AddClaims
 * @apiVersion 1.0.0
 * @apiGroup Claims
 * @apiDescription Add an array of claims if submitting user is Manager or Executive or customer. Throws an authz error for other roles.
 *
 * @apiExample {curl} Example usage:
 *     curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request POST --data '[{claim1}, {claim2}, ...]' http://localhost:3000/claims
 * A Claim object JSON can look like this:
 *  {
 *    "claimId": "Claim00007",
 *    "policyUuid": "afa43592-486f-4619-8b84-8807a1ee1454",
 *    "customerUuid": "1b5dbdcb-b0d2-45c9-9b79-7b2434b333cc",
 *    "ailmentUuid": "7b39c533-0be5-4ed8-a55c-70805ea3d3cc",
 *    "corporateUuid": "b11d253e-3135-48d6-8292-c95f36ba683d",
 *    "treatmentType": "treatment type 2",
 *    "cashless": false,
 *    "reimbursement": true,
 *    "dateOfHospitalization": "2020-05-20T00:00:00.000Z",
 *    "dateOfAdmission": "2019-05-20T00:00:00.000Z",
 *    "dateOfDischarge": "2020-05-29T00:00:00.000Z",
 *    "dateOfSettlement": "2020-05-29T00:00:00.000Z",
 *    "status": "closed",
 *    "initialEstimate": null,
 *    "amountSettled": "100900.00",
 *    "amountApproved": "100900.00",
 *    "amountDisallowed": "540.00",
 *    "denialReason": "",
 *    "disallowanceReason": ""
 *  }
 *
 * @apiSuccessExample Success-Response:
 *     {
 *        'status': 200,
 *        'errCode':'Success',
 *        'data': [{claims}],
 *     }
 *
 * @apiError NoClaimsInRequestBody Empty request body sent.
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
    header('Authorization').not().isEmpty().withMessage('Cannot be empty'),
    body().isArray({min: 1}).withMessage('req.body must have an array (of at least 1 JSON) of policy objects'),
    body('*.customerUuid').custom(value => {
      if (!value) { return  Promise.reject(`customerUuid in req.body cannot be empty.`); }
      return customersService.getCustomerByUuid(value)
      .then(customer => {
        if (!customer) {
          return Promise.reject(`Customer with uuid ${value} not found.`);
        }
      })
    }),
    authService.authorize
  ],
  claims.addClaims
);

module.exports = router;
