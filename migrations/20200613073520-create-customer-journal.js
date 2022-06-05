'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('CustomerJournals', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      field: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      changedByUserUuid: {
        type: Sequelize.UUID
      },
      changedByUsername: {
        type: Sequelize.STRING
      },
      oldValue: {
        type: Sequelize.STRING(5000)
      },
      newValue: {
        type: Sequelize.STRING(5000)
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
    return queryInterface.dropTable('CustomerJournals');
  }
};