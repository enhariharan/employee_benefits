'use strict';

module.exports = (sequelize, DataTypes) => {
  const TPA = sequelize.define('TPA', {
    uuid: {
      allowNull: false,
      unique: true,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    tpaid: {
      allowNull: false,
      unique: true,
      autoIncrement: false,
      type: DataTypes.STRING,
    },
    companyName: {
      allowNull: false,
      type: DataTypes.STRING
    },
    displayName: {
      type: DataTypes.STRING
    },
    branchCode: {
      type: DataTypes.STRING
    },
    branchAddressBuildingName: {
      type: DataTypes.STRING
    },
    branchAddressBuildingAddress: {
      allowNull: false,
      type: DataTypes.STRING
    },
    branchAddressStreet: {
      type: DataTypes.STRING
    },
    branchAddressCity: {
      allowNull: false,
      type: DataTypes.STRING
    },
    branchAddressDistrict: {
      type: DataTypes.STRING
    },
    branchAddressState: {
      allowNull: false,
      type: DataTypes.STRING
    },
    branchAddressPincode: {
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
    tpaServiceUrl: {
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
    scopes: {
      companyName: {
        attributes: {
          include: ['uuid', 'tpaid', 'companyName', 'displayName'],
          exclude: ['branchCode', 'branchAddressBuildingName', 'branchAddressBuildingAddress',
            'branchAddressStreet', 'branchAddressCity', 'branchAddressDistrict', 'branchAddressState', 'lat', 'long',
            'branchAddressPincode', 'contactFirstName', 'contactLastName', 'contactMobile', 'contactEmail',
            'contactGstNumber', `tpaServiceUrl`, 'active', 'createdAt', 'updatedAt']
        }
      },
    },
    paranoid: true
  });
  TPA.associate = function(models) {
    // associations can be defined here
  };
  return TPA;
};
