'use strict';

const express = require('express');
const router = express.Router();
const executives = require('../controllers/executivesController');
const authService = require('../services/authService');
const brokingCompaniesService = require('../services/brokingCompaniesService');
const corporatesService = require('../services/corporatesService');
const executivesService = require('../services/executivesService');
const { body, header, query} = require('express-validator');


router.get('/issues_list',
  [
    header('Authorization').not().isEmpty().withMessage('Authorization JWT not provided'),
    query('fromDate').not().isEmpty().withMessage('Cannot be empty'),
    query('toDate').not().isEmpty().withMessage('Cannot be empty'),
    authService.authorize
  ],
  executives.getAllEmployeeReportedIssues
);


router.get('/callback_enquiry_list',
  [
    header('Authorization').not().isEmpty().withMessage('Authorization JWT not provided'),
    query('fromDate').not().isEmpty().withMessage('Cannot be empty'),
    query('toDate').not().isEmpty().withMessage('Cannot be empty'),
    authService.authorize
  ],
  executives.getAllEmployeeRequestedCallbacks
);


router.put('/resolve_issue',
  [
    header('Authorization').not().isEmpty().withMessage('Authorization JWT not provided'),
    body('complaintId').not().isEmpty().withMessage('complaintId in req.body cannot be empty.'),
    body('resolution').not().isEmpty().withMessage('comments in req.body cannot be empty.'),
    body('status').not().isEmpty().withMessage('status in req.body cannot be empty.'),
    body('resolvedDate').not().isEmpty().withMessage('resolvedDate in req.body cannot be empty.'),
    authService.authorize
  ],
  executives.updateEmployeeReportedIssue
);

router.put('/resolve_callback',
  [
    header('Authorization').not().isEmpty().withMessage('Authorization JWT not provided'),
    body('requestId').not().isEmpty().withMessage('requestId in req.body cannot be empty.'),
    body('comments').not().isEmpty().withMessage('comments in req.body cannot be empty.'),
    body('status').not().isEmpty().withMessage('status in req.body cannot be empty.'),
    authService.authorize
  ],
  executives.updateEmployeeReportedCallback
);


/**
 * @api {get} /executives Get all executives
 * @apiName GetExecutives
 * @apiGroup Executives
 * @apiDescription Get all Executives.
 * If requesting user is Manager, then only those executives reporting to this manager are returned.
 * If empid is provided in query then return executive details of only that empid (only manager login).
 * If brokingCompanyUuid is provided in query then return executives of that brokingCompany (only manager login).
 * If requesting user is Executive, then only logged in Executive details are returned.
 * Throws authz error for other roles.
 *
 * @apiParam {String} [empid] Optional employee id to get an executive by employee id.
 * @apiParam {UUID}   [brokingCompanyUuid] Optional UUID to get all executives by broking company.
 * @apiHeader {String} Content-Type [Content-Type='application/json'] Content-Type.
 * @apiHeader {String} Authorization [Authorization=JWT-TOKEN-VALUE] JWT token.
 *
 * @apiExample {curl} Example usage:
 *    curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request GET http://localhost:3000/executives
 * This is an example of a executive JSON:
 * {
 *    "uuid": "123e4567-e89b-12d3-a456-426614174000",
 *    "empid": "100001",
 *    "brokingCompanyUuid": brokingCompanies[0].uuid,
 *    "firstName": "Biplab",
 *    "lastName": "Banerjee",
 *    "email": "biplab.banerjee@visista.com",
 *    "mobile": "+914123456799",
 *    "supervisorEmpid": "100000"
 *    "designation": "executive"
 * }
 *
 * @apiExample {curl} Example usage:
 *    curl --location --request GET 'http://ec2-13-234-213-178.ap-south-1.compute.amazonaws.com/api/v1/executives?brokingCompanyUuid=16c8ddb7-9634-45d4-a720-a5768e426aea' --header 'Authorization: JWT-TOKEN
 *
 * @apiSuccess {JSON} Listing of executives.
 *
 * @apiSuccessExample Success-Response:
 *    {
 *      "status": 200,
 *      "errCode": "Success",
 *      "data": "[{executives}]"
 *    }
 *
 * @apiError UnauthorizedAccess For any authn or authz errors.
 *
 * @apiErrorExample Error-Response:
 *    {
 *      "status": 401,
 *      "errCode": 'EmptyOrInvalidJwtToken',
 *      "message": 'auth token is empty or invalid',
 *      "wwwAuthenticate": 'JWT',
 *      "data": req.headers
 *    }
 */
router.get('/',
  [
    header('Authorization').not().isEmpty().withMessage(`Authorization token cannot be empty.`),
    query('empid').optional().custom((value, {req}) => value && req.query.brokingCompanyUuid).withMessage('empid cannot be empty and must be provided with brokingCompanyUuid'),
    query('brokingCompanyUuid').optional().not().isEmpty().withMessage('Cannot be empty'),
    authService.authorize
  ],
  executives.getExecutives);

