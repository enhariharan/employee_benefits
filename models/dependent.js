'use strict';

module.exports = (sequelize, DataTypes) => {
  const Dependent = sequelize.define('Dependent', {
    uuid: {
      allowNull: false,
      unique: true,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.UUID
    },
    dependentOnCustomerUuid: {
      allowNull: false,
      type: DataTypes.UUID,
      references: {
        model: 'Customers',
        key: 'uuid'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    },
    corporateUuid: {
      allowNull: false,
      type: DataTypes.UUID,
      references: {
        model: 'Corporates',
        key: 'uuid'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    },
    relationship: {
      allowNull: false,
      type: DataTypes.STRING
    },
    firstName: {
      allowNull: false,
      type: DataTypes.STRING
    },
    lastName: {
      type: DataTypes.STRING
    },
    gender: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    },
    mobile: {
      type: DataTypes.STRING
    },
    addressBuildingName: {
      type: DataTypes.STRING
    },
    addressBuildingAddress: {
      type: DataTypes.STRING
    },
    addressStreet: {
      type: DataTypes.STRING
    },
    addressCity: {
      type: DataTypes.STRING
    },
    addressDistrict: {
      type: DataTypes.STRING
    },
    addressState: {
      type: DataTypes.STRING
    },
    addressPincode: {
      type: DataTypes.STRING
    },
    lat: {
      type: DataTypes.DECIMAL(10,6)
    },
    long: {
      type: DataTypes.DECIMAL(10,8)
    },
    contactFirstName: {
      type: DataTypes.STRING
    },
    contactLastName: {
      type: DataTypes.STRING
    },
    contactMobile: { // TODO: Deprecated, use mobile instead.
      type: DataTypes.STRING
    },
    contactEmail: {
      type: DataTypes.STRING
    },
    dob: {
      allowNull: false,
      type: DataTypes.DATE
    },
    sumInsured: {
      type: DataTypes.DECIMAL(15,2),
      defaultValue: 0,
    },
    status: {
      // possible values: see services/employeeStatus.js
      allowNull: false,
      type: DataTypes.STRING,
      default: 'created'
    },
    approvalType: {
      type: DataTypes.STRING,
      allowNull: false,
      default: 'none'
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
    paranoid: true,
    defaultScope: {
      attributes: {exclude: ['updatedAt', 'deletedAt', 'active']}
    },
    scopes: {
      minimalFields: {
        attributes: {exclude: ['updatedAt', 'DeletedAt', 'corporateUuid', 'mobile',
            'addressBuildingName', 'addressBuildingAddress', 'addressStreet', 'addressCity', 'addressDistrict',
            'addressState', 'addressPincode', 'lat', 'long', 'contactFirstName', 'contactLastName', 'contactMobile',
            'contactEmail']
        }
      }
    }
  });
  Dependent.associate = ignoreModels => {
    // associations can be defined here
  };
  return Dependent;
};
