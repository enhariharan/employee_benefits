import React, {
  Fragment,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './exeNetworkHospitals.scss';
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
import MenuItem from '@material-ui/core/MenuItem';

import {
  CapitalizeFirstLetter,
  uniqueCorporateObject,
} from '../../../../reUseComponents/utils/utils';

import { PubSub } from '../../../../services/PubSub';
import ApiService from '../../../../services/ApiService';
import { EMP_CONST } from '../../../../services/Constants';
import { AuthContext } from '../../../../context/AuthContext';
import { GlobalDataContext } from '../../../../context/GlobalDataContext';

import NetworkHospitals from '../../../commonPages/networkHospitals/NetworkHospitals';

const ExeNetworkHospitals = React.memo((props) => {
  // console.log('ExeNetworkHospitals props ', props);

  const [globalOnLoadData, setGlobalOnLoadData] = useContext(GlobalDataContext);
  // console.log('ExeNetworkHospitals globalOnLoadData ', globalOnLoadData);

  let isGlobalData;
  !!globalOnLoadData &&
  Object.keys(globalOnLoadData).length > 0 &&
  !!globalOnLoadData.exeNetHospitals
    ? (isGlobalData = true)
    : (isGlobalData = false);

  let isGlobalCorporateData;
  !!globalOnLoadData &&
  Object.keys(globalOnLoadData).length > 0 &&
  !!globalOnLoadData.corporatesData
    ? (isGlobalCorporateData = true)
    : (isGlobalCorporateData = false);

  const myRef = useRef();

  const [isMobile, setIsMobile] = useState(null);
  const [currentUser] = useContext(AuthContext);

  const [corporateObj, setCorporateObj] = useState(
    (!!globalOnLoadData.selectedCorporate &&
      globalOnLoadData.selectedCorporate) ||
      {}
  );
  const [corporateIdVal, setCorporateIdVal] = useState(
    (!!globalOnLoadData.selectedCorporate &&
      globalOnLoadData.selectedCorporate.companyName) ||
      ''
  );
  const [corporatesData, setCorporatesData] = useState(
    (!!isGlobalCorporateData && globalOnLoadData.corporatesData) || []
  );

  const [pincodeVal, setPincodeVal] = useState(
    (!!isGlobalData && globalOnLoadData.exeNetHospitalsFields[0].pincodeVal) ||
      ''
  );
  const [pincodeData, setPincodeData] = useState([]);
  const [cityVal, setCityVal] = useState(
    (!!isGlobalData && globalOnLoadData.exeNetHospitalsFields[0].cityVal) || ''
  );
  const [cityData, setCityData] = useState([]);
  const [hospitalVal, setHospitalVal] = useState(
    (!!isGlobalData && globalOnLoadData.exeNetHospitalsFields[0].hospitalVal) ||
      ''
  );
  const [hospitalData, setHospitalData] = useState([]);
  const [hospitalListData, setHospitalListData] = useState(
    (!!isGlobalData && globalOnLoadData.exeNetHospitals) || []
  );
  useEffect(() => {
    getAllCorporates();

    // if (!!globalOnLoadData.selectedCorporate) {
    //   submitHospitals('', globalOnLoadData.selectedCorporate.uuid);
    // }

    PubSub.subscribe(PubSub.events.IS_MOBILE, (flag) => {
      setIsMobile(flag);
    });
    return () => {
      PubSub.unsubscribe(PubSub.events.IS_MOBILE);
    };
  }, []);

  const getAllCorporates = () => {
    if (!!isGlobalCorporateData) {
      return;
    }
    ApiService.get(`${EMP_CONST.URL.exe_getCorporates}`)
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

  const handleChangeCorporate = (e) => {
    if (!!e.target.value) {
      setCorporateIdVal(e.target.value);
      let currentObj = corporatesData.filter(
        (obj) => obj.companyName === e.target.value
      );
      // console.log('currentObj handleChangeCorporate ', currentObj);
      setCorporateObj(currentObj[0]);

      const updateCorporate = update(globalOnLoadData, {
        selectedCorporate: {
          $set: currentObj[0],
        },
      });
      setGlobalOnLoadData(updateCorporate);
    }
  };

  const pincodeChange = (e, value) => {
    if (
      // empty pincode selected value when clic the 'x' icon in pincode auto complete
      typeof value !== 'undefined' &&
      value === ''
    ) {
      setPincodeVal(value);

      // Removing selected pincode value into global object
      if (!!globalOnLoadData.exeNetHospitalsFields) {
        let newExeNetHospitalsFields = [
          ...globalOnLoadData.exeNetHospitalsFields,
        ];
        newExeNetHospitalsFields[0].pincodeVal = value;
        const newGlobalOnLoadData = update(globalOnLoadData, {
          ['exeNetHospitalsFields']: { $set: newExeNetHospitalsFields },
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
      if (!!globalOnLoadData.exeNetHospitalsFields) {
        let newExeNetHospitalsFields = [
          ...globalOnLoadData.exeNetHospitalsFields,
        ];
        newExeNetHospitalsFields[0].cityVal = value;
        const newGlobalOnLoadData = update(globalOnLoadData, {
          ['exeNetHospitalsFields']: { $set: newExeNetHospitalsFields },
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
      if (!!globalOnLoadData.exeNetHospitalsFields) {
        let newExeNetHospitalsFields = [
          ...globalOnLoadData.exeNetHospitalsFields,
        ];
        newExeNetHospitalsFields[0].hospitalVal = value;
        const newGlobalOnLoadData = update(globalOnLoadData, {
          ['exeNetHospitalsFields']: { $set: newExeNetHospitalsFields },
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

  const submitHospitals = (e, corpUuid) => {
    const corporateUuid = corpUuid || corporateObj.uuid;
    if (!corporateUuid) {
      return;
    }

    let url = `${EMP_CONST.URL.cust_networkHospitals}?${EMP_CONST.CORPORATEUUID}=${corporateUuid}`;

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
          let fieldsArray = [
            {
              ...corporateObj,
              corporateIdVal: corporateIdVal,
              pincodeVal: pincodeVal,
              cityVal: cityVal,
              hospitalVal: hospitalVal,
            },
          ];
          const newGlobalOnLoadData = update(globalOnLoadData, {
            ['exeNetHospitals']: {
              $set: response.data,
            },
            ['exeNetHospitalsFields']: { $set: fieldsArray },
          });
          setGlobalOnLoadData(newGlobalOnLoadData);

          setHospitalListData(response.data);
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
    detailsPath: '/executive-home/hospitals/network-hospitals',
  };

  const exeNetworkHospitalsTemplate = (
    <Fragment>
      {/* <pre>{JSON.stringify(globalOnLoadData)}</pre> */}
      <div className="hpr_pageHeadingWrapper">
        <div className="hpr_page-heading-left-wrapper">
          {!!isMobile && (
            <div className="hpr-breadcrumb-wrapper">
              <Link to={'/executive-home/hospitals'}>
                <FontAwesomeIcon icon="chevron-left" className="mr-1" />
                Back
              </Link>
            </div>
          )}
          <h3 className="">Network Hospitals</h3>
        </div>
        <div className="hpr-flex-table-filter-sort-wrapper align-items-center employee-pending-filter-wrapper">
          <TextField
            id="corporateIdVal"
            label="Corporate"
            select
            type="text"
            value={corporateIdVal}
            onChange={handleChangeCorporate}
            size="small"
            className="status-select-wrapper mr-1"
            variant="outlined"
          >
            {corporatesData.map((obj) => (
              <MenuItem key={obj} value={obj.companyName}>
                {CapitalizeFirstLetter(obj.companyName)}
              </MenuItem>
            ))}
          </TextField>

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
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search City"
                variant="outlined"
                InputProps={{ ...params.InputProps, type: 'search' }}
              />
            )}
          />

          <Autocomplete
            freeSolo
            onInputChange={(e, value) => hospitalChange(e, value)}
            className="hpr-auto-complete-table hpr-auto-complete-hospital mr-1"
            disableClearable
            options={hospitalData.map((option) => option)}
            value={hospitalVal}
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
            disabled={
              !!corporateIdVal && (!!pincodeVal || !!cityVal || !!hospitalVal)
                ? false
                : true
            }
            onClick={(e) => submitHospitals(e, corporateObj.uuid)}
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

  return exeNetworkHospitalsTemplate;
});

export default ExeNetworkHospitals;
