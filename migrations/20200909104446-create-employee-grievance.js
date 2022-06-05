'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('EmployeeGrievances', {
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
      issueType: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      issueDescription: {
        type: Sequelize.TEXT
      },
      dateOfReport: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      dateOfDisclosure: {        
        type: Sequelize.DATE       
      },
      resolution: {
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
    return queryInterface.dropTable('EmployeeGrievances');
  }
};