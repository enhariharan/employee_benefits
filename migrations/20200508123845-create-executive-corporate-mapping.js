'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ExecutiveCorporateMappings', {
      uuid: {
        allowNull: false,
        unique: true,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      executiveUuid: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Executives',
          key: 'uuid'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      corporateUuid: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Corporates',
          key: 'uuid'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    }, {
      timestamps: true
    });
  },
  down: (queryInterface, ignoreSequelize) => {
    return queryInterface.dropTable('ExecutiveCorporateMappings');
  }
};
