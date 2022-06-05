const { v4: uuidv4 } = require('uuid');
const JWT = require('jsonwebtoken');
const jwtconfig = require('../../config/jwtconfig');
const argon2 = require('argon2');
const { BrokingCompany, Corporate, CorporateHR, Executive, User } = require('../../models');
const chai = require('chai');
const assert = require('assert');
const server = require('../../app');
const models = require('../../models')


// describe('/corporates Test Suite', () => {
//   var password = null;
//   const brokingCompany =
//   {
//     uuid: uuidv4(),
//     companyName: 'ABC Private Limited',
//     displayName: 'ABC',
//     branchCode: 'b000001',
//     branchAddressBuildingName: 'Building 1',
//     branchAddressBuildingAddress: 'Building 1, SEZ 1',
//     branchAddressStreet: 'Street 1, Off Highway 2',
//     branchAddressCity: 'Mumbai',
//     branchAddressDistrict: 'Mumbai',
//     branchAddressState: 'MH',
//     branchAddressPincode: '200021',
//     lat: 12.234567,
//     long: 70.123456,
//     contactFirstName: 'First',
//     contactLastName: 'Last',
//     contactMobile: '+911234567888',
//     contactEmail: 'e@company.com',
//     contactGstNumber: 'E12345678901234'
//   };
//   var users = [
//     {
//       uuid: uuidv4(),
//       username: 'manager1',
//       password: null,
//       role: "manager"
//     },
//     {
//       uuid: uuidv4(),
//       username: 'executive1',
//       password: null,
//       role: "executive"
//     },
//     {
//       uuid: uuidv4(),
//       username: 'customer1',
//       password: null,
//       role: "customer"
//     },
//     {
//       uuid: uuidv4(),
//       username: 'hr1',
//       password: null,
//       role: "hr"
//     }
//   ];
//   const corporates = [
//     {
//       uuid: uuidv4(),
//       companyName: "Wipro Technologies Pvt Ltd",
//       displayName: "Wipro",
//       branchCode: "1",
//       branchAddressBuildingName: "Wipro Limited",
//       branchAddressBuildingAddress: "Doddakannelli",
//       branchAddressStreet: "Sarjapur Road",
//       branchAddressCity: "Bengaluru",
//       branchAddressDistrict: "Bengaluru",
//       branchAddressState: "Karnataka",
//       branchAddressPincode: "560035",
//       lat: "12.909711",
//       long: "77.687124"
//     },
//     {
//       uuid: uuidv4(),
//       companyName: "Tata Consultancy Services",
//       displayName: "TCS",
//       branchCode: "1",
//       branchAddressBuildingName: "Wipro Limited",
//       branchAddressBuildingAddress: "Doddakannelli",
//       branchAddressStreet: "Sarjapur Road",
//       branchAddressCity: "Bengaluru",
//       branchAddressDistrict: "Bengaluru",
//       branchAddressState: "Karnataka",
//       branchAddressPincode: "560035",
//       lat: "12.909711",
//       long: "77.687124"
//     }
//   ];
//   const corporateHRs = [
//     {
//       uuid: uuidv4(),
//       empid: '100001',
//       corporateUuid: corporates[0].uuid,
//       userUuid: users[3].uuid,
//       firstName: 'John',
//       lastName: 'Smith',
//       email: 'jsmith@gmail.com',
//       mobile: '+911234567890',
//     }
//   ];
//   const customers = [
//     {
//       uuid: uuidv4(),
//       empid: '100002',
//       corporateUuid: corporates[0].uuid,
//       userUuid: users[2].uuid,
//       firstName: 'Jane',
//       lastName: 'Smith',
//       email: 'jasmith@gmail.com',
//       mobile: '+912234567890',
//     }
//   ];
//   const executives = [
//     {
//       uuid: uuidv4(),
//       empid: '100001',
//       brokingCompanyUuid: brokingCompany.uuid,
//       userUuid: users[0].uuid,
//       firstName: 'Manager',
//       lastName: 'Babu',
//       email: 'email1@gmail.com',
//       mobile: '+911234567890',
//       supervisorEmpid: '100000',
//     },
//     {
//       uuid: uuidv4(),
//       empid: '100002',
//       brokingCompanyUuid: brokingCompany.uuid,
//       userUuid: users[1].uuid,
//       firstName: 'Executive',
//       lastName: 'Babu',
//       email: 'email2@gmail.com',
//       mobile: '+919876543210',
//       supervisorEmpid: '100001',
//     },
//   ];
//
//   var jwts = [];
//
//   beforeEach('Setup Users and Corporates', done => {
//     argon2.hash('password')
//       .then(p => {
//         if (!p) {
//           throw 'Hashing password failed.';
//         }
//         password = p;
//         users[0].password = password;
//         users[1].password = password;
//         users[2].password = password;
//         users[3].password = password;
//
//         const managerJwt = JWT.sign(users[0], jwtconfig.secret);
//         const executiveJwt = JWT.sign(users[1], jwtconfig.secret);
//         const customerJwt = JWT.sign(users[2], jwtconfig.secret);
//         const hrJwt = JWT.sign(users[3], jwtconfig.secret);
//
//         jwts.push(managerJwt);
//         jwts.push(executiveJwt);
//         jwts.push(customerJwt);
//         jwts.push(hrJwt);
//
//         return CorporateHR.destroy({ logging: false, where: {} });
//       })
//       .then(ignoreVar => {return Corporate.destroy({ logging: false, where: {} });})
//       .then(ignoreVar => {return Executive.destroy({ logging: false, where: {} });})
//       .then(ignoreVar => {return User.destroy({ logging: false, where: {} });})
//       .then(ignoreVar => {return BrokingCompany.destroy({ logging: false, where: {} });})
//       .then(ignoreVar => {return BrokingCompany.bulkCreate([brokingCompany], { logging: false }); })
//       .then(ignoreVar => {return User.bulkCreate(users, { logging: false }); })
//       .then(ignoreVar => {return Executive.bulkCreate(executives); })
//       .then(ignoreVar => {return Corporate.bulkCreate(corporates, { logging: false }); })
//       .then(ignoreVar => {return CorporateHR.bulkCreate(corporateHRs, { logging: false }); })
//       .then(u => {
//         if (!u) { throw 'Creating new users and corporates failed.'; }
//         done();
//       })
//       .catch(e => { console.log(e); done(e); })
//   });
//
//   afterEach('Tear down Users and Corporates', done => {
//     Promise.all([
//       CorporateHR.destroy({ logging: false, where: {} }),
//       Corporate.destroy({ logging: false, where: {} }),
//       Executive.destroy({ logging: false, where: {} }),
//       User.destroy({ logging: false, where: {} }),
//       BrokingCompany.destroy({ logging: false, where: {} }),
//       ])
//       .then(ignoreVar => { done(); })
//       .catch(e => { console.log(e); });
//   });
//
//   it('Manager can query all active Corporates', done => {
//     chai.request(server)
//       .get('/corporates')
//       .set("Content-Type", "application/json")
//       .set("Authorization", jwts[0])
//       .end((err, res) => {
//         if (err) {
//           console.log('login failed.');
//           console.log(err);
//           done(err);
//         }
//         res.should.have.status(200);
//         assert(res.body.status === 200);
//         assert(res.body.errCode === 'Success');
//         assert(res.body.data);
//         assert(res.body.data.length === 2);
//         assert(res.body.data[0].corporate);
//         assert(res.body.data[0].corporate.uuid === corporates[0].uuid);
//         assert(res.body.data[1].corporate.uuid === corporates[1].uuid);
//         done();
//       });
//   });
//
//   it('Executive can query all active Corporates he/she manages', done => {
//     chai.request(server)
//       .get('/corporates')
//       .set("Content-Type", "application/json")
//       .set("Authorization", jwts[1])
//       .end((err, res) => {
//         if (err) { done(err); }
//         res.should.have.status(200);
//         assert(res.body.status === 200);
//         assert(res.body.errCode === 'Success');
//         assert(res.body.data);
//         assert(res.body.data.length === 2);
//         assert(res.body.data[0].corporate);
//         assert(res.body.data[0].corporate.uuid === corporates[0].uuid);
//         assert(res.body.data[1].corporate.uuid === corporates[1].uuid);
//         // assert(res.body.data[2].corporate.uuid === corporates[2].uuid);
//         // assert(res.body.data[3].corporate.uuid === corporates[3].uuid);
//         done();
//       });
//   });
//
//   it('HR can query the active Corporate he/she belongs to', done => {
//     chai.request(server)
//       .get('/corporates')
//       .set("Content-Type", "application/json")
//       .set("Authorization", jwts[3])
//       .end((err, res) => {
//         if (err) { done(err); }
//         res.should.have.status(200);
//         assert(res.body.status === 200);
//         assert(res.body.errCode === 'Success');
//         assert(res.body.data);
//         assert(res.body.data.uuid === corporates[0].uuid);
//         assert(res.body.data.companyName === corporates[0].companyName);
//         done();
//       });
//   });
//
//   it('Customer cannot Get Corporates', done => {
//     chai.request(server)
//       .get('/corporates')
//       .set("Content-Type", "application/json")
//       .set("Authorization", jwts[2])
//       .end((err, res) => {
//         if (err) { done(err); }
//         res.should.have.status(401);
//         assert(res.body.status === 401);
//         assert(res.body.errCode === 'EmptyOrInvalidJwtToken');
//         assert(res.body.message === 'Error in JWT token Or Invalid credentials Or Invalid role presented. You are not authorized to perform this operation.');
//         done();
//       });
//   });
// });