/**
 * @api {post} /executives Add executives.
 * @apiName AddExecutives
 * @apiGroup Executives
 * @apiDescription Add an array of new Executives if requesting user is Manager. Throws an authz error for other roles.
 * This is an example JSON of an array of executives to add:
 * [
 *    {
 *      "empid": "100000",
 *      "brokingCompanyUuid": "883847bf-0da3-4976-8b8f-6390d47de11f",
 *      "firstName": "Sharmista",
 *      "lastName": "Sharma",
 *      "email": "sharmista.sharma@visista.com",
 *      "mobile": "+914123456700",
 *      "designation": "manager"
 *    },
 *    {
 *      "empid": "100001",
 *      "brokingCompanyUuid": "883847bf-0da3-4976-8b8f-6390d47de11f",
 *      "firstName": "Biplab",
 *      "lastName": "Banerjee",
 *      "email": "biplab.banerjee@visista.com",
 *      "mobile": "+914123456799",
 *      "supervisorEmpid": "100000"
 *      "designation": "executive"
 *    }
 * ]
 *
 * @apiExample {curl} Example usage:
 *    curl --location --request POST 'http://ec2-13-234-213-178.ap-south-1.compute.amazonaws.com/api/v1/executives' --header 'Authorization: JSON-TOKEN  --header 'Content-Type: application/json'  --data-raw '[{ "empid": "100010", "brokingCompanyUuid": "a1387894-f182-45d9-a9e2-3a936f984fc0", "firstName": "Vinitha", "lastName": "Shukla", "email": "vinitha.s@visista.com", "mobile": "+914123456889", "supervisorEmpid": "", "designation": "executive"}]'
 *
 * @apiSuccess {JSON} Listing of added executives.
 *
 * @apiSuccessExample Success-Response:
 *    {
 *      "status": 200,
 *      "errCode": "Success",
 *      "data": "[{executives}]"
 *    }
 *
 * @apiError UnauthorizedAccess For any authn or authz errors.
 *
 * @apiErrorExample Error-Response:
 *    {
 *      "status": 401,
 *      "errCode": 'EmptyOrInvalidJwtToken',
 *      "message": 'auth token is empty or invalid',
 *      "wwwAuthenticate": 'JWT',
 *      "data": req.headers,
 *    }
 */

router.post('/',
  [
    header('Authorization').not().isEmpty().withMessage(`Cannot be empty.`),
    body().isArray({min: 1}).withMessage('req.body must have an array (of at least 1 JSON) of corporate objects'),
    body('*.uuid').optional().not().isEmpty().custom(value => {
      return executivesService.getExecutiveByUuid(value)
      .then(executive => {
        if (executive) {return Promise.reject(`uuid is not unique`);}
      })
    }),
    body('*.empid').not().isEmpty().withMessage('Cannot be empty'),
    body('*.brokingCompanyUuid').not().isEmpty().withMessage('Cannot be empty'),
    body('*.brokingCompanyUuid').not().isEmpty().custom(value => {
      return brokingCompaniesService.getBrokingCompanyByUuid(value)
      .then(bc => {
        if (!bc) {return Promise.reject(`No broking company found with given brokingCompanyUuid - ${value}`);}
      })
    }),
    body('*.firstName').not().isEmpty().withMessage('Cannot be empty'),
    body('*.designation').not().isEmpty().withMessage('Cannot be empty'),
    body('*.supervisorEmpid').not().isEmpty().withMessage('Cannot be empty'),
    authService.authorize
  ],
  executives.addExecutives
);

/**
 * @api {put} /executives Update executive by mapping an executive to a corporate.
 * @apiName UpdateExecutives
 * @apiGroup Executives
 *
 * @apiExample {curl} Example usage:
 *    curl --location --request PUT 'http://localhost:3000/api/v1/executives' \
 --header 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InV1aWQiOiIxMjg3N2Q0Yi05ZTRjLTQyZTctODZhMy0yNjlmOTY5ZTFlODIiLCJjb3Jwb3JhdGVVdWlkIjpudWxsLCJicm9raW5nQ29tcGFueVV1aWQiOiI1NGE1NzM0Ni0wMTg2LTQ3NmMtYjZjMy1mMWRjMjU5NWFmZjQiLCJ1c2VybmFtZSI6InVzZXIxIiwicm9sZSI6Im1hbmFnZXIiLCJlbWFpbCI6IiIsIm1vYmlsZSI6IiIsImp3dCI6bnVsbCwiZW1waWQiOiIxMDAwMDAifSwiaWF0IjoxNjAxNjE0MTk2LCJleHAiOjE2MDE3MDA1OTZ9.ZPPwkCQ4oyYH6wpWA7Z2BgNGQ9GSWOpRH9_Ip-slccA' \
 --header 'Content-Type: application/json' \
 --data-raw '{
    "executiveUuid": "ec56d0d5-80ec-4869-bf79-98d7ae8a9e02",
    "corporateUuid": "ec56d0d5-80ec-4869-bf79-98d7ae8a9e02",
    ...
    any other fields to update go here.
    ...
}'
 *
 * @apiSuccessExample Success-Response:
 *    {
 *      "status": 200,
 *      "errCode": "Success",
 *      "data": message
 *    }
 *
 * @apiError UnauthorizedAccess For any authn or authz errors.
 *
 * @apiErrorExample Error-Response:
 *    {
 *      "status": 401,
 *      "errCode": 'EmptyOrInvalidJwtToken',
 *      "message": 'auth token is empty or invalid',
 *      "wwwAuthenticate": 'JWT',
 *      "data": req.headers,
 *    }
 */
router.put('/',
  [
    header('Authorization').not().isEmpty().withMessage(`Authorization token cannot be empty.`),
    body('corporateUuid').custom(value => {
      if (!value) { return  Promise.reject(`Cannot be empty.`); }
      return corporatesService.getCorporatesByUuid(value)
      .then(corp => {
        if (!corp) {
          return Promise.reject(`Corporate with uuid [${value}] not found.`);
        }
      })
    }),
    body('executiveUuid').custom(value => {
      if (!value) { return  Promise.reject(`Cannot be empty.`); }
      return executivesService.getExecutiveByUuid(value)
      .then(executive => {
        if (!executive) {
          return Promise.reject(`Executive with uuid [${value}] not found.`);
        }
      })
    }),
    authService.authorize
  ],
  executives.updateCorporateExecutives);

module.exports = router;
