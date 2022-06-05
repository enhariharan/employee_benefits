const moment = require('moment');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const mailHelper = require('../helpers/mailHelper');
const customersService = require('../services/customersService');
const mediAssistProvider = require('../providers/mediAssistProvider');
const mediAssistHelper = require('../helpers/mediAssistHelper');
const employeeStatus = require('../services/employeeStatus');
const appConfig = require('../config/appConfig');
const async = require("async");


const cron_admin_credentials = {
    uuid: appConfig.admin.uuid,
    username: employeeStatus.CRONJOB_USERNAME
}

const updateEmployeeStatus = (empList, corporateUuid) => {
    if(empList && empList.length > 0){
      customersService.updateCustomerStatusBulk(cron_admin_credentials, empList, corporateUuid)
      .then(() =>{
         console.log("Customers status updated successfully");
      })
      .catch(err => {
        console.log("Error while updating the customers status");
        console.log(err);           
     });
    }
    
}

const updateDependentStatus = (depList, corporateUuid) => {
    if(depList && depList.length > 0){
        customersService.updateDependentsStatusBulk(cron_admin_credentials, depList, corporateUuid)
      .then(() =>{
         console.log("Dependent status updated successfully");
      })
      .catch(err => {
        console.log("Error while updating the Dependent status");
        console.log(err);           
     });
    }
    
}

const addMediAssistDependents = (dependents_list ,corporateUUid) =>{
    if(dependents_list && dependents_list.length > 0) {
        mediAssistHelper.convertDependentJsonIntoEbpFormat(dependents_list, corporateUUid)
        .then(dependentsJsonList => {
            return customersService.addDependentsBulk(cron_admin_credentials, dependentsJsonList, corporateUUid);
        })
        .then(ignoredependents => {
            console.log('Dependents added')
        })
        .catch(err => {
            console.log(err);                        
        });
    }
    
}

const convertMediAssistAPIResponse = (customers_List, dependents_list ,corporateUUid) => {
     if(customers_List && customers_List.length > 0){         
         mediAssistHelper.convertCustomerJsonIntoEbpFormat(customers_List, corporateUUid)
         .then(customersJsonList => {
            return customersService.addCustomers(cron_admin_credentials,  customersJsonList);
         })
         .then(ignorecustomers => {
            addMediAssistDependents(dependents_list ,corporateUUid);             
         })         
         .catch(err => {
            addMediAssistDependents(dependents_list ,corporateUUid);
             console.log(err);                        
         });
     } else if(dependents_list && dependents_list.length > 0) {
        addMediAssistDependents(dependents_list ,corporateUUid);
     }
    
}

const getActiveEmployeeListByPolicy = (corpPolicyList) => {   // To get the complete list of employees on policy approval
    async.eachOfSeries(corpPolicyList, (policyData, key, callback) => {        
        let endDate = moment().utcOffset("+05:30").format('DD-MM-YYYY');
        let startDate = moment(policyData.fromDate).utcOffset("+05:30").format('DD-MM-YYYY');
        console.log('Fetching data for the policy : '+ policyData.policyNumber + ' StarDate: '+ startDate + ' End Date '+endDate);        
        mediAssistProvider.getUpdatedEmployeesListByPolicyNo(policyData.policyNumber, startDate, endDate, "Active")
        .then(empData => {            
            if(empData && empData.isSuccess && empData.benefDetails && empData.benefDetails.length > 0){               
                let customers_List = [];
                let dependents_list = [];
                empData.benefDetails.forEach(emp => {                     
                     if(emp.relName === 'Self'){
                         let empInfo = {empCode : emp.priBenefEmpCode, dob:emp.benefDOB, firstName:emp.benefName.substr(0, emp.benefName.indexOf(" ")), lastName: emp.benefName.substr(emp.benefName.indexOf(" ")+1, emp.benefName.length), gender: emp.benefSex, sumInsured: emp.sum_Insured};
                         if(empInfo.firstName == ""){
                            empInfo.firstName = empInfo.lastName;
                            empInfo.lastName = " ";
                         }
                         customers_List.push(empInfo);
                     }else{
                         let depInfo = {empCode : emp.priBenefEmpCode, relation: emp.relName.toLowerCase(), dob:emp.benefDOB, firstName:emp.benefName.substr(0, emp.benefName.indexOf(" ")), lastName: emp.benefName.substr(emp.benefName.indexOf(" ")+1, emp.benefName.length), gender: emp.benefSex, sumInsured: emp.sum_Insured};
                         if(depInfo.firstName == ""){
                            depInfo.firstName = depInfo.lastName;
                            depInfo.lastName = " ";
                         }
                         dependents_list.push(depInfo);
                     }
                });
                convertMediAssistAPIResponse(customers_List, dependents_list, key);                
                callback();
            }else{
                callback();  
            }
        })
        .catch(err => {
            console.log(err);
            callback();
        })
    });

}


