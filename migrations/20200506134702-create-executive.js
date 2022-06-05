'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Executives', {
      uuid: {
        allowNull: false,
        unique: true,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      empid: {
        allowNull: false,
        type: Sequelize.STRING
      },
      brokingCompanyUuid: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'BrokingCompanies',
          key: 'uuid',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      userUuid: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'uuid'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      firstName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      mobile: {
        type: Sequelize.STRING
      },
      designation: { // can be "executive" or "manager" only
        allowNull: false,
        type: Sequelize.STRING
      },
      supervisorEmpid: {
        allowNull: false,
        type: Sequelize.STRING
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
      timestamps: true
    });
  },
  down: (queryInterface, ignoreSequelize) => {
    return queryInterface.dropTable('Executives');
  }
};
