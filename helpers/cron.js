"use strict";

const CronJob = require('cron').CronJob;
const async = require("async");
const { Op } = require('sequelize');
const appConfig = require('../config/appConfig');
const tpaHelper = require('../helpers/tpaHelper');
const utilHelper = require('../helpers/utilHelper');
const commonService = require('../services/commonService');
const employeeStatus = require('../services/employeeStatus');
const claimsService = require('../services/claimsService');
const moment = require('moment');
const { NetworkHospital, Policy, InsuranceCompany, Customer, Dependent } = require('../models');
const startIndex = 0;
const endIndex = 10000;
const maxHospitals = 5000;

const addNetworkHospitals = (tpaName) => {
    const tpaUuid = tpaHelper.getTpaUuidByName(tpaName);
    Policy.findAll({where: {tpaUuid: tpaUuid}})
    .then(policyList => {
        let insurerUuids = [];
        policyList.forEach(policy => {
            if(insurerUuids.indexOf(policy.insuranceCompanyUuid) < 0){
                insurerUuids.push(policy.insuranceCompanyUuid);
            }
        });
        InsuranceCompany.findAll({where: { uuid: {[Op.or] : insurerUuids}}})
        .then(insuranceCompanyList => {
            let insuranceCompanyNames  = {};
            insuranceCompanyList.forEach(company => {
                insuranceCompanyNames[company.uuid] = company.displayName;
            })
            async.forEach(policyList, (policy, cb) => {
                console.log('Fetching hospitals for tpas'+ insuranceCompanyNames[policy.insuranceCompanyUuid]);                                     
                tpaHelper.getNetworkHospitalList(tpaUuid, insuranceCompanyNames[policy.insuranceCompanyUuid], startIndex, endIndex)
                .then(hospitalList =>{
                    if(hospitalList.length > maxHospitals){
                        hospitalList = hospitalList.slice(0, maxHospitals);
                    }
                    hospitalList.forEach(hospital => {
                        hospital.insuranceCompanyUuid = policy.insuranceCompanyUuid;
                        hospital.tpaUuid = policy.tpaUuid;                   
                    });
                    console.log('Saving hospitals for tpas'+ hospitalList.length); 
                    NetworkHospital.bulkCreate(hospitalList, { updateOnDuplicate: ["hospitalId", "tpaUuid", "insuranceCompanyUuid"] })
                    .then(() => {
                       console.log("Network hospital data inserted successfully");
                       cb();
                    })
                    .catch(err => {
                        console.log(err);
                        console.log("Network hospital data inserted failed");
                        cb();
                    });
                })
                .catch(err => {
                    console.log(err);
                    console.log('error while fetching hospitals');
                    cb();
                });
            });
        })
        .catch(err => {
            console.log('error while fetching Insurance companies');
            
        });
                 
    })
    .catch(err => {
        console.log(err);
        console.log('Error for fetching policies')
    });    

};




const policyApprovalScheduler = (tpaName) => {
    console.log('Running the policy approval Cron');
    const tpaUuid = tpaHelper.getTpaUuidByName(tpaName);
    console.log('Fetching the active list of policies');
    Policy.findAll({where: {tpaUuid: tpaUuid, status:'approved', updatedAt: {[Op.gte]: moment().add('-1', 'days').format('YYYY-MM-DD')}}})
    .then(policyList => {
        let corporate_policy_data = {};
        policyList.forEach(policy => {
            corporate_policy_data[policy.corporateUuid] = {insuranceCompanyUuid: policy.insuranceCompanyUuid, policyNumber: policy.policyId, fromDate: policy.fromDate, toDate: policy.toDate};
        });
        console.log(corporate_policy_data);
        utilHelper.getActiveEmployeeListByPolicy(corporate_policy_data);        
    }).catch(err => {
        console.log(err);
        console.log('error while fetching policy details');            
    });

};

