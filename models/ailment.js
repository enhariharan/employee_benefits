'use strict';

module.exports = (sequelize, DataTypes) => {
  const Ailment = sequelize.define('Ailment', {
    uuid: {
      allowNull: false,
      unique: true,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    name: {
      allowNull: false,
      autoIncrement: false,
      type: DataTypes.STRING,
    },
    description: {
      allowNull: false,
      autoIncrement: false,
      type: DataTypes.STRING,
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
  Ailment.associate = ignoreModels => {
    // associations can be defined here
  };
  return Ailment;
};
