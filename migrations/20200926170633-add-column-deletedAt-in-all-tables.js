'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const ATTRIBUTES = {type: Sequelize.DATE, allowNull: true};
    return queryInterface.sequelize.transaction(t => {
      const COLUMN_NAME = 'deletedAt';
      return Promise.all([
        queryInterface.addColumn('Corporates', COLUMN_NAME, ATTRIBUTES, {transaction: t}),
        queryInterface.addColumn('BrokingCompanies', COLUMN_NAME, ATTRIBUTES, {transaction: t}),
        queryInterface.addColumn('Users', COLUMN_NAME, ATTRIBUTES, {transaction: t}),
        queryInterface.addColumn('Executives', COLUMN_NAME, ATTRIBUTES, {transaction: t}),
        queryInterface.addColumn('ExecutiveCorporateMappings', COLUMN_NAME, ATTRIBUTES, {transaction: t}),
        queryInterface.addColumn('TPAs', COLUMN_NAME, ATTRIBUTES, {transaction: t}),
        queryInterface.addColumn('InsuranceCompanies', COLUMN_NAME, ATTRIBUTES, {transaction: t}),
        queryInterface.addColumn('Customers', COLUMN_NAME, ATTRIBUTES, {transaction: t}),
        queryInterface.addColumn('Dependents', COLUMN_NAME, ATTRIBUTES, {transaction: t}),
        queryInterface.addColumn('Policies', COLUMN_NAME, ATTRIBUTES, {transaction: t}),
        queryInterface.addColumn('Ailments', COLUMN_NAME, ATTRIBUTES, {transaction: t}),
        queryInterface.addColumn('NetworkHospitals', COLUMN_NAME, ATTRIBUTES, {transaction: t}),
        queryInterface.addColumn('PolicyAilmentMappings', COLUMN_NAME, ATTRIBUTES, {transaction: t}),
        queryInterface.addColumn('NonNetworkHospitals', COLUMN_NAME, ATTRIBUTES, {transaction: t}),
        queryInterface.addColumn('FamilyDefinitions', COLUMN_NAME, ATTRIBUTES, {transaction: t}),
        queryInterface.addColumn('CorporateHRs', COLUMN_NAME, ATTRIBUTES, {transaction: t}),
        queryInterface.addColumn('Claims', COLUMN_NAME, ATTRIBUTES, {transaction: t}),
        queryInterface.addColumn('PolicyCongenitalAilmentsInternalMappings', COLUMN_NAME, ATTRIBUTES, {transaction: t}),
        queryInterface.addColumn('PolicyCongenitalAilmentsExternalMappings', COLUMN_NAME, ATTRIBUTES, {transaction: t}),
        queryInterface.addColumn('CustomerJournals', COLUMN_NAME, ATTRIBUTES, {transaction: t}),
        queryInterface.addColumn('CustomerStateJournals', COLUMN_NAME, ATTRIBUTES, {transaction: t}),
        queryInterface.addColumn('DependentStateJournals', COLUMN_NAME, ATTRIBUTES, {transaction: t}),
        queryInterface.addColumn('EmployeeGrievances', COLUMN_NAME, ATTRIBUTES, {transaction: t}),
        queryInterface.addColumn('InsuranceEnquiries', COLUMN_NAME, ATTRIBUTES, {transaction: t})
      ]);
    })
  },

  down: (queryInterface, ignoreSequelize) => {
    return queryInterface.sequelize.transaction(t => {
      const COLUMN_NAME = 'deletedAt';
      return Promise.all([
        queryInterface.removeColumn('InsuranceEnquiries', COLUMN_NAME, {transaction: t}),
        queryInterface.removeColumn('EmployeeGrievances', COLUMN_NAME, {transaction: t}),
        queryInterface.removeColumn('DependentStateJournals', COLUMN_NAME, {transaction: t}),
        queryInterface.removeColumn('CustomerStateJournals', COLUMN_NAME, {transaction: t}),
        queryInterface.removeColumn('CustomerJournals', COLUMN_NAME, {transaction: t}),
        queryInterface.removeColumn('PolicyCongenitalAilmentsExternalMappings', COLUMN_NAME, {transaction: t}),
        queryInterface.removeColumn('PolicyCongenitalAilmentsInternalMappings', COLUMN_NAME, {transaction: t}),
        queryInterface.removeColumn('Claims', COLUMN_NAME, {transaction: t}),
        queryInterface.removeColumn('CorporateHRs', COLUMN_NAME, {transaction: t}),
        queryInterface.removeColumn('FamilyDefinitions', COLUMN_NAME, {transaction: t}),
        queryInterface.removeColumn('NonNetworkHospitals', COLUMN_NAME, {transaction: t}),
        queryInterface.removeColumn('PolicyAilmentMappings', COLUMN_NAME, {transaction: t}),
        queryInterface.removeColumn('NetworkHospitals', COLUMN_NAME, {transaction: t}),
        queryInterface.removeColumn('Ailments', COLUMN_NAME, {transaction: t}),
        queryInterface.removeColumn('Policies', COLUMN_NAME, {transaction: t}),
        queryInterface.removeColumn('Dependents', COLUMN_NAME, {transaction: t}),
        queryInterface.removeColumn('InsuranceCompanies', COLUMN_NAME, {transaction: t}),
        queryInterface.removeColumn('TPAs', COLUMN_NAME, {transaction: t}),
        queryInterface.removeColumn('ExecutiveCorporateMappings', COLUMN_NAME, {transaction: t}),
        queryInterface.removeColumn('Executives', COLUMN_NAME, {transaction: t}),
        queryInterface.removeColumn('Users', COLUMN_NAME, {transaction: t}),
        queryInterface.removeColumn('BrokingCompanies', COLUMN_NAME, {transaction: t}),
        queryInterface.removeColumn('Corporates', COLUMN_NAME, {transaction: t}),
        queryInterface.removeColumn('Customers', COLUMN_NAME, {transaction: t})
      ]);
    });
  }
};
