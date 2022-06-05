'use strict';
module.exports = (sequelize, DataTypes) => {
  const InsuranceEnquiry = sequelize.define('InsuranceEnquiry', {
    id: {allowNull: false, autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER},
    employeeUuid: DataTypes.UUID,    
    corporateUuid: DataTypes.UUID,
    executiveUuid: DataTypes.UUID,    
    insuranceType: DataTypes.STRING,
    status: DataTypes.STRING,    
    callBackRequestedTime: {allowNull: false, type: DataTypes.DATE, defaultValue: DataTypes.NOW},
    dateOfReport: {allowNull: false, type: DataTypes.DATE, defaultValue: DataTypes.NOW},
    comments: DataTypes.TEXT,   
    createdAt: {allowNull: false, type: DataTypes.DATE, defaultValue: DataTypes.NOW},
    updatedAt: {allowNull: false, type: DataTypes.DATE, defaultValue: DataTypes.NOW},
    deletedAt: {type: DataTypes.DATE, allowNull: true}
  }, {
    timestamps: true,
    defaultScope: {
      attributes: {exclude: ['createdAt', 'updatedAt', 'deletedAt']}
    },
    paranoid: true
  });
  InsuranceEnquiry.associate = function(models) {
    // associations can be defined here
  };
  return InsuranceEnquiry;
};