const hrApprovedScheduler = (tpaName) => {
    console.log('Running the HR approved Cron');
    const tpaUuid = tpaHelper.getTpaUuidByName(tpaName);   
    Policy.findAll({where: {tpaUuid: tpaUuid, status:'approved'}})
    .then(policyList => {
        let insurerUuids = [];
        let corporateUuids = [];
        let  corporate_policy_map = {};
        let  insurance_corporate_map = {};        
        policyList.forEach(policy => {
            if(insurerUuids.indexOf(policy.insuranceCompanyUuid) < 0){
                insurerUuids.push(policy.insuranceCompanyUuid);
            }
            if(corporateUuids.indexOf(policy.corporateUuid) < 0){
                corporateUuids.push(policy.corporateUuid);
            }
            corporate_policy_map[policy.corporateUuid] = {insuranceCompanyUuid: policy.insuranceCompanyUuid, policyNumber: policy.policyId, fromDate: policy.fromDate, toDate: policy.toDate, insurance_company_email: ""}
            insurance_corporate_map[policy.insuranceCompanyUuid] = policy.corporateUuid;
        });
        console.log('Corporates id List: '+ corporateUuids);
        console.log('Insurance id List: '+ insurerUuids);
        InsuranceCompany.findAll({where: { uuid: {[Op.or] : insurerUuids}}})
        .then(insuranceCompanyList => {  
            insuranceCompanyList.forEach(insComp => {
                corporate_policy_map[insurance_corporate_map[insComp.dataValues.uuid]]["insurance_company_email"] = insComp.dataValues.contactEmail;
            });
            console.log('Fetched the insurance company list'+ corporate_policy_map);
            commonService.getCorporateExecutives(corporateUuids)
            .then(executivesList =>{
                executivesList.forEach(execInfo => {
                    corporate_policy_map[execInfo.corporateUuid]["executive_email"] = execInfo.executiveEmail;
                    corporate_policy_map[execInfo.corporateUuid]["company_name"] = execInfo.companyName;
                });
                console.log('Fetched the executives list'+ corporate_policy_map);
                commonService.getCorporateEmployeeListByStatus(corporateUuids, employeeStatus.STATUS_HR_APPROVED, employeeStatus.APPROVAL_TYPE_ADDITION)
                .then(empList => {                   
                    commonService.getCorporateDependentsListByStatus(corporateUuids, employeeStatus.STATUS_HR_APPROVED, employeeStatus.APPROVAL_TYPE_ADDITION)
                    .then(depList => {                    
                        let employee_data  = {};
                        let corporateUuidList = [];                
                        empList.forEach(emp => {
                            if(emp.corporateUuid){
                                if(corporateUuidList.indexOf(emp.corporateUuid) < 0){
                                    corporateUuidList.push(emp.corporateUuid);                                
                                    employee_data[emp.corporateUuid] = {employee_status:[], dependents_status:[], employee_list: [], insurance_company_email : corporate_policy_map[emp.corporateUuid].insurance_company_email, executive_email: corporate_policy_map[emp.corporateUuid].executive_email, company_name: corporate_policy_map[emp.corporateUuid].company_name, policyNumber: corporate_policy_map[emp.corporateUuid].policyNumber };
                                }
                                employee_data[emp.corporateUuid].employee_status.push({uuid: emp.uuid,  status: employeeStatus.STATUS_PENDING_INSURER_APPROVAL, approvalType:emp.approvalType})
                                employee_data[emp.corporateUuid].employee_list.push({empid: emp.empid, firstName:emp.firstName, lastName: emp.lastName, relation: 'Self', dob: moment(emp.dob, ['YYYY-MM-DD HH:mm:ss']).add('-1', 'days').format('DD-MM-YYYY'), approvalType:emp.approvalType, dateOfJoining: moment(emp.dateOfJoining, ['YYYY-MM-DD HH:mm:ss']).utcOffset("+05:30").format('DD-MM-YYYY') , dateOfExit: emp.dateOfExit != undefined ? moment(emp.dateOfExit, ['YYYY-MM-DD HH:mm:ss']).utcOffset("+05:30").format('DD-MM-YYYY'): "" });
                            
                            }
                        });
                        depList.forEach(dep => {
                            if(dep.corporateUuid){
                                if(corporateUuidList.indexOf(dep.corporateUuid) < 0){
                                    corporateUuidList.push(dep.corporateUuid);
                                    employee_data[dep.corporateUuid] = {employee_status:[], dependents_status:[], employee_list: [], insurance_company_email : corporate_policy_map[dep.corporateUuid].insurance_company_email, executive_email: corporate_policy_map[dep.corporateUuid].executive_email, company_name: corporate_policy_map[dep.corporateUuid].company_name, policyNumber: corporate_policy_map[dep.corporateUuid].policyNumber};
                                }
                                employee_data[dep.corporateUuid].dependents_status.push({uuid: dep.uuid,  status: employeeStatus.STATUS_PENDING_INSURER_APPROVAL, approvalType:dep.approvalType})
                                employee_data[dep.corporateUuid].employee_list.push({empid: dep.custEmpId, firstName:dep.firstName, lastName: dep.lastName, relation: dep.relationship,  dob: moment(dep.dob, ['YYYY-MM-DD HH:mm:ss']).add('-1', 'days').format('DD-MM-YYYY'), approvalType:dep.approvalType, dateOfJoining: "", dateOfExit: ""});
                    
                            }                
                        });
                        console.log('Fetching the employees and dependents');
                        console.log(employee_data);
                        utilHelper.sendPendingApprovalEmailToInsurer(employee_data);
                    
                    })
                    .catch(err => {
                        console.log('error while fetching Dependents List');            
                    })
                })
                .catch(err => {
                    console.log('error while fetching Employees List');            
                })
                })
            .catch(err => {
                console.log('error while fetching executives List');            
            })       
            
        })
        .catch(err => {
            console.log(err);
            console.log('error while fetching Insurance companies');            
        })
    }).catch(err => {
        console.log('error while fetching policy details');            
    });
};


