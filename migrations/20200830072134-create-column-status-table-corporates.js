'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Corporates',
      'status',
      {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'new'
      }
    );
  },

  down: (queryInterface, ignoreSequelize) => {
    return queryInterface.removeColumn('Corporates', 'status');
  }
};
