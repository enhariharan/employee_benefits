"use strict";

const sequelize = require('../models').sequelize;
const { ServerError } = require('../errors/serverError');
const {logger} = require('../config/logger');
const moment = require('moment');

const getAllCorporatesExecutivesList = () => {
    return new Promise((resolve, reject) => {
        let corporates = [];
        const query = 'select  *, Corporates.uuid as corpUuid from Corporates LEFT JOIN ExecutiveCorporateMappings ON Corporates.uuid=ExecutiveCorporateMappings.corporateUuid LEFT JOIN Executives ON ExecutiveCorporateMappings.executiveUuid = Executives.uuid where  Corporates.active = 1';
        sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
            .then(function (data) {
                let corporatesData = {};
                let executiveFields = ['executiveUuid', 'empid', 'brokingCompanyUuid', 'userUuid', 'firstName', 'lastName', 'email', 'mobile', 'designation', 'supervisorEmpid'];
                let ignorableFields = ['uuid', 'corporateUuid', 'active', 'createdAt', 'updatedAt', 'status', 'corpUuid'];
                data.forEach(el => {
                    let executive = {};
                    let corporate = {
                        uuid: el.corpUuid
                    };
                    Object.keys(el).forEach(key => {
                        if (executiveFields.indexOf(key) > -1) {
                            executive[key] = el[key];
                        }
                        if (executiveFields.indexOf(key) < 0 && ignorableFields.indexOf(key) < 0) {
                            corporate[key] = el[key];
                        }
                    });
                    if (!corporatesData[el.corpUuid]) {
                        corporatesData[el.corpUuid] = {
                            corporateInfo: corporate,
                            executivesInfo: []
                        }
                    }
                    if (executive.executiveUuid) {
                        corporatesData[el.corpUuid].executivesInfo.push(executive);
                    }
                });
                Object.keys(corporatesData).forEach(key => {
                    let corp = corporatesData[key].corporateInfo;
                    corp.executives = corporatesData[key].executivesInfo;
                    corporates.push(corp)
                });
                
                resolve(corporates);

            })
            .catch(err => {
                reject(new ServerError('ErrorUpdatingCustomers', 'Error occurred while updating Corporate. Please see data for more details.', err));
            });
    });
}


const getAllEmployeeReportedIssues = (corporatesList, fromDate, toDate) => {
    logger.info(`${module.id}.${getAllEmployeeReportedIssues.name}()`);
    logger.debug(`corporatesList (size: ${corporatesList.length}): ${JSON.stringify(corporatesList)}`);
    logger.debug(`fromDate: ${JSON.stringify(fromDate)}`);
    logger.debug(`toDate: ${JSON.stringify(toDate)}`);
    return new Promise((resolve, reject) => {
        if (corporatesList && corporatesList.length) {
            const query = 'select EmployeeGrievances.id as complaintId, Corporates.companyName, Customers.empid, Customers.firstName, Customers.lastName, Customers.email, Customers.mobile,  issueType, issueDescription, dateOfReport as reportedAt, dateOfDisclosure as resolvedDate, resolution, EmployeeGrievances.status, ExecutiveCorporateMappings.executiveUuid as executiveEmpId, Executives.firstName as executiveFirstName, Executives.lastName as executiveLastName from EmployeeGrievances LEFT JOIN Corporates ON Corporates.uuid = EmployeeGrievances.corporateUuid LEFT JOIN Customers ON EmployeeGrievances.employeeUuid=Customers.userUuid LEFT JOIN  ExecutiveCorporateMappings ON  ExecutiveCorporateMappings.corporateUuid = Corporates.uuid  LEFT JOIN Executives ON ExecutiveCorporateMappings.executiveUuid = Executives.uuid  where  EmployeeGrievances.corporateUuid IN(:corporateIds) AND EmployeeGrievances.dateOfReport >= (:from) AND EmployeeGrievances.dateOfReport <= (:to)';
            sequelize.query(query, { replacements: {corporateIds: corporatesList, from : moment(fromDate, ['YYYY/MM/DD']).format('YYYY-MM-DD HH:mm:ss'), to: moment(toDate, ['YYYY/MM/DD']).add('+1', 'days').format('YYYY-MM-DD HH:mm:ss') },  type: sequelize.QueryTypes.SELECT, logging: console.log })
                .then( issuesList => {
                    resolve(issuesList);
                })
                .catch(err => {
                    reject(new ServerError('ErrorFetchingIssues', 'Error occurred while fetching the customer issues list. Please see data for more details.', err));
                });
        } else {
            resolve([]);
        }        
    });
}