const pendingInsurerScheduler = (tpaName) => {
    console.log('Running the pending insurer scheduler Cron');
    const tpaUuid = tpaHelper.getTpaUuidByName(tpaName);   
    Policy.findAll({where: {tpaUuid: tpaUuid, status:'approved'}})
    .then(policyList => {        
        let employee_data  = {};
        let corporateUuidList = [];
        let  corporate_policy_map = {}; 
        let corporateUuids = [];       
        policyList.forEach(policy => {            
            if(corporateUuids.indexOf(policy.corporateUuid) < 0){
                corporateUuids.push(policy.corporateUuid);
            }
            corporate_policy_map[policy.corporateUuid] = {policyNumber: policy.policyId, fromDate: policy.fromDate, toDate: policy.toDate};
         
        });
        commonService.getCorporateEmployeeListByStatus(corporateUuids, employeeStatus.STATUS_PENDING_INSURER_APPROVAL, employeeStatus.APPROVAL_TYPE_ADDITION)
            .then(empList => {
                commonService.getCorporateDependentsListByStatus(corporateUuids, employeeStatus.STATUS_PENDING_INSURER_APPROVAL, employeeStatus.APPROVAL_TYPE_ADDITION)
                .then(depList => {                                     
                     if((empList && empList.length > 0)  || (depList && depList.length > 0)){
                        empList.forEach(emp => {
                            if(emp.corporateUuid){
                                if(corporateUuidList.indexOf(emp.corporateUuid) < 0){
                                    corporateUuidList.push(emp.corporateUuid);                                
                                    employee_data[emp.corporateUuid] = {employee_list: [], dependent_list: [], policyId: corporate_policy_map[emp.corporateUuid].policyNumber};
                                }
                                employee_data[emp.corporateUuid].employee_list.push({empid: emp.empid, uuid: emp.uuid, updated_at: moment(emp.updatedAt, ['YYYY-MM-DD HH:mm:ss']).format('YYYY-MM-DD')});                               
                            }
                        });
                        depList.forEach(dep => {
                            if(dep.corporateUuid){
                                if(corporateUuidList.indexOf(dep.corporateUuid) < 0){
                                    corporateUuidList.push(dep.corporateUuid);
                                    employee_data[dep.corporateUuid] = {employee_list: [], dependent_list: [], policyId: corporate_policy_map[emp.corporateUuid].policyNumber};
                                }
                                employee_data[dep.corporateUuid].dependent_list.push({empid: dep.custEmpId, uuid:dep.uuid, relation: dep.relationship, updated_at: moment(dep.updatedAt, ['YYYY-MM-DD HH:mm:ss']).format('YYYY-MM-DD')});
                                                             
                            }                
                        });
                     }
                     utilHelper.verifyActiveEmployeesListByPolicy(employee_data);                   
                })
                .catch(err => {
                    console.log(err);
                    console.log('error while fetching Dependents List');            
                })
            })
            .catch(err => {
                console.log('error while fetching Employees List');            
            })
    }).catch(err => {
        console.log('error while fetching policy details');            
    });
    
};

