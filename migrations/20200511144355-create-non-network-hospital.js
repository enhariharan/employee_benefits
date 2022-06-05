'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('NonNetworkHospitals', {
      uuid: {
        allowNull: false,
        unique: true,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      hospitalId: {
        allowNull: false,
        unique: true,
        type: Sequelize.INTEGER,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      branchCode: {
        type: Sequelize.STRING
      },
      addressBuildingName: {
        type: Sequelize.STRING
      },
      addressBuildingAddress: {
        allowNull: false,
        type: Sequelize.STRING
      },
      addressStreet: {
        type: Sequelize.STRING
      },
      addressCity: {
        allowNull: false,
        type: Sequelize.STRING
      },
      addressDistrict: {
        type: Sequelize.STRING
      },
      addressState: {
        allowNull: false,
        type: Sequelize.STRING
      },
      addressPincode: {
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
      levelOfCare: {
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
    return queryInterface.dropTable('NonNetworkHospitals');
  }
};
