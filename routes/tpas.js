"use strict";

const express = require('express');
const router = express.Router();
const tpas = require('../controllers/tpasController');
const authService = require('../services/authService');
const tpasService = require('../services/tpasService');
const { body, header } = require('express-validator');

/**
 * @api {get} /tpas Get all TPAs
 * @apiName GetAllTPAs
 * @apiVersion 1.0.0
 * @apiGroup TPAs
 * @apiDescription Get all TPAs.
 *
 * @apiExample {curl} Example usage:
 *     curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request GET http://localhost:3000/tpas
 *
 * @apiSuccess {JSON} Listing of all broking companies.
 *
 * @apiSuccessExample Success-Response:
 *     {
 *       "code": "200",
 *       "data": "[{TPA1_JSON}, {TPA2_JSON}, ...]"
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
 *        object: req.headers,
 *      }
 */
router.get('/', [
  authService.authorize,
  header('Authorization').not().isEmpty().withMessage(`Cannot be empty.`)
  ], tpas.getAllTpas
);

/**
 * @api {post} /tpas Add an array of TPAs
 * @apiName AddTpas
 * @apiVersion 1.0.0
 * @apiGroup TPAs
 * @apiDescription Add an array of TPAs if submitting user is Manager or Executive. Throws an authz error for other roles.
 *
 * @apiExample {curl} Example usage:
 *     curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request POST --data '[{TPA1}, {TPA2}, ...]' http://localhost:3000/tpas
 *
 * @apiSuccess {JSON} Listing of added TPAs.
 *
 * @apiSuccessExample Success-Response:
 *     {
 *        'status': 200,
 *        'errCode':'Success',
 *        'data': TPAs,
 *     }
 *
 * @apiError NoTPAsInRequestBody Empty request body sent.
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
    authService.authorize,
    header('Authorization').not().isEmpty().withMessage(`Authorization token cannot be empty.`),
    body().isArray({min: 1}).withMessage('req.body must have an array (of at least 1 JSON) of TPA objects'),
    body('*.branchCode').not().isEmpty().withMessage('cannot be empty'),
    body('*.tpaid').not().isEmpty().custom(value => {
      return tpasService.getTpaByTpaId(value)
      .then(tpa => {
        if (tpa) {return Promise.reject(`must be unique`);}
      })
    }),
    body('*.companyName').not().isEmpty().custom(value => {
      return tpasService.getTpaByCompanyName(value)
      .then(tpa => {
        if (tpa) {return Promise.reject(`must be unique`);}
      })
    }),
    body('*.displayName').not().isEmpty().custom(value => {
      return tpasService.getTpaByDisplayName(value)
      .then(tpa => {
        if (tpa) {return Promise.reject(`must be unique`);}
      })
    }),
  ],
  tpas.addTpas
);

module.exports = router;
