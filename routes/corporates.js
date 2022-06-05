"use strict";

const express = require('express');
const router = express.Router();
const { body, header, query, param } = require('express-validator');
const corporates = require('../controllers/corporatesController');
const corporatesService = require('../services/corporatesService');
const authService = require('../services/authService');


/**
 * Get list of corporates and executives linked
 */

router.get('/executives',
  [
    header('Authorization').not().isEmpty().withMessage(`Cannot be empty.`),
    authService.authorize
  ],
  corporates.getAllCorporatesExecutivesList
);



/**
 * @api {get} /corporates/search Search all corporates by name.
 * @apiName SearchCorporates
 * @apiVersion 1.0.0
 * @apiGroup Corporates
 * @apiDescription Search all corporaes that have given search string in their name.
 *
 * @apiExample {curl} Example usage:
 *   curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request GET 'http://localhost:3000/api/v1/corporates/search?name=wip'
 * @apiSuccessExample Success-Response:
 * {
 *   "status": 200,
 *   "errCode": "Success",
 *   "data": [
 *     {name: Wipro Technologies; uuid: <uuid>>},
 *     {name: Wipro Life Sciences; uuid: <uuid>>},
 *   ]
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
router.get('/search',
  [
    header('Authorization').not().isEmpty().withMessage(`Cannot be empty.`),
    query('name').not().isEmpty().withMessage('Cannot be empty'),
    authService.authorize
  ],
  corporates.searchCorporates
);

/**
 * @api {get} /corporates Get all corporates
 * @apiName GetAllCorporates
 * @apiVersion 1.0.0
 * @apiGroup Corporates
 * @apiDescription Get all corporates as per these rules:
 *    - HR: For HR login, return the details of the corporate that the HR belongs to
 *    - Executive: For Executive login, return the list of corporates that this executive manages
 *    - Manager: For Manager login, return the consolidated list of corporates managed by all executives reporting to this manager
 *
 * @apiExample {curl} Example usage:
 *   curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request GET http://localhost:3000/api/v1/corporates
 *   curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request GET http://localhost:3000/api/v1/corporates?status=<>
 *
 * @apiParam {status} Optional query param. Filters corporates by status. Value can be "new" or "approved".
 * @apiSuccess {JSON} Corporates An array of this JSON object:
 * @apiSuccessExample Success-Response:
 *     {
 *       "status": "200",
 *       "errCode": "Success",
 *       "data": "[{corporate1_JSON}, {corporate2_JSON}, ...]"
 *     }
 * @apiError UnauthorizedAccess For any authn or authz errors.
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
    query('status').optional().not().isEmpty().withMessage('Cannot be empty'),
    query('status').optional().isIn(['new', 'approved']).withMessage('invalid status value'),
    authService.authorize
    ],
  corporates.getCorporates
);

/**
 * @api {post} /corporates Add an array of corporates
 * @apiName AddCorporates
 * @apiVersion 1.0.0
 * @apiGroup Corporates
 * @apiDescription Add an array of corporates if submitting user is Manager or Executive. Throws an authz error for other roles.
 *
 * @apiExample {curl} Example usage:
 *     curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request POST --data '[{corporate1}, {corporate2}, ...]' http://localhost:3000/api/v1/corporates
 * An example JSON for Corporate looks like this:
 * {
 *    executiveUuid: <logged-in-executive-uuid>,
 *    companyName: "Wipro Technologies Pvt Ltd",
 *    displayName: "Wipro",
 *    branchCode: "1",
 *    branchAddressBuildingName: "Wipro Limited",
 *    branchAddressBuildingAddress: "Doddakannelli",
 *    branchAddressStreet: "Sarjapur Road",
 *    branchAddressCity: "Bengaluru",
 *    branchAddressDistrict: "Bengaluru",
 *    branchAddressState: "Karnataka",
 *    branchAddressPincode: "560035",
 *    lat: "12.909711",
 *    long: "77.687124"
 * }
 *
 * @apiSuccess {JSON} Corporates An array of above JSON object but with UUID.
 *
 * @apiSuccessExample Success-Response:
 *     {
 *        'status': 200,
 *        'errCode':'Success',
 *        'data': corporates,
 *     }
 *
 * @apiError NoCorporatesInRequestBody Empty request body sent.
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
    body().isArray({min: 1}).withMessage('req.body must have an array (of at least 1 JSON) of corporate objects'),
    body('*.uuid').optional().not().isEmpty().custom(value => {
      return corporatesService.getCorporatesByUuid(value)
      .then(corp => {
        if (corp) {
          return Promise.reject(`uuid is not unique`);
        }
      })
    }),
    body('*.companyName').optional().not().isEmpty().custom(value => {
      return corporatesService.getCorporateByCompanyName(value)
      .then(corp => {
        if (corp) {
          return Promise.reject(`companyName must be unique`);
        }
      })
    }),
    body('*.displayName').optional().not().isEmpty().custom(value => {
      return corporatesService.getCorporateByDisplayName(value)
      .then(corp => {
        if (corp) {
          return Promise.reject(`displayName must be unique`);
        }
      })
    }),
  authService.authorize
  ],
  corporates.addCorporates
);

/**
 * @api {put} /corporates Update a corporates
 * @apiName UpdateCorporate
 * @apiVersion 1.0.0
 * @apiGroup Corporates
 * @apiDescription Update a corporate if submitting user is Manager or Executive.
 *
 * @apiExample {curl} Example usage:
 *     curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request PUT --data '{corporate}' http://localhost:3000/api/v1/corporates
 * An example JSON for Corporate looks like this:
 * {
 *    uuid: <logged-in-executive-uuid>,
 *    companyName: "Wipro Technologies Pvt Ltd",
 *    displayName: "Wipro",
 *    branchCode: "1",
 *    branchAddressBuildingName: "Wipro Limited",
 *    branchAddressBuildingAddress: "Doddakannelli",
 *    branchAddressStreet: "Sarjapur Road",
 *    branchAddressCity: "Bengaluru",
 *    branchAddressDistrict: "Bengaluru",
 *    branchAddressState: "Karnataka",
 *    branchAddressPincode: "560035",
 *    lat: "12.909711",
 *    long: "77.687124"
 * }
 *
 * @apiSuccess {JSON} Number of rows updated.
 *
 * @apiSuccessExample Success-Response:
 *     {
 *        'status': 200,
 *        'errCode':'Success',
 *        'data': corporates,
 *     }
 *
 * @apiError NoCorporatesInRequestBody Empty request body sent.
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
    header('Authorization').not().isEmpty().withMessage(`Cannot be empty.`),
    body('uuid').not().isEmpty().custom(value => {
      return corporatesService.getCorporatesByUuid(value)
      .then(corp => {
        if (!corp) {
          return Promise.reject(`Corporate with uuid [${value}] not found`);
        }
      })
    }),
    authService.authorize
  ],
  corporates.updateCorporate
);

/**
 * @api {post} /corporates/:uuid/hr Add an array of corporate HRs given corporate uuid
 * @apiName AddHRsByCorporate
 * @apiVersion 1.0.0
 * @apiGroup Corporates
 * @apiDescription Add an array of corporates if submitting user is Manager or Executive. Throws an authz error for other roles.
 *
 * @apiParam (Corporates) {uuid} UUID of the corporate.
 *
 * @apiExample {curl} Example usage:
 *     curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request POST --data '[{corporateHR1}, {corporateHR2}, ...]' http://localhost:3000/api/v1/corporates/:uuid/hr
 * An example HR JSON looks like this:
 * {
 *   empid: "emp001",
 *   corporateUuid: uuid-of-linked-Corporate,
 *   firstName: "FirstName",
 *   lastName: "LastName",
 *   email: "FirstName.LastName@corporate.com",
 *   mobile: "+919876543210"
 * }
 *
 * @apiSuccess {JSON} CorporateHRs An array of above JSON but with UUID
 *
 * @apiSuccessExample Success-Response:
 *     {
 *        'status': 200,
 *        'errCode':'Success',
 *        'data': corporateHRs,
 *     }
 *
 * @apiError NoCorporateHRsInRequestBody Empty request body sent.
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
router.post('/:uuid/hr',
  [
    header('Authorization').not().isEmpty().withMessage(`Cannot be empty.`),
    body().isArray({min: 1}).withMessage('req.body must have an array (of at least 1 JSON) of HR objects'),
    body('*.empid').not().isEmpty().withMessage('Cannot be empty.'),
    body('*.firstName').not().isEmpty().withMessage('Cannot be empty.'),
    param('uuid').not().isEmpty().custom(value => {
      return corporatesService.getCorporatesByUuid(value)
      .then(corp => {
        if (!corp) {
          return Promise.reject(`A corporate with UUID [${value}] was not found`);
        }
      })
    }),
    authService.authorize
  ], corporates.addHRsByCorporate
);

router.put('/update_executive',
  [
    header('Authorization').not().isEmpty().withMessage(`Cannot be empty.`),
    body('executiveUuid').not().isEmpty().withMessage('executiveUuid in req.body cannot be empty.'),
    body('corporateUuid').not().isEmpty().withMessage('corporateUuid in req.body cannot be empty.'),    
     authService.authorize
  ], corporates.updateCorporateExecutive
);


module.exports = router;