const getAllEmployeeRequestedCallbacks = (corporatesList, fromDate, toDate) => {
    return new Promise((resolve, reject) => {
        if(corporatesList && corporatesList.length){            
            const query = 'select InsuranceEnquiries.id as requestId, Corporates.companyName, Customers.empid, Customers.firstName, Customers.lastName, Customers.email, Customers.mobile,  insuranceType, callBackRequestedTime, dateOfReport,  comments, InsuranceEnquiries.status, ExecutiveCorporateMappings.executiveUuid, Executives.firstName as executiveFirstName, Executives.lastName as executiveLastName from InsuranceEnquiries LEFT JOIN Corporates ON Corporates.uuid = InsuranceEnquiries.corporateUuid LEFT JOIN Customers ON InsuranceEnquiries.employeeUuid=Customers.userUuid LEFT JOIN  ExecutiveCorporateMappings ON  ExecutiveCorporateMappings.corporateUuid = Corporates.uuid  LEFT JOIN Executives ON ExecutiveCorporateMappings.executiveUuid = Executives.uuid  where  InsuranceEnquiries.corporateUuid IN(:corporateIds) AND InsuranceEnquiries.dateOfReport >= (:from) AND InsuranceEnquiries.dateOfReport <= (:to)';
            sequelize.query(query, { replacements: {corporateIds: corporatesList, from : moment(fromDate, ['YYYY/MM/DD']).format('YYYY-MM-DD HH:mm:ss'), to: moment(toDate, ['YYYY/MM/DD']).add('+1', 'days').format('YYYY-MM-DD HH:mm:ss') },  type: sequelize.QueryTypes.SELECT, logging: console.log })
            .then( issuesList => {
                resolve(issuesList);
            })
            .catch(err => {
                reject(new ServerError('ErrorFetchingIssues', 'Error occurred while fetching the customer issues list. Please see data for more details.', err));
            });
        }else{
            resolve([]);
        }
    });
}

const getActiveEmployeesList = (fromDate, toDate) => {
    return new Promise((resolve, reject) => {                  
        const query = 'select CustomerStateJournals.userUuid, Customers.empid, Customers.firstName, Customers.sumInsured, Customers.lastName, Customers.corporateUuid, CorporateHRs.firstName as hrFirstName, CorporateHRs.email as hrEmail, ExecutiveCorporateMappings.executiveUuid, Executives.email as executiveEmail, Policies.policyId as policyNumber from CustomerStateJournals LEFT JOIN Customers ON  Customers.uuid = CustomerStateJournals.userUuid LEFT JOIN CorporateHRs ON CorporateHRs.corporateUuid = Customers.corporateUuid LEFT JOIN ExecutiveCorporateMappings ON ExecutiveCorporateMappings.corporateUuid = Customers.corporateUuid LEFT JOIN Executives ON Executives.uuid = ExecutiveCorporateMappings.executiveUuid LEFT JOIN Policies ON Policies.corporateUuid = Customers.corporateUuid   where CustomerStateJournals.newState = "active" AND  CustomerStateJournals.createdAt > (:from) AND CustomerStateJournals.createdAt <= (:to)';
        sequelize.query(query, { replacements: {from :fromDate, to: toDate},  type: sequelize.QueryTypes.SELECT })
            .then( empList => {
                resolve(empList);
            })
            .catch(err => {
               reject(new ServerError('ErrorFetching', 'Error occurred while fetching the active employees requests list. Please see data for more details.', err));
        });        
    });

}

const getActiveDependentsList = (fromDate, toDate) => {
    return new Promise((resolve, reject) => {                  
        const query = 'select DependentStateJournals.dependentUuid, Dependents.dependentOnCustomerUuid, Dependents.sumInsured,  Customers.empid as custEmpId, Customers.firstName as custFirstName, Customers.lastName as custLastName,  Dependents.firstName, Dependents.lastName, Dependents.relationship, Dependents.corporateUuid, CorporateHRs.firstName as hrFirstName, CorporateHRs.email as hrEmail, ExecutiveCorporateMappings.executiveUuid, Executives.email as executiveEmail, Policies.policyId as policyNumber from DependentStateJournals LEFT JOIN Dependents ON  Dependents.uuid = DependentStateJournals.dependentUuid LEFT JOIN CorporateHRs ON CorporateHRs.corporateUuid = Dependents.corporateUuid  LEFT JOIN Customers ON Dependents.dependentOnCustomerUuid = Customers.uuid LEFT JOIN ExecutiveCorporateMappings ON ExecutiveCorporateMappings.corporateUuid = Dependents.corporateUuid LEFT JOIN Executives ON Executives.uuid = ExecutiveCorporateMappings.executiveUuid LEFT JOIN Policies ON Policies.corporateUuid = Dependents.corporateUuid  where DependentStateJournals.newState = "active" AND  DependentStateJournals.createdAt > (:from) AND DependentStateJournals.createdAt <= (:to)';
        sequelize.query(query, { replacements: {from :fromDate, to: toDate},  type: sequelize.QueryTypes.SELECT })
            .then( empList => {
                resolve(empList);
            })
            .catch(err => {
               reject(new ServerError('ErrorFetching', 'Error occurred while fetching the active dependents requests list. Please see data for more details.', err));
        });        
    });
}


