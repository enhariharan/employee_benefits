"use strict";
const { Claim, Policy, BrokingCompany, Customer, Corporate, Dependent, CustomerStateJournal, DependentStateJournal, User } = require('../models');
const { Op } = require('sequelize');
const sequelize = require("sequelize");
const moment = require('moment');
const argon2 = require('argon2');
const mailHelper = require('../helpers/mailHelper');
const utilHelper = require('../helpers/utilHelper');
const appConfig = require('../config/appConfig');

const CLAIM_ANALYTICAL_ATTRIBUTES = [
  'claimId',
  'policyId',
  'empid',
  'dateOfHospitalization',
  'cashless',
  'reimbursement',
  'initialEstimate',
  'status',
  'dateOfSettlement',
  'amountSettled',
  'amountApproved',
  'amountDisallowed'
];

const getCorporateClaimAnalytics = (corporateUuid, policyId, startDate, endDate) => {
  return new Promise((resolve, reject) => {
    console.log(startDate);
    console.log(endDate);
    Claim.scope('defaultScope').findAll({
      where: {
        corporateUuid: corporateUuid,
        policyId: policyId,
        dateOfHospitalization: { [Op.between]: [moment(startDate, ['DD/MM/YYYY']).format('YYYY-MM-DD HH:mm:ss'), moment(endDate, ['DD/MM/YYYY']).format('YYYY-MM-DD HH:mm:ss')] }
      },
      attributes: CLAIM_ANALYTICAL_ATTRIBUTES
    })
    .then(claims => { resolve(claims); })
    .catch(err => { reject(err); })
  });
};


