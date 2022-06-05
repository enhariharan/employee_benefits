'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const TABLE = 'Dependents';
    const COLUMN_S = 'status';
    const ATTRIBUTES_S = {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'created',
    };
    const COLUMN_AT = 'approvalType';
    const ATTRIBUTES_AT = {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'addition',
    };
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn(TABLE, COLUMN_S, ATTRIBUTES_S, {transaction: t}),
        queryInterface.addColumn(TABLE, COLUMN_AT, ATTRIBUTES_AT, {transaction: t})
      ]);
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      const TABLE = 'Dependents';
      const COLUMN_S = 'status';
      const COLUMN_AT = 'approvalType';
      return Promise.all([
        queryInterface.removeColumn(TABLE, COLUMN_S, {transaction: t}),
        queryInterface.removeColumn(TABLE, COLUMN_AT, {transaction: t})
      ]);
    })
  }
};
