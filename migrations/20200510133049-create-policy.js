'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Policies', {
      uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        autoIncrement: false,
        primaryKey: true
      },
      tpaUuid: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'TPAs',
          key: 'uuid'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      corporateUuid: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Corporates',
          key: 'uuid'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      insuranceCompanyUuid: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'InsuranceCompanies',
          key: 'uuid'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      policyId: {
        type: Sequelize.STRING,
        allowNull: false
      },
      fromDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      toDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      policyYear: {
        type: Sequelize.STRING,
        allowNull: false
      },
      familyDefinition: {
        type: Sequelize.STRING,
        allowNull: false
      },
      numberOfFamilies :{
        type: Sequelize.STRING,
        allowNull: false
      },
      numberOfDependents: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      sumInsured: {
        type: Sequelize.DECIMAL(15,2),
        allowNull: false,
        defaultValue: 0
      },
      premiumPerFamily: {
        type: Sequelize.DECIMAL(15,2),
        allowNull: false,
        defaultValue: 0
      },
      premiumPerDependent: {
        type: Sequelize.DECIMAL(15,2),
        allowNull: false,
        defaultValue: 0
      },
      opd: {
        type: Sequelize.STRING, // "yes" or "no"
        allowNull: false
      },
      maternityCover: {
        type: Sequelize.STRING
      },
      maternityLimit: {
        type: Sequelize.DECIMAL(15,2),
        defaultValue: 0
      },
      babyCoverDayOne: {
        type: Sequelize.STRING // "yes" or "no"
      },
      preExistingCover: {
        type: Sequelize.STRING // "yes" or "no"
      },
      firstYearExclusions: {
        type: Sequelize.STRING // "yes" or "no"
      },
      secondYearExclusions: {
        type: Sequelize.STRING // "yes" or "no"
      },
      congenitalDiseasesInternal: {
        type: Sequelize.STRING // "yes" or "no"
      },
      congenitalDiseasesExternal: {
        type: Sequelize.STRING // "yes" or "no"
      },
      corporateBufferAndConditions: {
        type: Sequelize.TEXT
      },
      categories: {
        type: Sequelize.STRING
      },
      roomRentLimits: {
        type: Sequelize.STRING
      },
      copay: {
        type: Sequelize.DECIMAL(15,2),
        defaultValue: 0
      },
      parentalSubLimit: {
        type: Sequelize.DECIMAL(15,2),
        defaultValue: 0
      },
      parentalCopay: {
        type: Sequelize.DECIMAL(15,2),
        defaultValue: 0
      },
      opdLimit: {
        type: Sequelize.DECIMAL(15,2),
        defaultValue: 0
      },
      appendicitis: {
        type: Sequelize.DECIMAL(15,2),
        defaultValue: 0
      },
      hernia: {
        type: Sequelize.DECIMAL(15,2),
        defaultValue: 0
      },
      arthiritis: {
        type: Sequelize.DECIMAL(15,2),
        defaultValue: 0
      },
      digestiveDisorders: {
        type: Sequelize.DECIMAL(15,2),
        defaultValue: 0
      },
      cataract: {
        type: Sequelize.DECIMAL(15,2),
        defaultValue: 0
      },
      gallBladderAndHisterectomy: {
        type: Sequelize.DECIMAL(15,2),
        defaultValue: 0
      },
      kneeReplacement: {
        type: Sequelize.DECIMAL(15,2),
        defaultValue: 0
      },
      jointReplacementIncludingVertrebalJoints: {
        type: Sequelize.DECIMAL(15,2),
        defaultValue: 0
      },
      treatmentForKidneyStones: {
        type: Sequelize.DECIMAL(15,2),
        defaultValue: 0
      },
      piles: {
        type: Sequelize.DECIMAL(15,2),
        defaultValue: 0
      },
      hydrocele: {
        type: Sequelize.DECIMAL(15,2),
        defaultValue: 0
      },
      lasikSurgery: {
        type: Sequelize.DECIMAL(15,2),
        defaultValue: 0
      },
      wellnessProgram: {
        type: Sequelize.TEXT
      },
      helpdeskSchedule: {
        type: Sequelize.STRING
      },
      visistaSpoc1Name: {
        type: Sequelize.STRING
      },
      visistaSpoc1Designation: {
        type: Sequelize.STRING
      },
      visistaSpoc1Email: {
        type: Sequelize.STRING
      },
      visistaSpoc1Mobile: {
        type: Sequelize.STRING
      },
      visistaSpoc2Name: {
        type: Sequelize.STRING
      },
      visistaSpoc2Designation: {
        type: Sequelize.STRING
      },
      visistaSpoc2Email: {
        type: Sequelize.STRING
      },
      visistaSpoc2Mobile: {
        type: Sequelize.STRING
      },
      visistaSpoc3Name: {
        type: Sequelize.STRING
      },
      visistaSpoc3Designation: {
        type: Sequelize.STRING
      },
      visistaSpoc3Email: {
        type: Sequelize.STRING
      },
      visistaSpoc3Mobile: {
        type: Sequelize.STRING
      },
      tpaSpoc1Name: {
        type: Sequelize.STRING
      },
      tpaSpoc1Designation: {
        type: Sequelize.STRING
      },
      tpaSpoc1Email: {
        type: Sequelize.STRING
      },
      tpaSpoc1Mobile: {
        type: Sequelize.STRING
      },
      tpaSpoc2Name: {
        type: Sequelize.STRING
      },
      tpaSpoc2Designation: {
        type: Sequelize.STRING
      },
      tpaSpoc2Email: {
        type: Sequelize.STRING
      },
      tpaSpoc2Mobile: {
        type: Sequelize.STRING
      },
      tpaSpoc3Name: {
        type: Sequelize.STRING
      },
      tpaSpoc3Designation: {
        type: Sequelize.STRING
      },
      tpaSpoc3Email: {
        type: Sequelize.STRING
      },
      tpaSpoc3Mobile: {
        type: Sequelize.STRING
      },
      clientSpoc1Empid: {
        type: Sequelize.STRING
      },
      clientSpoc1Name: {
        type: Sequelize.STRING
      },
      clientSpoc1Email: {
        type: Sequelize.STRING
      },
      clientSpoc1Designation: {
        type: Sequelize.STRING
      },
      clientSpoc1Mobile: {
        type: Sequelize.STRING
      },
      clientSpoc2Empid: {
        type: Sequelize.STRING
      },
      clientSpoc2Name: {
        type: Sequelize.STRING
      },
      clientSpoc2Designation: {
        type: Sequelize.STRING
      },
      clientSpoc2Email: {
        type: Sequelize.STRING
      },
      clientSpoc2Mobile: {
        type: Sequelize.STRING
      },
      clientSpoc3Empid: {
        type: Sequelize.STRING
      },
      clientSpoc3Name: {
        type: Sequelize.STRING
      },
      clientSpoc3Designation: {
        type: Sequelize.STRING
      },
      clientSpoc3Email: {
        type: Sequelize.STRING
      },
      clientSpoc3Mobile: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'created'
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    },
    {
      timestamps: true
    });
  },
  down: (queryInterface, ignoreSequelize) => {
    return queryInterface.dropTable('Policies');
  }
};
