"use strict";

const express = require('express');
const router = express.Router();
const insuranceCompanies = require('../controllers/insuranceCompaniesController');
const { body, header } = require('express-validator');
const authService = require('../services/authService');

/**
 * @api {get} /insuranceCompanies Add insurance companies.
 * @apiName GetInsuranceCompanies
 * @apiVersion 1.0.0
 * @apiGroup InsuranceCompanies
 *
 * @apiExample {curl} Example usage:
 *     curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request GET http://localhost:3000/executives
 *
 * @apiSuccess {JSON} Listing of insurance companies.
 *
 * @apiSuccessExample Success-Response:
 *   {
 *     "status": 200,
 *     "errCode": "Success",
 *     "data": "[{insuranceCompanies}]"
 *   }
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
 */router.get('/',
  [
    header('Authorization').not().isEmpty().withMessage(`Authorization token cannot be empty.`),
    authService.authorize
  ],
  insuranceCompanies.getAllInsuranceCompanies
);

/**
 * @api {post} /insuranceCompanies Add insurance companies.
 * @apiName AddInsuranceCompanies
 * @apiVersion 1.0.0
 * @apiGroup InsuranceCompanies
 *
 * @apiExample {curl} Example usage:
 *     curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request POST --data '[{executive1}, {executive2}, ...]' http://localhost:3000/executives
 *
 * @apiSuccess {JSON} Listing of insurance companies.
 *
 * @apiSuccessExample Success-Response:
 *   {
 *     "status": 200,
 *     "errCode": "Success",
 *     "data": "[{insuranceCompanies}]"
 *   }
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
router.post('/',  [
    header('Authorization').not().isEmpty().withMessage(`Authorization token cannot be empty.`),
    body().isArray({min: 1}).withMessage('req.body must have an array (of at least 1 JSON) of InsuranceCompany objects'),
    body('*.companyName').not().isEmpty().withMessage('companyName in req.body cannot be empty.'),
    authService.authorize,
  ],
  insuranceCompanies.addInsuranceCompanies
);

module.exports = router;
