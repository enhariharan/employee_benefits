'use strict';

module.exports = (sequelize, DataTypes) => {
  const PolicyAilmentMapping = sequelize.define('PolicyAilmentMapping', {
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
    ailmentUuid: {
      allowNull: false,
      type: DataTypes.UUID,
      references: {
        model: 'Ailments',
        key: 'uuid'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
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
  PolicyAilmentMapping.associate = ignoreModels => {
    // associations can be defined here
  };
  return PolicyAilmentMapping;
};
