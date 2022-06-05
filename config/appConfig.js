// config.js
const env = process.env.NODE_ENV || 'development';// 'dev' or 'test'

const production = {
    tpa : {
        fhpl : {
            service_url : 'https://m.fhpl.net/Bunnyconnect/BCService.svc?wsdl',
            username: 'Visista',
            password: 'visista123'
        },
        mediAssist: {
            service_url : 'https://integration.medibuddy.in/ClaimAPIServiceV2/ClaimService',
            employee_activation_status_url: 'https://integration.medibuddy.in/ClaimAPIServiceV2/ClaimService/GetBenefDetails',
            username: 'visistausr',
            password: 'VSTG6d104'
        },

    },
    tpaIds:{
        "mediAssist" : "TPA_002",
        "fhpl": "TPA_001"
    },
    mail: {
        "email": "visistainsurance4u@gmail.com",
        "password": "Vis@432$",
        "smtp": "smtp.gmail.com"
    },
    admin:{
        uuid : 'fb69a869-eaab-46ae-84a0-a339aab4eb90'
    },
    domain_name: "visista4u.com"

};
const development = {
    tpa : {
        fhpl : {
            service_url : 'https://m.fhpl.net/Bunnyconnect/BCService.svc?wsdl',
            username: 'Visista',
            password: 'visista123'
        },
        mediAssist: {
            service_url : 'https://integration.medibuddy.in/ClaimAPIServiceV2/ClaimService',
            employee_activation_status_url: 'https://integration.medibuddy.in/ClaimAPIServiceV2/ClaimService/GetBenefDetails',
            username: 'visistausr',
            password: 'VSTG6d104'
        },
        
    },
    tpaIds:{
        "mediAssist" : "TPA_002",
        "fhpl": "TPA_001"
    },
    mail: {       
        "email": "visistainsurance4u@gmail.com",
        "password": "Vis@432$",
        "smtp": "smtp.gmail.com"
    },
    admin:{
        uuid : 'fb69a869-eaab-46ae-84a0-a339aab4eb90'
    },
    domain_name: "visista4u.com"
    
};
const staging = {
    tpa : {
        fhpl : {
            service_url : 'https://m.fhpl.net/Bunnyconnect/BCService.svc?wsdl',
            username: 'Visista',
            password: 'visista123'
        },
        mediAssist: {
            service_url : 'https://integration.medibuddy.in/ClaimAPIServiceV2/ClaimService',
            employee_activation_status_url: 'https://integration.medibuddy.in/ClaimAPIServiceV2/ClaimService/GetBenefDetails',
            username: 'visistausr',
            password: 'VSTG6d104'
        }
    },    
    tpaIds:{
        "mediAssist" : "TPA_002",
        "fhpl": "TPA_001"
    },
    mail: {       
        "email": "visistainsurance4u@gmail.com",
        "password": "Vis@432$",
        "smtp": "smtp.gmail.com"
    },
    admin:{
        uuid : 'fb69a869-eaab-46ae-84a0-a339aab4eb90'
    },
    domain_name: "visista4u.com"
    
};

const test = {
    tpa : {
        fhpl : {
            service_url : 'https://m.fhpl.net/Bunnyconnect/BCService.svc?wsdl',
            username: 'Visista',
            password: 'visista123'
        },
        mediAssist: {
            service_url : 'https://integration.medibuddy.in/ClaimAPIServiceV2/ClaimService',
            employee_activation_status_url: 'https://integration.medibuddy.in/ClaimAPIServiceV2/ClaimService/GetBenefDetails',
            username: 'visistausr',
            password: 'VSTG6d104'
        }
    },
    tpaIds:{
        "mediAssist" : "TPA_002",
        "fhpl": "TPA_001"
    },
    mail: {
        "email": "visistainsurance4u@gmail.com",
        "password": "Vis@432$",
        "smtp": "smtp.gmail.com"
    },
    admin:{
        uuid : 'fb69a869-eaab-46ae-84a0-a339aab4eb90'
    },
    domain_name: "visista4u.com"

};

const config = {
    staging,
    production,
    development,
    test
};

module.exports = config[env];
