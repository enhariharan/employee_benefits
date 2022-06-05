'use strict';

const express = require('express');
const router = express.Router();
const authService = require('../services/authService');
const hospitals = require('../controllers/hospitalsController');
const { header, query } = require('express-validator');

/**
 * @api {get} /networkHospitals/search Search all Network hospitals by name OR by city OR by pin-code.
 * @apiName SearchNetworkHospitals
 * @apiVersion 1.0.0
 * @apiGroup Hospitals
 * @apiDescription Search all network hospitals that have given search string in their name OR city OR pincode.
 *
 * @apiExample {curl} Example usage:
 *   curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request GET 'http://localhost:3000/networkHospitals/search?name=oll'
 * @apiSuccessExample Success-Response:
 *     {
 *       "status": 200,
 *       "errCode": "Success",
 *       "data": [Apollo Hospitals, KIMS, Fortis Hospitals Pvt Ltd]
 *     }
 *
 * @apiExample {curl} Example usage:
 *   curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request GET 'http://localhost:3000/networkHospitals/search?city=del'
 * @apiSuccessExample Success-Response:
 *     {
 *       "status": 200,
 *       "errCode": "Success",
 *       "data": [hyderabad, bangalore, delhi]
 *     }
 *
 *   curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request GET 'http://localhost:3000/networkHospitals/search?pincode=500001'
 * @apiSuccessExample Success-Response:
 *     {
 *       "status": 200,
 *       "errCode": "Success",
 *       "data": [500001, 560123]
 *     }
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
router.get('/search',
  [
    header('Authorization').not().isEmpty().withMessage(`Cannot be empty.`),
    query('hospitalName').optional().not().isEmpty().withMessage('hospitalName cannot be empty'),
    query('city').optional().not().isEmpty().withMessage('city cannot be empty'),
    query('pincode').optional().not().isEmpty().withMessage('pincode cannot be empty'),
    authService.authorize
  ],
  hospitals.searchNetworkHospitals);

/**
 * @api {get} /networkHospitals Get all Network hospitals satisfying given query criteria.
 * @apiName GetNetworkHospitals
 * @apiVersion 1.0.0
 * @apiGroup Hospitals
 * @apiDescription Get all non-network hospitals. This is accessible to all with username and password.
 *
 * @apiExample {curl} Example usage: *** ALL SEARCHES ARE CASE SENSITIVE ***
 *   curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request GET 'http://localhost:3000/networkHospitals'
 *   curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request GET 'http://localhost:3000/networkHospitals?uuid=<uuid>'
 *   curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request GET 'http://localhost:3000/networkHospitals?corporateuuid=<uuid>'
 *   curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request GET 'http://localhost:3000/networkHospitals?hospitalName=Apollo General Hospitals'
 *   curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request GET 'http://localhost:3000/networkHospitals?city=hyderabad'
 *   curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request GET 'http://localhost:3000/networkHospitals?pincode=500001'
 *   curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request GET 'http://localhost:3000/networkHospitals?hospitalName=Apollo General Hospitals'&city=hyderabad'&pincode=500001'
 *   curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request GET 'http://localhost:3000/networkHospitals?startIndex=1'
 *   curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request GET 'http://localhost:3000/networkHospitals?startIndex=1&endIndex=10'
 *
 * @apiSuccess {JSON} Listing of hospitals.
 *
 * @apiSuccessExample Success-Response:
 *     {
 *       "status": 200,
 *       "errCode": "Success",
 *       "data": "[{hospitals}]"
 *     }
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
router.get('/',
  [
    header('Authorization').not().isEmpty().withMessage(`Cannot be empty.`),
    authService.authorize
  ],
  hospitals.getNetworkHospitals);

/**
 * @api {post} /networkHospitals Add new network hospitals from SOAP service and fill our table.
 * @apiName AddNetworkHospitals
 * @apiVersion 1.0.0
 * @apiGroup Hospitals
 * @apiDescription Add new network hospitals from SOAP service.
 *
 * @apiExample {curl} Example usage:
 *   curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request POST --data '{"tpaUuid": <uuid>, "insuranceCompanyUuid": <uuid>}' 'http://localhost:3000/networkHospitals?startIndex=101&endIndex=1500'
 *   The following JSON must be sent in the request body. Otherwise this call will fail with HTTP error code 400.
 *   {
 *      "tpaUuid": "5583b5bb-c79f-4afd-b299-d74bbc652bd0",
 *      "insuranceCompanyUuid": "14757303-1721-4921-a152-ea46d48812f5"
 *   }
 *
 * @apiSuccess {JSON} Listing of added non-network hospitals.
 *
 * @apiSuccessExample Success-Response:
 *   {
 *     "status": 200,
 *     "errCode": "Success",
 *     "data": "[{hospitals}]"
 *   }
 *
 * @apiError UnauthorizedAccess For any authn errors only. No authz checks are done.
 * @apiErrorExample Error-Response:
 *   {
 *     status: 401,
 *     errCode: 'EmptyOrInvalidJwtToken',
 *     message: 'auth token is empty or invalid',
 *     wwwAuthenticate: 'JWT',
 *     data: req.headers,
 *   }
 *
 * @apiError InvalidQuery If TPA UUID is not provided in request body.
 * @apiErrorExample Error-Response:
 *  {
 *    status: 400,
 *    errCode: 'InvalidQuery.',
 *    message: 'TPA UUID must be provided in request body.'
 *  };
 *
 * @apiError InvalidQuery If Insurance COmpany UUID is not provided in request body.
 * @apiErrorExample Error-Response:
 *  {
 *    status: 400,
 *    errCode: 'InvalidQuery.',
 *    message: 'Insurance Company UUID must be provided in request body.'
 *  };
 *
 */
router.post('/',
  [
    header('Authorization').not().isEmpty().withMessage(`Cannot be empty.`),
    query('tpaUuid').not().isEmpty().withMessage('tpaUuid cannot be empty'),
    query('insuranceCompanyUuid').not().isEmpty().withMessage('insuranceCompanyUuid cannot be empty'),
    authService.authorize
  ],
  hospitals.addNetworkHospitalsFromSoap);


  router.get('/addNetworkHospitalByCron', hospitals.addNetworkHospitalByCron);



module.exports = router;
