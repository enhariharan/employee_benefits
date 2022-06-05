'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const TABLE = 'Claims';
    const COLUMN_AGE = 'age';
    const COLUMN_INSURER_NAME = 'insurerName';
    const COLUMN_CLAIM_REGISTERED_DATE = 'claimRegisteredDate';
    const COLUMN_HOSPITAL_CITY = 'hospitalCity';
    const COLUMN_HOSPITAL_STATE = 'hospitalState';
    const COLUMN_PAID_AMOUNT = 'paidAmount';
    const COLUMN_PAYMENT_DATE = 'dateOfPayment';
    const COLUMN_AILMENT_DESC = 'ailmentDescription';
    const ATTRIBUTES_STRING = {
      type: Sequelize.STRING
    };
    const ATTRIBUTES_AILMENT_DESC = {
      type: Sequelize.TEXT
    };
    const ATTRIBUTES_AMOUNT = {
      type: Sequelize.DECIMAL(15,2)
    }; 
    const ATTRIBUTES_DATE = {
      type: Sequelize.DATE
    }; 

    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn(TABLE, COLUMN_AGE, ATTRIBUTES_STRING, {transaction: t}),
        queryInterface.addColumn(TABLE, COLUMN_INSURER_NAME, ATTRIBUTES_STRING, {transaction: t}),
        queryInterface.addColumn(TABLE, COLUMN_CLAIM_REGISTERED_DATE, ATTRIBUTES_DATE, {transaction: t}),
        queryInterface.addColumn(TABLE, COLUMN_HOSPITAL_CITY, ATTRIBUTES_STRING, {transaction: t}),
        queryInterface.addColumn(TABLE, COLUMN_HOSPITAL_STATE, ATTRIBUTES_STRING, {transaction: t}),
        queryInterface.addColumn(TABLE, COLUMN_PAID_AMOUNT, ATTRIBUTES_AMOUNT, {transaction: t}),
        queryInterface.addColumn(TABLE, COLUMN_PAYMENT_DATE, ATTRIBUTES_DATE, {transaction: t}),
        queryInterface.addColumn(TABLE, COLUMN_AILMENT_DESC, ATTRIBUTES_AILMENT_DESC, {transaction: t})

      ]);
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      const TABLE = 'Claims';
      const COLUMN_AGE = 'age';
      const COLUMN_INSURER_NAME = 'insurerName';
      const COLUMN_CLAIM_REGISTERED_DATE = 'claimRegisteredDate';
      const COLUMN_HOSPITAL_CITY = 'hospitalCity';
      const COLUMN_HOSPITAL_STATE = 'hospitalState';
      const COLUMN_PAID_AMOUNT = 'paidAmount';
      const COLUMN_PAYMENT_DATE = 'dateOfPayment';
      const COLUMN_AILMENT_DESC = 'ailmentDescription';
      return Promise.all([
        queryInterface.removeColumn(TABLE, COLUMN_AGE, {transaction: t}),
        queryInterface.removeColumn(TABLE, COLUMN_INSURER_NAME, {transaction: t}),
        queryInterface.removeColumn(TABLE, COLUMN_CLAIM_REGISTERED_DATE, {transaction: t}),
        queryInterface.removeColumn(TABLE, COLUMN_HOSPITAL_CITY, {transaction: t}),
        queryInterface.removeColumn(TABLE, COLUMN_HOSPITAL_STATE, {transaction: t}),
        queryInterface.removeColumn(TABLE, COLUMN_PAID_AMOUNT, {transaction: t}),
        queryInterface.removeColumn(TABLE, COLUMN_PAYMENT_DATE, {transaction: t}),
        queryInterface.removeColumn(TABLE, COLUMN_AILMENT_DESC, {transaction: t})
      ]);
    })
    
  }
};