const getCorporateExecutives = (corporatesList) => {
    return new Promise((resolve, reject) => {
        if(corporatesList && corporatesList.length){            
            const query = 'select Corporates.uuid as corporateUuid, Corporates.companyName, ExecutiveCorporateMappings.executiveUuid, Executives.email as executiveEmail from Corporates LEFT JOIN ExecutiveCorporateMappings ON ExecutiveCorporateMappings.corporateUuid = Corporates.uuid LEFT JOIN Executives ON Executives.uuid = ExecutiveCorporateMappings.executiveUuid where Corporates.uuid IN(:corporateIds)';
            sequelize.query(query, { replacements: {corporateIds: corporatesList},  type: sequelize.QueryTypes.SELECT })
                .then( issuesList => {
                    resolve(issuesList);
                })
                .catch(err => {
                    reject(new ServerError('ErrorFetching', 'Error occurred while fetching the corporate exectuives requests list. Please see data for more details.', err));
                });
        }else{
            resolve([]);
        }
    });
}

const getCorporateEmployeeListByStatus = (corporateUuids, status, approvalType) => {
    return new Promise((resolve, reject) => {                  
        const query = 'select  Customers.uuid, Customers.empid, Customers.approvalType, Customers.sumInsured, Customers.dob, Customers.firstName, Customers.lastName, Customers.corporateUuid, Customers.dateOfJoining, Customers.dateOfExit, Customers.updatedAt from Customers  where corporateUuid in (:corporateIds) AND status = (:status) AND approvalType = (:approvalType)';
        sequelize.query(query, { replacements: {corporateIds :corporateUuids, status: status, approvalType:approvalType },  type: sequelize.QueryTypes.SELECT })
            .then( empList => {
                resolve(empList);
            })
            .catch(err => {
                console.log(err);
               reject(new ServerError('ErrorFetching', 'Error occurred while fetching the employee callback requests list. Please see data for more details.', err));
        });        
    });
};

const getCorporateDependentsListByStatus = (corporateUuids, status, approvalType) => {
    return new Promise((resolve, reject) => {                  
        const query = 'select Dependents.uuid, Dependents.dependentOnCustomerUuid,  Dependents.approvalType, Dependents.sumInsured, Dependents.dob, Customers.empid as custEmpId, Customers.firstName as custFirstName, Customers.lastName as custLastName,  Dependents.firstName, Dependents.lastName, Dependents.relationship, Dependents.corporateUuid, Customers.updatedAt from Dependents LEFT JOIN Customers ON Dependents.dependentOnCustomerUuid = Customers.uuid  where Dependents.corporateUuid in (:corporateIds) AND Dependents.status = (:status) AND Dependents.approvalType = (:approvalType)';
        sequelize.query(query, { replacements: {corporateIds :corporateUuids, status: status, approvalType:approvalType},  type: sequelize.QueryTypes.SELECT })
            .then( empList => {
                resolve(empList);
            })
            .catch(err => {
                console.log(err);
               reject(new ServerError('ErrorFetching', 'Error occurred while fetching the employee callback requests list. Please see data for more details.', err));
        });        
    });
};


const getDependentsListByCustomers = (customerUuids) => {
    return new Promise((resolve, reject) => { 
        if(customerUuids && customerUuids.length){
            const query = 'select Dependents.uuid, Dependents.dependentOnCustomerUuid  from Dependents  where Dependents.dependentOnCustomerUuid in (:customerUuids)';
            sequelize.query(query, { replacements: {customerUuids :customerUuids},  type: sequelize.QueryTypes.SELECT })
                .then( empList => {
                    resolve(empList);
                })
                .catch(err => {
                    console.log(err);
                reject(new ServerError('ErrorFetching', 'Error occurred while fetching the employee callback requests list. Please see data for more details.', err));
            }); 
        } else {
            resolve([]);
        }              
               
    });
};

const getCorporatesByExcecutiveMappedByManager = (empId) => {
    return new Promise((resolve, reject) => {                  
        const query = 'select ExecutiveCorporateMappings.corporateUuid from Executives RIGHT JOIN ExecutiveCorporateMappings ON  Executives.uuid = ExecutiveCorporateMappings.executiveUuid WHERE Executives.superVisorEmpId = (:empId)';
        sequelize.query(query, { replacements: {empId :empId},  type: sequelize.QueryTypes.SELECT })
            .then( corporateIds => {
                 resolve(corporateIds);
            })
            .catch(err => {
                console.log(err);
               reject(new ServerError('ErrorFetching', 'Error occurred while fetching the corporates which mapped to executes under the manager. Please see data for more details.', err));
        });        
    });
};

module.exports = {
    getAllCorporatesExecutivesList: getAllCorporatesExecutivesList,
    getAllEmployeeReportedIssues: getAllEmployeeReportedIssues,
    getAllEmployeeRequestedCallbacks: getAllEmployeeRequestedCallbacks,
    getActiveEmployeesList:getActiveEmployeesList,
    getActiveDependentsList:getActiveDependentsList,
    getCorporateEmployeeListByStatus:getCorporateEmployeeListByStatus,
    getCorporateDependentsListByStatus: getCorporateDependentsListByStatus,
    getCorporateExecutives: getCorporateExecutives,
    getCorporatesByExcecutiveMappedByManager: getCorporatesByExcecutiveMappedByManager,
    getDependentsListByCustomers:getDependentsListByCustomers
}