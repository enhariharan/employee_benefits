"use strict";

const { Op } = require('sequelize');
const { Customer, Dependent, Policy, ExecutiveCorporateMapping } = require('../models');
const customerStatus = require('./employeeStatus');

const fetchPendingActions = (whereOptions, pendingActionCount) => {
    return new Promise(
        (resolve, reject) => {
            Customer.count({
                where: whereOptions
            })
            .then(empCount => {
                pendingActionCount.employeeActions = empCount;                
                return Dependent.count({ where: whereOptions });
            })
            .then(depCount => {
                pendingActionCount.dependentsActions = depCount;
                resolve(pendingActionCount);
            })
            .catch(err => {
                reject(err);
            });
        });

}

const getPendingActions = (user) => {    
    return new Promise(
        (resolve, reject) => {
            let pendingActionCount = {
                employeeActions: 0,
                dependentsActions: 0,
                policyActions: 0
            } 
            console.log('Authentication Success for '+ user.role);
            if (user.role === 'executive' || user.role === 'hr') {
                let whereOptions = {};
                if (user.role === 'executive') {
                    ExecutiveCorporateMapping.scope('defaultScope').findAll({where: {executiveUuid: user.uuid}})
                    .then(mapping => {
                      let corpIds = [];
                      mapping.forEach(ecm => {
                        corpIds.push(ecm.corporateUuid);
                      });
                      whereOptions.corporateUuid = {[Op.or]: corpIds};
                      whereOptions.approvalType = {[Op.not]: customerStatus.APPROVAL_TYPE_NONE};
                      return fetchPendingActions(whereOptions, pendingActionCount);
                    })
                    .then (result => {
                      resolve(result);
                    })
                    .catch(err => {
                      reject(err);
                    })
                } else {
                    whereOptions.corporateUuid = user.corporateUuid;
                    whereOptions.status = customerStatus.STATUS_CREATED;
                    fetchPendingActions(whereOptions, pendingActionCount)
                    .then (result =>{
                          resolve(result);
                    })
                    .catch(err => {
                        reject(err);
                    })
                }
            } else if (user.role === 'manager') {
                let whereOptions = {
                    status: 'created'
                };
                Policy.count({where: whereOptions})
                .then(policyCount => {
                    pendingActionCount.policyActions = policyCount;
                    resolve(pendingActionCount);
                })
                .catch(err => {
                    reject(err);
                })
            }
        });

};


module.exports = {
    getPendingActions: getPendingActions
}