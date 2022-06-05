'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Claims', {
      uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        autoIncrement: false,
        primaryKey: true
      },
      claimId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      policyUuid: {
        type: Sequelize.UUID,
        allowNull: false,
        // references: {model:'Policies', key: 'uuid'} // TODO: Commented temporarily. Bring back after demo.
      },
      customerUuid: {
        type: Sequelize.UUID,
        allowNull: false,
        // references: {model:'Customers', key: 'uuid'} // TODO: Commented temporarily. Bring back after demo.
      },
      ailmentUuid: {
        type: Sequelize.UUID,
        allowNull: false,
        // references: {model:'Ailments', key: 'uuid'} // TODO: Commented temporarily. Bring back after demo.
      },
      corporateUuid: { // Taken from CustomerUuid and pasted here.
        type: Sequelize.UUID,
        allowNull: false,
        // references: {model:'Corporates', key: 'uuid'} // TODO: Commented temporarily. Bring back after demo.
      },
      corporateName: { // the corporate name taken from corporateUuid must be pasted here.
        type: Sequelize.STRING,
        allowNull: false
      },
      policyId: { // the policyId taken from policyUuid must be pasted here.
        type: Sequelize.STRING,
        allowNull: false
      },
      patientName: { // the 'FirstName LastName' taken from patientUuid must be pasted here.
        type: Sequelize.STRING,
        allowNull: false
      },
      relationship: { // Dependent relationship taken from patientUuid. Must be "self" if patientUuid is customerUuid.
        type: Sequelize.STRING,
        allowNull: false
      },
      employeeName: { // "FirstName Lastname" taken from customerUuid.
        type: Sequelize.STRING,
        allowNull: false
      },
      empid: { // empid taken from customerUuid.
        type: Sequelize.STRING,
        allowNull: false
      },
      hospitalName: { // taken from networkHospitalUuid or nonNetworkHospitalUuid whichever is non-null.
        type: Sequelize.STRING,
        allowNull: false
      },
      address: { // taken from customerUuid.
        type: Sequelize.STRING,
        allowNull: false
      },
      ailmentName: { // taken from ailmentUuid.
        type: Sequelize.STRING(500),
        allowNull: false
      },
      treatmentType: {
        type: Sequelize.STRING(500),
        allowNull: false
      },
      cashless: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      reimbursement: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      dateOfHospitalization: {
        type: Sequelize.DATE,
        allowNull: false
      },
      dateOfAdmission: {
        type: Sequelize.DATE
      },
      dateOfDischarge: {
        type: Sequelize.DATE
      },
      dateOfSettlement: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false
      },
      initialEstimate: {
        type: Sequelize.DECIMAL(15,2),
        defaultValue: 0
      },
      amountSettled: {
        type: Sequelize.DECIMAL(15,2),
        defaultValue: 0
      },
      amountApproved: {
        type: Sequelize.DECIMAL(15,2),
        defaultValue: 0
      },
      amountDisallowed: {
        type: Sequelize.DECIMAL(15,2),
        defaultValue: 0
      },
      denialReason: {
        type: Sequelize.STRING(5000),
        defaultValue: 0
      },
      disallowanceReason: {
        type: Sequelize.STRING(5000),
        defaultValue: 0
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
    }, {
      timestamps: true
    });
  },
  down: (queryInterface, ignoreSequelize) => {
    return queryInterface.dropTable('Claims');
  }
};
