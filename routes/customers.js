"use strict";

const express = require('express');
const router = express.Router();
const customers = require('../controllers/customersController');
const customersService = require('../services/customersService');
const corporatesService = require('../services/corporatesService');
const {body, header, param, query} = require('express-validator');
const authService = require('../services/authService');
const VALID_STATUS = require('../services/employeeStatus').status
const VALID_APPROVAL_TYPE = require('../services/employeeStatus').approvalType


router.get('/helpdesk',
  [
    header('Authorization').not().isEmpty().withMessage('Authorization JWT not provided'),
    authService.authorize
  ],
  customers.getHelpDeskInfo
);

router.get('/getReportedIssues',
  [
    header('Authorization').not().isEmpty().withMessage('Authorization JWT not provided'),
    authService.authorize
  ],
  customers.getEmployeeReportedIssues
);

router.post('/report_issue',
  [
    header('Authorization').not().isEmpty().withMessage('Authorization JWT not provided'),
    body('issueType').not().isEmpty().withMessage('issueType in req.body cannot be empty.'),
    body('description').not().isEmpty().withMessage('description in req.body cannot be empty.'),
    authService.authorize
  ],
  customers.reportEmployeeGrievance
);

router.post('/insurance_enquiry',
  [
    header('Authorization').not().isEmpty().withMessage('Authorization JWT not provided'),
    body('insuranceType').not().isEmpty().withMessage('insuranceType in req.body cannot be empty.'),
    body('callBackRequestedTime').not().isEmpty().withMessage('callBackRequestedTime in req.body cannot be empty.'),
    authService.authorize
  ],
  customers.insuranceEnquiryCallback
);