const verifyActiveEmployeesListByPolicy = (corpActiveEmpList) => {  // 
    async.eachOfSeries(corpActiveEmpList, (corpData, key, callback) => {
        console.log(corpData);        
        let endDate = moment().utcOffset("+05:30").format('DD-MM-YYYY');
        const empTotalList = corpData.employee_list.concat(corpData.dependent_list); 
        console.log(empTotalList);
        let startDate = new Date(Math.min(...empTotalList.map(e => new Date(e.updated_at))));
        startDate = moment(startDate).utcOffset("+05:30").format('DD-MM-YYYY');  
        console.log('Fetching policy info :'+ corpData.policyId );
        console.log(startDate);
        console.log(endDate);           
        mediAssistProvider.getUpdatedEmployeesListByPolicyNo(corpData.policyId, startDate, endDate, "Active")
        .then(empData => {
            if(empData && empData.isSuccess && empData.benefDetails && empData.benefDetails.length > 0){
                let customers_List = [];
                let dependents_list = [];
                empData.benefDetails.forEach(emp => {
                     console.log(emp);
                     if(emp.relName === 'Self'){
                         if(corpData.employee_list && corpData.employee_list.length > 0){
                            let empExists = corpData.employee_list.filter(function (item) {
                                return item.empid === emp.priBenefEmpCode;
                            });                            
                            if(empExists && empExists.length > 0){
                                customers_List.push({"uuid":empExists[0].uuid,"status": employeeStatus.STATUS_ACTIVE, "approvalType": employeeStatus.APPROVAL_TYPE_ADDITION});
                            }
                        }                         
                     }else{
                        if(corpData.dependent_list && corpData.dependent_list.length > 0){
                            let depExists = corpData.dependent_list.filter(function (item) {
                                return item.empid === emp.priBenefEmpCode && item.relation === emp.relName.toLowerCase();
                            });                            
                            if(depExists && depExists.length > 0){
                                dependents_list.push({"uuid":depExists[0].uuid,"status": employeeStatus.STATUS_ACTIVE, "approvalType": employeeStatus.APPROVAL_TYPE_ADDITION});
                            }
                        }                       
                     }
                });
                console.log(customers_List);
                console.log(dependents_list);
                updateEmployeeStatus(customers_List, key);
                updateDependentStatus(dependents_list, key);
                callback();
            }else{
                callback();  
            }
        })
        .catch(ignoreerr => {
            callback();
        })
    });

}


const verifyDeactivedEmployeesListByPolicy = (corpActiveEmpList) => {  // 
    async.eachOfSeries(corpActiveEmpList, (corpData, key, callback) => {
        console.log(corpData);        
        let endDate = moment().utcOffset("+05:30").format('DD-MM-YYYY');        
        let startDate = new Date(Math.min(...corpData.employee_list.map(e => new Date(e.updated_at))));
        startDate = moment(startDate).utcOffset("+05:30").format('DD-MM-YYYY');  
        console.log('Fetching policy info :'+ corpData.policyId );
        console.log(startDate);
        console.log(endDate);           
        mediAssistProvider.getUpdatedEmployeesListByPolicyNo(corpData.policyId, startDate, endDate, "Deactive")
        .then(empData => {
            if(empData && empData.isSuccess && empData.benefDetails && empData.benefDetails.length > 0){
                let customers_List = [];
                let dependents_list = [];
                empData.benefDetails.forEach(emp => {
                     console.log(emp);
                     if(emp.relName === 'Self'){
                         if(corpData.employee_list && corpData.employee_list.length > 0){
                            let empExists = corpData.employee_list.filter(function (item) {
                                return item.empid === emp.priBenefEmpCode;
                            });                            
                            if(empExists && empExists.length > 0){
                                customers_List.push({"uuid":empExists[0].uuid,"status": employeeStatus.STATUS_INACTIVE, "approvalType": employeeStatus.APPROVAL_TYPE_NONE});
                                let customer_dependents = empExists[0].customer_dependents_list;
                                customer_dependents.forEach(depUuid =>{
                                    dependents_list.push({"uuid":depUuid,"status": employeeStatus.STATUS_INACTIVE, "approvalType": employeeStatus.APPROVAL_TYPE_NONE});
                                });                                
                            }
                        }                         
                     }
                });
                console.log(customers_List);
                console.log(dependents_list);
                updateEmployeeStatus(customers_List, key);
                updateDependentStatus(dependents_list, key);
                callback();
            }else{
                callback();  
            }
        })
        .catch(ignoreerr => {
            callback();
        })
    });

}

