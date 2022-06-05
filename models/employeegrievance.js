'use strict';
module.exports = (sequelize, DataTypes) => {
  const EmployeeGrievance = sequelize.define('EmployeeGrievance', {
    id: {allowNull: false, autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER},
    employeeUuid: DataTypes.UUID,
    corporateUuid: DataTypes.UUID,
    executiveUuid: DataTypes.UUID,
    issueType: DataTypes.STRING,
    status: DataTypes.STRING,
    issueDescription: DataTypes.TEXT,
    dateOfReport: {allowNull: false, type: DataTypes.DATE, defaultValue: DataTypes.NOW},
    dateOfDisclosure: {type: DataTypes.DATE},
    resolution: DataTypes.TEXT,
    createdAt: {allowNull: false, type: DataTypes.DATE, defaultValue: DataTypes.NOW},
    updatedAt: {allowNull: false, type: DataTypes.DATE, defaultValue: DataTypes.NOW},
    deletedAt: {type: DataTypes.DATE, allowNull: true}
  }, {
    timestamps: true,
    defaultScope: {
      attributes: {exclude: ['createdAt', 'updatedAt', 'deletedAt']}
    },
    paranoid: true,
  });
  EmployeeGrievance.associate = function (models) {
    // associations can be defined here
  };
  return EmployeeGrievance;
};