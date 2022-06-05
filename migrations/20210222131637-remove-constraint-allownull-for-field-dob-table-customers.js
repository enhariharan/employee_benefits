'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const tableName = 'Customers';
    const attributeName = 'dob';
    const dataTypeOrOptions =
    {
      type: Sequelize.DATE,
      allowNull: true
    }
    return queryInterface.changeColumn(tableName, attributeName, dataTypeOrOptions);
  },

  down: (queryInterface, Sequelize) => {
    const tableName = 'Customers';
    const attributeName = 'dob';
    const dataTypeOrOptions =
      {
        type: Sequelize.DATE,
        allowNull: false
      }
    return queryInterface.changeColumn(tableName, attributeName, dataTypeOrOptions);
  }
};
