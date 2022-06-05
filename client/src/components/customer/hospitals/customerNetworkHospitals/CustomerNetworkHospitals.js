import React, { Fragment, useContext, useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './customerNetworkHospitals.scss';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  Link,
  useHistory,
} from 'react-router-dom';

import update from 'immutability-helper';

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Button } from '@material-ui/core';

import { PubSub } from '../../../../services/PubSub';
import ApiService from '../../../../services/ApiService';
import { EMP_CONST } from '../../../../services/Constants';
import { AuthContext } from '../../../../context/AuthContext';
import { GlobalDataContext } from '../../../../context/GlobalDataContext';

import NetworkHospitals from '../../../commonPages/networkHospitals/NetworkHospitals';

const CustomerNetworkHospitals = React.memo((props) => {
  // console.log('CustomerNetworkHospitals props ', props);
  const [globalOnLoadData, setGlobalOnLoadData] = useContext(GlobalDataContext);
  const [currentUser] = useContext(AuthContext);
  // console.log('CustomerNetworkHospitals globalOnLoadData ', globalOnLoadData);

  let isGlobalData;
  !!globalOnLoadData &&
  Object.keys(globalOnLoadData).length > 0 &&
  !!globalOnLoadData.customerNetHospitals
    ? (isGlobalData = true)
    : (isGlobalData = false);

  const [isMobile, setIsMobile] = useState(null);
  const [pincodeVal, setPincodeVal] = useState(
    (!!globalOnLoadData.customerNetHospitalsFields &&
      globalOnLoadData.customerNetHospitalsFields[0].pincodeVal) ||
      ''
  );
  const [pincodeData, setPincodeData] = useState([]);
  const [cityVal, setCityVal] = useState(
    (!!globalOnLoadData.customerNetHospitalsFields &&
      globalOnLoadData.customerNetHospitalsFields[0].cityVal) ||
      ''
  );
  const [cityData, setCityData] = useState([]);
  const [hospitalVal, setHospitalVal] = useState(
    (!!globalOnLoadData.customerNetHospitalsFields &&
      globalOnLoadData.customerNetHospitalsFields[0].hospitalVal) ||
      ''
  );
  const [hospitalData, setHospitalData] = useState([]);
  const [hospitalListData, setHospitalListData] = useState(
    (!!isGlobalData && globalOnLoadData.customerNetHospitals) || []
  );
  useEffect(() => {
    PubSub.subscribe(PubSub.events.IS_MOBILE, (flag) => {
      setIsMobile(flag);
    });
    return () => {
      PubSub.unsubscribe(PubSub.events.IS_MOBILE);
    };
  }, []);

  const pincodeChange = (e, value) => {
    if (
      // empty pincode selected value when clic the 'x' icon in pincode auto complete
      typeof value !== 'undefined' &&
      value === ''
    ) {
      setPincodeVal(value);

      // Removing selected pincode value into global object
      if (!!globalOnLoadData.customerNetHospitalsFields) {
        let newCustomerNetHospitalsFields = [
          ...globalOnLoadData.customerNetHospitalsFields,
        ];
        newCustomerNetHospitalsFields[0].pincodeVal = value;
        const newGlobalOnLoadData = update(globalOnLoadData, {
          ['customerNetHospitalsFields']: {
            $set: newCustomerNetHospitalsFields,
          },
        });
        setGlobalOnLoadData(newGlobalOnLoadData);
      }
    }

    if (!e || typeof e.target.value === 'undefined') {
      return;
    }

    if (value !== null && value.toString().length == 6) {
      setPincodeVal(value);
    }
    if (e.target.value !== null && e.target.value.length >= 3) {
      ApiService.get(
        `${EMP_CONST.URL.cust_networkHospitals}/${EMP_CONST.SERACH}?${EMP_CONST.PINCODE}=${e.target.value}`
      )
        .then((response) => {
          // console.log('response Pincode List ', response);
          if (
            typeof response !== 'undefined' &&
            response.data.length > 0 &&
            response.errCode === 'Success'
          ) {
            setPincodeData(response.data);
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
    }
  };

  const cityChange = (e, value) => {
    if (
      // empty city selected value when clic the 'x' icon in city auto complete
      typeof value !== 'undefined' &&
      value === ''
    ) {
      setCityVal(value);
      // Removing City value into global object
      if (!!globalOnLoadData.customerNetHospitalsFields) {
        let newCustomerNetHospitalsFields = [
          ...globalOnLoadData.customerNetHospitalsFields,
        ];
        newCustomerNetHospitalsFields[0].cityVal = value;
        const newGlobalOnLoadData = update(globalOnLoadData, {
          ['customerNetHospitalsFields']: {
            $set: newCustomerNetHospitalsFields,
          },
        });
        setGlobalOnLoadData(newGlobalOnLoadData);
      }
    }

    if (!e || typeof e.target.value === 'undefined') {
      return;
    }

    if (
      value !== null &&
      e.target.value !== null &&
      typeof e.target.value === 'number'
    ) {
      setCityVal(value);
    }
    if (e.target.value !== null && e.target.value.length >= 2) {
      ApiService.get(
        `${EMP_CONST.URL.cust_networkHospitals}/${EMP_CONST.SERACH}?${EMP_CONST.CITY}=${e.target.value}`
      )
        .then((response) => {
          // console.log('response cityChange  ', response);
          if (
            typeof response !== 'undefined' &&
            response.data.length > 0 &&
            response.errCode === 'Success'
          ) {
            setCityData(response.data);
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
    }
  };

  const hospitalChange = (e, value) => {
    if (
      // empty Hospital selected value when clic the 'x' icon in Hospital auto complete
      typeof value !== 'undefined' &&
      value === ''
    ) {
      setHospitalVal(value);
      // Removing selected hospital value into global object
      if (!!globalOnLoadData.customerNetHospitalsFields) {
        let newCustomerNetHospitalsFields = [
          ...globalOnLoadData.customerNetHospitalsFields,
        ];
        newCustomerNetHospitalsFields[0].hospitalVal = value;
        const newGlobalOnLoadData = update(globalOnLoadData, {
          ['customerNetHospitalsFields']: {
            $set: newCustomerNetHospitalsFields,
          },
        });
        setGlobalOnLoadData(newGlobalOnLoadData);
      }
    }

    if (!e || typeof e.target.value === 'undefined') {
      return;
    }

    if (
      value !== null &&
      e.target.value !== null &&
      typeof e.target.value === 'number'
    ) {
      setHospitalVal(value);
    }
    if (e.target.value !== null && e.target.value.length >= 2) {
      ApiService.get(
        `${EMP_CONST.URL.cust_networkHospitals}/${EMP_CONST.SERACH}?${EMP_CONST.HOSPITAL_NAME}=${e.target.value}`
      )
        .then((response) => {
          // console.log('response cityChange  ', response);
          if (
            typeof response !== 'undefined' &&
            response.data.length > 0 &&
            response.errCode === 'Success'
          ) {
            setHospitalData(response.data);
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
    }
  };

  const submitHospitals = (e) => {
    let url = `${EMP_CONST.URL.cust_networkHospitals}?${EMP_CONST.CORPORATEUUID}=${currentUser.corporateUuid}`;

    if (!!pincodeVal) {
      url = `${url}&${EMP_CONST.PINCODE}=${pincodeVal}`;
    }
    if (!!cityVal) {
      url = `${url}&${EMP_CONST.CITY}=${cityVal}`;
    }
    if (!!hospitalVal) {
      url = `${url}&${EMP_CONST.HOSPITAL_NAME}=${hospitalVal}`;
    }

    ApiService.get(url)
      .then((response) => {
        // console.log('response submitHospitals  ', response);
        if (
          typeof response !== 'undefined' &&
          !!response.data &&
          response.errCode === 'Success'
        ) {
          setHospitalListData(response.data);
          let fieldsArray = [
            {
              pincodeVal: pincodeVal,
              cityVal: cityVal,
              hospitalVal: hospitalVal,
            },
          ];
          const newGlobalOnLoadData = update(globalOnLoadData, {
            ['customerNetHospitals']: {
              $set: response.data,
            },
            ['customerNetHospitalsFields']: { $set: fieldsArray },
          });
          setGlobalOnLoadData(newGlobalOnLoadData);
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

  const viewDetailsData = {
    pageHeading: 'View Details',
    detailsPath: '/customer-home/hospitals/network-hospitals',
  };

  const customerNetworkHospitalsTemplate = (
    <Fragment>
      <div className="hpr_pageHeadingWrapper">
        <div className="hpr_page-heading-left-wrapper">
          {!!isMobile && (
            <div className="hpr-breadcrumb-wrapper">
              <Link to={'/customer-home/hospitals'}>
                <FontAwesomeIcon icon="chevron-left" className="mr-1" />
                Back
              </Link>
            </div>
          )}
          <h3 className="">Network Hospitals</h3>
        </div>
        <div className="hpr-flex-table-filter-sort-wrapper align-items-center employee-pending-filter-wrapper">
          <Autocomplete
            freeSolo
            onInputChange={(e, value) => pincodeChange(e, value)}
            className="hpr-auto-complete-table hpr-auto-complete-pincode"
            disableClearable
            value={pincodeVal}
            options={pincodeData.map((option) => option)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Pincode"
                variant="outlined"
                InputProps={{ ...params.InputProps, type: 'search' }}
              />
            )}
          />

          <Autocomplete
            freeSolo
            onInputChange={(e, value) => cityChange(e, value)}
            className="hpr-auto-complete-table hpr-auto-complete-city"
            disableClearable
            options={cityData.map((option) => option)}
            value={cityVal}
            renderInput={(params) => {
              const inputProps = params.inputProps;
              inputProps.autoComplete = 'off';
              return (
                <TextField
                  {...params}
                  inputProps={inputProps}
                  label="Search City"
                  variant="outlined"
                  InputProps={{ ...params.InputProps, type: 'search' }}
                />
              );
            }}
          />

          <Autocomplete
            freeSolo
            onInputChange={(e, value) => hospitalChange(e, value)}
            className="hpr-auto-complete-table hpr-auto-complete-hospital mr-1"
            disableClearable
            value={hospitalVal}
            options={hospitalData.map((option) => option)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Hospital"
                variant="outlined"
                InputProps={{ ...params.InputProps, type: 'search' }}
              />
            )}
          />

          <Button
            className="hpr-filter-sort-submit"
            disabled={!!pincodeVal || !!cityVal || !!hospitalVal ? false : true}
            onClick={submitHospitals}
          >
            Submit
          </Button>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          {!!hospitalListData && (
            <NetworkHospitals
              hospitalListData={hospitalListData}
              data={viewDetailsData}
            ></NetworkHospitals>
          )}
        </div>
      </div>
    </Fragment>
  );

  return customerNetworkHospitalsTemplate;
});

export default CustomerNetworkHospitals;
