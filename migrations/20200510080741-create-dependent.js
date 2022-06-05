'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Dependents', {
      uuid: {
        allowNull: false,
        unique: true,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      dependentOnCustomerUuid: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Customers',
          key: 'uuid'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      relationship: {
        allowNull: false,
        type: Sequelize.STRING
      },
      firstName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      gender: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      mobile: {
        type: Sequelize.STRING
      },
      addressBuildingName: {
        type: Sequelize.STRING
      },
      addressBuildingAddress: {
        type: Sequelize.STRING
      },
      addressStreet: {
        type: Sequelize.STRING
      },
      addressCity: {
        type: Sequelize.STRING
      },
      addressDistrict: {
        type: Sequelize.STRING
      },
      addressState: {
        type: Sequelize.STRING
      },
      addressPincode: {
        type: Sequelize.STRING
      },
      lat: {
        type: Sequelize.DECIMAL(10,6)
      },
      long: {
        type: Sequelize.DECIMAL(10,8)
      },
      contactFirstName: {
        type: Sequelize.STRING
      },
      contactLastName: {
        type: Sequelize.STRING
      },
      contactMobile: {
        type: Sequelize.STRING
      },
      contactEmail: {
        type: Sequelize.STRING
      },
      dob: {
        allowNull: false,
        type: Sequelize.DATE
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
    return queryInterface.dropTable('Dependents');
  }
};