const getCorporatePolicyAnalytics = (corporateUuid, policyId, startDate, endDate) => {
  return new Promise((resolve, reject) => {
      Policy.scope('defaultScope').findAll({
        where: {
          corporateUuid: corporateUuid,
          policyId: policyId
        }
      })
      .then(policyData => {
        if(policyData && policyData.length){
          Customer.scope('defaultScope').findAll({
            where: {
              corporateUuid: corporateUuid,
              status: 'active'
            },
            attributes: ["uuid"]
          }).
          then(customersList => {
            let custUuids = [];
            customersList.forEach(cus => {
              custUuids.push(cus.dataValues.uuid);
            });           
            Dependent.count({
              where: {
                dependentOnCustomerUuid: { [Op.or]: custUuids },
                status: 'active'
              }
            })
            .then(depCount => {
              let status = ['active', 'inactive']
              CustomerStateJournal.scope('defaultScope').findAll({
                where: {
                  corporateUuid: corporateUuid,
                  newState: { [Op.or]: status },
                  createdAt: { [Op.between]: [moment(startDate, ['DD/MM/YYYY']).format('YYYY-MM-DD HH:mm:ss'), moment(endDate, ['DD/MM/YYYY']).format('YYYY-MM-DD HH:mm:ss')] }
                },
                attributes: ['newState']
              })
              .then(customerStatesData => { 
                  let customerStates = [];
                  customerStatesData.forEach(cus => {
                    customerStates.push(cus.dataValues.newState);
                  });               
                  DependentStateJournal.scope('defaultScope').findAll({
                    where: {
                      corporateUuid: corporateUuid,
                      newState: { [Op.or]: status },
                      createdAt: { [Op.between]: [moment(startDate, ['DD/MM/YYYY']).format('YYYY-MM-DD HH:mm:ss'), moment(endDate, ['DD/MM/YYYY']).format('YYYY-MM-DD HH:mm:ss')] }
                    },
                    attributes: ['newState']
                  })
                  .then(dependentStatesData => {
                    let dependentStates = [];
                    dependentStatesData.forEach(dep => {
                      dependentStates.push(dep.dataValues.newState);
                    });
                    Dependent.scope('defaultScope').findAll({
                      where: {
                        dependentOnCustomerUuid: { [Op.or]: custUuids },
                        status: 'active'
                      },
                      attributes: ['relationShip']
                    })
                    .then(dependentData => {                      
                      let policyInfo = policyData[0];
                      let dependentsRelation = [];
                      dependentData.forEach(dep => {
                        dependentsRelation.push(dep.dataValues.relationShip);
                      });
                      let addedCustomers = customerStates.filter((state) => {return state === 'active'}).length;
                      let deletedCustomers = customerStates.filter((state) => {return state === 'inactive'}).length;
                      let addedDependents = dependentStates.filter((state) => {return state === 'active'}).length;
                      let deletedDependents = dependentStates.filter((state) => {return state === 'inactive'}).length;
                      let initialPremium = 0; 
                      let currentDatePremium = 0;
                      let addedPremium = 0;
                      let deletedPremium = 0;
                      if(parseInt(policyInfo.premiumPerDependent)){
                        initialPremium = parseInt(parseInt(policyInfo.numberOfFamilies)*parseInt(policyInfo.premiumPerDependent)) + parseInt(parseInt(policyInfo.numberOfDependents)*parseInt(policyInfo.premiumPerDependent)); 
                        currentDatePremium = parseInt(parseInt(custUuids.length)*parseInt(policyInfo.premiumPerDependent)) + parseInt(parseInt(dependentsRelation.length)*parseInt(policyInfo.premiumPerDependent));
                        addedPremium = parseInt(parseInt(addedCustomers)*parseInt(policyInfo.premiumPerDependent)) + parseInt(parseInt(addedDependents)*parseInt(policyInfo.premiumPerDependent));
                        deletedPremium = parseInt(parseInt(deletedCustomers)*parseInt(policyInfo.premiumPerDependent)) + parseInt(parseInt(deletedDependents)*parseInt(policyInfo.premiumPerDependent));
                      } else {
                        initialPremium = parseInt(parseInt(policyInfo.numberOfFamilies)*parseInt(policyInfo.premiumPerFamily)); 
                        currentDatePremium = parseInt(parseInt(custUuids.length)*parseInt(policyInfo.premiumPerFamily));
                        addedPremium = parseInt(parseInt(addedCustomers)*parseInt(policyInfo.premiumPerFamily));
                        deletedPremium = parseInt(parseInt(deletedCustomers)*parseInt(policyInfo.premiumPerFamily));
                     }
                        let result = {
                        period: {
                          fromDate: policyInfo.fromDate,
                          toDate: policyInfo.toDate
                        },
                        premium: {
                          premium_initial: initialPremium,
                          premium_per_family: parseInt(policyInfo.premiumPerFamily),
                          permium_per_member: parseInt(policyInfo.premiumPerDependent),
                          premium_for_additions: addedPremium,
                          premium_for_deletions: deletedPremium,
                          total_premium_as_on_date: currentDatePremium
                        },
                        initial: {
                          employees: parseInt(policyInfo.numberOfFamilies),
                          dependents: parseInt(policyInfo.numberOfDependents)
                        },
                        current: {
                          employees: custUuids.length,
                          spouses: dependentsRelation.filter((rel) => {return rel.toLowerCase() === 'spouse'}).length,
                          childerns: dependentsRelation.filter((rel) => {return rel.toLowerCase() === 'son' || rel.toLowerCase() === 'daughter' }).length,
                          parents_or_inlaws: dependentsRelation.filter((rel) => {return rel.toLowerCase() === 'mother' || rel.toLowerCase() === 'father' }).length,
                        },
                        additions: {
                          employees : addedCustomers,
                          dependents: addedDependents
                        },
                        deletions: {
                          employees : deletedCustomers,
                          dependents: deletedDependents
                        }           
                      }
                      resolve({ success: true, message: result})
                    })
                    .catch(err => {
                      console.log(err);
                      reject(err);
                    })
                  })
                  .catch(err => {
                    console.log(err);
                    reject(err);
                  })
              })
              .catch(err => {
                console.log(err);
                reject(err);
              })
            })
            .catch(err => {
              console.log(err);
              reject(err);
            })
          })
          .catch(err => {
            console.log(err);
            reject(err);
          })
        } else {
          resolve({ success: false, message: "No Policy Details found" })
        }
      })
      .catch(err => {
        console.log(err);
        reject(err);
      })
  });
};


