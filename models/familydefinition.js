'use strict';

const {Sequelize} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const FamilyDefinition = sequelize.define('FamilyDefinition', {
    uuid: {
      allowNull: false,
      unique: true,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    policyUuid: {
      allowNull: false,
      type: DataTypes.UUID,
      references: {
        model: 'Policies',
        key: 'uuid'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    },
    numberOfFamilies: {
      allowNull: false,
      defaultValue: 1,
      type: DataTypes.INTEGER,
    },
    numberOfDependents: {
      allowNull: false,
      defaultValue: 1,
      type: DataTypes.INTEGER,
    },
    categories: {
      allowNull: false,
      type: DataTypes.STRING(500),
    },
    sumInsured: {
      allowNull: false,
      type: DataTypes.DECIMAL(15, 2),
    },
    premiumPerFamily: {
      allowNull: false,
      type: DataTypes.DECIMAL(15, 2),
    },
    premiumPerDependent: {
      allowNull: false,
      type: DataTypes.DECIMAL(15, 2),
    },
    copay: {
      allowNull: false,
      type: DataTypes.DECIMAL(15, 2),
    },
    parentalSublimit: {
      allowNull: false,
      type: DataTypes.DECIMAL(15, 2),
    },
    parentalCoPay: {
      allowNull: false,
      type: DataTypes.DECIMAL(15, 2),
    },
    active: {
      allowNull: false,
      defaultValue: true,
      type: Sequelize.BOOLEAN
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
  FamilyDefinition.associate = function(models) {
    // associations can be defined here
  };
  return FamilyDefinition;
};
