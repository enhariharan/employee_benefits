'use strict';

const {v4: uuidv4} = require('uuid');
const argon2 = require('argon2');

const env = process.env.NODE_ENV || 'development';
const allowedNodeEnv = ['production'];

module.exports = {
  up: (queryInterface, ignoreSequelize) => {
    if (!allowedNodeEnv.includes(env)) { // This seeder is needed only in production
      return new Promise((resolve, ignoreReject) => {
        console.log(`This seeder works only in ${JSON.stringify(allowedNodeEnv)} environments`);
        resolve(true);
      });
    }

    const brokingCompany = {
      uuid: uuidv4(),
      companyName: 'Visista Insurance Broking Services Pvt Ltd',
      displayName: 'visista4u',
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
    const brokingCompanies = [brokingCompany];

    const password = 'vispass123';
    const adminUserLogin = {
      uuid: uuidv4(),
      username: 'admin',
      password: password,
      role: 'manager',
      corporateUuid: null,
      brokingCompanyUuid: brokingCompany.uuid,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const adminManager = {
      uuid: uuidv4(),
      empid: "100000",
      userUuid: adminUserLogin.uuid,
      brokingCompanyUuid: brokingCompany.uuid,
      firstName: "Admin",
      lastName: "",
      email: "ravi.k@mobhisure.com",
      mobile: "",
      supervisorEmpid: "",
      designation: "manager",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const executives = [adminManager];
    const users = [adminUserLogin];

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
      lat: "17.423929",
      long: "78.428102",
      contactFirstName: "",
      contactLastName: "",
      contactMobile: "1-800-425-4033",
      contactEmail: "info@fhpl.net",
      contactGstNumber: "36AAACF1740R1ZE",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const mediAssistTpa = {
      uuid: uuidv4(),
      tpaid: 'TPA_002',
      companyName: "Medi Assist India TPA Pvt Ltd",
      displayName: "Mediassist",
      branchCode: "2",
      branchAddressBuildingName: "Medi Assist India TPA Pvt Ltd",
      branchAddressBuildingAddress: "6-3-1192/1/1, 3rd Block, 2nd Floor, White House",
      branchAddressStreet: "Kundanbagh, Begumpet",
      branchAddressCity: "Hyderabad",
      branchAddressDistrict: "Hyderabad",
      branchAddressState: "Telengana",
      branchAddressPincode: "500026",
      lat: "17.435908",
      long: "78.45641",
      contactFirstName: "",
      contactLastName: "",
      contactMobile: "1-800-425-9449",
      contactEmail: "info@mediassist.in",
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
      branchAddressBuildingAddress: "The New India Assurance Co. Ltd.",
      branchAddressStreet: "#87, M.G.Road, Fort",
      branchAddressCity: "Mumbai",
      branchAddressDistrict: "Mumbai City",
      branchAddressState: "Maharashtra",
      branchAddressPincode: "400001",
      contactMobile: "1-800-209-1415",
      contactEmail: "tech.support@newindia.co.in",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const relianceGeneralInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "Reliance General Insurance Co. Ltd.",
      displayName: "Reliance_General",
      branchCode: "1",
      branchAddressBuildingName: "Reliance Centre",
      branchAddressBuildingAddress: "South wing, 4th Floor",
      branchAddressStreet: "Off Western Express Highway, Santacruz (East)",
      branchAddressCity: "Mumbai",
      branchAddressDistrict: "Mumbai City",
      branchAddressState: "Maharashtra",
      branchAddressPincode: "400055",
      contactMobile: "1-800-3009",
      contactEmail: "rgicl.services@relianceada.com",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const oicInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "The Oriental Insurance Co. Ltd.",
      displayName: "OIC",
      branchCode: "1",
      branchAddressBuildingName: "Oriental House",
      branchAddressBuildingAddress: "A-25/27",
      branchAddressStreet: "Asaf Ali Road",
      branchAddressCity: "New Delhi",
      branchAddressDistrict: "Central Delhi",
      branchAddressState: "Delhi",
      branchAddressPincode: "110002",
      contactMobile: "011-43659595",
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
      branchAddressStreet: "Nungambakkam High Road, IV Lane",
      branchAddressCity: "Chennai",
      branchAddressDistrict: "Chennai",
      branchAddressState: "Tamilnadu",
      branchAddressPincode: "600034",
      contactMobile: "+914428575200",
      contactEmail: "customercare@uiic.co.in",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const nicInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "National Insurance Co. Ltd.",
      displayName: "NIC",
      branchCode: "1",
      branchAddressBuildingName: "National Insurance Company Ltd.",
      branchAddressBuildingAddress: "3, Middleton Street",
      branchAddressStreet: "Prafulla Chandra Sen Sarani",
      branchAddressCity: "Kolkata",
      branchAddressDistrict: "Kolkata",
      branchAddressState: "West Bengal",
      branchAddressPincode: "700071",
      contactMobile: "+913322831705",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const iciciInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "ICICI Lombard General Insurance Co. Ltd.",
      displayName: "ICICI",
      branchCode: "1",
      branchAddressBuildingName: " ICICI Lombard House",
      branchAddressBuildingAddress: "414, P.Balu Marg",
      branchAddressStreet: "Off Veer Sawarkar Marg, Near Siddhivinayak Temple, Prabhadevi",
      branchAddressCity: "Mumbai",
      branchAddressDistrict: "Mumbai City",
      branchAddressState: "Maharashtra",
      branchAddressPincode: "400025",
      contactMobile: "1-800-2666",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const cholamandalamInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "Cholamandalam MS General Insurance Company Limited",
      displayName: " Cholamandalam",
      branchCode: "1",
      branchAddressBuildingName: "Cholamandalam MS General Insurance Company Limited",
      branchAddressBuildingAddress: "New No. 2, Old No. 234, Dare House, II Floor",
      branchAddressStreet: "N. S. C. Bose Road, Parrys",
      branchAddressCity: "Chennai",
      branchAddressDistrict: "Chennai",
      branchAddressState: "Tamilnadu",
      branchAddressPincode: "600001",
      contactMobile: "+914440445400",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const royalSundaramInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "Royal Sundaram General Insurance Company Limited",
      displayName: "Royal_Sundaram",
      branchCode: "1",
      branchAddressBuildingName: " Vishranthi Melaram Towers",
      branchAddressBuildingAddress: " No.2/319 , Rajiv Gandhi Salai (OMR)",
      branchAddressStreet: "Rajiv Gandhi Salai (OMR), Karapakkam",
      branchAddressCity: ", Chennai",
      branchAddressDistrict: "Chennai",
      branchAddressState: "Tamilnadu",
      branchAddressPincode: "600097",
      contactMobile: "+914471177117",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const iffcoTokioInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "IFFCO-TOKIO General Insurance Co. Ltd",
      displayName: "IFFCO_TOKIO",
      branchCode: "1",
      branchAddressBuildingName: " IFFCO Tower ",
      branchAddressBuildingAddress: "Plot No. 3, Sector 29",
      branchAddressStreet: "Sector 29",
      branchAddressCity: "Gurgaon",
      branchAddressDistrict: "Gurgaon",
      branchAddressState: "Haryana",
      branchAddressPincode: "122001",
      contactMobile: "1-800-103-5499",
      contactEmail: "support@iffcotokio.co.in",
      contactGstNumber: "22AAAAA0000A1Z5",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const hdfcErgoInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "HDFC Ergo General Insurance Company Limited",
      displayName: "HDFC_EGRO",
      branchCode: "2",
      branchAddressBuildingName: "HDFC Ergo General Insurance Company Limited",
      branchAddressBuildingAddress: "1st Floor, HDFC House, Backbay Reclamation",
      branchAddressStreet: "Parekh Marg, Churchgate",
      branchAddressCity: "Mumbai",
      branchAddressDistrict: "Mumbai",
      branchAddressState: "Maharashtra",
      branchAddressPincode: "400020",
      contactMobile: "+912262346234",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const licInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "LIC of India",
      displayName: "LIC",
      branchCode: "1",
      branchAddressBuildingName: "Plot No-177",
      branchAddressBuildingAddress: "Yogakshema Building",
      branchAddressStreet: "JB Temkar Marg, Nariman Point",
      branchAddressCity: "Mumbai",
      branchAddressDistrict: "Mumbai",
      branchAddressState: "Maharashtra",
      branchAddressPincode: "400021",
      contactMobile: "+912268276827",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const hdfcErgoHealthInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "HDFC ERGO Health Insurance Ltd",
      displayName: "AMHI",
      branchCode: "1",
      branchAddressBuildingName: "HDFC Ergo General Insurance Company Limited",
      branchAddressBuildingAddress: "1st Floor, HDFC House, Backbay Reclamation",
      branchAddressStreet: "Parekh Marg, Churchgate",
      branchAddressCity: "Mumbai",
      branchAddressDistrict: "Mumbai",
      branchAddressState: "Maharashtra",
      branchAddressPincode: "400020",
      contactMobile: "+912262346234",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const futureGeneraliInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "Future Generali India Insurance Co. Ltd",
      displayName: " Future_Generali",
      branchCode: "1",
      branchAddressBuildingName: "Indiabulls Finance Centre," + "," + "," + "Elphinstone Road, Prabhadevi (W), Mumbai - 400 013." + "Fax: 022-41514555, 022- 40976785.",
      branchAddressBuildingAddress: "Tower 3, 6th Floor, Senapati Bapat Marg",
      branchAddressStreet: "Elphinstone Road, Prabhadevi (W)",
      branchAddressCity: "Mumbai",
      branchAddressDistrict: "Mumbai",
      branchAddressState: "Maharashtra",
      branchAddressPincode: "400013",
      contactMobile: "1-800-220-233",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const bharathiAXAInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "Bharti AXA General Insurance Company Limited",
      displayName: "Bharathi_AXA",
      branchCode: "1",
      branchAddressBuildingName: "Osman Plaza",
      branchAddressBuildingAddress: "3rd Floor",
      branchAddressStreet: "Road No 1, Banjara Hills, Near Nagarjuna Circle",
      branchAddressCity: "Hyderabad",
      branchAddressDistrict: "Hyderabad",
      branchAddressState: "Telangana",
      branchAddressPincode: "500082",
      contactMobile: "+917304518623",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const relianceLifeInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "Reliance Nippon Life Insurance Company",
      displayName: " Reliance_Life",
      branchCode: "1",
      branchAddressBuildingName: "Reliance Center",
      branchAddressBuildingAddress: "5th Floor",
      branchAddressStreet: "Off Western Express Highway",
      branchAddressCity: "Mumbai",
      branchAddressDistrict: "Mumbai City",
      branchAddressState: "Maharashtra",
      branchAddressPincode: "400055",
      contactMobile: "1-800-102-1010",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const universalSampoInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "Universal Sompo General Insurance Co. Ltd.",
      displayName: " Universal_Sampo",
      branchCode: "1",
      branchAddressBuildingName: "Sangam Complex, 4th Floor, Unit No 401",
      branchAddressBuildingAddress: "Yogakshema",
      branchAddressStreet: "127, Andheri Kurla Road, Andheri (E)",
      branchAddressCity: "Mumbai",
      branchAddressDistrict: "Mumbai",
      branchAddressState: "Maharashtra",
      branchAddressPincode: "400059",
      contactMobile: "+912229211800",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const starHealthInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "Star Health and Allied Insurance Company Limited",
      displayName: "Star_Health",
      branchCode: "1",
      branchAddressBuildingName: "Star Health and Allied Insurance Company Limited",
      branchAddressBuildingAddress: "1, New Tank Street",
      branchAddressStreet: "Valluvar Kottam High Road, Nungambakkam",
      branchAddressCity: "Chennai",
      branchAddressDistrict: "Chennai",
      branchAddressState: "Tamilnadu",
      branchAddressPincode: "60034",
      contactMobile: "1800-102-4477",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const ltInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "L&T General Insurance Company Limited",
      displayName: " LT",
      branchCode: "1",
      branchAddressBuildingName: "L&T General Insurance Company Limited",
      branchAddressBuildingAddress: "Trade Centre, 6th Floor, 601-602",
      branchAddressStreet: "Bandra Kurla Complex, Bandra East",
      branchAddressCity: "Mumbai",
      branchAddressDistrict: "Mumbai",
      branchAddressState: "Maharashtra",
      branchAddressPincode: "400051",
      contactMobile: "1800-209-9930",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const religareInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "Religare Health Insurance Co. Ltd",
      displayName: " religare",
      branchCode: "1",
      branchAddressBuildingName: "Unitech Cyber Park, 6th Floor, Unit no 604-607",
      branchAddressBuildingAddress: "Tower C, Sector 39",
      branchAddressStreet: "Sector 39",
      branchAddressCity: "Gurgaon",
      branchAddressDistrict: "Gurgaon",
      branchAddressState: "Haryana",
      branchAddressPincode: "122001",
      contactMobile: "1-800-102-6655",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const indiaFirstInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "IndiaFirst Life Insurance Company Limited",
      displayName: " India_First",
      branchCode: "1",
      branchAddressBuildingName: "Nesco IT Park, Nesco Center",
      branchAddressBuildingAddress: "12th and 13th Floor, North [C] wing, Tower 4, ",
      branchAddressStreet: "Western Express Highway, Goregaon (East)",
      branchAddressCity: "Mumbai",
      branchAddressDistrict: "Mumbai",
      branchAddressState: "Maharashtra",
      branchAddressPincode: "400063",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const maxBupaInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "MaxBupa Health Insurance Co.Ltd",
      displayName: "  Max_Bupa",
      branchCode: "1",
      branchAddressBuildingName: "Mohan Cooperative Industrial Estate",
      branchAddressBuildingAddress: "B1/I2, Mohan Cooperative Industrial Estate",
      branchAddressStreet: ", Mathur Road",
      branchAddressCity: "New Delhi",
      branchAddressDistrict: "",
      branchAddressState: "Delhi",
      branchAddressPincode: "110044",
      contactMobile: "1860-500-8888",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const bajajAllianzInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "Bajaj Allianz General Insurance Co. Ltd.",
      displayName: "Bajaj_Allianz",
      branchCode: "1",
      branchAddressBuildingName: "Bajaj Allianz House",
      branchAddressBuildingAddress: "",
      branchAddressStreet: "Airport Road, Yerawada",
      branchAddressCity: "Pune",
      branchAddressDistrict: "Pune",
      branchAddressState: "Maharashtra",
      branchAddressPincode: "411006",
      contactMobile: "1800-209-5858",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const sbiInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "SBI General Insurance Company Limited",
      displayName: "SBI",
      branchCode: "1",
      branchAddressBuildingName: "Natraj",
      branchAddressBuildingAddress: "301",
      branchAddressStreet: "Junction of Western Express Highway & Andheri Kurla - Road, Andheri (East)",
      branchAddressCity: "Mumbai",
      branchAddressDistrict: "Mumbai",
      branchAddressState: "Maharashtra",
      branchAddressPincode: "400069",
      contactMobile: "1800-=22-1111",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const libertyInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "Liberty General Insurance Limited",
      displayName: "Liberty",
      branchCode: "1",
      branchAddressBuildingName: "Peninsula Business Park",
      branchAddressBuildingAddress: "Tower A, 10th floor",
      branchAddressStreet: "Ganpatrao Kadam Marg, Lower Parel",
      branchAddressCity: "Mumbai",
      branchAddressDistrict: "Mumbai",
      branchAddressState: "Maharashtra",
      branchAddressPincode: "400013",
      contactMobile: "1800-266-5844",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const avivaInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "Aviva Life Insurance Company India Ltd",
      displayName: "Aviva",
      branchCode: "1",
      branchAddressBuildingName: "Prakashdeep Building",
      branchAddressBuildingAddress: "2nd floor",
      branchAddressStreet: "7, Tolstoy Marg",
      branchAddressCity: "New Delhi",
      branchAddressDistrict: "New Delhi",
      branchAddressState: "Delhi",
      branchAddressPincode: "110030",
      contactMobile: "+91-124-2709000",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const adityaInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "Aditya Birla Health Insurance Co. Limited",
      displayName: "Aditya",
      branchCode: "1",
      branchAddressBuildingName: "GURU Raghavendraâ€'s Sri Parvata",
      branchAddressBuildingAddress: "Plot no ; 1285/A, 1st Floor, B Block",
      branchAddressStreet: "Road no - 1 & 64, Jubilee Hills",
      branchAddressCity: "Hyderabad",
      branchAddressDistrict: "Hyderabad",
      branchAddressState: "Telangana",
      branchAddressPincode: "500033",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const cignaInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "ManipalCigna Health Insurance Company Limited",
      displayName: "Cigna",
      branchCode: "1",
      branchAddressBuildingName: "Raheja Titanium",
      branchAddressBuildingAddress: "401/402, 4th Floor",
      branchAddressStreet: "off. Western Express Highway, Goregaon (E)",
      branchAddressCity: "Mumbai",
      branchAddressDistrict: "Mumbai",
      branchAddressState: "Maharashtra",
      branchAddressPincode: "400063",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const shikharInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "Shikhar Insurance Co Ltd",
      displayName: "Shikhar",
      branchCode: "1",
      branchAddressBuildingName: "Shikhar Biz Centre",
      branchAddressBuildingAddress: "Thapathali, Fifth to Seventh Floor",
      branchAddressStreet: "P.O. Box: 10692",
      branchAddressCity: "Kathmandu",
      branchAddressDistrict: "Kathmandu",
      branchAddressState: "Nepal",
      branchAddressPincode: "44611",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const goDigitInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "Go Digit General Insurance Limited",
      displayName: "GoDigit",
      branchCode: "1",
      branchAddressBuildingName: " GreenLife Insurance Broking Private Limited",
      branchAddressBuildingAddress: "A-4/B, 1st Floor, Rishi Tech Park",
      branchAddressStreet: "Near Unitech, New Town,",
      branchAddressCity: "Kolkata",
      branchAddressDistrict: "Kolkata",
      branchAddressState: "West Bengal",
      branchAddressPincode: "700156",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const rahejaInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "Raheja QBE General Insurance Company Limited",
      displayName: "Raheja",
      branchCode: "1",
      branchAddressBuildingName: "P&G Plaza",
      branchAddressBuildingAddress: "Ground Floor",
      branchAddressStreet: "Cardinal Gracious Road, Chakala, Andheri (E)",
      branchAddressCity: "Mumbai",
      branchAddressDistrict: "Mumbai",
      branchAddressState: "Maharashtra",
      branchAddressPincode: "400099",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const magmaInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "Magma HDI General Insurance Company LTD",
      displayName: "Magma",
      branchCode: "1",
      branchAddressBuildingName: "Anuj Chamber",
      branchAddressBuildingAddress: "4th Floor",
      branchAddressStreet: "24, Park Street",
      branchAddressCity: "Kolkata",
      branchAddressDistrict: "Kolkata",
      branchAddressState: "West Bengal",
      branchAddressPincode: "700016",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const dhflInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "Navi General Insurance Limited",
      displayName: "DHFL",
      branchCode: "1",
      branchAddressBuildingName: "Fulcrum",
      branchAddressBuildingAddress: "402,403 & 404, A & B Wing, 4th Floor",
      branchAddressStreet: "Sahar Road, Next to Hyatt Regency, Andheri (E)",
      branchAddressCity: "Mumbai",
      branchAddressDistrict: "Mumbai",
      branchAddressState: "Maharashtra",
      branchAddressPincode: "400099",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const edelweissInsuranceCompany = {
      uuid: uuidv4(),
      companyName: "Edelweiss General Insurance Company Limited",
      displayName: "Edelweiss",
      branchCode: "1",
      branchAddressBuildingName: "Kohinoor City Mall, Kohinoor City",
      branchAddressBuildingAddress: "5th Floor, Tower 3",
      branchAddressStreet: "Kirol Road, Kurla (W)",
      branchAddressCity: "Mumbai",
      branchAddressDistrict: "Mumbai",
      branchAddressState: "Maharashtra",
      branchAddressPincode: "400070",
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

    return argon2.hash(password)
    .then(p => {
      users.forEach(u => {u.password = p;});
      console.log('Seeding BrokingCompanies');
      return queryInterface.bulkInsert('BrokingCompanies', brokingCompanies)
    })
    .then(ignoreResult => {
      console.log('Seeding TPAs');
      return queryInterface.bulkInsert('TPAs', tpas);
    })
    .then(ignoreResult => {
      console.log('Seeding InsuranceCompanies');
      return queryInterface.bulkInsert('InsuranceCompanies', insuranceCompanies);
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
