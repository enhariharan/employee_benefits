// Junction table for many-to-many mapping of models Executive and Corporate
'use strict';

module.exports = (sequelize, DataTypes) => {
  const ExecutiveCorporateMapping = sequelize.define('ExecutiveCorporateMapping', {
    uuid: {
      allowNull: false,
      unique: true,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    executiveUuid: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Executives',
        key: 'uuid'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
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
  ExecutiveCorporateMapping.associate = ignoreModels => {
    // associations can be defined here
  };
  return ExecutiveCorporateMapping;
};
