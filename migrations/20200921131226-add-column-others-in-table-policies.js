'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Policies',
      'others',
      {
        type: Sequelize.STRING,
      }
    );
  },

  down: (queryInterface, ignoreSequelize) => {
    return queryInterface.removeColumn('Policies', 'others');
  }
};
