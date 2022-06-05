"use strict";
const SMTPClient   = require("emailjs").SMTPClient;
const appConfig = require('../config/appConfig');

const client = new SMTPClient({
   user:    appConfig.mail.email,
   password: appConfig.mail.password,
   host:    appConfig.mail.smtp,
   ssl:     true,
   timeout: 30000
});

const sendEmail  = (message) => {
    return new Promise((resolve, reject) => {
        client.send(message, (err, ignoreMessage) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
};

const sendCustomerPendingMailToHr = (to_email, emp_count) => {
    return new Promise((resolve, reject) => {
        const message	= {
            from:	appConfig.mail.email,
            to: to_email,
            subject:	"Customer activation is pending"
        };
        message.text = 'Dear HR, \n\n  There are '+emp_count+' customers pending for approval. Please login and apporve. \n\n Best Regards,\n Visista Risk Management.';
        sendEmail(message)
        .then((message) => {
            resolve(message);
        })
        .catch((err) => {
            reject(err);
        });
    });    
};

const sendActiveEmployeeListToHr = (policyData, emailList, file_path) => {
    return new Promise((resolve, reject) => {
        const message	= {
            from:	appConfig.mail.email,
            to: emailList.to_email,           
            subject:	"Active employees",
            attachment:[{path:file_path, type:"text/csv", name:"EmployeeList.csv"}]
        };
        if(emailList.cc_email){
            message.cc = emailList.cc_email;
        }
        message.text = 'Dear HR, \n\n  Please find attached the list of employees/dependents that have been added to the Group Health Insurance policy number '+policyData.policyNumber+' w.e.f '+policyData.currentDate+'. \n\nBest Regards,\n Visista Risk Management.';
        sendEmail(message)
        .then((message) => {
            resolve(message);
        })
        .catch((err) => {
            reject(err);
        });
    });
}

const sendPendingApprovalEmailToInsurer= (policyData, emailList, file_path) => {

    return new Promise((resolve, reject) => {
        const message	= {
            from:	appConfig.mail.email,
            to: emailList.to_email,           
            subject:	"Endorsement Request for policy number "+policyData.policyNumber,
            attachment:[{path:file_path, type:"text/csv", name:"EmployeeList.csv"}]
        };
        if(emailList.cc_email){
            message.cc = emailList.cc_email;
        }
        message.text = 'Dear Sir/Madam, \n\n  Please find attached the list of customers that needs to be added or removed from the policy number '+policyData.policyNumber+' belonging to '+policyData.corporateName+' with effective dates as per attachment. \n\nBest Regards,\n Visista Risk Management.';
        sendEmail(message)
        .then((message) => {
            resolve(message);
        })
        .catch((err) => {
            reject(err);
        });
    });
}

const sendHardPasswordResetEmail = (email_data) => {

    return new Promise((resolve, reject) => {
        const message	= {
            from:	appConfig.mail.email,
            to: email_data.to_email,           
            subject: "Password Reset"           
        };         
       
        message.text = 'Dear Sir/Madam, \n\n Your password is reset for logging into '+email_data.domain_name+' \n Please use below password for logging in going forward. \n New Password: '+email_data.new_password+' \n\nBest Regards,\n Visista Risk Management.';
        sendEmail(message)
        .then((message) => {
            resolve(message);
        })
        .catch((err) => {
            reject(err);
        });
    });
}

module.exports = {
    sendCustomerPendingMailToHr: sendCustomerPendingMailToHr,
    sendActiveEmployeeListToHr: sendActiveEmployeeListToHr,
    sendPendingApprovalEmailToInsurer:sendPendingApprovalEmailToInsurer,
    sendHardPasswordResetEmail:sendHardPasswordResetEmail
}




   