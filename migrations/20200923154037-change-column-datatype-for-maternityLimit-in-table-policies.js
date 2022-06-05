'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    // Change datatype of column Policies.maternityLimit to STRING. It was DECIMAL when this col was first created.
    // Now this column must also allow the value to be filled up as "unlimited". So changing datatype to STRING.
    return queryInterface. changeColumn('Policies',
      'maternityLimit',
      {
        type: Sequelize.STRING,
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    // datatype should be kept as STRING only in down migration also. It was DECIMAL when this col was first created.
    // However, down migration back to DECIMAL may fail now since some rows may have this column filled up as "unlimited".
    return queryInterface. changeColumn('Policies',
      'maternityLimit',
      {
        type: Sequelize.STRING,
      }
    );
  }
};
