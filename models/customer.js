'use strict';

module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define('Customer', {
    uuid: {
      allowNull: false,
      unique: true,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.UUID
    },
    empid: {
      allowNull: false,
      type: DataTypes.STRING
    },
    corporateUuid: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Corporates',
        key: 'uuid'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    },
    userUuid: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'uuid'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
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
      type: DataTypes.DATE,
      allowNull: false
    },
    dateOfJoining: {
      type: DataTypes.DATE,
    },
    dateOfExit: {
      type: DataTypes.DATE,
    },
    sumInsured: {
      type: DataTypes.DECIMAL(15,2),
      defaultValue: 0,
    },
    status: {
      type: DataTypes.STRING,
      // possible values: see apidocs for GET /customers or refer to array VALID_CUSTOMER_STATUSES in services/customersService.js
      allowNull: false,
    },
    approvalType: {
      type: DataTypes.STRING,
      allowNull: false
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
    paranoid: true,
    defaultScope: {
      attributes: {exclude: ['createdAt', 'updatedAt', 'deletedAt', 'active']}
    },
    scopes: {
      minimalFields: {
        attributes: {exclude: ['corporateUuid', 'addressBuildingName', 'addressBuildingAddress', 'addressStreet',
            'addressCity', 'addressDistrict', 'addressState', 'addressPincode', 'lat', 'long', 'contactFirstName',
            'contactLastName', 'contactMobile', 'contactEmail']
        }
      }
    }
  });
  Customer.associate = function(models) {
    // associations can be defined here
  };
  return Customer;
};
