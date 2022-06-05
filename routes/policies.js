"use strict";

const express = require('express');
const router = express.Router();
const policies = require('../controllers/policiesController');
const authService = require('../services/authService');
const corporatesService = require('../services/corporatesService');
const tpasService = require('../services/tpasService');
const insuranceCompaniesService = require('../services/insuranceCompaniesService');
const { body, query, header, param } = require('express-validator');

/**
 * @api {get} /policies/ecard Get policy eCard by policy id.
 * @apiName GetPolicyECard
 * @apiVersion 1.0.0
 * @apiGroup Policies
 * @apiDescription Request a policies eCard by policy id. Applicable for roles customer, HR, Manager, and Executive. Logged in customer will get eCard for his/her policy only. Logged in executive will get eCard of the corporates he/she manages. Logged in HR will get eCard for policies of his corporate only.
 *
 * @apiExample {curl} Example usage:
 *   curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request GET 'http://localhost:3000/policies/ecard?empid=<empid>&corporateUuid=<uuid>'
 *   curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request GET 'http://localhost:3000/policies/ecard'
 * If no empid query param is provided then it takes the empid and corporate of currently logged in user.
 *
 * @apiParam {string} empid Employee ID (MANDATORY)
 * @apiParam {UUID} corporateUuid Corporate UUID (MANDATORY)
 *
 * @apiSuccess {JSON} URL of the policy eCard for the customer whose employee ID was provided.
 *
 * @apiSuccessExample Success-Response:
 *     {
 *       "status": 200,
 *       "errCode": "Success",
 *       "data": URL
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
router.get('/ecard',
  [
    header('Authorization').not().isEmpty().withMessage(`cannot be empty.`),
    query('empid').not().isEmpty().withMessage('Cannot be empty'),
    query('corporateUuid').not().isEmpty().withMessage('cannot be empty'),
    authService.authorize
  ],
  policies.getPolicyECard
);


/**
 * @api {get} /policies Get all policies
 * @apiName GetPolicies
 * @apiVersion 1.0.0
 * @apiGroup Policies
 * @apiDescription Get all policies if requesting user is Manager or Executive or Customer. Throws an authz error for other roles. Logged in customer will get policies for his/her corporate only. Logged in executive will see policies of the coporates he/she manages. Logged in manager can use the below params to see specific policies. If no params are provided then all policies are returned for a manager.
 *
 * @apiExample {curl} Example usage:
 *   curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request GET http://localhost:3000/policies
 *   curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request GET http://localhost:3000/policies?tpaUuid=<uuid>
 *   curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request GET http://localhost:3000/policies?corporateUuid=<uuid>
 *   curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request GET http://localhost:3000/policies?insuranceCompanyUuid=<uuid>
 *
 * @apiParam {UUID} tpaUuid TPA UUID (MANDATORY)
 * @apiParam {UUID} corporateUuid Corporate UUID (MANDATORY)
 * @apiParam {UUID} insuranceCompanyUuid Insurance company UUID (MANDATORY)
 *
 * @apiSuccess {JSON} Polcies A Listing of all above policies.
 *
 * @apiSuccessExample Success-Response:
 *     {
 *       "status": 200,
 *       "errCode": "Success",
 *       "data": "[{policy1}, {policy2}, ...]"
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
    header('Authorization').not().isEmpty().withMessage(`Authorization token cannot be empty.`),
    query('corporateUuid').optional().custom(value => {
      if (!value) {
        return Promise.reject(`corporateUuid in req.query should contain a valid value.`);
      }
      return corporatesService.getCorporatesByUuid(value)
      .then(corp => {
        if (!corp) {
          return Promise.reject(`Customer with UUID ${value} not found.`);
        }
      })
    }),
    query('tpaUuid').optional().custom(value => {
      if (!value) {
        return Promise.reject(`tpaUuid in req.query should contain a valid value.`);
      }
      return tpasService.getTpaByUuid(value)
      .then(tpa => {
        if (!tpa) {
          return Promise.reject(`TPA with UUID ${value} not found.`);
        }
      })
    }),
    query('insuranceCompanyUuid').optional().custom(value => {
      if (!value) {
          return Promise.reject(`insuranceCompanyUuid in req.query should contain a valid value.`);
      }
      return insuranceCompaniesService.getInsuranceCompanyByUuid(value)
      .then(insuranceCompanyUuid => {
          if (!insuranceCompanyUuid) {
              return Promise.reject(`Insurance company with UUID ${value} not found.`);
          }
      })
    }),
    authService.authorize
  ],
  policies.getPolicies
);

/**
 * @api {get} /policies/:policyId/ecard Get policy eCard by policy id.
 * @apiName GetPolicyECardByPolicyId
 * @apiVersion 1.0.0
 * @apiGroup Policies
 * @apiDescription Request a policies eCard by policy id. Applicable for roles customer, HR, Manager, and Executive. Logged in customer will get eCard for his/her policy only. Logged in executive will get eCard of the corporates he/she manages. Logged in HR will get eCard for policies of his corporate only.
 *
 * @apiExample {curl} Example usage:
 *   curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request GET http://localhost:3000/policies/:policyid/ecard?empid=<empid>&corporateUuid=<uuid>
 *   corporateUuid needs to be provided when logged in user is of role executive/manager.
 *   corporateUuid is automatically taken from empid when logged in user is of role customer/hr.
 *
 * @apiParam {string} empid Employee ID (MANDATORY)
 * @apiParam {UUID} corporateUuid Corporate UUID (MANDATORY)
 *
 * @apiSuccess {JSON} URL of the policy eCard for the customer whose policy ID and employee ID was provided.
 *
 * @apiSuccessExample Success-Response:
 *     {
 *       "status": 200,
 *       "errCode": "Success",
 *       "data": URL
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
router.get('/:policyId/ecard',
  [
    header('Authorization').not().isEmpty().withMessage(`Authorization token cannot be empty.`),
    param('policyid').not().isEmpty().withMessage('Cannot be empty'),
    query('empid').not().isEmpty().withMessage('Cannot be empty'),
    query('corporateUuid').not().isEmpty().withMessage('Cannot be empty'),
    authService.authorize
  ],
  policies.getPolicyECardByPolicyId
);

/**
 * @api {get} /policies/:policyId Get a policy by policy id.
 * @apiName GetPolicyByPolicyId
 * @apiVersion 1.0.0
 * @apiGroup Policies
 * @apiDescription Request a policies by policy id for a requesting user of role Manager or Executive or Customer. Throws an authz error for other roles. Logged in customer will get policy for his/her corporate only. Logged in executive will see policies of the coporates he/she manages.
 *
 * @apiExample {curl} Example usage:
 *     curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request GET http://localhost:3000/policies/:policyid
 *
 * @apiSuccess {JSON} Listing of a matching policy.
 *
 * @apiSuccessExample Success-Response:
 *     {
 *       "status": 200,
 *       "errCode": "Success",
 *       "data": {policy}
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
router.get('/:policyId',
  [
    header('Authorization').not().isEmpty().withMessage(`Authorization token cannot be empty.`),
    param('policyid').not().isEmpty().withMessage('policyid cannot be empty'),
    authService.authorize
  ],
  policies.getPolicyByPolicyId);

/**
 * @api {get} /:policyId/networkHospitals/ Get network hospitals given policy id.
 * @apiName GetNetworkHospitalsByPolicyId
 * @apiVersion 1.0.0
 * @apiGroup Policies
 * @apiDescription Request network hospitals by policy id for a requesting user of role Manager, Executive, Customer, or hr. Throws an authz error for other roles. Logged in customer will get network hospitals list for his/her policy only. Logged in executive will see networkHospitals list if the policyId belongs to a coporate that he/she manages.
 *
 * @apiExample {curl} Example usage:
 *     curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request GET http://localhost:3000/policies/:policyid/networkHospitals/
 * This is an example of a hospital JSON:
 * {
 *    uuid: "123e4567-e89b-12d3-a456-426614174000",
 *    name: "Hospital 1",
 *    addressBuildingName: "Building 1",
 *    addressBuildingAddress: "Building 1, 6, SEZ 21",
 *    addressStreet: "Stree 1, Highway 1",
 *    addressCity: "Hyderabad",
 *    addressDistrict: "Hyderabad",
 *    addressState: "Telangana",
 *    addressPincode: "500001",
 *    lat: "12.123456",
 *    long: "77.123456",
 *    contactFirstName: "Contact",
 *    contactLastName: "Name",
 *    contactMobile: "+912345678901",
 *    contactEmail: "email@GMAIL.COM",
 *    contactGstNumber: "AA1234567890AEZ"
 * }
 *
 * @apiSuccess {JSON} Listing of network hospitals.
 *
 * @apiSuccessExample Success-Response:
 *     {
 *       "status": 200,
 *       "errCode": "Success",
 *       "data": [{hospitals}]
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
router.get('/:policyId/networkHospitals/',
  [
    header('Authorization').not().isEmpty().withMessage(`Authorization token cannot be empty.`),
    param('policyid').not().isEmpty().withMessage('Cannot be empty'),
    authService.authorize
  ],
  policies.getNetworkHospitalsByPolicyId);

/**
 * @api {get} /:policyId/ailments/ Get ailments covered given policy id.
 * @apiName GetAilmentsByPolicyId
 * @apiVersion 1.0.0
 * @apiGroup Policies
 * @apiDescription Request ailments by policy id for a requesting user of role Manager or Executive or Customer. Throws an authz error for other roles. Logged in customer will get ailments list for his/her policy only. Logged in executive will see ailments list if the policyId belongs to a coporate that he/she manages.
 *
 * @apiExample {curl} Example usage:
 *     curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request GET http://localhost:3000/policies/:policyid/ailments/
 * This is an example of an ailment JSON:
 * {
 *    uuid: "123e4567-e89b-12d3-a456-426614174000",
 *    name: "ailment 1",
 *    description: "This is an example description of an ailment. A typical description might span a much longer statement.",
 * }
 *
 * @apiSuccess {JSON} Listing of ailments.
 *
 * @apiSuccessExample Success-Response:
 *     {
 *       "status": 200,
 *       "errCode": "Success",
 *       "data": [{ailments}]
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
router.get('/:policyId/ailments/',
  [
    header('Authorization').not().isEmpty().withMessage(`Authorization token cannot be empty.`),
    param('policyid').not().isEmpty().withMessage('Cannot be empty'),
    authService.authorize
  ],
  policies.getAilmentsByPolicyId);

/**
 * @api {post} /policies Add an array of policies
 * @apiName AddPolicies
 * @apiVersion 1.0.0
 * @apiGroup Policies
 * @apiDescription Add an array of policies if submitting user is Manager or Executive. Throws an authz error for other roles. An executive can add a policy only for the corporates managed by him/her.
 *
 * @apiExample {curl} Example usage:
 *     curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request POST --data '[{policy1}, {policy2}, ...]' http://localhost:3000/policies
 *
 * @apiSuccess {JSON} Listing of added policies.
 *
 * @apiSuccessExample Success-Response:
 *     {
 *        'status': 200,
 *        'errCode':'Success',
 *        'data': [{policies}],
 *     }
 *
 * @apiError NoPoliciesInRequestBody Empty request body sent.
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
    header('Authorization').not().isEmpty().withMessage(`Cannot be empty.`),
    body().isArray({min: 1}).withMessage('req.body must have an array (of at least 1 JSON) of policy objects'),
    body('*.tpaUuid').not().isEmpty().withMessage('Cannot be empty.'),
    body('*.corporateUuid').not().isEmpty().withMessage('Cannot be empty.'),
    body('*.insuranceCompanyUuid').not().isEmpty().withMessage('Cannot be empty.'),
    body('*.policyId').not().isEmpty().withMessage('Cannot be empty.'),
    body('*.fromDate').not().isEmpty().withMessage('Cannot be empty.'),
    body('*.toDate').not().isEmpty().withMessage('Cannot be empty.'),
    body('*.policyYear').not().isEmpty().withMessage('Cannot be empty.'),
    body('*.numberOfDependents').optional().trim().toFloat().isFloat().withMessage('Must be a float number'),
    body('*.sumInsured').optional().trim().toFloat().isFloat().withMessage('Must be a float number'),
    body('*.premiumPerFamily').optional().trim().toFloat().isFloat().withMessage('Must be a float number'),
    body('*.premiumPerDependent').optional().trim().toFloat().isFloat().withMessage('Must be a float number'),
    body('*.copay').optional().trim().toFloat().isFloat().withMessage('Must be a float number'),
    body('*.parentalSubLimit').optional().trim().toFloat().isFloat().withMessage('Must be a float number'),
    body('*.parentalCopay').optional().trim().toFloat().isFloat().withMessage('Must be a float number'),
    body('*.opdLimit').optional().trim().toFloat().isFloat().withMessage('Must be a float number'),
    body('*.appendicitis').optional().trim().toFloat().isFloat().withMessage('Must be a float number'),
    body('*.hernia').optional().trim().toFloat().isFloat().withMessage('Must be a float number'),
    body('*.arthiritis').optional().trim().toFloat().isFloat().withMessage('Must be a float number'),
    body('*.digestiveDisorders').optional().trim().toFloat().isFloat().withMessage('Must be a float number'),
    body('*.cataract').optional().trim().toFloat().isFloat().withMessage('Must be a float number'),
    body('*.gallBladderAndHisterectomy').optional().trim().toFloat().isFloat().withMessage('Must be a float number'),
    body('*.kneeReplacement').optional().trim().toFloat().isFloat().withMessage('Must be a float number'),
    body('*.jointReplacementIncludingVertrebalJoints').optional().trim().toFloat().isFloat().withMessage('Must be a float number'),
    body('*.treatmentForKidneyStones').optional().trim().toFloat().isFloat().withMessage('Must be a float number'),
    body('*.piles').optional().trim().toFloat().isFloat().withMessage('Must be a float number'),
    body('*.hydrocele').optional().trim().toFloat().isFloat().withMessage('Must be a float number'),
    body('*.lasikSurgery').optional().trim().toFloat().isFloat().withMessage('Must be a float number'),
    authService.authorize
  ],
  policies.addPolicies);

/**
 * @api {put} /policies Update a policy
 * @apiName UpdatePolicies
 * @apiVersion 1.0.0
 * @apiGroup Policies
 * @apiDescription Update a policy if submitting user is Manager or Executive. Throws an authz error for other roles. An executive can add a policy only for the corporates managed by him/her.
 *
 * @apiExample {curl} Example usage:
 *     curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request PUT --data '{policy1}' http://localhost:3000/policies
 *
 * @apiParam {UUID} uuid UUID of the policy - MANDATORY
 * @apiParam {String} policyId The policyId - MANDATORY
 * All other fields to change can be provided as optional parameters
 *
 * @apiSuccess {JSON} Listing of added policies.
 *
 * @apiSuccessExample Success-Response:
 *     {
 *        'status': 200,
 *        'errCode':'Success',
 *        'data': [{policies}],
 *     }
 *
 * @apiError NoPoliciesInRequestBody Empty request body sent.
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
router.put('/',
  [
    header('Authorization').not().isEmpty().withMessage(`Authorization token cannot be empty.`),
    body('uuid').not().isEmpty().withMessage('tpaUuid in req.body cannot be empty.'),
    body('policyId').optional().not().isEmpty().withMessage('policyId in req.body cannot be empty.'),
    authService.authorize
  ],
  policies.updatePolicy
);

/**
 * @api {post} /policies/:policyId/networkHospitals/ Add an array of network hospitals for a policy id
 * @apiName AddNetworkHospitalsByPolicyId
 * @apiVersion 1.0.0
 * @apiGroup Policies
 * @apiDescription Add an array of network hospitals for a policy if submitting user is Manager or Executive. Throws an authz error for other roles. An executive can add a list of network hospitals only for the corporates managed by him/her.
 *
 * @apiExample {curl} Example usage:
 *     curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request POST --data '[{hospital1}, {hospital2}, ...]' http://localhost:3000/policies/:policyId/networkHospitals
 * This is an example of a hospital JSON:
 * {
 *    uuid: "123e4567-e89b-12d3-a456-426614174000",
 *    name: "Hospital 1",
 *    addressBuildingName: "Building 1",
 *    addressBuildingAddress: "Building 1, 6, SEZ 21",
 *    addressStreet: "Stree 1, Highway 1",
 *    addressCity: "Hyderabad",
 *    addressDistrict: "Hyderabad",
 *    addressState: "Telangana",
 *    addressPincode: "500001",
 *    lat: "12.123456",
 *    long: "77.123456",
 *    contactFirstName: "Contact",
 *    contactLastName: "Name",
 *    contactMobile: "+912345678901",
 *    contactEmail: "email@GMAIL.COM",
 *    contactGstNumber: "AA1234567890AEZ"
 * }
 *
 * @apiSuccess {JSON} Listing of added policies.
 *
 * @apiSuccessExample Success-Response:
 *     {
 *        'status': 200,
 *        'errCode':'Success',
 *        'data': [{policies}],
 *     }
 *
 * @apiError NoNetworkHospitalsInRequestBody Empty request body sent.
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
router.post('/:policyId/networkHospitals/',
  [
    header('Authorization').not().isEmpty().withMessage(`Authorization token cannot be empty.`),
    body().isArray({min: 1}).withMessage('req.body must have an array (of at least 1 JSON) of policy objects'),
    param('policyid').not().isEmpty().withMessage('Cannot be empty'),
    authService.authorize
  ],
  policies.addNetworkHospitalsByPolicyId);

/**
 * @api {post} /policies/:policyId/ailments/ Add an array of ailments for a policy id
 * @apiName AddAilmentsByPolicyId
 * @apiVersion 1.0.0
 * @apiGroup Policies
 * @apiDescription Add an array of ailments for a policy if submitting user is Manager or Executive. Throws an authz error for other roles. An executive can add a list of network hospitals only for the corporates managed by him/her.
 *
 * @apiExample {curl} Example usage:
 *     curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request POST --data '[{disease1}, {disease2}, ...]' http://localhost:3000/policies/:policyId/ailments
 * This is an example of an ailment JSON:
 * {
 *    uuid: "123e4567-e89b-12d3-a456-426614174000",
 *    name: "ailment 1",
 *    description: "This is an example description of an ailment. A typical description might span a much longer statement.",
 * }
 *
 * @apiSuccess {JSON} Listing of added ailments.
 *
 * @apiSuccessExample Success-Response:
 *     {
 *        'status': 200,
 *        'errCode':'Success',
 *        'data': [{ailments}],
 *     }
 *
 * @apiError NoAilmentssInRequestBody Empty request body sent.
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
router.post('/:policyId/ailments/',
  [
    header('Authorization').not().isEmpty().withMessage(`Authorization token cannot be empty.`),
    body().isArray({min: 1}).withMessage('req.body must have an array (of at least 1 JSON) of policy objects'),
    param('policyid').not().isEmpty().withMessage('Cannot be empty'),
    authService.authorize
  ],
  policies.addAilmentsByPolicyId);

module.exports = router;
