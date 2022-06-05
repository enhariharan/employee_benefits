'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('CustomerStateJournals', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('CustomerStateJournals');
  }
};