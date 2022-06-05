'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Dependents',
      'sumInsured',
      {
        type: Sequelize.DECIMAL(15,2),
      }
    );
  },

  down: (queryInterface, ignoreSequelize) => {
    return queryInterface.removeColumn('Dependents', 'sumInsured');
  }
};