const sendPendingApprovalEmailToInsurer = (corpActiveEmpList) => {
    let curDate = moment().utcOffset("+05:30").format('YYYY-MM-DD');
    const headers = [
        {id: 'empid', title: 'Employee ID'},
        {id: 'firstName', title: 'First Name'},
        {id: 'lastName', title: 'Last Name'},
        {id:'relation', title: 'Relation'},
        {id: 'dob', title:'Date Of Birth'},
        {id:'approvalType', title:'Approval Type'},
        {id:'dateOfJoining', title:'Joining Date'},
        {id:'dateOfExit', title:'Exit Date'}
    ];  
    async.eachOfSeries(corpActiveEmpList, (corpData, key, callback) => {
        console.log('Insurer email'+ corpData.insurance_company_email);        
        if(corpData.insurance_company_email && corpData.insurance_company_email.length > 0){
            let filePath = './csv_files/Pending_insurer_employees/'+curDate+ '_'+key +'.csv';
            const csvWriter = createCsvWriter({
                path: filePath,
                header: headers
            });
            csvWriter.writeRecords(corpData.employee_list) 
            .then(() => {
                setTimeout(() => {
                    let policyData = {policyNumber: corpData.policyNumber, corporateName: corpData.company_name, currentDate: moment().utcOffset("+05:30").format('DD-MMM-YYYY'), };
                    let emailList = {to_email: corpData.insurance_company_email, cc_email: corpData.executive_email};
                    mailHelper.sendPendingApprovalEmailToInsurer(policyData, emailList, filePath).
                    then(() => {
                        console.log("Email sent"+ corpData.insurance_company_email);
                        if(corpData.employee_status && corpData.employee_status.length > 0){
                            updateEmployeeStatus(corpData.employee_status, key);
                        }
                        if(corpData.dependents_status && corpData.dependents_status.length > 0){
                            updateDependentStatus(corpData.dependents_status, key);
                        }                        
                        callback();
                    }).catch(err => {
                        console.log(err);
                        console.log("Error in sending email");  
                        callback();         
                    });
                }, 2000); 
            })
            .catch(err => {
                console.log(err); 
                callback();          
            });
        }else{
            callback();
        }
    });   
};


const sendEmpActivationEmail = (corpActiveEmpList) => {
    let curDate = moment().utcOffset("+05:30").format('YYYY-MM-DD');
    const headers = [
        {id: 'empid', title: 'Employee ID'},
        {id: 'firstName', title: 'First Name'},
        {id: 'lastName', title: 'Last Name'},
        {id:'relation', title: 'Relation'},
        {id:'sumInsured', title: 'Sum Insured'}
    ];
    async.eachOfSeries(corpActiveEmpList, (corpData, key, callback) => {        
        if(corpData.hr_email && corpData.hr_email.length > 0){
            let filePath = './csv_files/active_employeees/'+curDate+ '_'+key +'.csv';
            const csvWriter = createCsvWriter({
                path: filePath,
                header: headers
            });
            csvWriter.writeRecords(corpData.employee_list) 
            .then(() => {
                setTimeout(() => {
                    let policyData = {policyNumber: corpData.policyNumber, currentDate: moment().utcOffset("+05:30").format('DD-MMM-YYYY'), };
                    let emailList = {to_email: corpData.hr_email, cc_email: corpData.executive_email};
                    mailHelper.sendActiveEmployeeListToHr(policyData, emailList, filePath).
                    then(() => {
                        console.log("Email sent");
                        callback();
                    }).catch(err => {
                        console.log(err);
                        console.log("Error in sending email");  
                        callback();         
                    });
                }, 2000); 
            })
            .catch(err => {
                console.log(err);  
                callback();         
            });
        }else{
            callback();
        }
    });    
   
};

const generatePassword = (pLength) => {
    let keyListAlpha="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
        keyListInt="123456789",
        keyListSpec="!@#$",
        password='';
    let len = Math.ceil(pLength/2);
    len = len - 1;
    let lenSpec = pLength-2*len;

    for (i=0;i<len;i++) {
        password+=keyListAlpha.charAt(Math.floor(Math.random()*keyListAlpha.length));
        password+=keyListInt.charAt(Math.floor(Math.random()*keyListInt.length));
    }

    for (i=0;i<lenSpec;i++)
        password+=keyListSpec.charAt(Math.floor(Math.random()*keyListSpec.length));

    password=password.split('').sort(function(){return 0.5-Math.random()}).join('');

    return password;

}




module.exports = {
    sendEmpActivationEmail: sendEmpActivationEmail,
    updateEmployeeStatus: updateEmployeeStatus,
    updateDependentStatus: updateDependentStatus,
    sendPendingApprovalEmailToInsurer: sendPendingApprovalEmailToInsurer,
    verifyActiveEmployeesListByPolicy:verifyActiveEmployeesListByPolicy,
    verifyDeactivedEmployeesListByPolicy: verifyDeactivedEmployeesListByPolicy,
    getActiveEmployeeListByPolicy:getActiveEmployeeListByPolicy,
    generatePassword:generatePassword
    
};