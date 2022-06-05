"use strict";

const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const {body} = require('express-validator');

/**
 * @api {post} /login Login as existing user.
 * @apiName Login
 * @apiVersion 1.0.0
 * @apiGroup Users
 * @apiDescription Login as existing user with username and password.
 *
 * @apiExample {curl} Example usage:
 * curl --header "Content-Type: application/json" --request POST --data "{ "username": "<username>", "password": "<password>", "role": "<manager|executive|customer>", "subdomain": "<corporate.brokingCompany.com>"}" "http://localhost:3000/users/login"
 *
 * @apiSuccess {JSON} Login.
 *
 * @apiSuccessExample Success-Response:
 *    {
 *      "status":200,
 *      "errCode":"Success"
 *      "data": {
 *        "user": {
 *          "uuid":"e2fdd7a0-24c7-4890-a739-09ef89907229",
 *          "username":"<empid>>",
 *          "role":"customer",
 *          "email":"enhariharan@gmail.com",
 *          "mobile":"+912345678901",
 *          "jwt":,JWT-jwtToken
 *        }
 *      },
 *    }
 *
 * @apiError IncorrectCredentials When invalid credentials are sent. Please see examples below.
 * @apiError Sequelize errors When email or mobile numbers for regn are not unique.
 *
 * @apiErrorExample Error-Response:
 *    {
 *      status: 400,
 *      errCode: 'IncorrectCredentials',
 *      message: 'Username not found. Send correct user credentials in request body.'
 *    }
 * @apiErrorExample Error-Response:
 *    {
 *      status: 400,
 *      errCode: 'IncorrectCredentials',
 *      message: 'password empty. Send correct user credentials in request body.'
 *    }
 * @apiErrorExample Error-Response:
 *    {
 *      status: 400,
 *      errCode: 'IncorrectCredentials',
 *      message: 'Role not found. Send correct user credentials in request body.'
 *    }
 * @apiErrorExample Error-Response:
 *    {
 *      status: 400,
 *      errCode: 'IncorrectCredentials',
 *      message: 'Subdomain not sent in request body. Please send a subdomain to login. An example of login subdomain is - "wipro.visista.com"',
 *    }
 * @apiErrorExample Error-Response:
 *    {
 *      status: 400,
 *      errCode: 'IncorrectCredentials',
 *      message: 'An incorrect login subdomain was sent for login. Please retry login with a correct login subdomain in body. Ex: "wipro.visista.com"'
 *    }
 * @apiErrorExample Error-Response:
 *    {
 *      status: 400,
 *      errCode: 'IncorrectCredentials',
 *      message: 'A Broking Company name matching the given domain was not found in DB.'
 *    }
 * @apiErrorExample Error-Response:
 *    {
 *      status: 400,
 *      errCode: 'IncorrectCredentials',
 *      message: 'A Corporate name matching the given domain was not found in DB.'
 *    }
 * @apiErrorExample Error-Response:
 *    {
 *      status: 403,
 *      errCode: 'IncorrectCredentials',
 *      message: `Incorrect username or password provided. data: {username: ${credentials.username}}`
 *    }
 * @apiErrorExample Error-Response:
 *    {
 *      status: 400,
 *      errCode: 'UnauthorizedAccess',
 *      message: "This customer's present status does not authorize login into this service at this time."
 *    }
 * @apiErrorExample Error-Response:
 *    {
 *      status: 401,
 *      errCode: 'IncorrectCredentials',
 *      message: 'Incorrect username or password provided.',
 *      data: {username: credentials.username}
 *    }
 */
router.post('/login',
  [
    body('username').exists().not().isEmpty().withMessage('Cannot be empty.'),
    body('password').exists().not().isEmpty().withMessage('Cannot be empty.'),
    body('subdomain').exists().not().isEmpty().withMessage('Cannot be empty'),
  ],
  usersController.login);

module.exports = router;
