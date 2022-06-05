# Sequelize ORM Usage in EB Server

This server uses [Sequelize v5](https://sequelize.org/v5/) ORM to interact with the DB server. Sequelize provides these featres mainly to use in our server:
- Promise based NodeJS API.
- Support for creating version-controlled database schemas and migrations.
- Pure JS based migrations, models, and seeders. All the complexity of SQL generation and execution is handled within Sequelize.
- Pure JS based CRUD support.
- Transaction support - mainly used in our server, during new user creation, updating customer details, etc.,

* [Install Sequelize](#install-sequelize)
* [Configure Sequelize](#configure-sequelize)
* [Create a migration](#create-a-migration)
* [Sequelize tables in MySQL to track version control of DB](#sequelize-tables-in-mysql-to-track-version-control-of-db)
* [How to run sequelize up migration](#how-to-run-sequelize-up-migration)
* [How to run sequelize down migration](#how-to-run-sequelize-down-migration)

## Install Sequelize
```shell script
~/employee_benefits$ npm install --save sequelize
~/employee_benefits$ npm install --save sequelize-cli
~/employee_benefits$ npm install --save mysql2
~/employee_benefits$ npm install --save sqlite3    # <-- This is optional
```

## Configure Sequelize
Refer to the file <code>config/config.json</code> for Sequelize configurations. For <code>development</code> and <code>staging</code> environments it appears as below:
```json
{
  "development": {
    "username": "eb_app_user",
    "password": "ebAppUser1$",
    "database": "eb_app_db_dev",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "staging": {
    "username": "eb_app_user",
    "password": "ebAppUser1$",
    "database": "eb_app_db_staging",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "logging": true
  }
}
```

Next, refer to the file <code>models/index.js</code> for the code to setup sequelize for use. Specifically, these lines:
```js
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}
```

The folder <code>models</code> also contains Sequelize objects corresponding to each table in our database.

![models](images/model_classes.png?raw=true "Models")

The files in folder <code>services/</code> contains code to use the above model classes.

For example, here is another snippet to get a listing of Policies in <code>models/policiesService.js</code>
```js
"use strict";

const { logger } = require('../config/logger');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');
const { Ailment, Corporate, CorporateHR, Customer, Executive, ExecutiveCorporateMapping } = require('../models');
const { InsuranceCompany, Policy, PolicyAilmentMapping, NetworkHospital, TPA } = require('../models');
const soapService = require('../services/soapService');

const getAllPolicies = () => {
  return new Promise( (resolve, reject) => {
    Policy.findAll()
    .then(policies => { resolve(policies); })
    .catch(err => { reject(err); })
  });
};
```

Here is a final example to query the DB with multiple conditions using sequelize. This gets Customers with specified vales of columns <code>status</code> and <code>approvalType</code>
```js
"use strict";

const {v4: uuidv4} = require('uuid');
const {CorporateHR, Customer, Dependent, sequelize, User} = require('../models');
const {Op} = require("sequelize");

const getAllCustomers = (corporateUuid, status, approvalType) => {
  return new Promise((resolve, reject) => {
    let whereOptions = {};
    whereOptions.corporateUuid = corporateUuid; // {corporateUuid: corporateUuid}
    whereOptions.status = status;               // {corporateUuid: corporateUuid, status: status}
    whereOptions.approvalType = approvalType;   // {corporateUuid: corporateUuid, status: status, approvalType: approvalType}

    const promise = (Object.keys(whereOptions))
      ? Customer.findAll({where: whereOptions}) // SQL Query: SELECT * FROM Customers WHERE (corporateUuid = '<corporateUuid>' AND status= '<status>' AND approvalType='<approvalType>');
      : Customer.findAll();                     // SQL Query: SELECT * FROM Customers;

    promise
    .then(customers => {
      console.info('Successfully received all customers from DB.');
      resolve(customers);
    })
    .catch(err => {
      console.info('Error encountered while getting all customers from DB.');
      reject(err);
    });
  });
}
```

As a slightly more complicated example, here is the snippet from <code>services/customersService.js</code> to add a new Customer record into DB using sequelize transaction support.
```js
"use strict";

const {CorporateHR, Customer, Dependent, sequelize, User} = require('../models');
const {Op} = require("sequelize");

const addCustomers = (credentials, customers) => {
  return new Promise((resolve, reject) => {
      sequelize.transaction(t => {
        return User.bulkCreate(newUserPromisesAndUpdatedCustomers.newUsers, {transation: t})
        .then(users => {
          return Customer.bulkCreate(newUserPromisesAndUpdatedCustomers.updatedCustomers, {transation: t})
        });
      })
      .then(result => {
        logger.info(`Transaction successfully committed.`)
        logger.debug(`${JSON.stringify(result)}`)
      })
  })
}
```

## Create a migration
Use the below command to create a migration for a new table.
```bash
$ npx sequelize-cli model:generate --name Executive --attributes uuid:uuid,empid:string,firstName:string,lastName:string,email:string,mobile:string,brokingCompanyUuid:uuid,supervisorEmpid:string,active:{type:boolean, allowNull:false,defaultValue: true}
```

This creates the following files:
<code>20200506134702-create-executive.js</code>
<code>executive.js</code>

For a detailed discussion on migrations in Sequelize, please [refer here](https://sequelize.org/v5/manual/migrations.html)

## Sequelize tables in MySQL to track version control of DB.
When you run migrations, Sequelize creates the table called <code>SequelizeMeta</code> in the server database. This table will store all the migrations that have been run.

### See Sequelize tables in server database
```bash
$ mysql -u eb_app_user -p -e 'SHOW TABLES;' eb_app_db_dev
Enter password: 
+------------------------------------------+
| Tables_in_eb_app_db_dev                  |
+------------------------------------------+
| Ailments                                 |
| BrokingCompanies                         |
| Claims                                   |
| CorporateHRs                             |
| Corporates                               |
| CustomerJournals                         |
| CustomerStateJournals                    |
| Customers                                |
| DependentStateJournals                   |
| Dependents                               |
| EmployeeGrievances                       |
| ExecutiveCorporateMappings               |
| Executives                               |
| FamilyDefinitions                        |
| InsuranceCompanies                       |
| InsuranceEnquiries                       |
| NetworkHospitals                         |
| NonNetworkHospitals                      |
| Policies                                 |
| PolicyAilmentMappings                    |
| PolicyCongenitalAilmentsExternalMappings |
| PolicyCongenitalAilmentsInternalMappings |
| SequelizeMeta                            |
| TPAs                                     |
| Users                                    |
+------------------------------------------+
``` 

### Check the migrations that have already run by Sequelize
```shell script
$ mysql -u eb_app_user -p -e "SELECT * FROM SequelizeMeta;" eb_app_db_dev
Enter password: 
+-----------------------------------------------------------------------------------+
| name                                                                              |
+-----------------------------------------------------------------------------------+
| 20200505042920-create-corporate.js                                                |
| 20200505042925-create-broking-company.js                                          |
| 20200505042941-create-user.js                                                     |
| 20200506134702-create-executive.js                                                |
| 20200508123845-create-executive-corporate-mapping.js                              |
| 20200509190122-create-tpa.js                                                      |
| 20200510022205-create-insurance-company.js                                        |
| 20200510025556-create-customer.js                                                 |
| 20200510080741-create-dependent.js                                                |
| 20200510133049-create-policy.js                                                   |
| 20200511144343-create-ailment.js                                                  |
| 20200511144345-create-network-hospital.js                                         |
| 20200511144353-create-policy-ailment-mapping.js                                   |
| 20200511144355-create-non-network-hospital.js                                     |
| 20200511163650-create-family-definition.js                                        |
| 20200511163726-create-corporate-hr.js                                             |
| 20200512013132-create-claim.js                                                    |
| 20200513152146-create-policy-congenital-ailments-internal-mapping.js              |
| 20200513152238-create-policy-congenital-ailments-external-mapping.js              |
| 20200613073520-create-customer-journal.js                                         |
| 20200620013942-create-column-approval-type-module-customer.js                     |
| 20200621065928-create-columns-status-and-approval-type-module-dependents.js       |
| 20200706155428-init-column-tpa-service-url-module-tpas.js                         |
| 20200722070351-create-columns-age-hospitalState-module-claims.js                  |
| 20200725040038-create-column-corporateuuid-table-dependents.js                    |
| 20200825133442-create-customer-state-journal.js                                   |
| 20200825133530-create-dependent-state-journal.js                                  |
| 20200830072134-create-column-status-table-corporates.js                           |
| 20200830154759-create-column-status-and-approval-type-table-corporatehrs.js       |
| 20200909104446-create-employee-grievance.js                                       |
| 20200909104507-create-insurance-enquiry.js                                        |
| 20200921131226-add-column-others-in-table-policies.js                             |
| 20200923154037-change-column-datatype-for-maternityLimit-in-table-policies.js     |
| 20200926170633-add-column-deletedAt-in-all-tables.js                              |
| 20201122082909-add-column-sumInsured-in-table-customers.js                        |
| 20201122084640-add-column-sumInsured-in-table-dependents.js                       |
| 20201127182439-add-columns-date-of-joining-and-date-of-exit-in-table-customers.js |
+-----------------------------------------------------------------------------------+
```

You will note that every migration file begins with a timestamp in it's file name noting when it was created. This time stamp is used to track the migrations and run them up/down in order.

## How to run sequelize up migration
```shell script
~/employee_benefits$ NODE_ENV=development npx sequelize-cli db:migrate
```
This command will check the table <code>SequelizeMeta</code>.
Next it will check for any migration files whose timestamp is later than the last noted migration file in this table (<code>20200706155428-init-column-tpa-service-url-module-tpas.js</code>). 
If found, it will run **all** those later migrations. Else it will show the message <code>No migrations were executed, database schema was already up to date.</code> and exit.

## How to run sequelize down migration
```shell script
~/employee_benefits$ NODE_ENV=development npx sequelize-cli db:migrate:undo
```
This command will check the table <code>SequelizeMeta</code>. 
Next it will check this table for the very latest migration file executed and undo only that migration. 
After undo, the entry will be removed from the table <code>SequelizeMeta</code>.
Running another <code>db:migrate:undo</code> will undo the next latest migration.

To undo all migrations run the below command:
```shell script
~/employee_benefits$ NODE_ENV=development npx sequelize-cli db:migrate:undo:all
```
