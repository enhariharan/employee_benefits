'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Corporates', {
      uuid: {
        allowNull: false,
        unique: true,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      companyName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      displayName: {
        type: Sequelize.STRING
      },
      branchCode: {
        type: Sequelize.STRING
      },
      branchAddressBuildingName: {
        type: Sequelize.STRING
      },
      branchAddressBuildingAddress: {
        allowNull: false,
        type: Sequelize.STRING
      },
      branchAddressStreet: {
        type: Sequelize.STRING
      },
      branchAddressCity: {
        allowNull: false,
        type: Sequelize.STRING
      },
      branchAddressDistrict: {
        type: Sequelize.STRING
      },
      branchAddressState: {
        allowNull: false,
        type: Sequelize.STRING
      },
      branchAddressPincode: {
        allowNull: false,
        type: Sequelize.STRING
      },
      lat: {
        type: Sequelize.DECIMAL(10, 6)
      },
      long: {
        type: Sequelize.DECIMAL(10, 8)
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
      contactGstNumber: {
        type: Sequelize.STRING
      },
      active: {
        allowNull: false,
        defaultValue: true,
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });
  },
  down: (queryInterface, ignoreSequelize) => {
    return queryInterface.dropTable('Corporates');
  }
};
