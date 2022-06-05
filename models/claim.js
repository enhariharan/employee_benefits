'use strict';

module.exports = (sequelize, DataTypes) => {
  const Claim = sequelize.define('Claim', {
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      autoIncrement: false,
      primaryKey: true
    },
    claimId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    policyUuid: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    customerUuid: { //NOTE: DO NOT USE. https://gitlab.com/vvsanilkumar/employee_benefits/-/issues/67 removes this field.
      type: DataTypes.UUID,
      allowNull: false,
    },
    ailmentUuid: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    corporateUuid: { // Taken from CustomerUuid and pasted here.
      type: DataTypes.UUID,
      allowNull: false,
    },
    corporateName: { // the corporate name taken from corporateUuid must be pasted here.
      type: DataTypes.STRING,
      allowNull: false
    },
    policyId: { // the policyId taken from policyUuid must be pasted here.
      type: DataTypes.STRING,
      allowNull: false
    },
    patientName: { // the 'FirstName LastName' taken from patientUuid must be pasted here.
      type: DataTypes.STRING,
      allowNull: false
    },
    relationship: { // Dependent relationship taken from patientUuid. Must be "self" if patientUuid is customerUuid.
      type: DataTypes.STRING,
      allowNull: false
    },
    employeeName: { // "FirstName Lastname" taken from customerUuid.
      type: DataTypes.STRING,
      allowNull: false
    },
    empid: { // empid taken from customerUuid.
      type: DataTypes.STRING,
      allowNull: false
    },
    hospitalName: { // taken from networkHospitalUuid or nonNetworkHospitalUuid whichever is non-null.
      type: DataTypes.STRING,
      allowNull: false
    },
    address: { // taken from customerUuid.
      type: DataTypes.STRING,
      allowNull: false
    },
    ailmentName: { // taken from ailmentUuid.
      type: DataTypes.STRING(500),
      allowNull: false
    },
    treatmentType: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    cashless: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    reimbursement: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    dateOfHospitalization: {
      type: DataTypes.DATE,
      allowNull: false
    },
    dateOfAdmission: {
      type: DataTypes.DATE
    },
    dateOfDischarge: {
      type: DataTypes.DATE
    },
    dateOfSettlement: {
      type: DataTypes.DATE
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    },
    initialEstimate: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0
    },
    amountSettled: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0
    },
    amountApproved: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0
    },
    amountDisallowed: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0
    },
    denialReason: {
      type: DataTypes.STRING(5000),
      defaultValue: 0
    },
    disallowanceReason: {
      type: DataTypes.STRING(5000),
      defaultValue: 0
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    timestamps: true,
    defaultScope: {
      attributes: {exclude: ['createdAt', 'updatedAt', 'deletedAt']}
    },
    paranoid: true
  });
  Claim.associate = function (models) {
    // associations can be defined here
  };
  return Claim;
};
