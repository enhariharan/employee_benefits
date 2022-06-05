'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const TABLE = 'Customers';
    const COLUMN = 'approvalType';
    const ATTRIBUTES = {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'addition',
    };
    return queryInterface.sequelize.transaction(t => {
      return queryInterface.addColumn(TABLE, COLUMN, ATTRIBUTES, {transaction: t});
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      const TABLE = 'Customers';
      const COLUMN = 'approvalType';
      return queryInterface.removeColumn(TABLE, COLUMN, {transaction: t});
    })
  }
};
