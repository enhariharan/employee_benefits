'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('FamilyDefinitions', {
      uuid: {
        allowNull: false,
        unique: true,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      policyUuid: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Policies',
          key: 'uuid'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      numOfFamilies: {
        type: Sequelize.INTEGER
      },
      numOfDependents: {
        type: Sequelize.INTEGER
      },
      categories: {
        type: Sequelize.STRING
      },
      sumInsured: {
        allowNull: false,
        type: Sequelize.DECIMAL(15,2)
      },
      premiumPerFamily: {
        allowNull: false,
        type: Sequelize.DECIMAL(15,2)
      },
      premiumPerDependent: {
        allowNull: false,
        type: Sequelize.DECIMAL(15,2)
      },
      coPay: {
        allowNull: false,
        type: Sequelize.DECIMAL(15,2)
      },
      parentalSubLimit: {
        allowNull: false,
        type: Sequelize.DECIMAL(15,2)
      },
      parentalCoPay: {
        allowNull: false,
        type: Sequelize.DECIMAL(15,2)
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
    });
  },
  down: (queryInterface, ignoreSequelize) => {
    return queryInterface.dropTable('FamilyDefinitions');
  }
};
