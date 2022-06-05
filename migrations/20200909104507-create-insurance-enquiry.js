'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('InsuranceEnquiries', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      employeeUuid: {
        type: Sequelize.UUID,
        allowNull: false
      },
      corporateUuid: {
        type: Sequelize.UUID,
        allowNull: false
      },
      executiveUuid: {
        type: Sequelize.UUID
      },
      insuranceType: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },      
      callBackRequestedTime: {
        allowNull: false,
        type: Sequelize.DATE
      },
      dateOfReport: {        
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      Comments: {
        type: Sequelize.TEXT
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
    return queryInterface.dropTable('InsuranceEnquiries');
  }
};