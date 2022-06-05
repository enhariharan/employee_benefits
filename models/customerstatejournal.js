'use strict';
module.exports = (sequelize, DataTypes) => {
  const CustomerStateJournal = sequelize.define('CustomerStateJournal', {
    id: {allowNull: false, autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER},
    userUuid: DataTypes.UUID,
    corporateUuid: DataTypes.UUID,
    changedByUserUuid: DataTypes.UUID,
    oldState: DataTypes.STRING,
    newState: DataTypes.STRING,
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
  CustomerStateJournal.associate = function (models) {
    // associations can be defined here
  };
  return CustomerStateJournal;
};