# Database Design of EB Server

_**NOTE: All images in this page are generated using [DBeaver Community Edition 7.3.0](https://dbeaver.io/download/)**_

The MySQL Database maintained for this server is configured in the file _config/config.json_. Please refer to that file to get the DB name, username, password, and other details for development, staging, and test environments. Of course, a separate config has to maintained for Production environment.

The DB contains these tables:

| No. | MySQL Table Name | Migration File | Model File |
|---: |:--- |:--- |:--- |
| 1 | Ailments | Users | migrations/20200505042941-create-user.js | models/user,js |
| 2 | BrokingCompanies | migrations/20200506111806-create-broking-company.js | models/brokingcompany.js |
| 3 | Claims | migrations/20200512013132-create-claim.js | models/claim.js |
| 4 | CorporateHRs | migrations/20200511163726-create-corporate-hr.js | models/corporatehr.js |
| 5 | Corporates | migrations/20200508123838-create-corporate.js | models/corporate.js  |
| 6 | CustomerJournals| migrations/20200613073520-create-customer-journal.js | models/customerjournal.js |
| 6 | CustomerStateJournals| migrations/20200825133442-create-customer-state-journal.js | models/customerstatejournal.js |
| 7 | Customers | migrations/20200510025556-create-customer.js | models/customer.js |
| 8 | DependentStateJournals| migrations/20200825133530-create-dependent-state-journal.js | models/dependentstatejournal.js |
| 9 | Dependents | migrations/20200510080741-create-dependent.js | models/dependent.js |
| 10 | EmployeeGrievances | migrations/20200909104446-create-employee-grievance.js | models/employeegrievance.js |
| 11 | ExecutiveCorporateMappings | migrations/20200508123845-create-executive-corporate-mapping.js | models/executiveCorporateMapping.js |
| 12 | Executives | migrations/20200506134702-create-executive.js | models/executive.js |
| 13 | FamilyDefinitions| migrations/20200511163650-create-family-definition.js | models/familydefinition.js |
| 14 | InsuranceCompanies | migrations/20200510022205-create-insurance-company.js | models/insuranceCompany.js |
| 15 | InsuranceEnquiries | migrations/20200909104507-create-insurance-enquiry.js | models/insuranceenquiry.js |
| 16 | NetworkHospitals | migrations/20200511144345-create-network-hospital.js | models/networkHospital.js |
| 17 | NonNetworkHospitals | migrations/20200511144355-create-non-network-hospital.js | models/nonNetworkHospital.js |
| 18 | Policies | migrations/20200510133049-create-policy.js | models/policy.js |
| 19 | PolicyAilmentMappings | migrations/20200511144353-create-policy-ailment-mapping.js | models/policyAilmentMapping.js |
| 20 | PolicyCongenitalAilmentsExternalMappings | migrations/20200513152238-create-policy-congenital-ailments-external-mapping.js | models/policycongenitalailmentsexternalmapping.js |
| 21 | PolicyCongenitalAilmentsInternalMappings | migrations/20200513152146-create-policy-congenital-ailments-internal-mapping.js | models/policycongenitalailmentsinternalmapping.js |
| 22 | TPAs | migrations/20200509190122-create-tpa.js | models/tpa.js |
| 23 | Users | migrations/20200505042941-create-user.js | models/user,js |


## Users and Roles
The DB supports 4 types of users (a.k.a roles) - **customer**, **hr**, **executive**, and **manager**.

All 4 roles - customer, hr, executive, manager - needs to login to the app using a combo of (userid, password, role). These login credentials are maintained in the table **Users**.

![Users And Roles](images/users_and_roles.png?raw=true "Users and Roles")

## Customers, Dependents, Corporates, and CorporateHRs
- A Customer belongs to a Corporate.
- A Corporate designates one-or-many HR personnel (a.k.a CorporateHR) as POCs in the EBP application to act on behalf of the Corporate.
- A Customer can have many Dependents.

![Customers](images/customers.png?raw=true "Customers, Dependents, Corporates, and CorporateHRs")
![COrporateHRs](images/corporatehrs.png?raw=true "Customers, Dependents, Corporates, and CorporateHRs")

## Executives, Managers, and Corporates
- An Executive can manage multiple Corporates.
- A Manager performs all activites of an Executive in addition to being a manager to many Executives. An Executive will have his/her manager stored in the field **supervisorEmpid**.
- An Executive can manage multiple Corporates. This mapping is maintained in the table "ExecutiveCorporateMappings".

![Executives](images/executives.png?raw=true "Executives, Managers")
![Corporates](images/corporates.png?raw=true "Corporates")

## Insurance Policies, Ailments, Network Hospitals
- An insurance policy belongs to at least one Corporate
- A policy covers many ailments.
- A policy has many Network Hospitals under it's cover. Any hospital that is not a network hospital but for which a claim is raised  is considered a non-network hospital. 

![Policies](images/policies.png?raw=true "Policies")

## Claims
- A Claim is linked to many entities and tables in the DB.
- Please refer to the complete DB Schema diagram below to understand the entity-relationship for Claims.

![Claims](images/claims.png?raw=true "Claims")

## Complete DB Schema Snapshot
![This is the complete DB schema](images/complete_db_schema.png?raw=true "Complete DB Schema")
