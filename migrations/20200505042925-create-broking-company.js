'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('BrokingCompanies', {
      uuid: {
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
      contactGstNumber: {
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
    return queryInterface.dropTable('BrokingCompanies');
  }
};
