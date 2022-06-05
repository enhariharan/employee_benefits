import React, {
  Fragment,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './addPolicy.scss';

import update from 'immutability-helper';

import MomentReg from 'moment';

import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';

import { AuthContext } from '../../../context/AuthContext';
import { EMP_CONST } from '../../../services/Constants';
import { PubSub } from '../../../services/PubSub';
import ApiService from '../../../services/ApiService';
import { GlobalDataContext } from '../../../context/GlobalDataContext';

import {
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import MenuItem from '@material-ui/core/MenuItem';

import {
  CapitalizeFirstLetter,
  stateArray,
  uniqueCorporateObject,
} from '../../../reUseComponents/utils/utils';

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  Link,
  useHistory,
} from 'react-router-dom';

const AddPolicy = React.memo((props) => {
  // console.log('AddPolicy props ', props);
  const history = useHistory();
  const [globalOnLoadData, setGlobalOnLoadData] = useContext(GlobalDataContext);

  const [corporatesData, setCorporatesData] = useState([]);

  const [fromDtPolicy, setFromDtPolicy] = useState(new Date());

  const [toDtPolicy, setToDtPolicy] = useState(
    new Date().setDate(new Date().getDate() + 364)
  );

  const getPolicyYrCB = (fDt, tDt) => {
    return (
      new Date(fDt || fromDtPolicy).getFullYear() +
      ' - ' +
      new Date(tDt || toDtPolicy).getFullYear()
    );
  };
  const [policyYearFromTo, setpolicyYearFromTo] = useState(getPolicyYrCB());

  const handleFromDtChange = (e) => {
    if (!e) {
      return;
    }
    setFromDtPolicy(e);
    let toDate = new Date(e).setDate(new Date(e).getDate() + 364);
    setToDtPolicy(toDate);
    setpolicyYearFromTo(getPolicyYrCB(e, toDate));
  };

  const [tpasListData, setTpasListData] = useState([]);
  const [insuranceCompaniesData, setInsuranceCompaniesData] = useState([]);
  // console.log('globalOnLoadData ', globalOnLoadData);
  useEffect(() => {
    if (
      !!globalOnLoadData.pendingActionsData &&
      Object.keys(globalOnLoadData.pendingActionsData).length > 0
    ) {
      getAllCorporates();
    }
  }, [!!globalOnLoadData.pendingActionsData]);

  useEffect(() => {
    if (!!isEditPolicy) {
      setFromDtPolicy(
        new Date(
          MomentReg(props.propObj.currentObj.fromDate).format('MM-DD-YYYY')
        )
      );
    }
    getTpasList();
    getInsuranceCompaniesList();
  }, []);

  useEffect(() => {
    if (!!props.propObj.currentObj && props.propObj.currentObj.fromDate) {
      setToDtPolicy(
        new Date(props.propObj.currentObj.fromDate).setDate(
          new Date(props.propObj.currentObj.fromDate).getDate() + 364
        )
      );
    }
  }, [!!fromDtPolicy]);

  const getAllCorporates = () => {
    ApiService.get(`${EMP_CONST.URL.exe_getCorporates}?status=approved`)
      .then((response) => {
        // console.log('response getAllCorporates ', response);
        if (typeof response !== 'undefined') {
          let uniqueCorporateData = uniqueCorporateObject(response.data);
          setCorporatesData(uniqueCorporateData);
          const newCorporatesData = update(globalOnLoadData, {
            ['corporatesData']: {
              $set: uniqueCorporateData,
            },
          });
          setGlobalOnLoadData(newCorporatesData);
        }
      })
      .catch((err) => {
        console.log(`Resend Error ${JSON.stringify(err)} `);
        if (!!err.data && (!!err.data.errCode || !!err.data.message)) {
          let respNotiObj = {
            message: err.data.message || err.data.errCode,
            color: 'error',
          };
          PubSub.publish(PubSub.events.SNACKBAR_PROVIDER, respNotiObj);
        }
      })
      .finally(() => {
        console.log(`Finally `);
      });
  };

  const getTpasList = () => {
    ApiService.get(`${EMP_CONST.URL.tpas_list}`)
      .then((response) => {
        // console.log('response getTpasList ', response);
        if (
          typeof response !== 'undefined' &&
          !!response.data &&
          response.data.length > 0
        ) {
          setTpasListData(response.data);
        }
      })
      .catch((err) => {
        console.log(`Resend Error ${JSON.stringify(err)} `);
        if (!!err.data && (!!err.data.message || !!err.data.errCode)) {
          let respNotiObj = {
            message: err.data.message || err.data.errCode,
            color: 'error',
          };
          PubSub.publish(PubSub.events.SNACKBAR_PROVIDER, respNotiObj);
        }
      })
      .finally(() => {
        console.log(`Finally `);
      });
  };

  const getInsuranceCompaniesList = () => {
    ApiService.get(`${EMP_CONST.URL.insurance_companies}`)
      .then((response) => {
        // console.log('response getInsuranceCompaniesList ', response);
        if (typeof response !== 'undefined') {
          setInsuranceCompaniesData(response);
        }
      })
      .catch((err) => {
        console.log(`Resend Error ${JSON.stringify(err)} `);
        if (!!err.data && (!!err.data.message || !!err.data.errCode)) {
          let respNotiObj = {
            message: err.data.message || err.data.errCode,
            color: 'error',
          };
          PubSub.publish(PubSub.events.SNACKBAR_PROVIDER, respNotiObj);
        }
      })
      .finally(() => {
        console.log(`Finally `);
      });
  };

  const [currentUser] = useContext(AuthContext);

  const [premiumPerFamily, setPremiumPerFamily] = useState(0);
  const [isPremiumPerFamilyDisable, setIsPremiumPerFamilyDisable] = useState(
    false
  );
  const [premiumPerDependent, setPremiumPerDependent] = useState(0);
  const [
    isPremiumPerDependentDisable,
    setIsPremiumPerDependentDisable,
  ] = useState(false);

  let isEditPolicy;
  !!props.propObj.methodType &&
  !!props.propObj.currentObj &&
  Object.keys(props.propObj.currentObj).length > 0
    ? (isEditPolicy = true)
    : (isEditPolicy = false);

  const [currentPolicyObj, setCurrentPolicyObj] = useState({});
  if (!!isEditPolicy && Object.keys(currentPolicyObj).length === 0) {
    setCurrentPolicyObj(props.propObj.currentObj);
    setPremiumPerFamily(Math.round(props.propObj.currentObj.premiumPerFamily));
    setPremiumPerDependent(
      Math.round(props.propObj.currentObj.premiumPerDependent)
    );
  }

  const handleChangePerMem = (e) => {
    setPremiumPerFamily(e.target.value);
    setPremiumPerDependent(0);
    if (typeof e.target.value === 'string' && e.target.value !== '') {
      setIsPremiumPerDependentDisable(true);
    } else {
      setIsPremiumPerDependentDisable(false);
    }
  };
  const handleChangePerDep = (e) => {
    setPremiumPerDependent(e.target.value);
    setPremiumPerFamily(0);
    if (typeof e.target.value === 'string' && e.target.value !== '') {
      setIsPremiumPerFamilyDisable(true);
    } else {
      setIsPremiumPerFamilyDisable(false);
    }
  };

  const addPolicyTemplate = (
    <Fragment>
      <Formik
        initialValues={{
          tpaUuid: !!isEditPolicy ? currentPolicyObj.TPAUUID : '',
          corporateUuid: !!isEditPolicy ? currentPolicyObj.corporateUUID : '',
          insuranceCompanyUuid: !!isEditPolicy
            ? currentPolicyObj.insuranceCompanyUUID
            : '',
          policyId: !!isEditPolicy ? currentPolicyObj.policyNumber : '',
          fromDate: !!isEditPolicy ? currentPolicyObj.fromDate : fromDtPolicy,
          toDate: !!isEditPolicy ? currentPolicyObj.toDate : toDtPolicy,
          policyYear: !!isEditPolicy
            ? currentPolicyObj.policyYear
            : policyYearFromTo,
          familyDefinition: !!isEditPolicy
            ? currentPolicyObj.familyDefinition
            : '',
          numberOfFamilies: !!isEditPolicy
            ? currentPolicyObj.numberOfFamilies
            : '',
          numberOfDependents: !!isEditPolicy
            ? currentPolicyObj.numberOfDependents
            : '',
          sumInsured: !!isEditPolicy
            ? Math.round(currentPolicyObj.sumInsured)
            : '',
          premiumPerFamily: premiumPerFamily,
          premiumPerDependent: premiumPerDependent,
          opd: !!isEditPolicy ? currentPolicyObj.OPD : '',
          maternityCover: !!isEditPolicy ? currentPolicyObj.maternityCover : '',
          maternityLimit: !!isEditPolicy ? currentPolicyObj.maternityLimit : '',
          babyCoverDayOne: !!isEditPolicy
            ? currentPolicyObj.babyCoverDayOne
            : '',
          preExistingCover: !!isEditPolicy
            ? currentPolicyObj.preExistingCover
            : '',
          firstYearExclusions: !!isEditPolicy
            ? currentPolicyObj.firstYearExclusions
            : '',
          secondYearExclusions: !!isEditPolicy
            ? currentPolicyObj.secondYearExclusions
            : '',
          congenitalDiseasesInternal: !!isEditPolicy
            ? currentPolicyObj.congenitalDiseasesInternal
            : '',
          congenitalDiseasesExternal: !!isEditPolicy
            ? currentPolicyObj.congenitalDiseasesExternal
            : '',
          corporateBufferAndConditions: !!isEditPolicy
            ? currentPolicyObj.corporateBufferAndConditions
            : '',
          categories: !!isEditPolicy ? currentPolicyObj.categories : '',
          roomRentLimits: !!isEditPolicy ? currentPolicyObj.roomRentLimits : '',
          copay: !!isEditPolicy ? currentPolicyObj.copay : '',
          parentalSubLimit: !!isEditPolicy
            ? currentPolicyObj.parentalSubLimit
            : '',
          parentalCopay: !!isEditPolicy ? currentPolicyObj.parentalCopay : '',
          opdLimit: !!isEditPolicy ? currentPolicyObj.OPDLimit : '',
          appendicitis: !!isEditPolicy ? currentPolicyObj.appendicitis : '',
          hernia: !!isEditPolicy ? currentPolicyObj.hernia : '',
          arthiritis: !!isEditPolicy ? currentPolicyObj.arthiritis : '',
          digestiveDisorders: !!isEditPolicy
            ? currentPolicyObj.digestiveDisorders
            : '',
          cataract: !!isEditPolicy ? currentPolicyObj.cataract : '',
          gallBladderAndHisterectomy: !!isEditPolicy
            ? currentPolicyObj.gallBladderAndHisterectomy
            : '',
          kneeReplacement: !!isEditPolicy
            ? currentPolicyObj.kneeReplacement
            : '',
          jointReplacementIncludingVertrebalJoints: !!isEditPolicy
            ? currentPolicyObj.jointReplacementIncludingVertrebalJoints
            : '',
          treatmentForKidneyStones: !!isEditPolicy
            ? currentPolicyObj.treatmentForKidneyStones
            : '',
          piles: !!isEditPolicy ? currentPolicyObj.piles : '',
          hydrocele: !!isEditPolicy ? currentPolicyObj.hydrocele : '',
          lasikSurgery: !!isEditPolicy ? currentPolicyObj.lasikSurgery : '',
          wellnessProgram: !!isEditPolicy
            ? currentPolicyObj.wellnessProgram
            : '',
          others: !!isEditPolicy ? currentPolicyObj.others : '',
          helpdeskSchedule: !!isEditPolicy
            ? currentPolicyObj.helpdeskSchedule
            : '',
          visistaSpoc1Name: !!isEditPolicy
            ? currentPolicyObj.visistaSPOC1Name
            : '',
          visistaSpoc1Designation: !!isEditPolicy
            ? currentPolicyObj.visistaSPOC1Designation
            : '',
          visistaSpoc1Email: !!isEditPolicy
            ? currentPolicyObj.visistaSPOC1Email
            : '',
          visistaSpoc1Mobile: !!isEditPolicy
            ? currentPolicyObj.visistaSPOC1Mobile
            : '',
          visistaSpoc2Name: !!isEditPolicy
            ? currentPolicyObj.visistaSPOC2Name
            : '',
          visistaSpoc2Designation: !!isEditPolicy
            ? currentPolicyObj.visistaSPOC2Designation
            : '',
          visistaSpoc2Email: !!isEditPolicy
            ? currentPolicyObj.visistaSPOC2Email
            : '',
          visistaSpoc2Mobile: !!isEditPolicy
            ? currentPolicyObj.visistaSPOC2Mobile
            : '',
          visistaSpoc3Name: !!isEditPolicy
            ? currentPolicyObj.visistaSPOC3Name
            : '',
          visistaSpoc3Designation: !!isEditPolicy
            ? currentPolicyObj.visistaSPOC3Designation
            : '',
          visistaSpoc3Email: !!isEditPolicy
            ? currentPolicyObj.visistaSPOC3Email
            : '',
          visistaSpoc3Mobile: !!isEditPolicy
            ? currentPolicyObj.visistaSPOC3Mobile
            : '',
          tpaSpoc1Name: !!isEditPolicy ? currentPolicyObj.TPASPOC1Name : '',
          tpaSpoc1Designation: !!isEditPolicy
            ? currentPolicyObj.TPASPOC1Designation
            : '',
          tpaSpoc1Email: !!isEditPolicy ? currentPolicyObj.TPASPOC1Email : '',
          tpaSpoc1Mobile: !!isEditPolicy ? currentPolicyObj.TPASPOC1Mobile : '',
          tpaSpoc2Name: !!isEditPolicy ? currentPolicyObj.TPASPOC2Name : '',
          tpaSpoc2Designation: !!isEditPolicy
            ? currentPolicyObj.TPASPOC2Designation
            : '',
          tpaSpoc2Email: !!isEditPolicy ? currentPolicyObj.TPASPOC2Email : '',
          tpaSpoc2Mobile: !!isEditPolicy ? currentPolicyObj.TPASPOC2Mobile : '',
          tpaSpoc3Name: !!isEditPolicy ? currentPolicyObj.TPASPOC3Name : '',
          tpaSpoc3Designation: !!isEditPolicy
            ? currentPolicyObj.TPASPOC3Designation
            : '',
          tpaSpoc3Email: !!isEditPolicy ? currentPolicyObj.TPASPOC3Email : '',
          tpaSpoc3Mobile: !!isEditPolicy ? currentPolicyObj.TPASPOC3Mobile : '',
          clientSpoc1Empid: !!isEditPolicy
            ? currentPolicyObj.clientSPOC1Empid
            : '',
          clientSpoc1Name: !!isEditPolicy
            ? currentPolicyObj.clientSPOC1Name
            : '',
          clientSpoc1Email: !!isEditPolicy
            ? currentPolicyObj.clientSPOC1Email
            : '',
          clientSpoc1Designation: !!isEditPolicy
            ? currentPolicyObj.clientSPOC1Designation
            : '',
          clientSpoc1Mobile: !!isEditPolicy
            ? currentPolicyObj.clientSPOC1Mobile
            : '',
          clientSpoc2Empid: !!isEditPolicy
            ? currentPolicyObj.clientSPOC2Empid
            : '',
          clientSpoc2Name: !!isEditPolicy
            ? currentPolicyObj.clientSPOC2Name
            : '',
          clientSpoc2Designation: !!isEditPolicy
            ? currentPolicyObj.clientSPOC2Designation
            : '',
          clientSpoc2Email: !!isEditPolicy
            ? currentPolicyObj.clientSPOC2Email
            : '',
          clientSpoc2Mobile: !!isEditPolicy
            ? currentPolicyObj.clientSPOC2Mobile
            : '',
          clientSpoc3Empid: !!isEditPolicy
            ? currentPolicyObj.clientSPOC3Empid
            : '',
          clientSpoc3Name: !!isEditPolicy
            ? currentPolicyObj.clientSPOC3Name
            : '',
          clientSpoc3Designation: !!isEditPolicy
            ? currentPolicyObj.clientSPOC3Designation
            : '',
          clientSpoc3Email: !!isEditPolicy
            ? currentPolicyObj.clientSPOC3Email
            : '',
          clientSpoc3Mobile: !!isEditPolicy
            ? currentPolicyObj.clientSPOC3Mobile
            : '',
        }}
        validationSchema={Yup.object().shape({
          tpaUuid: Yup.string().required('Required'),
          corporateUuid: Yup.string().required('Required'),
          insuranceCompanyUuid: Yup.string().required('Required'),
          policyId: Yup.string().required('Required'),
          fromDate: Yup.string().required('Required'),
          toDate: Yup.string().required('Required'),
          policyYear: Yup.string().required('Required'),
          familyDefinition: Yup.string().required('Required'),
          numberOfFamilies: Yup.string()
            .matches(/^[0-9]*$/)
            .required('Required'),
          numberOfDependents: Yup.string()
            .matches(/^[0-9]*$/)
            .required('Required'),
          sumInsured: Yup.string()
            .matches(/^[0-9]*$/)
            .required('Required'),
          premiumPerFamily: Yup.string()
            .matches(/^[0-9]*$/)
            .required('Required'),
          premiumPerDependent: Yup.string()
            .matches(/^[0-9]*$/)
            .required('Required'),
          opd: Yup.string().required('Required'),
          maternityCover: Yup.string().required('Required'),
          maternityLimit: '',
          babyCoverDayOne: Yup.string().required('Required'),
          preExistingCover: Yup.string().required('Required'),
          firstYearExclusions: Yup.string().required('Required'),
          secondYearExclusions: Yup.string().required('Required'),
          congenitalDiseasesInternal: Yup.string().required('Required'),
          congenitalDiseasesExternal: Yup.string().required('Required'),
          corporateBufferAndConditions: Yup.string().required('Required'),
          categories: '',
          roomRentLimits: '',
          copay: '',
          parentalSubLimit: '',
          parentalCopay: '',
          opdLimit: '',
          appendicitis: '',
          hernia: '',
          arthiritis: '',
          digestiveDisorders: '',
          cataract: '',
          gallBladderAndHisterectomy: '',
          kneeReplacement: '',
          jointReplacementIncludingVertrebalJoints: '',
          treatmentForKidneyStones: '',
          piles: '',
          hydrocele: '',
          lasikSurgery: '',
          wellnessProgram: '',
          others: '',
          helpdeskSchedule: Yup.string().required('Required'),
          visistaSpoc1Name: Yup.string().required('Required'),
          visistaSpoc1Designation: Yup.string().required('Required'),
          visistaSpoc1Email: Yup.string()
            .email('Must be valid email')
            .required('Required'),
          visistaSpoc1Mobile: Yup.string()
            .matches(/^[0-9]{10}$/, 'Must be exactly 10 digits')
            .required('Required'),
          visistaSpoc2Name: '',
          visistaSpoc2Designation: '',
          visistaSpoc2Email: Yup.string().email('Must be valid email'),
          visistaSpoc2Mobile: Yup.string().matches(
            /^[0-9]{10}$/,
            'Must be exactly 10 digits'
          ),
          visistaSpoc3Name: '',
          visistaSpoc3Designation: '',
          visistaSpoc3Email: Yup.string().email('Must be valid email'),
          visistaSpoc3Mobile: Yup.string().matches(
            /^[0-9]{10}$/,
            'Must be exactly 10 digits'
          ),
          tpaSpoc1Name: Yup.string().required('Required'),
          tpaSpoc1Designation: Yup.string().required('Required'),
          tpaSpoc1Email: Yup.string()
            .email('Must be valid email')
            .required('Required'),
          tpaSpoc1Mobile: Yup.string()
            .matches(/^[0-9]{10}$/, 'Must be exactly 10 digits')
            .required('Required'),
          tpaSpoc2Name: '',
          tpaSpoc2Designation: '',
          tpaSpoc2Email: Yup.string().email('Must be valid email'),
          tpaSpoc2Mobile: Yup.string().matches(
            /^[0-9]{10}$/,
            'Must be exactly 10 digits'
          ),
          tpaSpoc3Name: '',
          tpaSpoc3Designation: '',
          tpaSpoc3Email: Yup.string().email('Must be valid email'),
          tpaSpoc3Mobile: Yup.string().matches(
            /^[0-9]{10}$/,
            'Must be exactly 10 digits'
          ),
          clientSpoc1Empid: Yup.string().required('Required'),
          clientSpoc1Name: Yup.string().required('Required'),
          clientSpoc1Email: Yup.string()
            .email('Must be valid email')
            .required('Required'),
          clientSpoc1Designation: Yup.string().required('Required'),
          clientSpoc1Mobile: Yup.string()
            .matches(/^[0-9]{10}$/, 'Must be exactly 10 digits')
            .required('Required'),
          clientSpoc2Empid: '',
          clientSpoc2Name: '',
          clientSpoc2Designation: '',
          clientSpoc2Email: Yup.string().email('Must be valid email'),
          clientSpoc2Mobile: Yup.string().matches(
            /^[0-9]{10}$/,
            'Must be exactly 10 digits'
          ),
          clientSpoc3Empid: '',
          clientSpoc3Name: '',
          clientSpoc3Designation: '',
          clientSpoc3Email: Yup.string().email('Must be valid email'),
          clientSpoc3Mobile: Yup.string().matches(
            /^[0-9]{10}$/,
            'Must be exactly 10 digits'
          ),
        })}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          const postData = {
            ...values,
            uuid: currentUser.uuid,
            fromDate: fromDtPolicy,
            toDate: toDtPolicy,
            policyYear: policyYearFromTo,
            maternityLimit: !!values.maternityLimit
              ? values.maternityLimit
              : '0',
            roomRentLimits: !!values.roomRentLimits
              ? values.roomRentLimits
              : '0',
            copay: !!values.copay ? values.copay : '0',
            parentalSubLimit: !!values.parentalSubLimit
              ? values.parentalSubLimit
              : '0',
            parentalCopay: !!values.parentalCopay ? values.parentalCopay : '0',
            opdLimit: !!values.opdLimit ? values.opdLimit : '0',
            appendicitis: !!values.appendicitis ? values.appendicitis : '0',
            hernia: !!values.hernia ? values.hernia : '0',
            arthiritis: !!values.arthiritis ? values.arthiritis : '0',
            digestiveDisorders: !!values.digestiveDisorders
              ? values.digestiveDisorders
              : '0',
            cataract: !!values.cataract ? values.cataract : '0',
            gallBladderAndHisterectomy: !!values.gallBladderAndHisterectomy
              ? values.gallBladderAndHisterectomy
              : '0',
            kneeReplacement: !!values.kneeReplacement
              ? values.kneeReplacement
              : '0',
            jointReplacementIncludingVertrebalJoints: !!values.jointReplacementIncludingVertrebalJoints
              ? values.jointReplacementIncludingVertrebalJoints
              : '0',
            treatmentForKidneyStones: !!values.treatmentForKidneyStones
              ? values.treatmentForKidneyStones
              : '0',
            piles: !!values.piles ? values.piles : '0',
            hydrocele: !!values.hydrocele ? values.hydrocele : '0',

            lasikSurgery: !!values.lasikSurgery ? values.lasikSurgery : '0',

            wellnessProgram: !!values.wellnessProgram
              ? values.wellnessProgram
              : '',
            others: !!values.others ? values.others : '',
            premiumPerDependent: premiumPerDependent,
            premiumPerFamily: premiumPerFamily,
          };

          // let methodType = props.propObj.methodType;

          if (!!isEditPolicy) {
            postData.uuid = currentPolicyObj.uuid;
          }

          const addEditPolicyCB = (cbAPI) => {
            cbAPI
              .then((response) => {
                // console.log('response Resend ', response);
                if (
                  typeof response !== 'undefined' &&
                  response.errCode.toLowerCase() === 'success'
                ) {
                  !isEditPolicy
                    ? history.push(props.propObj.redirectURL)
                    : history.goBack();

                  let respNotiObj = {
                    message: !isEditPolicy
                      ? 'Policy Added successfully'
                      : 'Policy updated successfully',
                    color: 'success',
                  };
                  PubSub.publish(PubSub.events.SNACKBAR_PROVIDER, respNotiObj);
                }
              })

              .catch((err) => {
                console.log(`Resend Error ${JSON.stringify(err)} `);
                if (!!err.data && (!!err.data.errCode || !!err.data.message)) {
                  let respNotiObj = {
                    message: err.data.message || err.data.errCode,
                    color: 'error',
                  };
                  PubSub.publish(PubSub.events.SNACKBAR_PROVIDER, respNotiObj);
                }
              })
              .finally(() => {
                console.log(`Finally `);
              });
          };

          !!isEditPolicy
            ? addEditPolicyCB(
                ApiService.put(`${EMP_CONST.URL.exe_policiesList}`, postData)
              )
            : addEditPolicyCB(
                ApiService.post(`${EMP_CONST.URL.exe_policiesList}`, [postData])
              );

          setTimeout(() => {
            setSubmitting(false);
            resetForm(values);
          }, 500);
        }}
        render={({
          handleSubmit,
          handleReset,
          handleChange,
          isSubmitting,
          handleBlur,
          values,
          errors,
          touched,
          dirty,
          submitForm,
        }) => (
          <Fragment>
            {/* <pre>{JSON.stringify(values, null, 1)}</pre> */}
            <Form>
              <div className="hpr_addEmployeeWrapper">
                <div className="hpr_aEmployeeFormFieldsWrapper hpr-add-policy-wrapper p-0">
                  <div className="row">
                    <div className="col-12 hpr_aEColWrapper mt-2">
                      <div className="hpr-policy-section-heading">
                        Policy Details
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                      <div className="hpr_aETxtFieldsWrapper">
                        <TextField
                          id="corporateUuid"
                          label="Corporate"
                          select
                          type="text"
                          value={values.corporateUuid}
                          onChange={handleChange('corporateUuid')}
                          error={errors.corporateUuid && touched.corporateUuid}
                          helperText={
                            errors.corporateUuid && touched.corporateUuid
                              ? errors.corporateUuid
                              : null
                          }
                        >
                          {corporatesData.map((obj) => (
                            <MenuItem key={obj.uuid} value={obj.uuid}>
                              {CapitalizeFirstLetter(obj.companyName)}
                            </MenuItem>
                          ))}
                        </TextField>
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                      <div className="hpr_aETxtFieldsWrapper">
                        <TextField
                          id="policyId"
                          label="Policy Number"
                          type="text"
                          value={values.policyId}
                          onChange={handleChange}
                          error={errors.policyId && touched.policyId}
                          helperText={
                            errors.policyId && touched.policyId
                              ? errors.policyId
                              : null
                          }
                        />
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                      <div className="hpr_aETxtFieldsWrapper">
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <DatePicker
                            id="fromDate"
                            autoOk
                            label="From Date"
                            value={fromDtPolicy}
                            onChange={handleFromDtChange}
                            minDate={new Date(new Date().getFullYear() - 364)}
                            format="dd/MM/yyyy"
                            animateYearScrolling
                            InputProps={{
                              endAdornment: (
                                <FontAwesomeIcon icon="calendar-alt" />
                              ),
                            }}
                            error={errors.fromDate && touched.fromDate}
                            helperText={
                              errors.fromDate && touched.fromDate
                                ? errors.fromDate
                                : null
                            }
                          />
                        </MuiPickersUtilsProvider>
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                      <div className="hpr_aETxtFieldsWrapper">
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <DatePicker
                            id="toDate"
                            autoOk
                            label="To Date"
                            value={toDtPolicy}
                            disabled="true"
                            // onChange={handleToDtChange}
                            format="dd/MM/yyyy"
                            animateYearScrolling
                            InputProps={{
                              endAdornment: (
                                <FontAwesomeIcon icon="calendar-alt" />
                              ),
                            }}
                          />
                        </MuiPickersUtilsProvider>
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                      <div className="hpr_aETxtFieldsWrapper">
                        <TextField
                          id="policyYear"
                          label="Policy Year"
                          type="text"
                          value={policyYearFromTo}
                          disabled="true"
                          error={errors.policyYear && touched.policyYear}
                          helperText={
                            errors.policyYear && touched.policyYear
                              ? errors.policyYear
                              : null
                          }
                        />
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                      <div className="hpr_aETxtFieldsWrapper">
                        <TextField
                          id="insuranceCompanyUuid"
                          label="Insurance Company "
                          select
                          type="text"
                          value={values.insuranceCompanyUuid}
                          onChange={handleChange('insuranceCompanyUuid')}
                          error={
                            errors.insuranceCompanyUuid &&
                            touched.insuranceCompanyUuid
                          }
                          helperText={
                            errors.insuranceCompanyUuid &&
                            touched.insuranceCompanyUuid
                              ? errors.insuranceCompanyUuid
                              : null
                          }
                        >
                          {insuranceCompaniesData.map((val) => (
                            <MenuItem key={val.uuid} value={val.uuid}>
                              {CapitalizeFirstLetter(val.companyName)}
                            </MenuItem>
                          ))}
                        </TextField>
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                      <div className="hpr_aETxtFieldsWrapper">
                        <TextField
                          id="tpa"
                          label="TPA"
                          select
                          type="text"
                          value={values.tpaUuid}
                          onChange={handleChange('tpaUuid')}
                          error={errors.tpaUuid && touched.tpaUuid}
                          helperText={
                            errors.tpaUuid && touched.tpaUuid
                              ? errors.tpaUuid
                              : null
                          }
                        >
                          {tpasListData.map((val) => (
                            <MenuItem key={val.uuid} value={val.uuid}>
                              {val.displayName}
                            </MenuItem>
                          ))}
                        </TextField>
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                      <div className="hpr_aETxtFieldsWrapper">
                        <TextField
                          id="familyDefinition"
                          label="Family Definition"
                          select
                          type="text"
                          value={values.familyDefinition}
                          onChange={handleChange('familyDefinition')}
                          onBlur={handleBlur}
                          error={
                            errors.familyDefinition && touched.familyDefinition
                          }
                          helperText={
                            errors.familyDefinition && touched.familyDefinition
                              ? errors.familyDefinition
                              : null
                          }
                        >
                          {EMP_CONST.FAMILY_DEFINITION.map((val) => (
                            <MenuItem key={val} value={val}>
                              {CapitalizeFirstLetter(val)}
                            </MenuItem>
                          ))}
                        </TextField>
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                      <div className="hpr_aETxtFieldsWrapper">
                        <TextField
                          id="numberOfFamilies"
                          label="No of Employees"
                          type="number"
                          value={values.numberOfFamilies}
                          onChange={handleChange}
                          error={
                            errors.numberOfFamilies && touched.numberOfFamilies
                          }
                          helperText={
                            errors.numberOfFamilies && touched.numberOfFamilies
                              ? errors.numberOfFamilies
                              : null
                          }
                        />
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                      <div className="hpr_aETxtFieldsWrapper">
                        <TextField
                          id="numberOfDependents"
                          label="Number of Dependents"
                          type="number"
                          value={values.numberOfDependents}
                          onChange={handleChange}
                          error={
                            errors.numberOfDependents &&
                            touched.numberOfDependents
                          }
                          helperText={
                            errors.numberOfDependents &&
                            touched.numberOfDependents
                              ? errors.numberOfDependents
                              : null
                          }
                        ></TextField>
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                      <div className="hpr_aETxtFieldsWrapper">
                        <TextField
                          id="sumInsured"
                          label="Sum Insured"
                          type="number"
                          value={values.sumInsured}
                          onChange={handleChange}
                          error={errors.sumInsured && touched.sumInsured}
                          helperText={
                            errors.sumInsured && touched.sumInsured
                              ? errors.sumInsured
                              : null
                          }
                        />
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                      <div className="hpr_aETxtFieldsWrapper">
                        <TextField
                          id="premiumPerFamily"
                          label="Premium Per Family"
                          type="number"
                          value={premiumPerFamily}
                          onChange={handleChangePerMem}
                          error={
                            errors.premiumPerFamily && touched.premiumPerFamily
                          }
                          disabled={!!isPremiumPerFamilyDisable}
                          helperText={
                            errors.premiumPerFamily && touched.premiumPerFamily
                              ? errors.premiumPerFamily
                              : null
                          }
                        />
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                      <div className="hpr_aETxtFieldsWrapper">
                        <TextField
                          id="premiumPerDependent"
                          label="Premium Per Member"
                          type="number"
                          value={premiumPerDependent}
                          onChange={handleChangePerDep}
                          disabled={!!isPremiumPerDependentDisable}
                          error={
                            errors.premiumPerDependent &&
                            touched.premiumPerDependent
                          }
                          helperText={
                            errors.premiumPerDependent &&
                            touched.premiumPerDependent
                              ? errors.premiumPerDependent
                              : null
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="hpr_addEmployeeWrapper mt-3">
                <div className="hpr_aEmployeeFormFieldsWrapper hpr-add-policy-wrapper p-0">
                  <div className="row">
                    <div className="col-12 hpr_aEColWrapper mt-2">
                      <div className="hpr-policy-section-heading">
                        Coverage Details
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                      <div className="hpr_aETxtFieldsWrapper">
                        <FormLabel component="legend">OPD</FormLabel>
                        <RadioGroup
                          id="opd"
                          row
                          label="opd"
                          value={values.opd}
                          onChange={handleChange('opd')}
                          error={errors.opd && touched.opd}
                          helperText={
                            errors.opd && touched.opd ? errors.opd : null
                          }
                        >
                          {EMP_CONST.YES_NO.map((value) => (
                            <FormControlLabel
                              label={value}
                              key={value}
                              value={value}
                              control={<Radio color="primary" />}
                            />
                          ))}
                        </RadioGroup>

                        <FormHelperText
                          error={Boolean(errors.opd) && touched.opd}
                        >
                          {errors.opd}
                        </FormHelperText>
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                      <div className="hpr_aETxtFieldsWrapper">
                        <FormLabel component="legend">
                          Maternity Cover
                        </FormLabel>
                        <RadioGroup
                          row
                          name="maternityCover"
                          value={values.maternityCover}
                          onChange={handleChange('maternityCover')}
                        >
                          {EMP_CONST.YES_NO.map((value) => (
                            <FormControlLabel
                              label={value}
                              key={value}
                              value={value}
                              control={<Radio color="primary" />}
                            />
                          ))}
                        </RadioGroup>
                        <FormHelperText
                          error={
                            Boolean(errors.maternityCover) &&
                            touched.maternityCover
                          }
                        >
                          {errors.maternityCover}
                        </FormHelperText>
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                      <div className="hpr_aETxtFieldsWrapper">
                        <FormLabel component="legend">
                          Baby Cover Day One 
                        </FormLabel>
                        <RadioGroup
                          row
                          name="babyCoverDayOne"
                          value={values.babyCoverDayOne}
                          onChange={handleChange('babyCoverDayOne')}
                        >
                          {EMP_CONST.YES_NO.map((value) => (
                            <FormControlLabel
                              label={value}
                              key={value}
                              value={value}
                              control={<Radio color="primary" />}
                            />
                          ))}
                        </RadioGroup>
                        <FormHelperText
                          error={
                            Boolean(errors.babyCoverDayOne) &&
                            touched.babyCoverDayOne
                          }
                        >
                          {errors.babyCoverDayOne}
                        </FormHelperText>
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                      <div className="hpr_aETxtFieldsWrapper">
                        <FormLabel component="legend">
                          Pre Existing Cover 
                        </FormLabel>
                        <RadioGroup
                          row
                          name="preExistingCover"
                          value={values.preExistingCover}
                          onChange={handleChange('preExistingCover')}
                        >
                          {EMP_CONST.YES_NO.map((value) => (
                            <FormControlLabel
                              label={value}
                              key={value}
                              value={value}
                              control={<Radio color="primary" />}
                            />
                          ))}
                        </RadioGroup>
                        <FormHelperText
                          error={
                            Boolean(errors.preExistingCover) &&
                            touched.preExistingCover
                          }
                        >
                          {errors.preExistingCover}
                        </FormHelperText>
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                      <div className="hpr_aETxtFieldsWrapper">
                        <FormLabel component="legend">
                          First Year Exclusions
                        </FormLabel>
                        <RadioGroup
                          row
                          name="firstYearExclusions"
                          value={values.firstYearExclusions}
                          onChange={handleChange('firstYearExclusions')}
                        >
                          {EMP_CONST.YES_NO.map((value) => (
                            <FormControlLabel
                              label={value}
                              key={value}
                              value={value}
                              control={<Radio color="primary" />}
                            />
                          ))}
                        </RadioGroup>
                        <FormHelperText
                          error={
                            Boolean(errors.firstYearExclusions) &&
                            touched.firstYearExclusions
                          }
                        >
                          {errors.firstYearExclusions}
                        </FormHelperText>
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                      <div className="hpr_aETxtFieldsWrapper">
                        <FormLabel component="legend">
                          Second Year Exclusions
                        </FormLabel>
                        <RadioGroup
                          row
                          name="secondYearExclusions"
                          value={values.secondYearExclusions}
                          onChange={handleChange('secondYearExclusions')}
                        >
                          {EMP_CONST.YES_NO.map((value) => (
                            <FormControlLabel
                              label={value}
                              key={value}
                              value={value}
                              control={<Radio color="primary" />}
                            />
                          ))}
                        </RadioGroup>
                        <FormHelperText
                          error={
                            Boolean(errors.secondYearExclusions) &&
                            touched.secondYearExclusions
                          }
                        >
                          {errors.secondYearExclusions}
                        </FormHelperText>
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                      <div className="hpr_aETxtFieldsWrapper">
                        <FormLabel component="legend">
                          Congenital Diseases Internal
                        </FormLabel>
                        <RadioGroup
                          row
                          name="congenitalDiseasesInternal"
                          value={values.congenitalDiseasesInternal}
                          onChange={handleChange('congenitalDiseasesInternal')}
                        >
                          {EMP_CONST.YES_NO.map((value) => (
                            <FormControlLabel
                              label={value}
                              key={value}
                              value={value}
                              control={<Radio color="primary" />}
                            />
                          ))}
                        </RadioGroup>
                        <FormHelperText
                          error={
                            Boolean(errors.congenitalDiseasesInternal) &&
                            touched.congenitalDiseasesInternal
                          }
                        >
                          {errors.congenitalDiseasesInternal}
                        </FormHelperText>
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                      <div className="hpr_aETxtFieldsWrapper">
                        <FormLabel component="legend">
                          Congenital Diseases External 
                        </FormLabel>
                        <RadioGroup
                          row
                          name="congenitalDiseasesExternal"
                          value={values.congenitalDiseasesExternal}
                          onChange={handleChange('congenitalDiseasesExternal')}
                        >
                          {EMP_CONST.YES_NO.map((value) => (
                            <FormControlLabel
                              label={value}
                              key={value}
                              value={value}
                              control={<Radio color="primary" />}
                            />
                          ))}
                        </RadioGroup>
                        <FormHelperText
                          error={
                            Boolean(errors.congenitalDiseasesExternal) &&
                            touched.congenitalDiseasesExternal
                          }
                        >
                          {errors.congenitalDiseasesExternal}
                        </FormHelperText>
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                      <div className="hpr_aETxtFieldsWrapper">
                        <FormLabel component="legend">
                          Corporate Buffer
                        </FormLabel>
                        <RadioGroup
                          row
                          name="corporateBufferAndConditions"
                          value={values.corporateBufferAndConditions}
                          onChange={handleChange(
                            'corporateBufferAndConditions'
                          )}
                        >
                          {EMP_CONST.YES_NO.map((value) => (
                            <FormControlLabel
                              label={value}
                              key={value}
                              value={value}
                              control={<Radio color="primary" />}
                            />
                          ))}
                        </RadioGroup>
                        <FormHelperText
                          error={
                            Boolean(errors.corporateBufferAndConditions) &&
                            touched.corporateBufferAndConditions
                          }
                        >
                          {errors.corporateBufferAndConditions}
                        </FormHelperText>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="hpr_addEmployeeWrapper mt-3">
                <div className="hpr_aEmployeeFormFieldsWrapper hpr-add-policy-wrapper p-0">
                  <div className="row">
                    <div className="col-12 hpr_aEColWrapper mt-2">
                      <div className="hpr-policy-section-heading">
                        Policy Sub Limits
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                      <div className="hpr_aETxtFieldsWrapper">
                        <TextField
                          id="maternityLimit"
                          label="Maternity Limit"
                          type="text"
                          value={values.maternityLimit}
                          onChange={handleChange}
                          error={
                            errors.maternityLimit && touched.maternityLimit
                          }
                          helperText={
                            errors.maternityLimit && touched.maternityLimit
                              ? errors.maternityLimit
                              : null
                          }
                        />
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                      <div className="hpr_aETxtFieldsWrapper">
                        <TextField
                          id="roomRentLimits"
                          label="Room Rent Limits"
                          type="text"
                          value={values.roomRentLimits}
                          onChange={handleChange}
                          error={
                            errors.roomRentLimits && touched.roomRentLimits
                          }
                          helperText={
                            errors.roomRentLimits && touched.roomRentLimits
                              ? errors.roomRentLimits
                              : null
                          }
                        />
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                      <div className="hpr_aETxtFieldsWrapper">
                        <TextField
                          id="copay"
                          label="Co-Pay"
                          type="number"
                          value={values.copay}
                          onChange={handleChange}
                          error={errors.copay && touched.copay}
                          helperText={
                            errors.copay && touched.copay ? errors.copay : null
                          }
                        />
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                      <div className="hpr_aETxtFieldsWrapper">
                        <TextField
                          id="parentalSubLimit"
                          label="Parental Sub Limit"
                          type="number"
                          value={values.parentalSubLimit}
                          onChange={handleChange}
                          error={
                            errors.parentalSubLimit && touched.parentalSubLimit
                          }
                          helperText={
                            errors.parentalSubLimit && touched.parentalSubLimit
                              ? errors.parentalSubLimit
                              : null
                          }
                        />
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                      <div className="hpr_aETxtFieldsWrapper">
                        <TextField
                          id="parentalCopay"
                          label="Parental Co-Pay"
                          type="number"
                          value={values.parentalCopay}
                          onChange={handleChange}
                          error={errors.parentalCopay && touched.parentalCopay}
                          helperText={
                            errors.parentalCopay && touched.parentalCopay
                              ? errors.parentalCopay
                              : null
                          }
                        />
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                      <div className="hpr_aETxtFieldsWrapper">
                        <TextField
                          id="opdLimit"
                          label="OPD Limit"
                          type="number"
                          value={values.opdLimit}
                          onChange={handleChange}
                          error={errors.opdLimit && touched.opdLimit}
                          helperText={
                            errors.opdLimit && touched.opdLimit
                              ? errors.opdLimit
                              : null
                          }
                        />
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                      <div className="hpr_aETxtFieldsWrapper">
                        <TextField
                          id="appendicitis"
                          label="Appendicitis"
                          type="number"
                          value={values.appendicitis}
                          onChange={handleChange}
                          error={errors.appendicitis && touched.appendicitis}
                          helperText={
                            errors.appendicitis && touched.appendicitis
                              ? errors.appendicitis
                              : null
                          }
                        />
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                      <div className="hpr_aETxtFieldsWrapper">
                        <TextField
                          id="hernia"
                          label="Hernia"
                          type="number"
                          value={values.hernia}
                          onChange={handleChange}
                          error={errors.hernia && touched.hernia}
                          helperText={
                            errors.hernia && touched.hernia
                              ? errors.hernia
                              : null
                          }
                        />
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                      <div className="hpr_aETxtFieldsWrapper">
                        <TextField
                          id="arthiritis"
                          label="Arthiritis"
                          type="number"
                          value={values.arthiritis}
                          onChange={handleChange}
                          error={errors.arthiritis && touched.arthiritis}
                          helperText={
                            errors.arthiritis && touched.arthiritis
                              ? errors.arthiritis
                              : null
                          }
                        />
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                      <div className="hpr_aETxtFieldsWrapper">
                        <TextField
                          id="digestiveDisorders"
                          label="Digestive disorders"
                          type="number"
                          value={values.digestiveDisorders}
                          onChange={handleChange}
                          error={
                            errors.digestiveDisorders &&
                            touched.digestiveDisorders
                          }
                          helperText={
                            errors.digestiveDisorders &&
                            touched.digestiveDisorders
                              ? errors.digestiveDisorders
                              : null
                          }
                        />
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                      <div className="hpr_aETxtFieldsWrapper">
                        <TextField
                          id="cataract"
                          label="Cataract"
                          type="number"
                          value={values.cataract}
                          onChange={handleChange}
                          error={errors.cataract && touched.cataract}
                          helperText={
                            errors.cataract && touched.cataract
                              ? errors.cataract
                              : null
                          }
                        />
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                      <div className="hpr_aETxtFieldsWrapper">
                        <TextField
                          id="gallBladderAndHisterectomy"
                          label="Gall Bladder & Hysterectomy"
                          type="number"
                          value={values.gallBladderAndHisterectomy}
                          onChange={handleChange}
                          error={
                            errors.gallBladderAndHisterectomy &&
                            touched.gallBladderAndHisterectomy
                          }
                          helperText={
                            errors.gallBladderAndHisterectomy &&
                            touched.gallBladderAndHisterectomy
                              ? errors.gallBladderAndHisterectomy
                              : null
                          }
                        />
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                      <div className="hpr_aETxtFieldsWrapper">
                        <TextField
                          id="kneeReplacement"
                          label="Knee Replacement"
                          type="number"
                          value={values.kneeReplacement}
                          onChange={handleChange}
                          error={
                            errors.kneeReplacement && touched.kneeReplacement
                          }
                          helperText={
                            errors.kneeReplacement && touched.kneeReplacement
                              ? errors.kneeReplacement
                              : null
                          }
                        />
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                      <div className="hpr_aETxtFieldsWrapper">
                        <TextField
                          id="jointReplacementIncludingVertrebalJoints"
                          label="Joint replacement Including Vertebral Joints"
                          type="number"
                          value={
                            values.jointReplacementIncludingVertrebalJoints
                          }
                          onChange={handleChange}
                          error={
                            errors.jointReplacementIncludingVertrebalJoints &&
                            touched.jointReplacementIncludingVertrebalJoints
                          }
                          helperText={
                            errors.jointReplacementIncludingVertrebalJoints &&
                            touched.jointReplacementIncludingVertrebalJoints
                              ? errors.jointReplacementIncludingVertrebalJoints
                              : null
                          }
                        />
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                      <div className="hpr_aETxtFieldsWrapper">
                        <TextField
                          id="treatmentForKidneyStones"
                          label="Treatment for kidney Stones"
                          type="number"
                          value={values.treatmentForKidneyStones}
                          onChange={handleChange}
                          error={
                            errors.treatmentForKidneyStones &&
                            touched.treatmentForKidneyStones
                          }
                          helperText={
                            errors.treatmentForKidneyStones &&
                            touched.treatmentForKidneyStones
                              ? errors.treatmentForKidneyStones
                              : null
                          }
                        />
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                      <div className="hpr_aETxtFieldsWrapper">
                        <TextField
                          id="piles"
                          label="Piles"
                          type="number"
                          value={values.piles}
                          onChange={handleChange}
                          error={errors.piles && touched.piles}
                          helperText={
                            errors.piles && touched.piles ? errors.piles : null
                          }
                        />
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                      <div className="hpr_aETxtFieldsWrapper">
                        <TextField
                          id="hydrocele"
                          label="Hydrocele"
                          type="number"
                          value={values.hydrocele}
                          onChange={handleChange}
                          error={errors.hydrocele && touched.hydrocele}
                          helperText={
                            errors.hydrocele && touched.hydrocele
                              ? errors.hydrocele
                              : null
                          }
                        />
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                      <div className="hpr_aETxtFieldsWrapper">
                        <TextField
                          id="lasikSurgery"
                          label="Lasik Surgery"
                          type="number"
                          value={values.lasikSurgery}
                          onChange={handleChange}
                          error={errors.lasikSurgery && touched.lasikSurgery}
                          helperText={
                            errors.lasikSurgery && touched.lasikSurgery
                              ? errors.lasikSurgery
                              : null
                          }
                        />
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                      <div className="hpr_aETxtFieldsWrapper">
                        <TextField
                          id="wellnessProgram"
                          label="Wellness Program"
                          type="text"
                          value={values.wellnessProgram}
                          onChange={handleChange}
                          error={
                            errors.wellnessProgram && touched.wellnessProgram
                          }
                          helperText={
                            errors.wellnessProgram && touched.wellnessProgram
                              ? errors.wellnessProgram
                              : null
                          }
                        />
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                      <div className="hpr_aETxtFieldsWrapper">
                        <TextField
                          id="others"
                          label="Others"
                          type="text"
                          value={values.others}
                          onChange={handleChange}
                          error={errors.others && touched.others}
                          helperText={
                            errors.others && touched.others
                              ? errors.others
                              : null
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="hpr_addEmployeeWrapper mt-3">
                <div className="hpr_aEmployeeFormFieldsWrapper hpr-add-policy-wrapper p-0">
                  <div className="row">
                    <div className="col-12 hpr_aEColWrapper mt-2">
                      <div className="hpr-policy-section-heading">
                        SPOC Details
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                      <div className="hpr_aETxtFieldsWrapper">
                        <TextField
                          id="helpdeskSchedule"
                          label="Help Desk Schedule"
                          type="text"
                          value={values.helpdeskSchedule}
                          onChange={handleChange}
                          error={
                            errors.helpdeskSchedule && touched.helpdeskSchedule
                          }
                          helperText={
                            errors.helpdeskSchedule && touched.helpdeskSchedule
                              ? errors.helpdeskSchedule
                              : null
                          }
                        />
                      </div>
                    </div>

                    <div className="col-12 ">
                      <fieldset className="col-12 hpr-fieldset-wrapper ">
                        <legend>Visista SPOC</legend>
                        <div className="row">
                          <div className="col-lg-3 col-md-6 col-12 hpr_aEColWrapper">
                            <div className="hpr_aETxtFieldsWrapper">
                              <TextField
                                id="visistaSpoc1Name"
                                label="Name"
                                type="text"
                                value={values.visistaSpoc1Name}
                                onChange={handleChange}
                                error={
                                  errors.visistaSpoc1Name &&
                                  touched.visistaSpoc1Name
                                }
                                helperText={
                                  errors.visistaSpoc1Name &&
                                  touched.visistaSpoc1Name
                                    ? errors.visistaSpoc1Name
                                    : null
                                }
                              />
                            </div>
                          </div>

                          <div className="col-lg-3 col-md-6 col-12 hpr_aEColWrapper">
                            <div className="hpr_aETxtFieldsWrapper">
                              <TextField
                                id="visistaSpoc1Email"
                                label="Email"
                                type="text"
                                value={values.visistaSpoc1Email}
                                onChange={handleChange}
                                error={
                                  errors.visistaSpoc1Email &&
                                  touched.visistaSpoc1Email
                                }
                                helperText={
                                  errors.visistaSpoc1Email &&
                                  touched.visistaSpoc1Email
                                    ? errors.visistaSpoc1Email
                                    : null
                                }
                              />
                            </div>
                          </div>

                          <div className="col-lg-3 col-md-6 col-12 hpr_aEColWrapper">
                            <div className="hpr_aETxtFieldsWrapper">
                              <TextField
                                id="visistaSpoc1Mobile"
                                label="Mobile"
                                type="text"
                                value={values.visistaSpoc1Mobile}
                                onChange={handleChange}
                                error={
                                  errors.visistaSpoc1Mobile &&
                                  touched.visistaSpoc1Mobile
                                }
                                helperText={
                                  errors.visistaSpoc1Mobile &&
                                  touched.visistaSpoc1Mobile
                                    ? errors.visistaSpoc1Mobile
                                    : null
                                }
                              />
                            </div>
                          </div>

                          <div className="col-lg-3 col-md-6 col-12 hpr_aEColWrapper">
                            <div className="hpr_aETxtFieldsWrapper">
                              <TextField
                                id="visistaSpoc1Designation"
                                label="Designation"
                                type="text"
                                value={values.visistaSpoc1Designation}
                                onChange={handleChange}
                                error={
                                  errors.visistaSpoc1Designation &&
                                  touched.visistaSpoc1Designation
                                }
                                helperText={
                                  errors.visistaSpoc1Designation &&
                                  touched.visistaSpoc1Designation
                                    ? errors.visistaSpoc1Designation
                                    : null
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </fieldset>
                    </div>

                    <div className="col-12 ">
                      <fieldset className="col-12 hpr-fieldset-wrapper ">
                        <legend>Visista 1st Escalation</legend>
                        <div className="row">
                          <div className="col-lg-3 col-md-6 col-12 hpr_aEColWrapper">
                            <div className="hpr_aETxtFieldsWrapper">
                              <TextField
                                id="visistaSpoc2Name"
                                label="Name"
                                type="text"
                                value={values.visistaSpoc2Name}
                                onChange={handleChange}
                              />
                            </div>
                          </div>

                          <div className="col-lg-3 col-md-6 col-12 hpr_aEColWrapper">
                            <div className="hpr_aETxtFieldsWrapper">
                              <TextField
                                id="visistaSpoc2Email"
                                label="Email"
                                type="text"
                                value={values.visistaSpoc2Email}
                                onChange={handleChange}
                                error={
                                  errors.visistaSpoc2Email &&
                                  touched.visistaSpoc2Email
                                }
                                helperText={
                                  errors.visistaSpoc2Email &&
                                  touched.visistaSpoc2Email
                                    ? errors.visistaSpoc2Email
                                    : null
                                }
                              />
                            </div>
                          </div>

                          <div className="col-lg-3 col-md-6 col-12 hpr_aEColWrapper">
                            <div className="hpr_aETxtFieldsWrapper">
                              <TextField
                                id="visistaSpoc2Mobile"
                                label="Mobile"
                                type="text"
                                value={values.visistaSpoc2Mobile}
                                onChange={handleChange}
                                error={
                                  errors.visistaSpoc2Mobile &&
                                  touched.visistaSpoc2Mobile
                                }
                                helperText={
                                  errors.visistaSpoc2Mobile &&
                                  touched.visistaSpoc2Mobile
                                    ? errors.visistaSpoc2Mobile
                                    : null
                                }
                              />
                            </div>
                          </div>

                          <div className="col-lg-3 col-md-6 col-12 hpr_aEColWrapper">
                            <div className="hpr_aETxtFieldsWrapper">
                              <TextField
                                id="visistaSpoc2Designation"
                                label="Designation"
                                type="text"
                                value={values.visistaSpoc2Designation}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </div>
                      </fieldset>
                    </div>

                    <div className="col-12 ">
                      <fieldset className="col-12 hpr-fieldset-wrapper ">
                        <legend>Visista 2nd Escalation</legend>
                        <div className="row">
                          <div className="col-lg-3 col-md-6 col-12 hpr_aEColWrapper">
                            <div className="hpr_aETxtFieldsWrapper">
                              <TextField
                                id="visistaSpoc3Name"
                                label="Name"
                                type="text"
                                value={values.visistaSpoc3Name}
                                onChange={handleChange}
                              />
                            </div>
                          </div>

                          <div className="col-lg-3 col-md-6 col-12 hpr_aEColWrapper">
                            <div className="hpr_aETxtFieldsWrapper">
                              <TextField
                                id="visistaSpoc3Email"
                                label="Email"
                                type="text"
                                value={values.visistaSpoc3Email}
                                onChange={handleChange}
                                error={
                                  errors.visistaSpoc3Email &&
                                  touched.visistaSpoc3Email
                                }
                                helperText={
                                  errors.visistaSpoc3Email &&
                                  touched.visistaSpoc3Email
                                    ? errors.visistaSpoc3Email
                                    : null
                                }
                              />
                            </div>
                          </div>

                          <div className="col-lg-3 col-md-6 col-12 hpr_aEColWrapper">
                            <div className="hpr_aETxtFieldsWrapper">
                              <TextField
                                id="visistaSpoc3Mobile"
                                label="Mobile"
                                type="text"
                                value={values.visistaSpoc3Mobile}
                                onChange={handleChange}
                                error={
                                  errors.visistaSpoc3Mobile &&
                                  touched.visistaSpoc3Mobile
                                }
                                helperText={
                                  errors.visistaSpoc3Mobile &&
                                  touched.visistaSpoc3Mobile
                                    ? errors.visistaSpoc3Mobile
                                    : null
                                }
                              />
                            </div>
                          </div>

                          <div className="col-lg-3 col-md-6 col-12 hpr_aEColWrapper">
                            <div className="hpr_aETxtFieldsWrapper">
                              <TextField
                                id="visistaSpoc3Designation"
                                label="Designation"
                                type="text"
                                value={values.visistaSpoc3Designation}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </div>
                      </fieldset>
                    </div>

                    <div className="col-12 ">
                      <br />
                    </div>

                    <div className="col-12 ">
                      <fieldset className="col-12 hpr-fieldset-wrapper ">
                        <legend>TPA SPOC</legend>
                        <div className="row">
                          <div className="col-lg-3 col-md-6 col-12 hpr_aEColWrapper">
                            <div className="hpr_aETxtFieldsWrapper">
                              <TextField
                                id="tpaSpoc1Name"
                                label="Name"
                                type="text"
                                value={values.tpaSpoc1Name}
                                onChange={handleChange}
                                error={
                                  errors.tpaSpoc1Name && touched.tpaSpoc1Name
                                }
                                helperText={
                                  errors.tpaSpoc1Name && touched.tpaSpoc1Name
                                    ? errors.tpaSpoc1Name
                                    : null
                                }
                              />
                            </div>
                          </div>

                          <div className="col-lg-3 col-md-6 col-12 hpr_aEColWrapper">
                            <div className="hpr_aETxtFieldsWrapper">
                              <TextField
                                id="tpaSpoc1Email"
                                label="Email"
                                type="text"
                                value={values.tpaSpoc1Email}
                                onChange={handleChange}
                                error={
                                  errors.tpaSpoc1Email && touched.tpaSpoc1Email
                                }
                                helperText={
                                  errors.tpaSpoc1Email && touched.tpaSpoc1Email
                                    ? errors.tpaSpoc1Email
                                    : null
                                }
                              />
                            </div>
                          </div>

                          <div className="col-lg-3 col-md-6 col-12 hpr_aEColWrapper">
                            <div className="hpr_aETxtFieldsWrapper">
                              <TextField
                                id="tpaSpoc1Mobile"
                                label="Mobile"
                                type="text"
                                value={values.tpaSpoc1Mobile}
                                onChange={handleChange}
                                error={
                                  errors.tpaSpoc1Mobile &&
                                  touched.tpaSpoc1Mobile
                                }
                                helperText={
                                  errors.tpaSpoc1Mobile &&
                                  touched.tpaSpoc1Mobile
                                    ? errors.tpaSpoc1Mobile
                                    : null
                                }
                              />
                            </div>
                          </div>

                          <div className="col-lg-3 col-md-6 col-12 hpr_aEColWrapper">
                            <div className="hpr_aETxtFieldsWrapper">
                              <TextField
                                id="tpaSpoc1Designation"
                                label="Designation"
                                type="text"
                                value={values.tpaSpoc1Designation}
                                onChange={handleChange}
                                error={
                                  errors.tpaSpoc1Designation &&
                                  touched.tpaSpoc1Designation
                                }
                                helperText={
                                  errors.tpaSpoc1Designation &&
                                  touched.tpaSpoc1Designation
                                    ? errors.tpaSpoc1Designation
                                    : null
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </fieldset>
                    </div>

                    <div className="col-12 ">
                      <fieldset className="col-12 hpr-fieldset-wrapper ">
                        <legend>TPA 1st Escalation</legend>
                        <div className="row">
                          <div className="col-lg-3 col-md-6 col-12 hpr_aEColWrapper">
                            <div className="hpr_aETxtFieldsWrapper">
                              <TextField
                                id="tpaSpoc2Name"
                                label="Name"
                                type="text"
                                value={values.tpaSpoc2Name}
                                onChange={handleChange}
                              />
                            </div>
                          </div>

                          <div className="col-lg-3 col-md-6 col-12 hpr_aEColWrapper">
                            <div className="hpr_aETxtFieldsWrapper">
                              <TextField
                                id="tpaSpoc2Email"
                                label="Email"
                                type="text"
                                value={values.tpaSpoc2Email}
                                onChange={handleChange}
                                error={
                                  errors.tpaSpoc2Email && touched.tpaSpoc2Email
                                }
                                helperText={
                                  errors.tpaSpoc2Email && touched.tpaSpoc2Email
                                    ? errors.tpaSpoc2Email
                                    : null
                                }
                              />
                            </div>
                          </div>

                          <div className="col-lg-3 col-md-6 col-12 hpr_aEColWrapper">
                            <div className="hpr_aETxtFieldsWrapper">
                              <TextField
                                id="tpaSpoc2Mobile"
                                label="Mobile"
                                type="text"
                                value={values.tpaSpoc2Mobile}
                                onChange={handleChange}
                                error={
                                  errors.tpaSpoc2Mobile &&
                                  touched.tpaSpoc2Mobile
                                }
                                helperText={
                                  errors.tpaSpoc2Mobile &&
                                  touched.tpaSpoc2Mobile
                                    ? errors.tpaSpoc2Mobile
                                    : null
                                }
                              />
                            </div>
                          </div>

                          <div className="col-lg-3 col-md-6 col-12 hpr_aEColWrapper">
                            <div className="hpr_aETxtFieldsWrapper">
                              <TextField
                                id="tpaSpoc2Designation"
                                label="Designation"
                                type="text"
                                value={values.tpaSpoc2Designation}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </div>
                      </fieldset>
                    </div>

                    <div className="col-12 ">
                      <fieldset className="col-12 hpr-fieldset-wrapper ">
                        <legend>TPA 2nd Escalation</legend>
                        <div className="row">
                          <div className="col-lg-3 col-md-6 col-12 hpr_aEColWrapper">
                            <div className="hpr_aETxtFieldsWrapper">
                              <TextField
                                id="tpaSpoc3Name"
                                label="Name"
                                type="text"
                                value={values.tpaSpoc3Name}
                                onChange={handleChange}
                              />
                            </div>
                          </div>

                          <div className="col-lg-3 col-md-6 col-12 hpr_aEColWrapper">
                            <div className="hpr_aETxtFieldsWrapper">
                              <TextField
                                id="tpaSpoc3Email"
                                label="Email"
                                type="text"
                                value={values.tpaSpoc3Email}
                                onChange={handleChange}
                                error={
                                  errors.tpaSpoc3Email && touched.tpaSpoc3Email
                                }
                                helperText={
                                  errors.tpaSpoc3Email && touched.tpaSpoc3Email
                                    ? errors.tpaSpoc3Email
                                    : null
                                }
                              />
                            </div>
                          </div>

                          <div className="col-lg-3 col-md-6 col-12 hpr_aEColWrapper">
                            <div className="hpr_aETxtFieldsWrapper">
                              <TextField
                                id="tpaSpoc3Mobile"
                                label="Mobile"
                                type="text"
                                value={values.tpaSpoc3Mobile}
                                onChange={handleChange}
                                error={
                                  errors.tpaSpoc3Mobile &&
                                  touched.tpaSpoc3Mobile
                                }
                                helperText={
                                  errors.tpaSpoc3Mobile &&
                                  touched.tpaSpoc3Mobile
                                    ? errors.tpaSpoc3Mobile
                                    : null
                                }
                              />
                            </div>
                          </div>

                          <div className="col-lg-3 col-md-6 col-12 hpr_aEColWrapper">
                            <div className="hpr_aETxtFieldsWrapper">
                              <TextField
                                id="tpaSpoc3Designation"
                                label="Designation"
                                type="text"
                                value={values.tpaSpoc3Designation}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </div>
                      </fieldset>
                    </div>

                    <div className="col-12 ">
                      <br />
                    </div>

                    <div className="col-12 ">
                      <fieldset className="col-12 hpr-fieldset-wrapper ">
                        <legend>Client HR 1</legend>
                        <div className="row">
                          <div className="col hpr_aEColWrapper">
                            <div className="hpr_aETxtFieldsWrapper">
                              <TextField
                                id="clientSpoc1Empid"
                                label="Employee Id"
                                type="text"
                                value={values.clientSpoc1Empid}
                                onChange={handleChange}
                                error={
                                  errors.clientSpoc1Empid &&
                                  touched.clientSpoc1Empid
                                }
                                helperText={
                                  errors.clientSpoc1Empid &&
                                  touched.clientSpoc1Empid
                                    ? errors.clientSpoc1Empid
                                    : null
                                }
                              />
                            </div>
                          </div>

                          <div className="col hpr_aEColWrapper">
                            <div className="hpr_aETxtFieldsWrapper">
                              <TextField
                                id="clientSpoc1Name"
                                label="Name"
                                type="text"
                                value={values.clientSpoc1Name}
                                onChange={handleChange}
                                error={
                                  errors.clientSpoc1Name &&
                                  touched.clientSpoc1Name
                                }
                                helperText={
                                  errors.clientSpoc1Name &&
                                  touched.clientSpoc1Name
                                    ? errors.clientSpoc1Name
                                    : null
                                }
                              />
                            </div>
                          </div>

                          <div className="col hpr_aEColWrapper">
                            <div className="hpr_aETxtFieldsWrapper">
                              <TextField
                                id="clientSpoc1Email"
                                label="Email"
                                type="text"
                                value={values.clientSpoc1Email}
                                onChange={handleChange}
                                error={
                                  errors.clientSpoc1Email &&
                                  touched.clientSpoc1Email
                                }
                                helperText={
                                  errors.clientSpoc1Email &&
                                  touched.clientSpoc1Email
                                    ? errors.clientSpoc1Email
                                    : null
                                }
                              />
                            </div>
                          </div>

                          <div className="col hpr_aEColWrapper">
                            <div className="hpr_aETxtFieldsWrapper">
                              <TextField
                                id="clientSpoc1Mobile"
                                label="Mobile"
                                type="text"
                                value={values.clientSpoc1Mobile}
                                onChange={handleChange}
                                error={
                                  errors.clientSpoc1Mobile &&
                                  touched.clientSpoc1Mobile
                                }
                                helperText={
                                  errors.clientSpoc1Mobile &&
                                  touched.clientSpoc1Mobile
                                    ? errors.clientSpoc1Mobile
                                    : null
                                }
                              />
                            </div>
                          </div>

                          <div className="col hpr_aEColWrapper">
                            <div className="hpr_aETxtFieldsWrapper">
                              <TextField
                                id="clientSpoc1Designation"
                                label="Designation"
                                type="text"
                                value={values.clientSpoc1Designation}
                                onChange={handleChange}
                                error={
                                  errors.clientSpoc1Designation &&
                                  touched.clientSpoc1Designation
                                }
                                helperText={
                                  errors.clientSpoc1Designation &&
                                  touched.clientSpoc1Designation
                                    ? errors.clientSpoc1Designation
                                    : null
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </fieldset>
                    </div>

                    <div className="col-12 ">
                      <fieldset className="col-12 hpr-fieldset-wrapper ">
                        <legend>Cleint HR 2</legend>
                        <div className="row">
                          <div className="col hpr_aEColWrapper">
                            <div className="hpr_aETxtFieldsWrapper">
                              <TextField
                                id="clientSpoc2Empid"
                                label="Employee Id"
                                type="text"
                                value={values.clientSpoc2Empid}
                                onChange={handleChange}
                              />
                            </div>
                          </div>

                          <div className="col hpr_aEColWrapper">
                            <div className="hpr_aETxtFieldsWrapper">
                              <TextField
                                id="clientSpoc2Name"
                                label="Name"
                                type="text"
                                value={values.clientSpoc2Name}
                                onChange={handleChange}
                              />
                            </div>
                          </div>

                          <div className="col hpr_aEColWrapper">
                            <div className="hpr_aETxtFieldsWrapper">
                              <TextField
                                id="clientSpoc2Email"
                                label="Email"
                                type="text"
                                value={values.clientSpoc2Email}
                                onChange={handleChange}
                                error={
                                  errors.clientSpoc2Email &&
                                  touched.clientSpoc2Email
                                }
                                helperText={
                                  errors.clientSpoc2Email &&
                                  touched.clientSpoc2Email
                                    ? errors.clientSpoc2Email
                                    : null
                                }
                              />
                            </div>
                          </div>

                          <div className="col hpr_aEColWrapper">
                            <div className="hpr_aETxtFieldsWrapper">
                              <TextField
                                id="clientSpoc2Mobile"
                                label="Mobile"
                                type="text"
                                value={values.clientSpoc2Mobile}
                                onChange={handleChange}
                                error={
                                  errors.clientSpoc2Mobile &&
                                  touched.clientSpoc2Mobile
                                }
                                helperText={
                                  errors.clientSpoc2Mobile &&
                                  touched.clientSpoc2Mobile
                                    ? errors.clientSpoc2Mobile
                                    : null
                                }
                              />
                            </div>
                          </div>

                          <div className="col hpr_aEColWrapper">
                            <div className="hpr_aETxtFieldsWrapper">
                              <TextField
                                id="clientSpoc2Designation"
                                label="Designation"
                                type="text"
                                value={values.clientSpoc2Designation}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </div>
                      </fieldset>
                    </div>

                    <div className="col-12 ">
                      <fieldset className="col-12 hpr-fieldset-wrapper ">
                        <legend>Cleint HR 3</legend>
                        <div className="row">
                          <div className="col hpr_aEColWrapper">
                            <div className="hpr_aETxtFieldsWrapper">
                              <TextField
                                id="clientSpoc3Empid"
                                label="Employee Id"
                                type="text"
                                value={values.clientSpoc3Empid}
                                onChange={handleChange}
                              />
                            </div>
                          </div>

                          <div className="col hpr_aEColWrapper">
                            <div className="hpr_aETxtFieldsWrapper">
                              <TextField
                                id="clientSpoc3Name"
                                label="Name"
                                type="text"
                                value={values.clientSpoc3Name}
                                onChange={handleChange}
                              />
                            </div>
                          </div>

                          <div className="col hpr_aEColWrapper">
                            <div className="hpr_aETxtFieldsWrapper">
                              <TextField
                                id="clientSpoc3Email"
                                label="Email"
                                type="text"
                                value={values.clientSpoc3Email}
                                onChange={handleChange}
                                error={
                                  errors.clientSpoc3Email &&
                                  touched.clientSpoc3Email
                                }
                                helperText={
                                  errors.clientSpoc3Email &&
                                  touched.clientSpoc3Email
                                    ? errors.clientSpoc3Email
                                    : null
                                }
                              />
                            </div>
                          </div>

                          <div className="col hpr_aEColWrapper">
                            <div className="hpr_aETxtFieldsWrapper">
                              <TextField
                                id="clientSpoc3Mobile"
                                label="Mobile"
                                type="text"
                                value={values.clientSpoc3Mobile}
                                onChange={handleChange}
                                error={
                                  errors.clientSpoc3Mobile &&
                                  touched.clientSpoc3Mobile
                                }
                                helperText={
                                  errors.clientSpoc3Mobile &&
                                  touched.clientSpoc3Mobile
                                    ? errors.clientSpoc3Mobile
                                    : null
                                }
                              />
                            </div>
                          </div>

                          <div className="col hpr_aEColWrapper">
                            <div className="hpr_aETxtFieldsWrapper">
                              <TextField
                                id="clientSpoc3Designation"
                                label="Designation"
                                type="text"
                                value={values.clientSpoc3Designation}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </div>
                      </fieldset>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-3 mt-3 col-12 d-flex justify-content-end">
                <div className="hpr_formSecondaryBtnWrapper mr-2">
                  <Button variant="contained">Clear</Button>
                </div>
                <div className="hpr_formPrimaryBtnWrapper">
                  <Button
                    variant="contained"
                    disabled={isSubmitting}
                    onClick={submitForm}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </Form>
          </Fragment>
        )}
      />
    </Fragment>
  );

  return addPolicyTemplate;
});

export default AddPolicy;
