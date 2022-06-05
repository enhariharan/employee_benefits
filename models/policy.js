'use strict';

module.exports = (sequelize, DataTypes) => {
  const Policy = sequelize.define('Policy', {
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      autoIncrement: false,
      primaryKey: true
    },
    tpaUuid: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'TPAs',
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
    insuranceCompanyUuid: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'InsuranceCompanies',
        key: 'uuid'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    },
    policyId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fromDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    toDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    policyYear: {
      type: DataTypes.STRING,
      allowNull: false
    },
    familyDefinition: {
      type: DataTypes.STRING,
      allowNull: false
    },
    numberOfFamilies: {
      type: DataTypes.STRING,
      allowNull: false
    },
    numberOfDependents: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    sumInsured: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0
    },
    premiumPerFamily: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0
    },
    premiumPerDependent: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0
    },
    opd: {
      type: DataTypes.STRING, // "yes" or "no"
      allowNull: false
    },
    maternityCover: {
      type: DataTypes.STRING
    },
    maternityLimit: {
      type: DataTypes.STRING // can take a float value or "unlimited"
    },
    babyCoverDayOne: {
      type: DataTypes.STRING // "yes" or "no"
    },
    preExistingCover: {
      type: DataTypes.STRING // "yes" or "no"
    },
    firstYearExclusions: {
      type: DataTypes.STRING // "yes" or "no"
    },
    secondYearExclusions: {
      type: DataTypes.STRING // "yes" or "no"
    },
    congenitalDiseasesInternal: {
      type: DataTypes.STRING // "yes" or "no"
    },
    congenitalDiseasesExternal: {
      type: DataTypes.STRING // "yes" or "no"
    },
    corporateBufferAndConditions: {
      type: DataTypes.TEXT
    },
    categories: {
      type: DataTypes.STRING
    },
    roomRentLimits: {
      type: DataTypes.STRING
    },
    copay: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0
    },
    parentalSubLimit: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0
    },
    parentalCopay: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0
    },
    opdLimit: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0
    },
    appendicitis: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0
    },
    hernia: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0
    },
    arthiritis: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0
    },
    digestiveDisorders: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0
    },
    cataract: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0
    },
    gallBladderAndHisterectomy: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0
    },
    kneeReplacement: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0
    },
    jointReplacementIncludingVertrebalJoints: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0
    },
    treatmentForKidneyStones: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0
    },
    piles: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0
    },
    hydrocele: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0
    },
    lasikSurgery: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0
    },
    wellnessProgram: {
      type: DataTypes.TEXT
    },
    helpdeskSchedule: {
      type: DataTypes.STRING
    },
    visistaSpoc1Name: {
      type: DataTypes.STRING
    },
    visistaSpoc1Designation: {
      type: DataTypes.STRING
    },
    visistaSpoc1Email: {
      type: DataTypes.STRING
    },
    visistaSpoc1Mobile: {
      type: DataTypes.STRING
    },
    visistaSpoc2Name: {
      type: DataTypes.STRING
    },
    visistaSpoc2Designation: {
      type: DataTypes.STRING
    },
    visistaSpoc2Email: {
      type: DataTypes.STRING
    },
    visistaSpoc2Mobile: {
      type: DataTypes.STRING
    },
    visistaSpoc3Name: {
      type: DataTypes.STRING
    },
    visistaSpoc3Designation: {
      type: DataTypes.STRING
    },
    visistaSpoc3Email: {
      type: DataTypes.STRING
    },
    visistaSpoc3Mobile: {
      type: DataTypes.STRING
    },
    tpaSpoc1Name: {
      type: DataTypes.STRING
    },
    tpaSpoc1Designation: {
      type: DataTypes.STRING
    },
    tpaSpoc1Email: {
      type: DataTypes.STRING
    },
    tpaSpoc1Mobile: {
      type: DataTypes.STRING
    },
    tpaSpoc2Name: {
      type: DataTypes.STRING
    },
    tpaSpoc2Designation: {
      type: DataTypes.STRING
    },
    tpaSpoc2Email: {
      type: DataTypes.STRING
    },
    tpaSpoc2Mobile: {
      type: DataTypes.STRING
    },
    tpaSpoc3Name: {
      type: DataTypes.STRING
    },
    tpaSpoc3Designation: {
      type: DataTypes.STRING
    },
    tpaSpoc3Email: {
      type: DataTypes.STRING
    },
    tpaSpoc3Mobile: {
      type: DataTypes.STRING
    },
    clientSpoc1Empid: {
      type: DataTypes.STRING
    },
    clientSpoc1Name: {
      type: DataTypes.STRING
    },
    clientSpoc1Email: {
      type: DataTypes.STRING
    },
    clientSpoc1Designation: {
      type: DataTypes.STRING
    },
    clientSpoc1Mobile: {
      type: DataTypes.STRING
    },
    clientSpoc2Empid: {
      type: DataTypes.STRING
    },
    clientSpoc2Name: {
      type: DataTypes.STRING
    },
    clientSpoc2Designation: {
      type: DataTypes.STRING
    },
    clientSpoc2Email: {
      type: DataTypes.STRING
    },
    clientSpoc2Mobile: {
      type: DataTypes.STRING
    },
    clientSpoc3Empid: {
      type: DataTypes.STRING
    },
    clientSpoc3Name: {
      type: DataTypes.STRING
    },
    clientSpoc3Designation: {
      type: DataTypes.STRING
    },
    clientSpoc3Email: {
      type: DataTypes.STRING
    },
    clientSpoc3Mobile: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'created'
    },
    others: {
      type: DataTypes.STRING,
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
  Policy.associate = function (models) {
    // associations can be defined here
  };
  return Policy;
};