const verifyDeactivatedEmployess = (tpaName) => {
    console.log('Running the deactived employees Cron');
    const tpaUuid = tpaHelper.getTpaUuidByName(tpaName);   
    Policy.findAll({where: {tpaUuid: tpaUuid, status:'approved'}})
    .then(policyList => {        
        let employee_data  = {};
        let corporateUuidList = [];
        let  corporate_policy_map = {}; 
        let corporateUuids = [];       
        policyList.forEach(policy => {            
            if(corporateUuids.indexOf(policy.corporateUuid) < 0){
                corporateUuids.push(policy.corporateUuid);
            }
            corporate_policy_map[policy.corporateUuid] = {policyNumber: policy.policyId, fromDate: policy.fromDate, toDate: policy.toDate};
         
        });
        commonService.getCorporateEmployeeListByStatus(corporateUuids, employeeStatus.STATUS_PENDING_TPA_APPROVAL, employeeStatus.APPROVAL_TYPE_DELETION)
            .then(empList => {                
                let customerUuids = [];
                empList.forEach(emp => {
                    customerUuids.push(emp.uuid);
                });
                console.log(customerUuids);
                commonService.getDependentsListByCustomers(customerUuids)                 
                .then(depList => {  
                    let customerDependents = {};
                     depList.forEach(dep => {
                         console.log(dep.dependentOnCustomerUuid);
                         console.log(customerDependents[dep.dependentOnCustomerUuid]);
                         if(customerDependents[dep.dependentOnCustomerUuid] === undefined){
                            customerDependents[dep.dependentOnCustomerUuid] = [];
                         }
                         customerDependents[dep.dependentOnCustomerUuid].push(dep.uuid);
                     });
                     if((empList && empList.length > 0)  || (depList && depList.length > 0)){
                        empList.forEach(emp => {
                            if(emp.corporateUuid){
                                if(corporateUuidList.indexOf(emp.corporateUuid) < 0){
                                    corporateUuidList.push(emp.corporateUuid);                                
                                    employee_data[emp.corporateUuid] = {employee_list: [], dependent_list: [], policyId: corporate_policy_map[emp.corporateUuid].policyNumber};
                                }
                                employee_data[emp.corporateUuid].employee_list.push({empid: emp.empid, uuid: emp.uuid, customer_dependents_list: customerDependents[emp.uuid], updated_at: moment(emp.updatedAt, ['YYYY-MM-DD HH:mm:ss']).format('YYYY-MM-DD')});                               
                            }
                        });
                        
                     }
                     utilHelper.verifyDeactivedEmployeesListByPolicy(employee_data);                   
                })
                .catch(err => {
                    console.log(err);
                    console.log('error while fetching Dependents List');            
                })
            })
            .catch(err => {
                console.log(err);
                console.log('error while fetching Employees List');            
            })
    }).catch(err => {
        console.log('error while fetching policy details');            
    });

}


const employeeActiveListEmailScheduler = () => {
    console.log('Running the active employees Cron');
    let toDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');
    let fromDate = moment(toDate, ['YYYY-MM-DD HH:mm:ss']).add('-1', 'days').format('YYYY-MM-DD HH:mm:ss');    
    commonService.getActiveEmployeesList(fromDate, toDate)
       .then(empList=> {
        commonService.getActiveDependentsList(fromDate, toDate)
        .then(depList=> {          
            let employee_data  = {};
            let corporateUuidList = [];
            empList.forEach(emp => {
                 if(emp.corporateUuid){
                    if(corporateUuidList.indexOf(emp.corporateUuid) < 0){
                        corporateUuidList.push(emp.corporateUuid);
                        employee_data[emp.corporateUuid] = {employee_list: [], hr_email : emp.hrEmail, hr_first_name: emp.hrFirstName, executive_email: emp.executiveEmail, policyNumber: emp.policyNumber};
                     }
                     employee_data[emp.corporateUuid].employee_list.push({empid: emp.empid, firstName:emp.firstName, lastName: emp.lastName, relation: 'Self',  dob: emp.dob, sumInsured: emp.sumInsured});
                    if(emp.hrEmail && emp.hrEmail.length > 0){
                        employee_data[emp.corporateUuid].hr_email = emp.hrEmail;                    
                    }
                    if(emp.hrFirstName && emp.hrFirstName.length > 0){
                        employee_data[emp.corporateUuid].hr_first_name = emp.hrFirstName; 
                    }
                 }
            });
            depList.forEach(dep => {
                if(dep.corporateUuid){
                    if(corporateUuidList.indexOf(dep.corporateUuid) < 0){
                        corporateUuidList.push(dep.corporateUuid);
                        employee_data[dep.corporateUuid] = {employee_list: [], hr_email : dep.hrEmail, hr_first_name: dep.hrFirstName, executive_email: dep.executiveEmail, policyNumber: dep.policyNumber};
                     }
                     employee_data[dep.corporateUuid].employee_list.push({empid: dep.custEmpId, firstName:dep.firstName, lastName: dep.lastName, relation: dep.relationship, dob: dep.dob, sumInsured: dep.sumInsured});
                    if(dep.hrEmail && dep.hrEmail.length > 0){
                        employee_data[dep.corporateUuid].hr_email = dep.hrEmail;                    
                    }
                    if(dep.hrFirstName && dep.hrFirstName.length > 0){
                        employee_data[dep.corporateUuid].hr_first_name = dep.hrFirstName; 
                    }
                }                
           });
           console.log(employee_data);
           utilHelper.sendEmpActivationEmail(employee_data);           
        })
        .catch(err => {
         console.log('error while fetching Active depenedents');            
     });
       })
       .catch(err => {
        console.log('error while fetching Active employees');            
    });    
};


