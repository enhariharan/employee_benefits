'use strict';

module.exports = (sequelize, DataTypes) => {
  const CorporateHR = sequelize.define('CorporateHR', {
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      autoIncrement: false,
      primaryKey: true
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
      allowNull: false,
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
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'new'
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
    defaultScope: {
      attributes: {exclude: ['createdAt', 'updatedAt', 'deletedAt']}
    },
    paranoid: true
  });
  CorporateHR.associate = function(models) {
    // associations can be defined here
  };
  return CorporateHR;
};
