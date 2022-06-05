'use strict';

const {Sequelize} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    uuid: {
      allowNull: false,
      unique: true,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    corporateUuid: {
      allowNull: true,
      type: Sequelize.UUID,
      references: {
        model: 'Corporates',
        key: 'uuid'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    },
    brokingCompanyUuid: {
      allowNull: true,
      type: DataTypes.UUID,
      references: {
        model: 'BrokingCompanies',
        key: 'uuid'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    },
    username: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    role: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    mobile: {
      type: DataTypes.STRING,
    },
    active: {
      allowNull: false,
      defaultValue: true,
      type: DataTypes.BOOLEAN,
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
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
