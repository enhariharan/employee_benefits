'use strict';

module.exports = (sequelize, DataTypes) => {
  const CustomerJournal = sequelize.define('CustomerJournal', {
    id: {allowNull: false, autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER},
    field: DataTypes.STRING,
    description: DataTypes.STRING,
    changedByUserUuid: DataTypes.UUID,
    changedByUsername: DataTypes.STRING,
    oldValue: DataTypes.STRING,
    newValue: DataTypes.STRING,
    createdAt: {allowNull: false, type: DataTypes.DATE, defaultValue: DataTypes.NOW},
    updatedAt: {allowNull: false, type: DataTypes.DATE, defaultValue: DataTypes.NOW},
     deletedAt: {type: DataTypes.DATE, allowNull: true}
  }, {
    timestamps: true,
    defaultScope: {
      attributes: {exclude: ['createdAt', 'updatedAt', 'deletedAt']}
    },
    paranoid: true
  });
  CustomerJournal.associate = function (models) {
    // associations can be defined here
  };
  return CustomerJournal;
}