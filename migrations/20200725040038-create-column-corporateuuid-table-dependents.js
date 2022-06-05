'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Dependents',
      'corporateUuid',
      {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Corporates',
          key: 'uuid'
        }
      }, {logging: console.log}
    );
  },

  down: (queryInterface, ignoreSequelize) => {
    return queryInterface.removeColumn('Dependents', 'corporateUuid');
  }
};
