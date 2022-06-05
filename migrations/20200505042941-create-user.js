'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      uuid: {
        allowNull: false,
        unique: true,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      corporateUuid: {
        allowNull: true,
        type: Sequelize.UUID,
        references: {model: 'Corporates', key: 'uuid'},
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      brokingCompanyUuid: {
        allowNull: true,
        type: Sequelize.UUID,
        references: {model: 'BrokingCompanies', key: 'uuid'},
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      username: {
        allowNull: false,
        type: Sequelize.STRING
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING
      },
      role: {
        allowNull: false,
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      mobile: {
        type: Sequelize.STRING
      },
      active: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: true
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
    return queryInterface.dropTable('Users');
  }
};
