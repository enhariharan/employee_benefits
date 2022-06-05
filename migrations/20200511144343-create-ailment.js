'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Ailments', {
      uuid: {
        allowNull: false,
        unique: true,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      name: {
        allowNull: false,
        autoIncrement: false,
        type: Sequelize.STRING,
      },
      description: {
        allowNull: false,
        autoIncrement: false,
        type: Sequelize.STRING,
      },
      active: {
        allowNull: false,
        defaultValue: true,
        type: Sequelize.BOOLEAN
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
    }, {
      timestamps: true,
    });
  },
  down: (queryInterface, ignoreSequelize) => {
    return queryInterface.dropTable('Ailments');
  }
};
