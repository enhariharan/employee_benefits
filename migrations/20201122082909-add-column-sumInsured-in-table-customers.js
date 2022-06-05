'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Customers',
      'sumInsured',
      {
        type: Sequelize.DECIMAL(15,2),
      }
    );
  },

  down: (queryInterface, ignoreSequelize) => {
    return queryInterface.removeColumn('Customers', 'sumInsured');
  }
};
