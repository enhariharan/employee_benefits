"use strict";

const express = require('express');
const router = express.Router();
const brokingCompanies = require('../controllers/brokingCompaniesController');
const brokingCompaniesService = require('../services/brokingCompaniesService');
const {header, body} = require('express-validator');
const authService = require('../services/authService');

/**
 * @api {get} /brokingCompanies Get all brokingCompanies
 * @apiName GetAllBrokingCompanies
 * @apiVersion 1.0.0
 * @apiGroup BrokingCompanies
 * @apiDescription Get all broking companies if requesting user is Manager or Executive. Throws an authz error for other roles.
 *
 * @apiExample {curl} Example usage:
 *     curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request GET http://localhost:3000/brokingCompanies
 *
 * @apiSuccess {JSON} Listing of all broking companies.
 *
 * @apiSuccessExample Success-Response:
 *     {
 *       "status": 200,
 *       "errCode": "Success",
 *       "data": "[{brokingCompany1JSON}, {brokingCompany2JSON}, ...]"
 *     }
 *
 * @apiError 400 if Authorization header (JWT token) is not provided.
 * @apiError 400 if Authorization header (JWT token) is incorrect.
 * @apiError 400 if role is not manager or executive.
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
router.get('/',[
    header('Authorization').not().isEmpty().withMessage(`Cannot be empty.`),
    authService.authorize
  ],
  brokingCompanies.getAllBrokingCompanies
);

/**
 * @api {post} /brokingCompanies Add an array of broking companies
 * @apiName AddBrokingCompanies
 * @apiVersion 1.0.0
 * @apiGroup BrokingCompanies
 * @apiDescription Add an array of broking companies if submitting user is Manager or Executive. Throws an authz error for other roles.
 *
 * @apiExample {curl} Example usage:
 *     curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request POST --data '[{company1}, {company2}, ...]' http://localhost:3000/brokingCompanies
 *
 * @apiSuccess {JSON} Listing of added broking companies.
 *
 * @apiSuccessExample Success-Response:
 *     {
 *        'status': 200,
 *        'errCode':'Success',
 *        'data': brokingCompanies,
 *     }
 *
 * @apiError NoBrokingCompaniesInRequestBody Empty request body sent.
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
router.post('/', [
    header('Authorization').not().isEmpty().withMessage(`Cannot be empty.`),
    body().isArray({min: 1}).withMessage('req.body must have an array (of at least 1 JSON) of corporate objects'),
    body('*.uuid').optional().not().isEmpty().custom(value => {
      return brokingCompaniesService.getBrokingCompanyByUuid(value)
      .then(corp => {
        if (corp) {return Promise.reject(`uuid is not unique`);}
      })
    }),
    body('*.companyName').not().isEmpty().custom(value => {
      return brokingCompaniesService.getBrokingCompanyByCompanyName(value)
      .then(corp => {
        if (corp) {return Promise.reject(`companyName must be unique`);}
      })
    }),
    body('*.displayName').not().isEmpty().custom(value => {
      return brokingCompaniesService.getBrokingCompanyByDisplayName(value)
      .then(corp => {
        if (corp) {return Promise.reject(`displayName must be unique`);}
      })
    }),
    authService.authorize,
  ],
  brokingCompanies.addBrokingCompanies
);

module.exports = router;
