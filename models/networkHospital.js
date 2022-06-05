'use strict';

const {Sequelize} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const NetworkHospital = sequelize.define('NetworkHospital', {
    uuid: {
      allowNull: false,
      unique: true,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    hospitalId: {
      allowNull: true,
      unique: false,
      type: DataTypes.INTEGER,
    },
    tpaUuid: {
      allowNull: false,
      type: Sequelize.UUID,
      references: {
        model: 'TPAs',
        key: 'uuid'
      }
    },
    insuranceCompanyUuid: {
      allowNull: false,
      type: Sequelize.UUID,
      references: {
        model: 'InsuranceCompanies',
        key: 'uuid'
      }
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    branchCode: {
      type: DataTypes.STRING
    },
    addressBuildingName: {
      type: DataTypes.STRING
    },
    addressBuildingAddress: {
      allowNull: false,
      type: DataTypes.STRING
    },
    addressStreet: {
      type: DataTypes.STRING
    },
    addressCity: {
      allowNull: false,
      type: DataTypes.STRING
    },
    addressDistrict: {
      type: DataTypes.STRING
    },
    addressState: {
      allowNull: false,
      type: DataTypes.STRING
    },
    addressPincode: {
      allowNull: false,
      type: DataTypes.STRING
    },
    lat: {
      type: DataTypes.DECIMAL(10, 6)
    },
    long: {
      type: DataTypes.DECIMAL(10, 8)
    },
    contactFirstName: {
      type: DataTypes.STRING
    },
    contactLastName: {
      type: DataTypes.STRING
    },
    contactMobile: {
      type: DataTypes.STRING
    },
    contactEmail: {
      type: DataTypes.STRING
    },
    contactGstNumber: {
      type: DataTypes.STRING
    },
    levelOfCare: {
      type: DataTypes.STRING
    },
    networkType: {
      type: DataTypes.STRING
    },
    active: {
      allowNull: false,
      defaultValue: true,
      type: DataTypes.BOOLEAN
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
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
  NetworkHospital.associate = function(models) {
    // associations can be defined here
  };
  return NetworkHospital;
};