const hardRestPassword = (corporateUuid, empId, role) => {
  return new Promise((resolve, reject) => {
    if(role == 'hr'){
      Corporate.findOne({where: {uuid: corporateUuid}})
      .then(corpData => {
          User.findOne({where: {username: empId, corporateUuid: corporateUuid, role: role}})
          .then(userData => {
            if(userData){      
                if(userData.dataValues.email){
                  let res ={
                      empId: empId,
                      email: userData.dataValues.email
                  }
                  let password = utilHelper.generatePassword(8);                  
                  argon2.hash(password)
                  .then(passwordStr => {                   
                      User.update({password: passwordStr}, {where: {uuid: userData.dataValues.uuid}})
                      .then(ignore => {
                          let email_data = {
                            to_email : userData.dataValues.email,
                            new_password: password,
                            domain_name: 'http://www.'+appConfig.domain_name
                          }
                          if(role == 'hr'){
                            email_data.domain_name = 'http://'+corpData.dataValues.displayName+'.'+appConfig.domain_name;
                          }
                          mailHelper.sendHardPasswordResetEmail(email_data)
                          .then(ignore =>{
                            resolve({success: true, data: res});
                          }).catch(err => {
                            console.log(err);
                            reject(err);
                          })                        
                      }).catch(err => {
                        console.log(err);
                        reject(err);
                      })
                  }).catch(err => {
                    console.log(err);
                    reject(err);
                  })                
                  
                }else{
                  resolve({success: false, message: "User does not have email"})
                }
                
            }else{
                resolve({success: false, message: "No user details found"})
            }
          }).catch(err => {
            console.log(err);
            reject(err);
          })
      })
      .catch(err => {
        console.log(err);
        reject(err);
      })
    } else{
      BrokingCompany.findOne({where: {uuid: corporateUuid}})
      .then(corpData => {
          User.findOne({where: {username: empId, brokingCompanyUuid: corporateUuid, role: role}})
          .then(userData => {
            if(userData){      
                if(userData.dataValues.email){
                  let res ={
                      empId: empId,
                      email: userData.dataValues.email
                  }
                  let password = utilHelper.generatePassword(8);                  
                  argon2.hash(password)
                  .then(passwordStr => {                   
                      User.update({password: passwordStr}, {where: {uuid: userData.dataValues.uuid}})
                      .then(ignore => {
                          let email_data = {
                            to_email : userData.dataValues.email,
                            new_password: password,
                            domain_name: 'http://www.'+appConfig.domain_name
                          }                          
                          mailHelper.sendHardPasswordResetEmail(email_data)
                          .then(ignore =>{
                            resolve({success: true, data: res});
                          }).catch(err => {
                            console.log(err);
                            reject(err);
                          })                        
                      }).catch(err => {
                        console.log(err);
                        reject(err);
                      })
                  }).catch(err => {
                    console.log(err);
                    reject(err);
                  })                
                  
                }else{
                  resolve({success: false, message: "User does not have email"})
                }
                
            }else{
                resolve({success: false, message: "No user details found"})
            }
          }).catch(err => {
            console.log(err);
            reject(err);
          })
      })
      .catch(err => {
        console.log(err);
        reject(err);
      })
    }
  });



};

module.exports = {
  getCorporateClaimAnalytics: getCorporateClaimAnalytics,
  getCorporatePolicyAnalytics: getCorporatePolicyAnalytics,
  hardRestPassword:hardRestPassword 
}