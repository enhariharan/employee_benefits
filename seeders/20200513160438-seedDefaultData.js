'use strict';

const {v4: uuidv4} = require('uuid');
const argon2 = require('argon2');
const env = process.env.NODE_ENV || 'development';
const allowedNodeEnv = ['development', 'test', 'staging'];

module.exports = {
  up: (queryInterface, ignoreSequelize) => {
    if (!allowedNodeEnv.includes(env)) {
      return new Promise((resolve, ignoreReject) => {
        console.log(`This seeder works only in ${JSON.stringify(allowedNodeEnv)} environments`);
        resolve(true);
      });
    }

    const visistaBCBranch1 = {
      uuid: uuidv4(),
      companyName: 'Visista Insurance Broking Services Pvt Ltd',
      displayName: 'Visista',
      branchCode: '1',
      branchAddressBuildingName: 'Plot no-177',
      branchAddressBuildingAddress: 'Phase-II, Kamalapuri Colony',
      branchAddressStreet: '',
      branchAddressCity: 'Hyderabad',
      branchAddressDistrict: 'Hyderabad',
      branchAddressState: 'Telangana',
      branchAddressPincode: '500073',
      lat: '17.430833',
      long: '78.428659',
      contactFirstName: 'Datla K M S Raju',
      contactLastName: '',
      contactMobile: '+914040176990',
      contactEmail: 'datlakmsraju@visista.com',
      contactGstNumber: '36AABCV6422B1ZP',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const integratedBCBranch2 = {
      uuid: uuidv4(),
      companyName: 'Integrated Insurance Broking Services Pvt Ltd',
      displayName: 'Integrated',
      branchCode: '2',
      branchAddressBuildingName: 'Plot no-177',
      branchAddressBuildingAddress: 'Phase-II, Kamalapuri Colony',
      branchAddressStreet: '',
      branchAddressCity: 'Chennai',
      branchAddressDistrict: 'Chennai',
      branchAddressState: 'Tamilnadu',
      branchAddressPincode: '600017',
      lat: '17.430833',
      long: '78.428659',
      contactFirstName: 'Kishore',
      contactLastName: 'Kumar',
      contactMobile: '+914040176990',
      contactEmail: 'kishore.kumar@integrated.com',
      contactGstNumber: '22AAAAA0000A1Z6',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const brokingCompanies = [visistaBCBranch1, integratedBCBranch2];

    const NclCorporate = {
      uuid: uuidv4(),
      companyName: "NCL Dealers Welfare Trust",
      displayName: "NCL",
      branchCode: "1",
      branchAddressBuildingName: "NCL Pearl",
      branchAddressBuildingAddress: "7th Floor, Opp Hyderabad Bhawan, Near Rail Nilayam",
      branchAddressStreet: "Sarojini Devi Road, East Maredpally",
      branchAddressCity: "Secunderabad",
      branchAddressDistrict: "Secunderabad",
      branchAddressState: "Telangana",
      branchAddressPincode: "500026",
      lat: "17.440361",
      long: "78.508135",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const tcsCorporate = {
      uuid: uuidv4(),
      companyName: "Tata Consultancy Services",
      displayName: "TCS",
      branchCode: "1",
      branchAddressBuildingName: "Wipro Limited",
      branchAddressBuildingAddress: "Doddakannelli",
      branchAddressStreet: "Sarjapur Road",
      branchAddressCity: "Bengaluru",
      branchAddressDistrict: "Bengaluru",
      branchAddressState: "Karnataka",
      branchAddressPincode: "560035",
      lat: "12.909711",
      long: "77.687124",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const innovaxionCorporate = {
      uuid: uuidv4(),
      companyName: "Innovaxion Inc",
      displayName: "Inno",
      branchCode: "1",
      branchAddressBuildingName: "Innovaxion Inc Pvt Ltd",
      branchAddressBuildingAddress: "Doddakannelli",
      branchAddressStreet: "Sarjapur Road",
      branchAddressCity: "Bengaluru",
      branchAddressDistrict: "Bengaluru",
      branchAddressState: "Karnataka",
      branchAddressPincode: "560035",
      lat: "12.909711",
      long: "77.687124",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const visistaCorporate = {
      uuid: uuidv4(),
      companyName: "Visista Insurance Broking Services Pvt Ltd",
      displayName: "Visista",
      branchCode: "1",
      branchAddressBuildingName: "Visista Insurance Broking Services Pvt Ltd",
      branchAddressBuildingAddress: "Plot No. 177, Phase-2, Kamalapuri Colony",
      branchAddressStreet: "",
      branchAddressCity: "Hyderabad",
      branchAddressDistrict: "Hyderabad",
      branchAddressState: "Telangana",
      branchAddressPincode: "500073",
      lat: "17.430341",
      long: "78.4302273",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const corporates = [
      NclCorporate,
      tcsCorporate,
      innovaxionCorporate,
      visistaCorporate
    ];

    const user1ManagerVisista = {
      uuid: uuidv4(),
      username: 'user1',
      password: null,
      role: 'manager',
      corporateUuid: null,
      brokingCompanyUuid: visistaBCBranch1.uuid,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const vinithaExecutiveVisista = {
      uuid: uuidv4(),
      username: 'user2',
      password: null,
      role: 'executive',
      corporateUuid: null,
      brokingCompanyUuid: visistaBCBranch1.uuid,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const vinodExecutiveVisista = {
      uuid: uuidv4(),
      username: 'vinod',
      password: null,
      role: 'executive',
      corporateUuid: null,
      brokingCompanyUuid: visistaBCBranch1.uuid,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const userApegdls151Ncl = {
      uuid: uuidv4(),
      username: 'APEGDLS151',
      password: null,
      role: 'customer',
      corporateUuid: NclCorporate.uuid,
      brokingCompanyUuid: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const amitHRNcl = {
      uuid: uuidv4(),
      username: 'amitk',
      password: null,
      role: 'hr',
      corporateUuid: NclCorporate.uuid,
      brokingCompanyUuid: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const user4Manager = {
      uuid: uuidv4(),
      username: 'user4',
      password: null,
      role: 'manager',
      corporateUuid: null,
      brokingCompanyUuid: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const user5ExecutiveVisista = {
      uuid: uuidv4(),
      username: 'user5',
      password: null,
      role: 'executive',
      corporateUuid: null,
      brokingCompanyUuid: visistaBCBranch1.uuid,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const user6CustomerNcl = {
      uuid: uuidv4(),
      username: 'user6',
      password: null,
      role: 'customer',
      corporateUuid: NclCorporate.uuid,
      brokingCompanyUuid: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const user7HRTcs = {
      uuid: uuidv4(),
      username: 'user7',
      password: null,
      role: 'hr',
      corporateUuid: tcsCorporate.uuid,
      brokingCompanyUuid: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const user8HRInnovaxion = {
      uuid: uuidv4(),
      username: 'user8',
      password: null,
      role: 'hr',
      corporateUuid: innovaxionCorporate.uuid,
      brokingCompanyUuid: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const userApvsdld04Ncl = {
      uuid: uuidv4(),
      username: 'APVSDLD04',
      password: null,
      role: 'customer',
      corporateUuid: NclCorporate.uuid,
      brokingCompanyUuid: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const user9HRVisista = {
      uuid: uuidv4(),
      username: 'user9',
      password: null,
      role: 'hr',
      corporateUuid: visistaCorporate.uuid,
      brokingCompanyUuid: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const user10CustomerVisista = {
      uuid: uuidv4(),
      username: 'user10',
      password: null,
      role: 'customer',
      corporateUuid: visistaCorporate.uuid,
      brokingCompanyUuid: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const users = [
      user1ManagerVisista,
      vinithaExecutiveVisista,
      vinodExecutiveVisista,
      user9HRVisista,
      user10CustomerVisista,
      user5ExecutiveVisista,
      user6CustomerNcl,
      userApegdls151Ncl,
      userApvsdld04Ncl,
      amitHRNcl,
      user4Manager,
      user7HRTcs,
      user8HRInnovaxion
    ];

    const amitCorporateHR = {
      uuid: uuidv4(),
      empid: "100001",
      userUuid: amitHRNcl.uuid,
      corporateUuid: NclCorporate.uuid,
      firstName: "Amit",
      lastName: "K",
      email: "amitk@wpiro.com",
      mobile: '+911234567890',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const user7CorporateHR = {
      uuid: uuidv4(),
      empid: "400010",
      userUuid: user7HRTcs.uuid,
      corporateUuid: tcsCorporate.uuid,
      firstName: "User",
      lastName: "7",
      email: "user7@dxc.com",
      mobile: '+911234567890',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const user8CorporateHR = {
      uuid: uuidv4(),
      empid: "100100",
      userUuid: user8HRInnovaxion.uuid,
      corporateUuid: innovaxionCorporate.uuid,
      firstName: "User",
      lastName: "8",
      email: "user8@innovaxion.com",
      mobile: '+911234567890',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const user9CorporateHR = {
      uuid: uuidv4(),
      empid: "100110",
      userUuid: user9HRVisista.uuid,
      corporateUuid: visistaCorporate.uuid,
      firstName: "User",
      lastName: "9",
      email: "user9@visista.com",
      mobile: '+911234567820',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const corporateHRs = [
      amitCorporateHR,
      user7CorporateHR,
      user8CorporateHR,
      user9CorporateHR
    ];

    const biplabExecutiveUser1Manager = {
      uuid: uuidv4(),
      empid: "100000",
      userUuid: user1ManagerVisista.uuid,
      brokingCompanyUuid: visistaBCBranch1.uuid,
      firstName: "Biplab",
      lastName: "Banerjee",
      email: "biplab.banerjee@visista.com",
      mobile: "+914123456799",
      supervisorEmpid: "100001",
      designation: "manager",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const vinithaExecutiveUser2 = {
      uuid: uuidv4(),
      empid: "100010",
      userUuid: vinithaExecutiveVisista.uuid,
      brokingCompanyUuid: visistaBCBranch1.uuid,
      firstName: "Vinitha",
      lastName: "Shukla",
      email: "vinitha.s@visista.com",
      mobile: "+914123456889",
      supervisorEmpid: "100002",
      designation: "executive",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const shanmukhExecutiveUser5 = {
      uuid: uuidv4(),
      empid: "100020",
      userUuid: user5ExecutiveVisista.uuid,
      brokingCompanyUuid: visistaBCBranch1.uuid,
      firstName: "Shanmukhaswamy",
      lastName: "Chinnappa",
      email: "shan.chin@visista.com",
      mobile: "+914123456789",
      supervisorEmpid: "100003",
      designation: "executive",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const user1ManagerVisistaEx = {
      uuid: uuidv4(),
      empid: "100025",
      userUuid: user1ManagerVisista.uuid,
      brokingCompanyUuid: visistaBCBranch1.uuid,
      firstName: "User",
      lastName: "1",
      email: "user1@visista.com",
      mobile: "+914123456799",
      supervisorEmpid: "100003",
      designation: "Manager",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const vinodExecutiveVisistaEx = {
      uuid: uuidv4(),
      empid: "100035",
      userUuid: vinodExecutiveVisista.uuid,
      brokingCompanyUuid: visistaBCBranch1.uuid,
      firstName: "Vinod",
      lastName: "Babu",
      email: "vinod@visista.com",
      mobile: "+914123456799",
      supervisorEmpid: "100003",
      designation: "Manager",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const executives = [
      biplabExecutiveUser1Manager,
      vinithaExecutiveUser2,
      shanmukhExecutiveUser5,
      user1ManagerVisistaEx,
      vinodExecutiveVisistaEx
    ];

    const executiveCorporateMappings = [
      {
        uuid: uuidv4(), executiveUuid: biplabExecutiveUser1Manager.uuid, corporateUuid: tcsCorporate.uuid,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        uuid: uuidv4(), executiveUuid: biplabExecutiveUser1Manager.uuid, corporateUuid: NclCorporate.uuid,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        uuid: uuidv4(), executiveUuid: biplabExecutiveUser1Manager.uuid, corporateUuid: innovaxionCorporate.uuid,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        uuid: uuidv4(), executiveUuid: vinithaExecutiveUser2.uuid, corporateUuid: tcsCorporate.uuid,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        uuid: uuidv4(), executiveUuid: vinithaExecutiveUser2.uuid, corporateUuid: NclCorporate.uuid,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        uuid: uuidv4(), executiveUuid: vinithaExecutiveUser2.uuid, corporateUuid: innovaxionCorporate.uuid,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        uuid: uuidv4(), executiveUuid: user1ManagerVisistaEx.uuid, corporateUuid: visistaCorporate.uuid,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        uuid: uuidv4(), executiveUuid: vinodExecutiveVisistaEx.uuid, corporateUuid: visistaCorporate.uuid,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const fhplTpa = {
      uuid: uuidv4(),
      tpaid: 'TPA_001',
      companyName: "Family Health Plan Insurance TPA Limited (FHPL)",
      displayName: "FHPL",
      branchCode: "133829",
      branchAddressBuildingName: "Srinilaya Cyber Spazio",
      branchAddressBuildingAddress: "No:8-2-269/A/2-1 To 6, 2nd Floor",
      branchAddressStreet: "Road No.2, Banjara Hills",
      branchAddressCity: "Hyderabad",
      branchAddressDistrict: "Hyderabad",
      branchAddressState: "Telangana",
      branchAddressPincode: "500034",
      lat: "19.106680",
      long: "72.886707",
      contactFirstName: "Shiva",
      contactLastName: "Belavadi",
      contactMobile: "+912240176990",
      contactEmail: "shiv.belavadi@fhpl.com",
      contactGstNumber: "22AAAAA0000A1Z5",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const mediAssistTpa = {
      uuid: uuidv4(),
      tpaid: 'TPA_002',
      companyName: "Medi Assist India TPA Pvt Ltd",
      displayName: "Mediassist",
      branchCode: "2",
      branchAddressBuildingName: "47/1, 9th Cross, 1st Main Road",
      branchAddressBuildingAddress: "Sarakki Industrial Layout, 3rd Phase",
      branchAddressStreet: "J P Nagar",
      branchAddressCity: "Bengaluru",
      branchAddressDistrict: "Bengaluru Urban",
      branchAddressState: "Karnataka",
      branchAddressPincode: "560062",
      lat: "12.883718",
      long: "77.574031",
      contactFirstName: "Ganesh",
      contactLastName: "K",
      contactMobile: "+918040176991",
      contactEmail: "ganesh.k@mediassist.com",
      contactGstNumber: "32AACCM8044R1Z2",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const tpas = [fhplTpa, mediAssistTpa];

    const niaInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "The New India Assurance Co. Ltd",
      displayName: "NIA",
      branchCode: "1",
      branchAddressBuildingName: "Sample",
      branchAddressBuildingAddress: "Sample",
      branchAddressStreet: "",
      branchAddressCity: "Sample",
      branchAddressDistrict: "Sample",
      branchAddressState: "Sample",
      branchAddressPincode: "400011",
      lat: "18.987968",
      long: "72.826766",
      contactFirstName: "Ganesh",
      contactLastName: "K",
      contactMobile: "+918040176991",
      contactEmail: "ganesh.k@nia.com",
      contactGstNumber: "32AACCM8044R1Z2",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const relianceGeneralInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "Reliance General Insurance Co. Ltd.",
      displayName: "Reliance_General",
      branchCode: "1",
      branchAddressBuildingName: "Sample",
      branchAddressBuildingAddress: "Sample",
      branchAddressStreet: "",
      branchAddressCity: "Sample",
      branchAddressDistrict: "Sample",
      branchAddressState: "Sample",
      branchAddressPincode: "400011",
      lat: "18.987968",
      long: "72.826766",
      contactFirstName: "Ganesh",
      contactLastName: "K",
      contactMobile: "+918040176991",
      contactEmail: "ganesh.k@nia.com",
      contactGstNumber: "32AACCM8044R1Z2",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const oicInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "The Oriental Insurance Co. Ltd.",
      displayName: "OIC",
      branchCode: "1",
      branchAddressBuildingName: "Sample",
      branchAddressBuildingAddress: "Sample",
      branchAddressStreet: "",
      branchAddressCity: "Sample",
      branchAddressDistrict: "Sample",
      branchAddressState: "Sample",
      branchAddressPincode: "400011",
      lat: "18.987968",
      long: "72.826766",
      contactFirstName: "Ganesh",
      contactLastName: "K",
      contactMobile: "+918040176991",
      contactEmail: "ganesh.k@nia.com",
      contactGstNumber: "32AACCM8044R1Z2",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const uiicInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "United India Insurance Co. Ltd",
      displayName: "UIIC",
      branchCode: "1",
      branchAddressBuildingName: "United India Insurance Company Ltd.",
      branchAddressBuildingAddress: "19, Nungambakkam High Road, IV Lane",
      branchAddressStreet: "",
      branchAddressCity: "Chennai",
      branchAddressDistrict: "Chennai",
      branchAddressState: "Tamilnadu",
      branchAddressPincode: "600034",
      lat: "18.92952",
      long: "72.821444",
      contactFirstName: "Ashok",
      contactLastName: "Kumar",
      contactMobile: "+914428575200",
      contactEmail: "ashok.kumar@uiic.co.in",
      contactGstNumber: "22AAAAA0000A1Z5",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const nicInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "National Insurance Co. Ltd.",
      displayName: "NIC",
      branchCode: "1",
      branchAddressBuildingName: "United India Insurance Company Ltd.",
      branchAddressBuildingAddress: "19, Nungambakkam High Road, IV Lane",
      branchAddressStreet: "",
      branchAddressCity: "Chennai",
      branchAddressDistrict: "Chennai",
      branchAddressState: "Tamilnadu",
      branchAddressPincode: "600034",
      lat: "18.92952",
      long: "72.821444",
      contactFirstName: "Ashok",
      contactLastName: "Kumar",
      contactMobile: "+914428575200",
      contactEmail: "ashok.kumar@uiic.co.in",
      contactGstNumber: "22AAAAA0000A1Z5",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const iciciInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "ICICI Lombard General Insurance Co. Ltd.",
      displayName: "ICICI",
      branchCode: "1",
      branchAddressBuildingName: "United India Insurance Company Ltd.",
      branchAddressBuildingAddress: "19, Nungambakkam High Road, IV Lane",
      branchAddressStreet: "",
      branchAddressCity: "Chennai",
      branchAddressDistrict: "Chennai",
      branchAddressState: "Tamilnadu",
      branchAddressPincode: "600034",
      lat: "18.92952",
      long: "72.821444",
      contactFirstName: "Ashok",
      contactLastName: "Kumar",
      contactMobile: "+914428575200",
      contactEmail: "ashok.kumar@uiic.co.in",
      contactGstNumber: "22AAAAA0000A1Z5",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const cholamandalamInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "Cholamandalam MS General Insurance Company Limited",
      displayName: " Cholamandalam",
      branchCode: "1",
      branchAddressBuildingName: "United India Insurance Company Ltd.",
      branchAddressBuildingAddress: "19, Nungambakkam High Road, IV Lane",
      branchAddressStreet: "",
      branchAddressCity: "Chennai",
      branchAddressDistrict: "Chennai",
      branchAddressState: "Tamilnadu",
      branchAddressPincode: "600034",
      lat: "18.92952",
      long: "72.821444",
      contactFirstName: "Ashok",
      contactLastName: "Kumar",
      contactMobile: "+914428575200",
      contactEmail: "ashok.kumar@uiic.co.in",
      contactGstNumber: "22AAAAA0000A1Z5",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const royalSundaramInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "Royal Sundaram General Insurance Company Limited",
      displayName: "Royal_Sundaram",
      branchCode: "1",
      branchAddressBuildingName: "United India Insurance Company Ltd.",
      branchAddressBuildingAddress: "19, Nungambakkam High Road, IV Lane",
      branchAddressStreet: "",
      branchAddressCity: "Chennai",
      branchAddressDistrict: "Chennai",
      branchAddressState: "Tamilnadu",
      branchAddressPincode: "600034",
      lat: "18.92952",
      long: "72.821444",
      contactFirstName: "Ashok",
      contactLastName: "Kumar",
      contactMobile: "+914428575200",
      contactEmail: "ashok.kumar@uiic.co.in",
      contactGstNumber: "22AAAAA0000A1Z5",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const iffcoTokioInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "IFFCO-TOKIO General Insurance Co. Ltd",
      displayName: "IFFCO_TOKIO",
      branchCode: "1",
      branchAddressBuildingName: "United India Insurance Company Ltd.",
      branchAddressBuildingAddress: "19, Nungambakkam High Road, IV Lane",
      branchAddressStreet: "",
      branchAddressCity: "Chennai",
      branchAddressDistrict: "Chennai",
      branchAddressState: "Tamilnadu",
      branchAddressPincode: "600034",
      lat: "18.92952",
      long: "72.821444",
      contactFirstName: "Ashok",
      contactLastName: "Kumar",
      contactMobile: "+914428575200",
      contactEmail: "ashok.kumar@uiic.co.in",
      contactGstNumber: "22AAAAA0000A1Z5",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const hdfcErgoInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "HDFC Ergo General Insurance Company Limited",
      displayName: "HDFC_EGRO",
      branchCode: "2",
      branchAddressBuildingName: "12th Floor, Lodha Excelus",
      branchAddressBuildingAddress: "Apollo Mills Compound, N .M. Joshi Road, Mahalaxmi",
      branchAddressStreet: "",
      branchAddressCity: "Mumbai",
      branchAddressDistrict: "Mumbai",
      branchAddressState: "Maharashtra",
      branchAddressPincode: "400011",
      lat: "18.987968",
      long: "72.826766",
      contactFirstName: "Ganesh",
      contactLastName: "K",
      contactMobile: "+918040176991",
      contactEmail: "ganesh.k@hdfclife.com",
      contactGstNumber: "32AACCM8044R1Z2",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const licInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "LIC of India",
      displayName: "LIC",
      branchCode: "1",
      branchAddressBuildingName: "Plot No-177",
      branchAddressBuildingAddress: "Yogakshema",
      branchAddressStreet: "Nariman Point",
      branchAddressCity: "Mumbai",
      branchAddressDistrict: "Mumbai",
      branchAddressState: "Maharashtra",
      branchAddressPincode: "400021",
      lat: "18.92952",
      long: "72.821444",
      contactFirstName: "Ashok",
      contactLastName: "Kumar",
      contactMobile: "+912240176990",
      contactEmail: "ashok.kumar@lic.com",
      contactGstNumber: "22AAAAA0000A1Z5",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const hdfcErgoHealthInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "HDFC ERGO Health Insurance Ltd\n",
      displayName: "AMHI",
      branchCode: "1",
      branchAddressBuildingName: "Plot No-177",
      branchAddressBuildingAddress: "Yogakshema",
      branchAddressStreet: "Nariman Point",
      branchAddressCity: "Mumbai",
      branchAddressDistrict: "Mumbai",
      branchAddressState: "Maharashtra",
      branchAddressPincode: "400021",
      lat: "18.92952",
      long: "72.821444",
      contactFirstName: "Ashok",
      contactLastName: "Kumar",
      contactMobile: "+912240176990",
      contactEmail: "ashok.kumar@lic.com",
      contactGstNumber: "22AAAAA0000A1Z5",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const futureGeneraliInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "Future Generali India Insurance Co. Ltd",
      displayName: " Future_Generali",
      branchCode: "1",
      branchAddressBuildingName: "Plot No-177",
      branchAddressBuildingAddress: "Yogakshema",
      branchAddressStreet: "Nariman Point",
      branchAddressCity: "Mumbai",
      branchAddressDistrict: "Mumbai",
      branchAddressState: "Maharashtra",
      branchAddressPincode: "400021",
      lat: "18.92952",
      long: "72.821444",
      contactFirstName: "Ashok",
      contactLastName: "Kumar",
      contactMobile: "+912240176990",
      contactEmail: "ashok.kumar@lic.com",
      contactGstNumber: "22AAAAA0000A1Z5",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const bharathiAXAInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "Bharti AXA General Insurance Company Limited",
      displayName: "Bharathi_AXA",
      branchCode: "1",
      branchAddressBuildingName: "Plot No-177",
      branchAddressBuildingAddress: "Yogakshema",
      branchAddressStreet: "Nariman Point",
      branchAddressCity: "Mumbai",
      branchAddressDistrict: "Mumbai",
      branchAddressState: "Maharashtra",
      branchAddressPincode: "400021",
      lat: "18.92952",
      long: "72.821444",
      contactFirstName: "Ashok",
      contactLastName: "Kumar",
      contactMobile: "+912240176990",
      contactEmail: "ashok.kumar@lic.com",
      contactGstNumber: "22AAAAA0000A1Z5",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const relianceLifeInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "RELIANCE NIPPON LIFE INSURANCE CO LTD\n",
      displayName: " Reliance_Life\n",
      branchCode: "1",
      branchAddressBuildingName: "Plot No-177",
      branchAddressBuildingAddress: "Yogakshema",
      branchAddressStreet: "Nariman Point",
      branchAddressCity: "Mumbai",
      branchAddressDistrict: "Mumbai",
      branchAddressState: "Maharashtra",
      branchAddressPincode: "400021",
      lat: "18.92952",
      long: "72.821444",
      contactFirstName: "Ashok",
      contactLastName: "Kumar",
      contactMobile: "+912240176990",
      contactEmail: "ashok.kumar@lic.com",
      contactGstNumber: "22AAAAA0000A1Z5",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const universalSampoInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "Universal Sompo General Insurance Co. Ltd.\n",
      displayName: " Universal_Sampo\n",
      branchCode: "1",
      branchAddressBuildingName: "Plot No-177",
      branchAddressBuildingAddress: "Yogakshema",
      branchAddressStreet: "Nariman Point",
      branchAddressCity: "Mumbai",
      branchAddressDistrict: "Mumbai",
      branchAddressState: "Maharashtra",
      branchAddressPincode: "400021",
      lat: "18.92952",
      long: "72.821444",
      contactFirstName: "Ashok",
      contactLastName: "Kumar",
      contactMobile: "+912240176990",
      contactEmail: "ashok.kumar@lic.com",
      contactGstNumber: "22AAAAA0000A1Z5",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const starHealthInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "Star Health and Allied Insurance Company Limited\n",
      displayName: "Star_Health\n",
      branchCode: "1",
      branchAddressBuildingName: "Plot No-177",
      branchAddressBuildingAddress: "Yogakshema",
      branchAddressStreet: "Nariman Point",
      branchAddressCity: "Mumbai",
      branchAddressDistrict: "Mumbai",
      branchAddressState: "Maharashtra",
      branchAddressPincode: "400021",
      lat: "18.92952",
      long: "72.821444",
      contactFirstName: "Ashok",
      contactLastName: "Kumar",
      contactMobile: "+912240176990",
      contactEmail: "ashok.kumar@lic.com",
      contactGstNumber: "22AAAAA0000A1Z5",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const ltInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "L&T General Insurance Company Limited\n",
      displayName: " LT\n",
      branchCode: "1",
      branchAddressBuildingName: "Plot No-177",
      branchAddressBuildingAddress: "Yogakshema",
      branchAddressStreet: "Nariman Point",
      branchAddressCity: "Mumbai",
      branchAddressDistrict: "Mumbai",
      branchAddressState: "Maharashtra",
      branchAddressPincode: "400021",
      lat: "18.92952",
      long: "72.821444",
      contactFirstName: "Ashok",
      contactLastName: "Kumar",
      contactMobile: "+912240176990",
      contactEmail: "ashok.kumar@lic.com",
      contactGstNumber: "22AAAAA0000A1Z5",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const religareInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "Religare Health Insurance Co. Ltd\n",
      displayName: " religare\n",
      branchCode: "1",
      branchAddressBuildingName: "Plot No-177",
      branchAddressBuildingAddress: "Yogakshema",
      branchAddressStreet: "Nariman Point",
      branchAddressCity: "Mumbai",
      branchAddressDistrict: "Mumbai",
      branchAddressState: "Maharashtra",
      branchAddressPincode: "400021",
      lat: "18.92952",
      long: "72.821444",
      contactFirstName: "Ashok",
      contactLastName: "Kumar",
      contactMobile: "+912240176990",
      contactEmail: "ashok.kumar@lic.com",
      contactGstNumber: "22AAAAA0000A1Z5",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const indiaFirstInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "IndiaFirst Life Insurance Company Limited\n",
      displayName: " India_First\n",
      branchCode: "1",
      branchAddressBuildingName: "Plot No-177",
      branchAddressBuildingAddress: "Yogakshema",
      branchAddressStreet: "Nariman Point",
      branchAddressCity: "Mumbai",
      branchAddressDistrict: "Mumbai",
      branchAddressState: "Maharashtra",
      branchAddressPincode: "400021",
      lat: "18.92952",
      long: "72.821444",
      contactFirstName: "Ashok",
      contactLastName: "Kumar",
      contactMobile: "+912240176990",
      contactEmail: "ashok.kumar@lic.com",
      contactGstNumber: "22AAAAA0000A1Z5",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const maxBupaInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "MaxBupa Health Insurance Co.Ltd\n",
      displayName: "  Max_Bupa\n",
      branchCode: "1",
      branchAddressBuildingName: "Plot No-177",
      branchAddressBuildingAddress: "Yogakshema",
      branchAddressStreet: "Nariman Point",
      branchAddressCity: "Mumbai",
      branchAddressDistrict: "Mumbai",
      branchAddressState: "Maharashtra",
      branchAddressPincode: "400021",
      lat: "18.92952",
      long: "72.821444",
      contactFirstName: "Ashok",
      contactLastName: "Kumar",
      contactMobile: "+912240176990",
      contactEmail: "ashok.kumar@lic.com",
      contactGstNumber: "22AAAAA0000A1Z5",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const bajajAllianzInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "Bajaj Allianz General Insurance Co. Ltd.\n",
      displayName: "Bajaj_Allianz\n",
      branchCode: "1",
      branchAddressBuildingName: "Plot No-177",
      branchAddressBuildingAddress: "Yogakshema",
      branchAddressStreet: "Nariman Point",
      branchAddressCity: "Mumbai",
      branchAddressDistrict: "Mumbai",
      branchAddressState: "Maharashtra",
      branchAddressPincode: "400021",
      lat: "18.92952",
      long: "72.821444",
      contactFirstName: "Ashok",
      contactLastName: "Kumar",
      contactMobile: "+912240176990",
      contactEmail: "ashok.kumar@lic.com",
      contactGstNumber: "22AAAAA0000A1Z5",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const sbiInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "SBI General Insurance Company Limited\n",
      displayName: "SBI",
      branchCode: "1",
      branchAddressBuildingName: "Plot No-177",
      branchAddressBuildingAddress: "Yogakshema",
      branchAddressStreet: "Nariman Point",
      branchAddressCity: "Mumbai",
      branchAddressDistrict: "Mumbai",
      branchAddressState: "Maharashtra",
      branchAddressPincode: "400021",
      lat: "18.92952",
      long: "72.821444",
      contactFirstName: "Ashok",
      contactLastName: "Kumar",
      contactMobile: "+912240176990",
      contactEmail: "ashok.kumar@lic.com",
      contactGstNumber: "22AAAAA0000A1Z5",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const libertyInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "Liberty General Insurance Limited\n",
      displayName: "Liberty\n",
      branchCode: "1",
      branchAddressBuildingName: "Plot No-177",
      branchAddressBuildingAddress: "Yogakshema",
      branchAddressStreet: "Nariman Point",
      branchAddressCity: "Mumbai",
      branchAddressDistrict: "Mumbai",
      branchAddressState: "Maharashtra",
      branchAddressPincode: "400021",
      lat: "18.92952",
      long: "72.821444",
      contactFirstName: "Ashok",
      contactLastName: "Kumar",
      contactMobile: "+912240176990",
      contactEmail: "ashok.kumar@lic.com",
      contactGstNumber: "22AAAAA0000A1Z5",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const avivaInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "Aviva Life Insurance Company India Ltd\n",
      displayName: "Aviva",
      branchCode: "1",
      branchAddressBuildingName: "Plot No-177",
      branchAddressBuildingAddress: "Yogakshema",
      branchAddressStreet: "Nariman Point",
      branchAddressCity: "Mumbai",
      branchAddressDistrict: "Mumbai",
      branchAddressState: "Maharashtra",
      branchAddressPincode: "400021",
      lat: "18.92952",
      long: "72.821444",
      contactFirstName: "Ashok",
      contactLastName: "Kumar",
      contactMobile: "+912240176990",
      contactEmail: "ashok.kumar@lic.com",
      contactGstNumber: "22AAAAA0000A1Z5",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const adityaInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "Aditya Birla Health Insurance Co. Limited\n",
      displayName: "Aditya",
      branchCode: "1",
      branchAddressBuildingName: "Plot No-177",
      branchAddressBuildingAddress: "Yogakshema",
      branchAddressStreet: "Nariman Point",
      branchAddressCity: "Mumbai",
      branchAddressDistrict: "Mumbai",
      branchAddressState: "Maharashtra",
      branchAddressPincode: "400021",
      lat: "18.92952",
      long: "72.821444",
      contactFirstName: "Ashok",
      contactLastName: "Kumar",
      contactMobile: "+912240176990",
      contactEmail: "ashok.kumar@lic.com",
      contactGstNumber: "22AAAAA0000A1Z5",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const cignaInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "ManipalCigna Health Insurance Company Limited\n",
      displayName: "Cigna\n",
      branchCode: "1",
      branchAddressBuildingName: "Plot No-177",
      branchAddressBuildingAddress: "Yogakshema",
      branchAddressStreet: "Nariman Point",
      branchAddressCity: "Mumbai",
      branchAddressDistrict: "Mumbai",
      branchAddressState: "Maharashtra",
      branchAddressPincode: "400021",
      lat: "18.92952",
      long: "72.821444",
      contactFirstName: "Ashok",
      contactLastName: "Kumar",
      contactMobile: "+912240176990",
      contactEmail: "ashok.kumar@lic.com",
      contactGstNumber: "22AAAAA0000A1Z5",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const shikharInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "Shikhar Insurance Co Ltd\n",
      displayName: "Shikhar",
      branchCode: "1",
      branchAddressBuildingName: "Plot No-177",
      branchAddressBuildingAddress: "Yogakshema",
      branchAddressStreet: "Nariman Point",
      branchAddressCity: "Mumbai",
      branchAddressDistrict: "Mumbai",
      branchAddressState: "Maharashtra",
      branchAddressPincode: "400021",
      lat: "18.92952",
      long: "72.821444",
      contactFirstName: "Ashok",
      contactLastName: "Kumar",
      contactMobile: "+912240176990",
      contactEmail: "ashok.kumar@lic.com",
      contactGstNumber: "22AAAAA0000A1Z5",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const goDigitInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "Go Digit General Insurance Limited\n",
      displayName: "GoDigit",
      branchCode: "1",
      branchAddressBuildingName: "Plot No-177",
      branchAddressBuildingAddress: "Yogakshema",
      branchAddressStreet: "Nariman Point",
      branchAddressCity: "Mumbai",
      branchAddressDistrict: "Mumbai",
      branchAddressState: "Maharashtra",
      branchAddressPincode: "400021",
      lat: "18.92952",
      long: "72.821444",
      contactFirstName: "Ashok",
      contactLastName: "Kumar",
      contactMobile: "+912240176990",
      contactEmail: "ashok.kumar@lic.com",
      contactGstNumber: "22AAAAA0000A1Z5",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const rahejaInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "Raheja QBE General Insurance Company Limited\n",
      displayName: "Raheja",
      branchCode: "1",
      branchAddressBuildingName: "Plot No-177",
      branchAddressBuildingAddress: "Yogakshema",
      branchAddressStreet: "Nariman Point",
      branchAddressCity: "Mumbai",
      branchAddressDistrict: "Mumbai",
      branchAddressState: "Maharashtra",
      branchAddressPincode: "400021",
      lat: "18.92952",
      long: "72.821444",
      contactFirstName: "Ashok",
      contactLastName: "Kumar",
      contactMobile: "+912240176990",
      contactEmail: "ashok.kumar@lic.com",
      contactGstNumber: "22AAAAA0000A1Z5",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const magmaInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "Magma HDI General Insurance Company LTD\n",
      displayName: "Magma",
      branchCode: "1",
      branchAddressBuildingName: "Plot No-177",
      branchAddressBuildingAddress: "Yogakshema",
      branchAddressStreet: "Nariman Point",
      branchAddressCity: "Mumbai",
      branchAddressDistrict: "Mumbai",
      branchAddressState: "Maharashtra",
      branchAddressPincode: "400021",
      lat: "18.92952",
      long: "72.821444",
      contactFirstName: "Ashok",
      contactLastName: "Kumar",
      contactMobile: "+912240176990",
      contactEmail: "ashok.kumar@lic.com",
      contactGstNumber: "22AAAAA0000A1Z5",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const dhflInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "Navi General Insurance Limited\n",
      displayName: "DHFL",
      branchCode: "1",
      branchAddressBuildingName: "Plot No-177",
      branchAddressBuildingAddress: "Yogakshema",
      branchAddressStreet: "Nariman Point",
      branchAddressCity: "Mumbai",
      branchAddressDistrict: "Mumbai",
      branchAddressState: "Maharashtra",
      branchAddressPincode: "400021",
      lat: "18.92952",
      long: "72.821444",
      contactFirstName: "Ashok",
      contactLastName: "Kumar",
      contactMobile: "+912240176990",
      contactEmail: "ashok.kumar@lic.com",
      contactGstNumber: "22AAAAA0000A1Z5",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const edelweissInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "Edelweiss General Insurance Company Limited\n",
      displayName: "Edelweiss",
      branchCode: "1",
      branchAddressBuildingName: "Plot No-177",
      branchAddressBuildingAddress: "Yogakshema",
      branchAddressStreet: "Nariman Point",
      branchAddressCity: "Mumbai",
      branchAddressDistrict: "Mumbai",
      branchAddressState: "Maharashtra",
      branchAddressPincode: "400021",
      lat: "18.92952",
      long: "72.821444",
      contactFirstName: "Ashok",
      contactLastName: "Kumar",
      contactMobile: "+912240176990",
      contactEmail: "ashok.kumar@lic.com",
      contactGstNumber: "22AAAAA0000A1Z5",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const insuranceCompanies = [
      niaInsuranceCompany,
      relianceGeneralInsuranceCompany,
      oicInsuranceCompany,
      uiicInsuranceCompany,
      nicInsuranceCompany,
      iciciInsuranceCompany,
      cholamandalamInsuranceCompany,
      royalSundaramInsuranceCompany,
      iffcoTokioInsuranceCompany,
      hdfcErgoInsuranceCompany,
      licInsuranceCompany,
      hdfcErgoHealthInsuranceCompany,
      futureGeneraliInsuranceCompany,
      bharathiAXAInsuranceCompany,
      relianceLifeInsuranceCompany,
      universalSampoInsuranceCompany,
      starHealthInsuranceCompany,
      ltInsuranceCompany,
      religareInsuranceCompany,
      indiaFirstInsuranceCompany,
      maxBupaInsuranceCompany,
      bajajAllianzInsuranceCompany,
      sbiInsuranceCompany,
      libertyInsuranceCompany,
      avivaInsuranceCompany,
      adityaInsuranceCompany,
      cignaInsuranceCompany,
      shikharInsuranceCompany,
      goDigitInsuranceCompany,
      rahejaInsuranceCompany,
      magmaInsuranceCompany,
      dhflInsuranceCompany,
      edelweissInsuranceCompany
    ];

    const customerAmitHr = {
      uuid: uuidv4(),
      empid: amitCorporateHR.empid,
      userUuid: amitHRNcl.uuid,
      corporateUuid: NclCorporate.uuid,
      firstName: "Amit",
      lastName: "K",
      gender: "M",
      email: "amitk@wpiro.com",
      addressBuildingName: "Address Line 1",
      addressBuildingAddress: "Apartment 1",
      addressStreet: "Street one",
      addressCity: "Hyderabad",
      addressDistrict: "Hyderabad",
      addressState: "telangana",
      addressPincode: "500036",
      lat: "12.345678",
      long: "77.123456",
      contactFirstName: "Contact",
      contactLastName: "01",
      mobile: "+ 911234567890",
      contactEmail: "email@gmail.com",
      dob: "1970-01-01",
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const customerApvsdlD04 = {
      uuid: uuidv4(),
      empid: "APVSDLD04",
      userUuid: userApvsdld04Ncl.uuid,
      corporateUuid: NclCorporate.uuid,
      firstName: "Jyothi",
      lastName: "Reddy",
      gender: "F",
      email: "jyothireddy@wpiro.com",
      addressBuildingName: "Address Line 1",
      addressBuildingAddress: "Apartment 1",
      addressStreet: "Street one",
      addressCity: "Hyderabad",
      addressDistrict: "Hyderabad",
      addressState: "telangana",
      addressPincode: "500042",
      lat: "12.345678",
      long: "77.123456",
      contactFirstName: "Contact",
      contactLastName: "01",
      mobile: "+ 911234567890",
      contactEmail: "jyothir@gmail.com",
      dob: "1970-01-01",
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const customerApegdls151 = {
      uuid: uuidv4(),
      empid: "APEGDLS151",
      userUuid: userApegdls151Ncl.uuid,
      corporateUuid: NclCorporate.uuid,
      firstName: "Venkateswarulu",
      lastName: "D",
      gender: "M",
      email: "emp22@wipro.com",
      addressBuildingName: "Address Line 12",
      addressBuildingAddress: "Apartment 987",
      addressStreet: "Street two",
      addressCity: "Bangalore",
      addressDistrict: "Bangalore",
      addressState: "Karnataka",
      addressPincode: "560102",
      lat: "12.345678",
      long: "77.123456",
      contactFirstName: "Contact",
      contactLastName: "last name",
      mobile: "+ 911234567890",
      contactEmail: "email@gmail.com ",
      dob: "1974-03-02",
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const customerUser6Customer = {
      uuid: uuidv4(),
      empid: "100005",
      userUuid: user6CustomerNcl.uuid,
      corporateUuid: NclCorporate.uuid,
      firstName: "emp",
      lastName: "12",
      gender: "F",
      email: "emp12@wipro.com",
      addressBuildingName: "Address Line 12",
      addressBuildingAddress: "Apartment 987",
      addressStreet: "Street two",
      addressCity: "Bangalore",
      addressDistrict: "Bangalore",
      addressState: "Karnataka",
      addressPincode: "560102",
      lat: "12.345678",
      long: "77.123456",
      contactFirstName: "Contact",
      contactLastName: "last name",
      mobile: "+911234567890",
      contactEmail: "email@gmail.com",
      dob: "1973-02-21",
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const customerUser8HR = {
      uuid: uuidv4(),
      empid: user8CorporateHR.empid,
      userUuid: user8HRInnovaxion.uuid,
      corporateUuid: tcsCorporate.uuid,
      firstName: "emp",
      lastName: "23",
      gender: "M",
      email: "emp23@dxc.com",
      addressBuildingName: "Address Line 12",
      addressBuildingAddress: "Apartment 987",
      addressStreet: "Street two",
      addressCity: "Bangalore",
      addressDistrict: "Bangalore",
      addressState: "Karnataka",
      addressPincode: "560102",
      lat: "12.345678",
      long: "77.123456",
      contactFirstName: "Contact",
      contactLastName: "last name",
      mobile: "+911234567890",
      contactEmail: "email@gmail.com",
      dob: "1975-04-22",
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const customers = [customerAmitHr, customerApegdls151, customerUser6Customer, customerUser8HR, customerApvsdlD04];

    const dependentMotherCustomerApegdls151 = {
      uuid: uuidv4(),
      dependentOnCustomerUuid: customerApegdls151.uuid,
      corporateUuid: NclCorporate.uuid,
      relationship: "mother",
      firstName: "Dependent",
      lastName: "1",
      gender: "F",
      addressBuildingName: null,
      addressBuildingAddress: "Viliyatthu Illam",
      addressStreet: "4 th Main, 5 th Cross, BEL Layout, Vidyaranyapura",
      addressCity: "Bengaluru ",
      addressDistrict: "Bengaluru Urban ",
      addressState: "Karnataka ",
      addressPincode: "560035 ",
      lat: "13.083959",
      long: "77.5624813",
      contactFirstName: "Self",
      contactLastName: "Self",
      mobile: null,
      contactEmail: null,
      dob: "1941-01-01",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const dependentFatherCustomerApegdls151 = {
      uuid: uuidv4(),
      dependentOnCustomerUuid: customerApegdls151.uuid,
      corporateUuid: NclCorporate.uuid,
      relationship: "father",
      firstName: "Dependent",
      lastName: "2",
      gender: "M",
      addressBuildingName: "Viliyatthu Illam",
      addressBuildingAddress: "4th Main, 5th Cross, BEL Layout",
      addressStreet: "Vidyaranyapura",
      addressCity: "Bengaluru",
      addressDistrict: "Bengaluru Urban",
      addressState: "Karnataka",
      addressPincode: "560035",
      lat: "13.083959",
      long: "77.5624813",
      contactFirstName: "Self",
      contactLastName: "Self",
      mobile: null,
      contactEmail: null,
      dob: "1933-02-01",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const dependentSpouseCustomerApvsdlD04 = {
      uuid: uuidv4(),
      dependentOnCustomerUuid: customerApvsdlD04.uuid,
      corporateUuid: NclCorporate.uuid,
      relationship: "spouse",
      firstName: "Lakshmi",
      lastName: "V",
      gender: "F",
      addressBuildingName: "Viliyatthu Illam",
      addressBuildingAddress: "4th Main, 5th Cross, BEL Layout",
      addressStreet: "Vidyaranyapura",
      addressCity: "Bengaluru",
      addressDistrict: "Bengaluru Urban",
      addressState: "Karnataka",
      addressPincode: "560035",
      lat: "13.083959",
      long: "77.5624813",
      contactFirstName: "Self",
      contactLastName: "Self",
      mobile: null,
      contactEmail: null,
      dob: "1933-02-01",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const dependentSonCustomerApvsdlD04 = {
      uuid: uuidv4(),
      dependentOnCustomerUuid: customerApvsdlD04.uuid,
      corporateUuid: NclCorporate.uuid,
      relationship: "father",
      firstName: "Dependent",
      lastName: "2",
      gender: "M",
      addressBuildingName: "Viliyatthu Illam",
      addressBuildingAddress: "4th Main, 5th Cross, BEL Layout",
      addressStreet: "Vidyaranyapura",
      addressCity: "Bengaluru",
      addressDistrict: "Bengaluru Urban",
      addressState: "Karnataka",
      addressPincode: "560035",
      lat: "13.083959",
      long: "77.5624813",
      contactFirstName: "Self",
      contactLastName: "Self",
      contactMobile: null,
      contactEmail: null,
      dob: "1933-02-01",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const dependentDaughterCustomerApvsdlD04 = {
      uuid: uuidv4(),
      dependentOnCustomerUuid: customerApvsdlD04.uuid,
      corporateUuid: NclCorporate.uuid,
      relationship: "father",
      firstName: "Dependent",
      lastName: "2",
      gender: "M",
      addressBuildingName: "Viliyatthu Illam",
      addressBuildingAddress: "4th Main, 5th Cross, BEL Layout",
      addressStreet: "Vidyaranyapura",
      addressCity: "Bengaluru",
      addressDistrict: "Bengaluru Urban",
      addressState: "Karnataka",
      addressPincode: "560035",
      lat: "13.083959",
      long: "77.5624813",
      contactFirstName: "Self",
      contactLastName: "Self",
      mobile: null,
      contactEmail: null,
      dob: "1933-02-01",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const dependents = [
      dependentMotherCustomerApegdls151, dependentFatherCustomerApegdls151,
      dependentSpouseCustomerApvsdlD04, dependentSonCustomerApvsdlD04, dependentDaughterCustomerApvsdlD04
    ];

    const NclUiicPolicy = {
      uuid: uuidv4(),
      tpaUuid: fhplTpa.uuid,
      corporateUuid: NclCorporate.uuid,
      insuranceCompanyUuid: uiicInsuranceCompany.uuid,
      policyId: "556004501910000053",
      fromDate: "2020-03-01",
      toDate: "2021-02-28",
      policyYear: "2020-21",
      familyDefinition: "4- Self+Spouse+two children+two parents or Parents in laws",
      numberOfFamilies: "2",
      numberOfDependents: '4',
      sumInsured: 1000000.00,
      premiumPerFamily: 500000.00,
      premiumPerDependent: 200000.00,
      opd: 'Yes',
      maternityCover: 'Maternity Cover Description goes here.',
      maternityLimit: 'unlimited',
      babyCoverDayOne: 'Yes',
      preExistingCover: 'No',
      firstYearExclusions: 'Yes',
      secondYearExclusions: 'Yes',
      congenitalDiseasesInternal: 'Yes',
      congenitalDiseasesExternal: 'Yes',
      corporateBufferAndConditions: 'corporate Buffer and Conditions description goes here.',
      categories: 'A, B, C, D',
      roomRentLimits: 'Room rent limits description goes here.',
      copay: '500.00',
      parentalSubLimit: '10000.00',
      parentalCopay: '100.00',
      opdLimit: '100000.00',
      appendicitis: '100000.00',
      hernia: '100000.00',
      arthiritis: '100000.00',
      digestiveDisorders: '100000.00',
      cataract: '100000.00',
      gallBladderAndHisterectomy: '100000.00',
      kneeReplacement: '100000.00',
      jointReplacementIncludingVertrebalJoints: '100000.00',
      treatmentForKidneyStones: '100000.00',
      piles: '100000.00',
      hydrocele: '100000.00',
      lasikSurgery: '100000.00',
      wellnessProgram: 'Wellness program description goes here.',
      helpdeskSchedule: 'Helpdesk schedule description goes here.',
      visistaSpoc1Name: 'Krishnakumar Menon',
      visistaSpoc1Designation: 'Exective',
      visistaSpoc1Email: 'krishnakumar@visista.com',
      visistaSpoc1Mobile: '+911234567890',
      visistaSpoc2Name: 'Radhakumari C',
      visistaSpoc2Designation: 'Manager',
      visistaSpoc2Email: 'radhakumari@visistacom',
      visistaSpoc2Mobile: '+911234567890',
      visistaSpoc3Name: 'Aniruddh Venkatesh',
      visistaSpoc3Designation: 'Director',
      visistaSpoc3Email: 'aniruddh@visista.com',
      visistaSpoc3Mobile: '+919876543210',
      tpaSpoc1Name: 'Md Saleem',
      tpaSpoc1Designation: 'Executive',
      tpaSpoc1Email: 'mdsaleem@tpa.com',
      tpaSpoc1Mobile: '+919876543210',
      tpaSpoc2Name: 'George Matthew',
      tpaSpoc2Designation: 'Manager',
      tpaSpoc2Email: 'goerge@tpa.com',
      tpaSpoc2Mobile: '+919876543210',
      tpaSpoc3Name: 'Amarpreet Singh',
      tpaSpoc3Designation: 'Director',
      tpaSpoc3Email: 'amarpreet@tpa.com',
      tpaSpoc3Mobile: '+919876543210',
      clientSpoc1Empid: 'policy1clientspoc1empid',
      clientSpoc1Name: 'Shubha Singhal',
      clientSpoc1Email: 'shubha@client.com',
      clientSpoc1Designation: 'Executive',
      clientSpoc1Mobile: '+919876543210',
      clientSpoc2Empid: 'policy1clientspoc2empid',
      clientSpoc2Name: 'Venkateshwara Rao',
      clientSpoc2Designation: 'Manager',
      clientSpoc2Email: 'venkat@client.com',
      clientSpoc2Mobile: '+919876543210',
      clientSpoc3Empid: 'policy1clientspoc3empid',
      clientSpoc3Name: 'Ayyappa Goud',
      clientSpoc3Designation: 'Director',
      clientSpoc3Email: 'ayyappa@client.com',
      clientSpoc3Mobile: '+919876543210',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const tcsHdfcPolicy = {
      uuid: uuidv4(),
      tpaUuid: mediAssistTpa.uuid,
      corporateUuid: tcsCorporate.uuid,
      insuranceCompanyUuid: hdfcErgoInsuranceCompany.uuid,
      policyId: "LIC223456",
      fromDate: "2020-03-01",
      toDate: "2021-02-28",
      policyYear: "2020-21",
      familyDefinition: "4- Self+Spouse+two children+two parents or Parents in laws",
      numberOfFamilies: "2",
      numberOfDependents: '4',
      sumInsured: 1000000.00,
      premiumPerFamily: 500000.00,
      premiumPerDependent: 200000.00,
      opd: 'Yes',
      maternityCover: 'Maternity Cover Description goes here.',
      maternityLimit: '100000.00',
      babyCoverDayOne: 'Yes',
      preExistingCover: 'No',
      firstYearExclusions: 'Yes',
      secondYearExclusions: 'Yes',
      congenitalDiseasesInternal: 'Yes',
      congenitalDiseasesExternal: 'Yes',
      corporateBufferAndConditions: 'corporate Buffer and Conditions description goes here.',
      categories: 'A, B, C, D',
      roomRentLimits: 'Room rent limits description goes here.',
      copay: '500.00',
      parentalSubLimit: '10000.00',
      parentalCopay: '100.00',
      opdLimit: '100000.00',
      appendicitis: '100000.00',
      hernia: '100000.00',
      arthiritis: '100000.00',
      digestiveDisorders: '100000.00',
      cataract: '100000.00',
      gallBladderAndHisterectomy: '100000.00',
      kneeReplacement: '100000.00',
      jointReplacementIncludingVertrebalJoints: '100000.00',
      treatmentForKidneyStones: '100000.00',
      piles: '100000.00',
      hydrocele: '100000.00',
      lasikSurgery: '100000.00',
      wellnessProgram: 'Wellness program description goes here.',
      helpdeskSchedule: 'Helpdesk schedule description goes here.',
      visistaSpoc1Name: 'Krishnakumar Menon',
      visistaSpoc1Designation: 'Exective',
      visistaSpoc1Email: 'krishnakumar@visista.com',
      visistaSpoc1Mobile: '+911234567890',
      visistaSpoc2Name: 'Radhakumari C',
      visistaSpoc2Designation: 'Manager',
      visistaSpoc2Email: 'radhakumari@visistacom',
      visistaSpoc2Mobile: '+911234567890',
      visistaSpoc3Name: 'Aniruddh Venkatesh',
      visistaSpoc3Designation: 'Director',
      visistaSpoc3Email: 'aniruddh@visista.com',
      visistaSpoc3Mobile: '+919876543210',
      tpaSpoc1Name: 'Md Saleem',
      tpaSpoc1Designation: 'Executive',
      tpaSpoc1Email: 'mdsaleem@tpa.com',
      tpaSpoc1Mobile: '+919876543210',
      tpaSpoc2Name: 'George Matthew',
      tpaSpoc2Designation: 'Manager',
      tpaSpoc2Email: 'goerge@tpa.com',
      tpaSpoc2Mobile: '+919876543210',
      tpaSpoc3Name: 'Amarpreet Singh',
      tpaSpoc3Designation: 'Director',
      tpaSpoc3Email: 'amarpreet@tpa.com',
      tpaSpoc3Mobile: '+919876543210',
      clientSpoc1Empid: 'policy2clientspoc1empid',
      clientSpoc1Name: 'Shubha Singhal',
      clientSpoc1Email: 'shubha@client.com',
      clientSpoc1Designation: 'Executive',
      clientSpoc1Mobile: '+919876543210',
      clientSpoc2Empid: 'policy2clientspoc2empid',
      clientSpoc2Name: 'Venkateshwara Rao',
      clientSpoc2Designation: 'Manager',
      clientSpoc2Email: 'venkat@client.com',
      clientSpoc2Mobile: '+919876543210',
      clientSpoc3Empid: 'policy2clientspoc3empid',
      clientSpoc3Name: 'Ayyappa Goud',
      clientSpoc3Designation: 'Director',
      clientSpoc3Email: 'ayyappa@client.com',
      clientSpoc3Mobile: '+919876543210',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const tcsLicPolicy = {
      uuid: uuidv4(),
      tpaUuid: mediAssistTpa.uuid,
      corporateUuid: tcsCorporate.uuid,
      insuranceCompanyUuid: hdfcErgoInsuranceCompany.uuid,
      policyId: "5005002819P116559324",
      fromDate: "2020-03-01",
      toDate: "2021-02-28",
      policyYear: "2020-21",
      familyDefinition: "4- Self+Spouse+two children+two parents or Parents in laws",
      numberOfFamilies: "2",
      numberOfDependents: '4',
      sumInsured: 1000000.00,
      premiumPerFamily: 500000.00,
      premiumPerDependent: 200000.00,
      opd: 'Yes',
      maternityCover: 'Maternity Cover Description goes here.',
      maternityLimit: '100000.00',
      babyCoverDayOne: 'Yes',
      preExistingCover: 'No',
      firstYearExclusions: 'Yes',
      secondYearExclusions: 'Yes',
      congenitalDiseasesInternal: 'Yes',
      congenitalDiseasesExternal: 'Yes',
      corporateBufferAndConditions: 'corporate Buffer and Conditions description goes here.',
      categories: 'A, B, C, D',
      roomRentLimits: 'Room rent limits description goes here.',
      copay: '500.00',
      parentalSubLimit: '10000.00',
      parentalCopay: '100.00',
      opdLimit: '100000.00',
      appendicitis: '100000.00',
      hernia: '100000.00',
      arthiritis: '100000.00',
      digestiveDisorders: '100000.00',
      cataract: '100000.00',
      gallBladderAndHisterectomy: '100000.00',
      kneeReplacement: '100000.00',
      jointReplacementIncludingVertrebalJoints: '100000.00',
      treatmentForKidneyStones: '100000.00',
      piles: '100000.00',
      hydrocele: '100000.00',
      lasikSurgery: '100000.00',
      wellnessProgram: 'Wellness program description goes here.',
      helpdeskSchedule: 'Helpdesk schedule description goes here.',
      visistaSpoc1Name: 'Krishnakumar Menon',
      visistaSpoc1Designation: 'Exective',
      visistaSpoc1Email: 'krishnakumar@visista.com',
      visistaSpoc1Mobile: '+911234567890',
      visistaSpoc2Name: 'Radhakumari C',
      visistaSpoc2Designation: 'Manager',
      visistaSpoc2Email: 'radhakumari@visistacom',
      visistaSpoc2Mobile: '+911234567890',
      visistaSpoc3Name: 'Aniruddh Venkatesh',
      visistaSpoc3Designation: 'Director',
      visistaSpoc3Email: 'aniruddh@visista.com',
      visistaSpoc3Mobile: '+919876543210',
      tpaSpoc1Name: 'Md Saleem',
      tpaSpoc1Designation: 'Executive',
      tpaSpoc1Email: 'mdsaleem@tpa.com',
      tpaSpoc1Mobile: '+919876543210',
      tpaSpoc2Name: 'George Matthew',
      tpaSpoc2Designation: 'Manager',
      tpaSpoc2Email: 'goerge@tpa.com',
      tpaSpoc2Mobile: '+919876543210',
      tpaSpoc3Name: 'Amarpreet Singh',
      tpaSpoc3Designation: 'Director',
      tpaSpoc3Email: 'amarpreet@tpa.com',
      tpaSpoc3Mobile: '+919876543210',
      clientSpoc1Empid: 'policy3clientspoc1empid',
      clientSpoc1Name: 'Shubha Singhal',
      clientSpoc1Email: 'shubha@client.com',
      clientSpoc1Designation: 'Executive',
      clientSpoc1Mobile: '+919876543210',
      clientSpoc2Empid: 'policy3clientspoc2empid',
      clientSpoc2Name: 'Venkateshwara Rao',
      clientSpoc2Designation: 'Manager',
      clientSpoc2Email: 'venkat@client.com',
      clientSpoc2Mobile: '+919876543210',
      clientSpoc3Empid: 'policy3clientspoc3empid',
      clientSpoc3Name: 'Ayyappa Goud',
      clientSpoc3Designation: 'Director',
      clientSpoc3Email: 'ayyappa@client.com',
      clientSpoc3Mobile: '+919876543210',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const policies = [NclUiicPolicy, tcsHdfcPolicy, tcsLicPolicy];

    const cancerAilment = {
      uuid: uuidv4(), name: "cancer", description: "Description of Cancer",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const cataractAilment = {
      uuid: uuidv4(), name: "Cataract", description: "Eye surgical procedure",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const ailments = [cancerAilment, cataractAilment];

    const apolloHydHospital = {
      uuid: uuidv4(),
      hospitalId: 1,
      tpaUuid: fhplTpa.uuid,
      insuranceCompanyUuid: uiicInsuranceCompany.uuid,
      branchCode: 1,
      name: "Apollo Hospitals",
      addressBuildingName: "Apollo Health City Jubilee Hills",
      addressBuildingAddress: "Jubilee Hills,",
      addressStreet: "",
      addressCity: "Hyderabad",
      addressDistrict: "Hyderabad",
      addressState: "Telangana",
      addressPincode: "500033",
      lat: "12.123456",
      long: "77.123456",
      contactFirstName: "Contact",
      contactLastName: "Name",
      contactMobile: "+914023607530",
      contactEmail: "apollohealthcityhyd@apollohospitals.com",
      contactGstNumber: "AA1234567890AEZ",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const fortisBangaloreHospital = {
      uuid: uuidv4(),
      hospitalId: 2,
      tpaUuid: mediAssistTpa.uuid,
      insuranceCompanyUuid: uiicInsuranceCompany.uuid,
      branchCode: 2,
      name: "Fortis Hospitals",
      addressBuildingName: "Fortis Hospital Bannerghatta Road",
      addressBuildingAddress: "154, 9, Bannerghatta Main Rd",
      addressStreet: "Opposite IIM, Sahyadri Layout, Panduranga Nagar",
      addressCity: "Bengaluru",
      addressDistrict: "Bengaluru",
      addressState: "Karnataka",
      addressPincode: "560076",
      lat: "12.123456",
      long: "77.123456",
      contactFirstName: "Contact",
      contactLastName: "Name",
      contactMobile: "+919663367253",
      contactEmail: "care.bng@fortishealthcare.com",
      contactGstNumber: "AA1234567890AEZ",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const hospitals = [apolloHydHospital, fortisBangaloreHospital];

    const policyAilmentMappings = [
      {
        uuid: uuidv4(), policyUuid: NclUiicPolicy.uuid, ailmentUuid: cancerAilment.uuid,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        uuid: uuidv4(), policyUuid: tcsHdfcPolicy.uuid, ailmentUuid: cataractAilment.uuid,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        uuid: uuidv4(), policyUuid: tcsLicPolicy.uuid, ailmentUuid: cataractAilment.uuid,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    return argon2.hash('pass')
    .then(p => {
      users.forEach(u => {
        u.password = p;
      });
      console.log('Seeding BrokingCompanies');
      return queryInterface.bulkInsert('BrokingCompanies', brokingCompanies);
    })
    .then(ignoreResult => {
      console.log('Seeding Corporates');
      return queryInterface.bulkInsert('Corporates', corporates);
    })
    .then(ignoreResult => {
      console.log('Seeding Users');
      return queryInterface.bulkInsert('Users', users);
    })
    .then(result => {
      console.log(`${JSON.stringify(result)}`);
      console.log('Seeding Executives');
      return queryInterface.bulkInsert('Executives', executives);
    })
    .then(ignoreResult => {
      console.log('Seeding ExecutiveCorporateMappings');
      return queryInterface.bulkInsert('ExecutiveCorporateMappings', executiveCorporateMappings);
    })
    .then(ignoreResult => {
      console.log('Seeding CorporateHRs');
      return queryInterface.bulkInsert('CorporateHRs', corporateHRs);
    })
    .then(ignoreResult => {
      console.log('Seeding CorpoTPAsrateHRs');
      return queryInterface.bulkInsert('TPAs', tpas);
    })
    .then(ignoreResult => {
      console.log('Seeding InsuranceCompanies');
      return queryInterface.bulkInsert('InsuranceCompanies', insuranceCompanies);
    })
    .then(ignoreResult => {
      console.log('Seeding Customers');
      return queryInterface.bulkInsert('Customers', customers);
    })
    .then(ignoreResult => {
      console.log('Seeding Dependents');
      return queryInterface.bulkInsert('Dependents', dependents);
    })
    .then(ignoreResult => {
      console.log('Seeding Policies');
      return queryInterface.bulkInsert('Policies', policies);
    })
    .then(ignoreResult => {
      console.log('Seeding NetworkHospitals');
      return queryInterface.bulkInsert('NetworkHospitals', hospitals);
    })
    .then(ignoreResult => {
      console.log('Seeding Ailments');
      return queryInterface.bulkInsert('Ailments', ailments);
    })
    .then(ignoreResult => {
      console.log('Seeding PolicyAilmentMappings');
      return queryInterface.bulkInsert('PolicyAilmentMappings', policyAilmentMappings);
    })
    .then(ignoreResult => {
      console.log('All UP migrations completed.');
    })
    .catch(e => {
      console.log(e);
    });
  },

  down: (queryInterface, ignoreSequelize) => {
    if (!allowedNodeEnv.includes(env)) {
      return new Promise((resolve, ignoreReject) => {
        console.log(`This seeder works only in ${JSON.stringify(allowedNodeEnv)} environments`);
        resolve(true);
      });
    }

    return queryInterface.bulkDelete('PolicyAilmentMappings', null, {})
    .then(ignoreResult => {
      return queryInterface.bulkDelete('Ailments', null, {});
    })
    .then(ignoreResult => {
      return queryInterface.bulkDelete('NetworkHospitals', null, {});
    })
    .then(ignoreResult => {
      return queryInterface.bulkDelete('Policies', null, {});
    })
    .then(ignoreResult => {
      return queryInterface.bulkDelete('Dependents', null, {});
    })
    .then(ignoreResult => {
      return queryInterface.bulkDelete('Customers', null, {});
    })
    .then(ignoreResult => {
      return queryInterface.bulkDelete('InsuranceCompanies', null, {});
    })
    .then(ignoreResult => {
      return queryInterface.bulkDelete('TPAs', null, {});
    })
    .then(ignoreResult => {
      return queryInterface.bulkDelete('CorporateHRs', null, {});
    })
    .then(ignoreResult => {
      return queryInterface.bulkDelete('ExecutiveCorporateMappings', null, {});
    })
    .then(ignoreResult => {
      return queryInterface.bulkDelete('Executives', null, {});
    })
    .then(ignoreResult => {
      return queryInterface.bulkDelete('Users', null, {});
    })
    .then(ignoreResult => {
      return queryInterface.bulkDelete('Corporates', null, {});
    })
    .then(ignoreResult => {
      return queryInterface.bulkDelete('BrokingCompanies', null, {});
    })
    .then(ignoreResult => {
      console.log('All DOWN migrations completed.')
    })
    .catch(e => {
      console.log(e);
    });
  }
};