const policyClaimsScheduler = (tpaName) => {
    console.log('Policy Claims scheduler Cron');
    const tpaUuid = tpaHelper.getTpaUuidByName(tpaName);   
    Policy.findAll({where: {tpaUuid: tpaUuid, status:'approved'}})
    .then(policyList => {             
        async.forEach(policyList, (policy, cb) => {
            console.log('Fetching the claims for the policy :'+ policy.policyId);
            claimsService.mediAssistClaimsByPolicyByDates(policy.policyId, policy.fromDate, new Date())
            .then(claims => {  
                console.log('Claims updated successful for the policy :'+ policy.policyId);
                cb();              
            })
            .catch(err => {
                console.log('Claims updated failed for the policy:'+ policy.policyId);
                cb();
            });
        });
    }).catch(err => {
        console.log('error while Policy claims');            
    });  
};


const policyApprovalSchedulerCron = new CronJob('00 05 00 * * *', function() {
    policyApprovalScheduler('mediAssist');
  }, null, true, 'Asia/Kolkata');

const hrApprovedSchedulerCron = new CronJob('00 10 00 * * *', function() {
    hrApprovedScheduler('mediAssist');
}, null, true, 'Asia/Kolkata');

const pendingInsurerSchedulerCron = new CronJob('00 15 00 * * *', function() {
    pendingInsurerScheduler('mediAssist');
}, null, true, 'Asia/Kolkata');

const verifyDeactivatedEmployessCron = new CronJob('00 20 00 * * *', function() {
    verifyDeactivatedEmployess('mediAssist');
}, null, true, 'Asia/Kolkata');

const employeeActiveListEmailSchedulerCron =new CronJob('00 00 00 * * *', function() {
    employeeActiveListEmailScheduler('mediAssist');
}, null, true, 'Asia/Kolkata');

const policyClaimsSchedulerCron =new CronJob('00 00 00 * * *', function() {
    policyClaimsScheduler('mediAssist');
}, null, true, 'Asia/Kolkata');


const enableCrons = () => {
    policyApprovalSchedulerCron.start();
    hrApprovedSchedulerCron.start();
    pendingInsurerSchedulerCron.start();
    verifyDeactivatedEmployessCron.start();
    employeeActiveListEmailSchedulerCron.start();
    policyClaimsSchedulerCron.start();
}




const loadNetworkHospital = () => {
    addNetworkHospitals('mediAssist');
}

enableCrons();

/*
const networkHospitalJob = new CronJob('* * * * * *', function() {
      loadNetworkHospitals();
  
});

networkHospitalJob.start();
*/

module.exports = {
    loadNetworkHospital: loadNetworkHospital,
    policyApprovalScheduler:policyApprovalScheduler,
    hrApprovedScheduler:hrApprovedScheduler,
    pendingInsurerScheduler:pendingInsurerScheduler,    
    employeeActiveListEmailScheduler: employeeActiveListEmailScheduler,
    verifyDeactivatedEmployess: verifyDeactivatedEmployess
}
