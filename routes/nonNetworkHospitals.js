"use strict";

const express = require('express');
const router = express.Router();
const authService = require('../services/authService');
const hospitals = require('../controllers/hospitalsController');
const { body, header, query } = require('express-validator');

/**
 * @api {get} /nonNetworkHospitals/search Search all Network hospitals containing substring in name and address fields.
 * @apiName SearchNonNetworkHospitalsByNameAndAddress
 * @apiVersion 1.0.0
 * @apiGroup Hospitals
 * @apiDescription Search all non-network hospitals that have given search string in their name or address.
 *
 * @apiExample {curl} Example usage:
 *   curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request GET 'http://localhost:3000/nonNetworkHospitals/search?name=opp'
 *
 * @apiSuccess {JSON} hospitalNamesList Returns an array of matching hospital names
 *
 * @apiSuccessExample Success-Response:
 *   {
 *     "status": 200,
 *     "errCode": "Success",
 *     "data": "[
 *      Appollo Hospitals,
 *      AppGenix Hospitals,
 *      Viva Apolli Hospitals
 *     ]"
 *   }
 *
 * @apiError UnauthorizedAccess For any authn errors only. No authz checks are done.
 *
 * @apiErrorExample Error-Response:
 *   {
 *     "status": "401",
 *     "errCode": 'EmptyOrInvalidJwtToken',
 *     "message": 'auth token is empty or invalid',
 *     "wwwAuthenticate": 'JWT',
 *     "data": "<detailed JSON or any other data as returned>",
 *   }
 */
router.get('/search',
  [
    header('Authorization').not().isEmpty().withMessage(`cannot be empty.`),
    query('name').not().isEmpty().withMessage('Cannot be empty'),
    authService.authorize
  ],
  hospitals.searchNonNetworkHospitals);

/**
 * @api {get} /nonNetworkHospitals Get all non-Network hospitals
 * @apiName GetNonNetworkHospitals
 * @apiVersion 1.0.0
 * @apiGroup Hospitals
 * @apiDescription Get all non-network hospitals. This is accessible to all.
 *
 * @apiExample {curl} Example usage:
 *   curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request GET http://localhost:3000/hospitals
 *
 * @apiSuccess {JSON} HospitalsList Listing of hospitals.
 *
 * @apiSuccessExample Success-Response:
 *   {
 *     "status": 200,
 *     "errCode": "Success",
 *     "data": "[{
 *       "uuid": "<uuid>",
 *       "hospitalId": "<hospitalId>",
 *       "name": "<name>",
 *       "addressBuildingName": "<addressBuildingName>",
 *       "addressBuildingAddress": "<addressBuildingAddress>",
 *       "addressStreet": "<addressStreet>",
 *       "addressCity": "<addressCity>",
 *       "addressDistrict": "<addressDistrict>",
 *       "addressState": "<addressState>",
 *       "addressPincode": "<addressPincode>",
 *     },
 *     {
 *       "uuid": "<uuid>",
 *       "hospitalId": "<hospitalId>",
 *       "name": "<name>",
 *       "addressBuildingName": "<addressBuildingName>",
 *       "addressBuildingAddress": "<addressBuildingAddress>",
 *       "addressStreet": "<addressStreet>",
 *       "addressCity": "<addressCity>",
 *       "addressDistrict": "<addressDistrict>",
 *       "addressState": "<addressState>",
 *     }]"
 *   }
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
    header('Authorization').not().isEmpty().withMessage(`cannot be empty.`),
    authService.authorize
  ],
  hospitals.getNonNetworkHospitals);

/**
 * @api {post} /nonNetworkHospitals Add new non-network hospitals
 * @apiName AddNonNetworkHospitals
 * @apiVersion 1.0.0
 * @apiGroup Hospitals
 * @apiDescription Add new non-network hospitals if requesting user is Manager or executive.
 *
 * @apiExample {curl} Example usage:
 *   curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request POST --data '[{hospital1}, {hospital2}, ...]' http://localhost:3000/hospitals
 *
 * @apiSuccess {JSON} AddedHospitalsArray Listing of added non-network hospitals.
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
 *   {
 *     status: 401,
 *     errCode: 'EmptyOrInvalidJwtToken',
 *     message: 'auth token is empty or invalid',
 *     wwwAuthenticate: 'JWT',
 *     data: req.headers,
 *   }
 */
router.post('/',
  [
    header('Authorization').not().isEmpty().withMessage(`Cannot be empty.`),
    body().isArray({min: 1}).withMessage('req.body must have an array (of at least 1 JSON) of hospital objects'),
    authService.authorize
  ],
  hospitals.addNonNetworkHospitals);

module.exports = router;
