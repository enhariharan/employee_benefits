import React, {
  Fragment,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react';

import { AuthContext } from '../../../context/AuthContext';
import { EMP_CONST } from '../../../services/Constants';
import { PubSub } from '../../../services/PubSub';
import ApiService from '../../../services/ApiService';

import { Button } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import MenuItem from '@material-ui/core/MenuItem';

import {
  CapitalizeFirstLetter,
  stateArray,
} from '../../../reUseComponents/utils/utils';

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  Link,
  useHistory,
} from 'react-router-dom';

const AddCorporate = React.memo((props) => {
  // console.log('AddCorporate props ', props);
  const history = useHistory();

  const [currentUser] = useContext(AuthContext);

  const [currentCorporateObj, setCurrentCorporateObj] = useState({});

  let isEditCorporate;
  !!props.propObj.methodType &&
  !!props.propObj.currentObj &&
  Object.keys(props.propObj.currentObj).length > 0
    ? (isEditCorporate = true)
    : (isEditCorporate = false);

  if (!!isEditCorporate && Object.keys(currentCorporateObj).length === 0) {
    setCurrentCorporateObj(props.propObj.currentObj);
  }

  const addCorporateTemplate = (
    <Fragment>
      <div className="hpr_addEmployeeWrapper">
        <Formik
          initialValues={{
            companyName: !!isEditCorporate
              ? currentCorporateObj.companyName
              : '',
            displayName: !!isEditCorporate
              ? currentCorporateObj.displayName
              : '',
            branchAddressState: !!isEditCorporate
              ? currentCorporateObj.branchAddressState
              : '',
            branchAddressBuildingName: !!isEditCorporate
              ? currentCorporateObj.branchAddressBuildingName
              : '',
            branchAddressBuildingAddress: !!isEditCorporate
              ? currentCorporateObj.branchAddressBuildingAddress
              : '',
            branchAddressStreet: !!isEditCorporate
              ? currentCorporateObj.branchAddressStreet
              : '',
            branchAddressCity: !!isEditCorporate
              ? currentCorporateObj.branchAddressCity
              : '',
            branchAddressDistrict: !!isEditCorporate
              ? currentCorporateObj.branchAddressDistrict
              : '',
            branchAddressPincode: !!isEditCorporate
              ? currentCorporateObj.branchAddressPincode
              : '',
          }}
          validationSchema={Yup.object().shape({
            companyName: Yup.string().required('Required'),
            displayName: Yup.string()
              .matches(
                /^[a-z0-9]+$/,
                'Accepts only lowercase characters and numbers'
              )
              .required('Required'),
            branchAddressState: Yup.string().required('Required'),
            branchAddressBuildingName: Yup.string().required('Required'),
            branchAddressBuildingAddress: Yup.string().required('Required'),
            branchAddressStreet: '',
            branchAddressCity: Yup.string().required('Required'),
            branchAddressDistrict: Yup.string().required('Required'),
            branchAddressPincode: Yup.string()
              .matches(/^[0-9]{6}$/, 'Must be exactly 6 digits')
              .required('Required'),
          })}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            const postData = { ...values };

            if (!!isEditCorporate) {
              postData.uuid = props.propObj.currentObj.uuid;
            }

            let methodType = props.propObj.methodType;

            const addEditCorpCB = (cbAPI) => {
              cbAPI
                .then((response) => {
                  // console.log('response Resend ', response);
                  if (
                    typeof response !== 'undefined' &&
                    response.errCode.toLowerCase() === 'success'
                  ) {
                    !isEditCorporate
                      ? history.push(props.propObj.redirectURL)
                      : history.goBack();

                    let respNotiObj = {
                      message: response.message,
                      color: 'success',
                    };
                    PubSub.publish(
                      PubSub.events.SNACKBAR_PROVIDER,
                      respNotiObj
                    );
                  }
                })

                .catch((err) => {
                  console.log(`Resend Error ${JSON.stringify(err)} `);
                  if (
                    !!err.data &&
                    (!!err.data.errCode || !!err.data.message)
                  ) {
                    let respNotiObj = {
                      message: err.data.message || err.data.errCode,
                      color: 'error',
                    };
                    PubSub.publish(
                      PubSub.events.SNACKBAR_PROVIDER,
                      respNotiObj
                    );
                  }
                })
                .finally(() => {
                  // console.log(`Finally `);
                });
            };

            !!methodType && methodType === 'put'
              ? addEditCorpCB(
                  ApiService.put(`${EMP_CONST.URL.exe_getCorporates}`, postData)
                )
              : addEditCorpCB(
                  ApiService.post(`${EMP_CONST.URL.exe_getCorporates}`, [
                    postData,
                  ])
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
            <div className="hpr_aEmployeeFormFieldsWrapper">
              {/* <pre>{JSON.stringify(!!isEditDependant)}</pre> */}
              <Form className="row">
                <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                  <div className="hpr_aETxtFieldsWrapper">
                    <TextField
                      id="companyName"
                      label="Company Name"
                      type="text"
                      value={values.companyName}
                      onChange={handleChange}
                      error={errors.companyName && touched.companyName}
                      helperText={
                        errors.companyName && touched.companyName
                          ? errors.companyName
                          : null
                      }
                    />
                  </div>
                </div>

                <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                  <div className="hpr_aETxtFieldsWrapper">
                    <TextField
                      id="displayName"
                      label="Domain Name"
                      type="text"
                      value={values.displayName}
                      onChange={handleChange}
                      error={errors.displayName && touched.displayName}
                      helperText={
                        errors.displayName && touched.displayName
                          ? errors.displayName
                          : null
                      }
                    />
                  </div>
                </div>

                {/* <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                  <div className="hpr_aETxtFieldsWrapper">
                    <TextField
                      id="branchCode"
                      label="Branch Code"
                      type="text"
                      value={values.branchCode}
                      onChange={handleChange}
                      error={errors.branchCode && touched.branchCode}
                      helperText={
                        errors.branchCode && touched.branchCode
                          ? errors.branchCode
                          : null
                      }
                    />
                  </div>
                </div> */}

                <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                  <div className="hpr_aETxtFieldsWrapper">
                    <TextField
                      id="branchAddressBuildingName"
                      label="Building name"
                      type="text"
                      value={values.branchAddressBuildingName}
                      onChange={handleChange}
                      error={
                        errors.branchAddressBuildingName &&
                        touched.branchAddressBuildingName
                      }
                      helperText={
                        errors.branchAddressBuildingName &&
                        touched.branchAddressBuildingName
                          ? errors.branchAddressBuildingName
                          : null
                      }
                    />
                  </div>
                </div>

                <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                  <div className="hpr_aETxtFieldsWrapper">
                    <TextField
                      id="branchAddressBuildingAddress"
                      label="Address 1"
                      type="text"
                      value={values.branchAddressBuildingAddress}
                      onChange={handleChange}
                      error={
                        errors.branchAddressBuildingAddress &&
                        touched.branchAddressBuildingAddress
                      }
                      helperText={
                        errors.branchAddressBuildingAddress &&
                        touched.branchAddressBuildingAddress
                          ? errors.branchAddressBuildingAddress
                          : null
                      }
                    />
                  </div>
                </div>

                <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                  <div className="hpr_aETxtFieldsWrapper">
                    <TextField
                      id="branchAddressStreet"
                      label="Landmark"
                      type="text"
                      value={values.branchAddressStreet}
                      onChange={handleChange}
                      error={
                        errors.branchAddressStreet &&
                        touched.branchAddressStreet
                      }
                      helperText={
                        errors.branchAddressStreet &&
                        touched.branchAddressStreet
                          ? errors.branchAddressStreet
                          : null
                      }
                    />
                  </div>
                </div>

                {!!stateArray && stateArray.length > 0 && (
                  <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                    <div className="hpr_aETxtFieldsWrapper">
                      <TextField
                        id="state"
                        label="State"
                        select
                        type="text"
                        value={values.branchAddressState}
                        onChange={handleChange('branchAddressState')}
                        onBlur={handleBlur}
                        error={
                          errors.branchAddressState &&
                          touched.branchAddressState
                        }
                        helperText={
                          errors.branchAddressState &&
                          touched.branchAddressState
                            ? errors.branchAddressState
                            : null
                        }
                      >
                        {stateArray.map((obj) => (
                          <MenuItem key={obj.code} value={obj.code}>
                            {CapitalizeFirstLetter(obj.name)}
                          </MenuItem>
                        ))}
                      </TextField>
                    </div>
                  </div>
                )}

                <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                  <div className="hpr_aETxtFieldsWrapper">
                    <TextField
                      id="branchAddressDistrict"
                      label="District"
                      type="text"
                      value={values.branchAddressDistrict}
                      onChange={handleChange}
                      error={
                        errors.branchAddressDistrict &&
                        touched.branchAddressDistrict
                      }
                      helperText={
                        errors.branchAddressDistrict &&
                        touched.branchAddressDistrict
                          ? errors.branchAddressDistrict
                          : null
                      }
                    />
                  </div>
                </div>

                <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                  <div className="hpr_aETxtFieldsWrapper">
                    <TextField
                      id="branchAddressCity"
                      label="City"
                      type="text"
                      value={values.branchAddressCity}
                      onChange={handleChange}
                      error={
                        errors.branchAddressCity && touched.branchAddressCity
                      }
                      helperText={
                        errors.branchAddressCity && touched.branchAddressCity
                          ? errors.branchAddressCity
                          : null
                      }
                    />
                  </div>
                </div>

                <div className="col-lg-4 col-md-6 col-12 hpr_aEColWrapper">
                  <div className="hpr_aETxtFieldsWrapper">
                    <TextField
                      id="branchAddressPincode"
                      label="Pin Code"
                      type="text"
                      value={values.branchAddressPincode}
                      onChange={handleChange}
                      error={
                        errors.branchAddressPincode &&
                        touched.branchAddressPincode
                      }
                      helperText={
                        errors.branchAddressPincode &&
                        touched.branchAddressPincode
                          ? errors.branchAddressPincode
                          : null
                      }
                    />
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
            </div>
          )}
        />
      </div>
    </Fragment>
  );

  return addCorporateTemplate;
});

export default AddCorporate;
