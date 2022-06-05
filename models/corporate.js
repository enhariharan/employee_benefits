'use strict';

module.exports = (sequelize, DataTypes) => {
  const Corporate = sequelize.define('Corporate', {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      unique: true,
      autoIncrement: false,
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: false
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
      type: DataTypes.STRING,
      allowNull: false
    },
    branchAddressStreet: {
      type: DataTypes.STRING
    },
    branchAddressCity: {
      type: DataTypes.STRING,
      allowNull: false
    },
    branchAddressDistrict: {
      type: DataTypes.STRING
    },
    branchAddressState: {
      type: DataTypes.STRING,
      allowNull: false
    },
    branchAddressPincode: {
      type: DataTypes.STRING,
      allowNull: false
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
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'new'
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
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
      attributes: {exclude: ['deletedAt']}
    },
    scopes: {
      companyName: {
        attributes: {
          include: ['uuid', 'companyName', 'displayName'],
          exclude: ['branchCode', 'branchAddressBuildingName', 'branchAddressBuildingAddress',
            'branchAddressStreet', 'branchAddressCity', 'branchAddressDistrict', 'branchAddressState', 'lat', 'long',
            'branchAddressPincode', 'contactFirstName', 'contactLastName', 'contactMobile', 'contactEmail',
            'contactGstNumber', 'status', 'active', 'createdAt', 'updatedAt']
        }
      },
      minimalFields: {
        attributes: {
          exclude: ['contactFirstName', 'contactLastName', 'contactMobile', 'contactEmail', 'contactGstNumber', 'updatedAt']
        }
      },
    },
    paranoid: true
  });
  Corporate.associate = ignoreModels => {
    // associations can be defined here
  };
  return Corporate;
};
