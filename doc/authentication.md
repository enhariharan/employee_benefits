# Authentication and Authorization logic in EB Server

## Authentication
Authentication of a user happens as a result of login from the UI.

These fields are required from the client for successful authentication.

- *username*: This is the employee id provided at registration.
- *password*: This is initialized to date-of-birth for a Customer. For HR, Executive, and Manager roles  (manager, senior manager, superuser) this is initialized to the employee id. [Argon2](https://www.npmjs.com/package/argon2) is used as the package to provide password hashing.
- *subdomain*: This is a string of the form _corporateDisplayName.brokingCompanyDisplayName_. An example of a subdomain is _amazon.visista4u_. A new subdomain is created when a new corporate is successfully registered. A subdomain called www.visista4u is created by default and this is not associated to any corporate. This can be used for admin login, manager login, and executive login. 

A user can perform make any request on the server, as per the user's role, only after a successful login.

At successful login, a JWT token is returned to the client. This JWT token must subsequently be sent with every request to the server using the HTTP header "Authorization:<JWT token>".

The logic for new customer and new user creation is present in the file <code>services/customerService.js</code> function <code>addCustomers()</code>.

## Authorization
Every operation performed on the server, except login, is an authorized operation. That is to say, the user must be authorized to perform this operation. A 400 error is returned if authorization fails. Authorization is performed using the JWT token sent in the HTTP header (Authorization) of each API request.

The authorization check performed is to see if the role of the user permits for this API to be accessed. If this API is not allowed for a particular role then authorization fails and error code 400 is returned. The specific role of the logged-in user is provided by the JWT token.

The roles permitted by the server are:

- customer
- hr
- executive
- manager
- srmanager
- superuser

Every API is authorized to be accessible by one or more of the above roles.

Autorization rules for each API is present in the file _services/authService.js_. An example authorization rule in this file looks like this:
```bash
{url: '/api/v1/networkHospitals', method: 'GET', authorizedRoles: [ROLE_SUPERUSER, ROLE_SRMANAGER, ROLE_MANAGER, ROLE_EXECUTIVE, ROLE_CUSTOMER, ROLE_HR]},
```
The above rule specifies that the URI /api/v1/networkHospitals can be accessed by a user this is one of these roles - Superuser, Senior Manager, Manager, Executive, Customer, HR. 

When a new API is added, please ensure that an authorization rule is added like the above example into _services/authService.js_. Else, HTTP error 400 will be returned when this API is accessed.
