'use strict';

module.exports = {
  up: (queryInterface, ignoreSequelize) => {
    const tableName = 'Claims';
    const attributeName = 'customerUuid';
    return queryInterface.removeColumn(tableName, attributeName);
  },

  down: (queryInterface, Sequelize) => {
    const table = 'Claims';
    const key = 'customerUuid';
    const attribute = {type: Sequelize.UUID};
    return queryInterface.addColumn(table, key, attribute);
  }
};
