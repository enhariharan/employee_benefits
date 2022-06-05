'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('DependentStateJournals', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      dependentUuid: {
        type: Sequelize.UUID
      },
      userUuid: {
        type: Sequelize.UUID
      }, 
      corporateUuid: {
        type: Sequelize.UUID
      },       
      changedByUserUuid: {
        type: Sequelize.UUID
      },     
      oldState: {
        type: Sequelize.STRING(30)
      },
      newState: {
        type: Sequelize.STRING(30)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },
  down: (queryInterface, ignoreSequelize) => {
    return queryInterface.dropTable('DependentStateJournals');
  }
};