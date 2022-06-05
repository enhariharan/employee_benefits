'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const TABLE = 'Customers';
    const COLUMN_DOJ = 'dateOfJoining';
    const ATTRIBUTES_DOJ = {
      type: Sequelize.DATE,
    };
    const COLUMN_DOE = 'dateOfExit';
    const ATTRIBUTES_DOE = {
      type: Sequelize.DATE,
    };
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn(TABLE, COLUMN_DOJ, ATTRIBUTES_DOJ, {transaction: t}),
        queryInterface.addColumn(TABLE, COLUMN_DOE, ATTRIBUTES_DOE, {transaction: t})
      ]);
    })
  },

  down: (queryInterface, ignoreSequelize) => {
    return queryInterface.sequelize.transaction(t => {
      const TABLE = 'Customers';
      const COLUMN_DOJ = 'dateOfJoining';
      const COLUMN_DOE = 'dateOfExit';
      return Promise.all([
        queryInterface.removeColumn(TABLE, COLUMN_DOE, {transaction: t}),
        queryInterface.removeColumn(TABLE, COLUMN_DOJ, {transaction: t})
      ]);
    });
  }
};
