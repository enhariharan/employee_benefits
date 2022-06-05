'use strict';

module.exports = (sequelize, DataTypes) => {
  const Executive = sequelize.define('Executive', {
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
    brokingCompanyUuid: {
      allowNull: false,
      type: DataTypes.UUID,
      references: {
        model: 'BrokingCompanies',
        key: 'uuid'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    },
    userUuid: {
      allowNull: false,
      type: DataTypes.UUID,
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
    email: {
      type: DataTypes.STRING
    },
    mobile: {
      type: DataTypes.STRING
    },
    designation: { // can be "executive" or "manager" only
      allowNull: false,
      type: DataTypes.STRING
    },
    supervisorEmpid: {
      allowNull: false,
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
      minimalFields: {
        attributes: {
          exclude: ['empid', 'brokingCompanyUuid', 'userUuid', 'email', 'mobile', 'supervisorEmpid']
        }
      },
    },
    paranoid: true
  });
  Executive.associate = ignoreModels => {
    // associations can be defined here
  };
  return Executive;
};