/**
 * @api {get} /customers/search Search for customers by name
 * @apiName SearchCustomers
 * @apiVersion 1.0.0
 * @apiGroup Customers
 * @apiDescription Search customers containing the given search string in their first name or last name.
 *
 * @apiParam (Customers) {empid} Employee ID of the customer.
 *
 * @apiExample {curl} Example usage:
 *     curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request GET http://localhost:3000/api/v1/customers/search?name='amit'
 *
 * @apiSuccess {JSON} Customer Example: [{
 *    uuid: "123e4567-e89b-12d3-a456-426614174000",
 *    empid: "100001",
 *    firstName: "amit",
 *    lastName: "kumar",
 * },
 * {,
 *    uuid: "123e4567-e89b-12d3-a456-426614174000",
 *    empid: "100001",
 *    firstName: "Amitabh",
 *    lastName: "Nair",
 * },
 * {,
 *    uuid: "123e4567-e89b-12d3-a456-426614174000",
 *    empid: "100001",
 *    firstName: "Kishan",
 *    lastName: "Amitosh",
 * }]
 *
 * @apiSuccessExample Success-Response:
 *     {
 *        'status': 200,
 *        'errCode':'Success',
 *        'data': [dependents],
 *     }
 *
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
router.get('/search',
  [
    header('Authorization').not().isEmpty().withMessage('Authorization JWT not provided'),
    query('name').not().isEmpty().withMessage('name cannot be empty'),
    authService.authorize
  ],
  customers.search
);

/**
 * @api {get} /customers/:empid/ Get a customer by empid
 * @apiName GetCustomerByEmpId
 * @apiVersion 1.0.0
 * @apiGroup Customers
 * @apiDescription Request customers with a given empid. Gives back only logged in customer details if requesting user is logged in customer. Throws an authz error for other roles. Throws an authz error if logged in customer is not an HR and requests details of another customer.
 *
 * @apiParam {empid} empid Employee ID of customer.
 * @apiParam (UUID) corporateUuid Corporate UUID of customer.
 *
 * @apiExample {curl} Example usage:
 *     curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request GET http://localhost:3000/api/v1/customers/A12345?corporateUuid=uuid
 *
 * @apiSuccess {JSON} Customer Example: {
 *   uuid: 123e4567-e89b-12d3-a456-426614174000,
 *   empid: "100001",
 *   corporateUuid: 123e4567-e89b-12d3-a456-426614174000,
 *   firstName: "emp",
 *   lastName: "11",
 *   gender: "M",
 *   email: "emp11@wpiro.com",
 *   addressBuildingName: "Address Line 1",
 *   addressBuildingAddress: "Apartment 1",
 *   addressStreet: "Street one",
 *   addressCity: "Hyderabad",
 *   addressDistrict: "Hyderabad",
 *   addressState: "telangana",
 *   addressPincode: "500036",
 *   lat: "12.345678",
 *   long: "77.123456",
 *   contactFirstName: "Contact",
 *   contactLastName: "01",
 *   mobile: "+ 911234567890",
 *   contactEmail: "email@gmail.com",
 *   dob: "1970-01-01",
 *   sumInsured:30000,
 * }
 *
 * @apiSuccessExample Success-Response:
 *     {
 *       "status": "200",
 *       "errCode": "Success",
 *       "data": {customer}
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
    query('corporateUuid').not().isEmpty().withMessage(`corporateUuid in req.query cannot be empty.`),
    authService.authorize
  ],
  customers.getCustomerByEmpIdByCorporateUuid
);

/**
 * @api {get} /customers/:empid/dependents Get a customer's dependents by customer empid
 * @apiName GetCustomerDependentsByEmpid
 * @apiVersion 1.0.0
 * @apiGroup Customers
 * @apiDescription Request dependents of a customer with a given empid if requesting user is Manager or Executive or HR or logged in customer. Gives back only logged in customer's dependents details if requesting user is logged in customer. Throws an authz error for other roles. Throws an authz error if logged in customer requests details of another customer.
 *
 * @apiParam {empid} empid Employee ID of the customer.
 * @apiParam {UUID} corporateUuid MANDATORY. UUID of corporate.
 * @apiParam {string='created', 'hr approved', 'pending insurer approval', 'insurer approved', 'pending tpa approval', 'tpa approved', 'active', 'resigned', 'rejected', 'inactive', 'all'} OPTIONAL status Value of status.
 * @apiParam {string='addition', 'deletion', 'none', 'all'} approvaltype OPTIONAL Value of approvaltype.
 *
 * @apiExample {curl} Example usage:
 *   curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request GET http://localhost:3000/api/v1/customers/A12345/dependents?corporateUuid=<uuid>
 *   curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request GET http://localhost:3000/api/v1/customers/A12345/dependents?corporateUuid=<uuid>&status=active
 *   curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request GET http://localhost:3000/api/v1/customers/A12345/dependents?corporateUuid=<uuid>&approvaltype=addition
 *
 * @apiSuccessExample Success-Response:
 *     {
 *       "status": "200",
 *       "errCode": "Success",
 *       "data": {dependents: [{dependent}, {dependent}, ...]}
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
router.get('/:empid/dependents',
  [
    header('Authorization').not().isEmpty().withMessage('Authorization JWT not provided'),
    param('empid').not().isEmpty().withMessage('empid must be provided in req.param'),
    query('corporateUuid').custom(value => {
      if (!value) { return  Promise.reject(`Cannot be empty.`); }
      return corporatesService.getCorporatesByUuid(value)
      .then(corp => {
        if (!corp) {
          return Promise.reject(`Incorrect value. A Corporate with uuid [${value}] was not found.`);
        }
      })
    }),
    query('status').optional().custom(value => {
      if (!value) { return  Promise.reject(`Cannot be empty.`); }
      if (!VALID_STATUS.includes(value) && value !== 'all') { return  Promise.reject(`Incorrect value.`); }
    }),
    query('approvalType').optional().custom(value => {
      if (!value) { return  Promise.reject(`Cannot be empty.`); }
      if (!VALID_APPROVAL_TYPE.includes(value) && value !== 'all') { return  Promise.reject(`Incorrect value.`); }
    }),
    authService.authorize
  ],
  customers.getDependentsByEmpidByCorporateUuid
);

/**
 * @api {get} /customers Get all customers
 * @apiName GetAllCustomers
 * @apiVersion 1.0.0
 * @apiGroup Customers
 * @apiDescription Get all customers if requesting user is Manager or Executive. Gives back only logged in customer if requesting user is logged in customer. Gives back all customer belonging to a Corporate if requesting user is logged in HR. Throws an authz error for other roles.
 *
 * Customers can also be queried filtered by their status. The possible values of status are as below:
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
 * Customers can also be queried based on :
 *   'addition', // Set when employee is in the middle of onboarding workflow.
 *   'deletion', // Set when employee is in the middle of deboarding workflow.
 *   'none'      // Set when all workflows are complete and employee is not part of any workflow.
 *
 * @apiParam {empid} empid Employee ID of the customer.
 * @apiParam {UUID} corporateUuid OPTIONAL. Corporate UUID
 * @apiParam {string} status OPTIONAL. Customer or Dependent status
 * @apiParam {string} approvalType OPTIONAL. Customer or Dependent approval type
 *
 * @apiExample {curl} Example usage:
 *   curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request GET http://localhost:3000/api/v1/customers
 *   curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request GET http://localhost:3000/api/v1/customers?corporateUuid=<uuid>
 *   curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request GET http://localhost:3000/api/v1/customers?status=<>
 *   curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request GET http://localhost:3000/api/v1/customers?approvaltype=<>
 *
 * @apiSuccessExample Success-Response:
 *     {
 *       "code": "200",
 *       "data": "[{customer1}, {customer2}, ...]"
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
    authService.authorize,
    query('corporateUuid').optional().custom(value => {
      if (!value) { return  Promise.reject(`corporateUuid cannot be null.`); }
      return corporatesService.getCorporatesByUuid(value)
      .then(corp => {
        if (!corp) {
          return Promise.reject(`Incorrect value. Corporate with uuid ${value} not found.`);
        }
      })
    }),
    query('status').optional().custom(value => {
      if (!value) { return  Promise.reject(`Cannot be empty.`); }
      if (!VALID_STATUS.includes(value) && value !== 'all') { return  Promise.reject(`Incorrect value.`); }
    }),
    query('approvalType').optional().custom(value => {
      if (!value) { return  Promise.reject(`Cannot be empty.`); }
      if (!VALID_APPROVAL_TYPE.includes(value) && value !== 'all') { return  Promise.reject(`Incorrect value.`); }
    })
  ],
  customers.getAllCustomers);



/**
 * @api {put} /customers Updates a customers
 * @apiName UpdateCustomer
 * @apiVersion 1.0.0
 * @apiGroup Customers
 * @apiDescription Update a customer if requesting user is Manager or Executive.
 * Gives back only logged in customer if requesting user is logged in customer.
 * Gives back all customer belonging to a Corporate if requesting user is logged in HR.
 * Throws an authz error for other roles.
 *
 * @apiExample {curl} Example usage:
 *     curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request POST --data '{customer}' http://localhost:3000/api/v1/customers
 * A customer JSON looks like this:
 * {
 *   empid: "100001",
 *   corporateUuid: uuid,
 *   firstName: "Ashok",
 *   lastName: "Kumar",
 *   gender: "email:",
 *   email: "emp11@wpiro.com",
 *   mobile: "+919123456789",
 *   addressBuildingName: "Address Line 1",
 *   addressBuildingAddress: "Apartment 1",
 *   addressStreet: "Street one",
 *   addressCity: "Hyderabad",
 *   addressDistrict: "Hyderabad",
 *   addressState: "telangana",
 *   addressPincode: "500036",
 *   lat: "12.345678",
 *   long: "77.123456",
 *   contactFirstName: "Contact",
 *   contactLastName: "01",
 *   contactEmail: "email@gmail.com",
 *   dob: "1970-01-01",
 *   sumInsured:30000,
 *   status: "hr approved"
 *   approvalType: "addition"
 * }
 *
 * @apiSuccess {JSON} Customer A list of this JSON object:
 *     {
 *        'status': 200,
 *        'errCode':'Success',
 *        'data': <count-of-rows-updated>>,
 *     }
 *
 * @apiSuccessExample Success-Response:
 *     {
 *       "code": "200",
 *       "data": "[{customer1}, {customer2}, ...]"
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
    body('uuid').not().isEmpty().custom(value => {
      return customersService.getCustomerByUuid(value)
      .then(customer => {
        if (!customer) {
          return Promise.reject(`Customer with uuid ${value} not found.`);
        }
      })
    }),
    authService.authorize
  ],
  customers.updateCustomer
);

/**
 * @api {post} /customers Add an array of customers
 * @apiName AddCustomers
 * @apiVersion 1.0.0
 * @apiGroup Customers
 * @apiDescription Add an array of customers if submitting user is Manager or HR or Executive. Throws an authz error for other roles.
 *
 * @apiExample {curl} Example usage:
 *     curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request POST --data '[{customer1}, {customer2}, ...]' http://localhost:3000/api/v1/customers
 * A customer JSON looks like this:
 * {
 *    empid: "100001",
 *    corporateUuid: corporates[0].uuid,
 *    firstName: "emp",
 *    lastName: "11",
 *    gender: "M",
 *    email: "emp11@wpiro.com",
 *    addressBuildingName: "Address Line 1",
 *    addressBuildingAddress: "Apartment 1",
 *    addressStreet: "Street one",
 *    addressCity: "Hyderabad",
 *    addressDistrict: "Hyderabad",
 *    addressState: "telangana",
 *    addressPincode: "500036",
 *    lat: "12.345678",
 *    long: "77.123456",
 *    contactFirstName: "Contact",
 *    contactLastName: "01",
 *    mobile: "+ 911234567890",
 *    contactEmail: "email@gmail.com",
 *    dob: "1970-01-01",
 *    sumInsured: 30000
 * }
 *
 * @apiSuccess {JSON} Customers An array of above JSON object but with added UUID.
 *
 * @apiSuccessExample Success-Response:
 *     {
 *        'status': 200,
 *        'errCode':'Success',
 *        'data': [customers],
 *     }
 *
 * @apiError NoCustomersInRequestBody Empty request body sent.
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
    body().isArray({min: 1}).withMessage('req.body must have an array (of at least 1 JSON) of customer objects'),
    body('*.empid').not().isEmpty().withMessage('empid in req.body cannot be empty.'),
    body('*.corporateUuid').custom(value => {
      if (!value) { return  Promise.reject(`corporateUuid in req.body cannot be empty.`); }
      return corporatesService.getCorporatesByUuid(value)
      .then(corp => {
        if (!corp) {
          return Promise.reject(`Corporate with uuid ${value} not found.`);
        }
      })
    }),
    body('*.firstName').not().isEmpty().withMessage('firstName in req.body cannot be empty.'),
    authService.authorize
  ],
  customers.addCustomers
);

// Bulk Dependents upload
router.post('/dependents/bulk-add',
  [
    header('Authorization').not().isEmpty().withMessage('Authorization JWT not provided'),
    query('corporateUuid').not().isEmpty().withMessage('corporateUuid cannot be empty.'),
    body().isArray({min: 1}).withMessage('req.body must have an array (of at least 1 JSON) of dependent objects'),
    body('*.empid').not().isEmpty().withMessage('empid in req.body cannot be empty.'),
    body('*.relationship').not().isEmpty().withMessage('relationship in req.body cannot be empty.'),
    body('*.firstName').not().isEmpty().withMessage('firstName in req.body cannot be empty.'),
    body('*.dob').not().isEmpty().withMessage('dob in req.body cannot be empty.'),
    authService.authorize
  ],
  customers.addDependentsBulk
);


// Bulk Dependents status
router.put('/dependents/bulk-status',
  [
    header('Authorization').not().isEmpty().withMessage('Authorization JWT not provided'),
    query('corporateUuid').not().isEmpty().withMessage('corporateUuid cannot be empty.'),
    body().isArray({min: 1}).withMessage('req.body must have an array (of at least 1 JSON) of dependent objects'),
    body('*.uuid').not().isEmpty().withMessage('uuid in req.body cannot be empty.'),
    body('*.status').not().isEmpty().withMessage('relationship in req.body cannot be empty.'),
    body('*.approvalType').not().isEmpty().withMessage('firstName in req.body cannot be empty.'),
    authService.authorize
  ],
  customers.updateDependentsStatusBulk
);

// Bulk Employee status
router.put('/bulk-status',
  [
    header('Authorization').not().isEmpty().withMessage('Authorization JWT not provided'),
    query('corporateUuid').not().isEmpty().withMessage('corporateUuid cannot be empty.'),
    body().isArray({min: 1}).withMessage('req.body must have an array (of at least 1 JSON) of dependent objects'),
    body('*.uuid').not().isEmpty().withMessage('uuid in req.body cannot be empty.'),
    body('*.status').not().isEmpty().withMessage('relationship in req.body cannot be empty.'),
    body('*.approvalType').not().isEmpty().withMessage('firstName in req.body cannot be empty.'),
    authService.authorize
  ],
  customers.updateCustomerStatusBulk
);


/**
 * @api {post} /customers/:empid/dependents Add dependents for a given customer
 * @apiName AddDependents
 * @apiVersion 1.0.0
 * @apiGroup Customers
 * @apiDescription Add an array of dependents for a customer given customer empid if submitting user is Manager or Executive or HR or logged in customer. A logged in customer can only add dependents for oneself. A logged in HR can add dependents for employees in the same corporate. Throws an authz error for other roles. Throws authz error if logged-in customer tries with another empid.
 *
 * @apiExample {curl} Example usage:
 *     curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request POST --data '[{dependent1}, {dependent2}, ...]' http://localhost:3000/api/v1/customers/A12345/dependents
 *
 * A dependent JSON looks like this:
 * {
 *   dependentOnCustomerUuid: <customerUuid>,
 *   corporateUuid: <corporateUuid>,
 *   relationship: "mother",
 *   firstName: "Dependent",
 *   lastName: "1",
 *   gender: "F",
 *   addressBuildingName: null,
 *   addressBuildingAddress: "Viliyatthu Illam",
 *   addressStreet: "4 th Main, 5 th Cross, BEL Layout, Vidyaranyapura",
 *   addressCity: "Bengaluru ",
 *   addressDistrict: "Bengaluru Urban ",
 *   addressState: "Karnataka ",
 *   addressPincode: "560035 ",
 *   lat: "13.083959",
 *   long: "77.5624813",
 *   contactFirstName: "Self",
 *   contactLastName: "Self",
 *   mobile: null,
 *   contactEmail: null,
 *   dob: "1941-01-01",
 *   sumInsured:30000
 * }
 * @apiSuccess {JSON} Dependents An array of above JSON object but with UUID.
 *
 * @apiSuccessExample Success-Response:
 *     {
 *        'status': 200,
 *        'errCode':'Success',
 *        'data': [dependents],
 *     }
 *
 * @apiError NoDependentsInRequestBody Empty request body sent.
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
router.post('/:empid/dependents',
  [
    header('Authorization').not().isEmpty().withMessage('Authorization JWT not provided'),
    body().isArray({min: 1}).withMessage('req.body must have an array (of at least 1 JSON) of dependent objects'),
    body('*.corporateUuid').not().isEmpty().withMessage('corporateUuid in req.body cannot be empty.'),
    body('*.relationship').not().isEmpty().withMessage('relationship in req.body cannot be empty.'),
    body('*.firstName').not().isEmpty().withMessage('firstName in req.body cannot be empty.'),
    body('*.dob').not().isEmpty().withMessage('dob in req.body cannot be empty.'),
    param('empid').not().isEmpty().withMessage('empid must be provided in req.param'),
    authService.authorize
  ],
  customers.addDependents
);

/**
 * @api {put} /customers/:empid/dependents Update a dependent for a given customer
 * @apiName updateDependent
 * @apiVersion 1.0.0
 * @apiGroup Customers
 * @apiDescription Update a dependent for a customer given customer empid.
 * An HR can update dependent for employees in the same corporate.
 * Throws an authz error fo r other roles.
 * Throws authz error if logged-in customer tries with another empid.
 *
 * @apiExample {curl} Example usage:
 *     curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request PUT --data '{dependent1}' http://localhost:3000/api/v1/customers/A12345/dependents
 *
 * A dependent JSON looks like this:
 * {
 *   uuid: <dependentUuid>,
 *   dependentOnCustomerUuid: <customerUuid>,
 *   corporateUuid: <corporateUuid>,
 *   relationship: "mother",
 *   addressBuildingName: null,
 *   addressBuildingAddress: "Viliyatthu Illam",
 *   addressStreet: "4 th Main, 5 th Cross, BEL Layout, Vidyaranyapura",
 *   addressCity: "Bengaluru ",
 *   addressDistrict: "Bengaluru Urban ",
 *   addressState: "Karnataka ",
 *   addressPincode: "560035 ",
 *   lat: "13.083959",
 *   long: "77.5624813",
 *   contactFirstName: "Self",
 *   contactLastName: "Self",
 *   mobile: null,
 *   contactEmail: null,
 *   sumInsured:30000,
 *   status: "hr approved"
 *   approvalType: "addition"
 * }
 * @apiSuccess {JSON} Dependents An array of above JSON object but with UUID.
 *
 * @apiSuccessExample Success-Response:
 *     {
 *        'status': 200,
 *        'errCode':'Success',
 *        'data': [number-of-rows-modified],
 *     }
 *
 * @apiError NoDependentsInRequestBody Empty request body sent.
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
router.put('/:empid/dependents',
  [
    header('Authorization').not().isEmpty().withMessage('Authorization JWT not provided'),
    body('uuid').not().isEmpty().withMessage('uuid in req.body cannot be empty.'),
    body('corporateUuid').not().isEmpty().withMessage('corporateUuid in req.body cannot be empty.'),
    param('empid').not().isEmpty().withMessage('empid must be provided in req.param'),
    authService.authorize
  ],
  customers.updateDependent);

/**
 * @api {put} /customers/dependents Update a dependent
 * @apiName updateDependent
 * @apiVersion 1.0.0
 * @apiGroup Customers
 * @apiDescription Update a dependent for a customer.
 * An HR can update a dependent in the same corporate.
 * Throws an authz error fo r other roles.
 * Throws authz error if logged-in customer tries with another empid.
 *
 * @apiExample {curl} Example usage:
 *     curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request PUT --data '{dependent1}' http://localhost:3000/api/v1/customers/A12345/dependents
 *
 * A dependent JSON looks like this:
 * {
 *   uuid: <dependentUuid>, <-- Mandatory -->
 *   dependentOnCustomerUuid: <customerUuid>,
 *   corporateUuid: <corporateUuid>,
 *   relationship: "mother",
 *   addressBuildingName: null,
 *   addressBuildingAddress: "Viliyatthu Illam",
 *   addressStreet: "4 th Main, 5 th Cross, BEL Layout, Vidyaranyapura",
 *   addressCity: "Bengaluru ",
 *   addressDistrict: "Bengaluru Urban ",
 *   addressState: "Karnataka ",
 *   addressPincode: "560035 ",
 *   lat: "13.083959",
 *   long: "77.5624813",
 *   contactFirstName: "Self",
 *   contactLastName: "Self",
 *   mobile: null,
 *   contactEmail: null,
 *   sumInsured:30000,
 *   status: "hr approved"
 *   approvalType: "addition"
 * }
 * @apiSuccess {JSON} Dependents An array of above JSON object but with UUID.
 *
 * @apiSuccessExample Success-Response:
 *     {
 *        'status': 200,
 *        'errCode':'Success',
 *        'data': [number-of-rows-modified],
 *     }
 *
 * @apiError NoDependentsInRequestBody Empty request body sent.
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
router.put('/dependents',
  [
    header('Authorization').not().isEmpty().withMessage('Authorization JWT not provided'),
    body('uuid').custom(value => {
      if (!value) { return  Promise.reject(`Cannot be empty.`); }
      return customersService.getDependentByUuid(value)
      .then(dependent => {
        if (!dependent) {
          return Promise.reject(`Dependent with uuid ${value} not found.`);
        }
      })
    }),
    authService.authorize
  ],
  customers.updateDependentByUuid);

router.get('/dependents/list',
  [
    header('Authorization').not().isEmpty().withMessage('Authorization JWT not provided'),
    query('status').not().isEmpty().withMessage('status cannot be empty'),
    query('corporateUuid').not().isEmpty().withMessage('corporateUuid cannot be empty'),
    authService.authorize
  ],
  customers.getDependentsByStatus
);

/**
 * @api {get} /customers/dependents/:uuid Get a dependent by empid
 * @apiName GetDependentsByUuid
 * @apiVersion 1.0.0
 * @apiGroup Customers
 * @apiDescription Request a dependent by uuid.
 *
 * @apiParam (Customers) {uuid} UUID of the customer.
 *
 * @apiExample {curl} Example usage:
 *   curl --header "Content-Type: application/json" --header "Authorization:<JWT-TOKEN>" --request GET http://localhost:3000/api/v1/customers/dependents/eea3fc79-1280-4f90-982e-ae9e383f99ca
 *
 * @apiSuccess {JSON} Dependents
 * {
 *   uuid: "123e4567-e89b-12d3-a456-426614174000",
 *   dependentOnCustomerUuid: customers[0].uuid,
 *   customerEmpid: APGS101,
 *   relationship: "mother",
 *   firstName: "Dependent",
 *   lastName: "1",
 *   gender: "F",
 *   addressBuildingName: null,
 *   addressBuildingAddress: "Viliyatthu Illam",
 *   addressStreet: "4 th Main, 5 th Cross, BEL Layout, Vidyaranyapura",
 *   addressCity: "Bengaluru ",
 *   addressDistrict: "Bengaluru Urban ",
 *   addressState: "Karnataka ",
 *   addressPincode: "560035 ",
 *   lat: "13.083959",
 *   long: "77.5624813",
 *   contactFirstName: "Self",
 *   contactLastName: "Self",
 *   mobile: null,
 *   contactEmail: null,
 *   dob: "1941-01-01",
 *   sumInsured:30000,
 * }
 *
 * @apiSuccessExample Success-Response:
 *     {
 *       "status": "200",
 *       "errCode": "Success",
 *       "data": dependent-json
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
router.get('/dependents/:uuid',
  [
    header('Authorization').not().isEmpty().withMessage('Authorization JWT not provided'),
    param('uuid').custom(value => {
      if (!value) { return  Promise.reject(`uuid in req.param cannot be empty.`); }
      return customersService.getDependentByUuid(value)
      .then(d => {
        if (!d) {
          return Promise.reject(`Dependent with uuid ${value} not found.`);
        }
      })
    }),
    authService.authorize
  ],
  customers.getDependentByUuid
);




module.exports = router;

