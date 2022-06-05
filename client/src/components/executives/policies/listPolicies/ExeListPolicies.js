import React, { Fragment, useContext, useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  Link,
  useHistory,
} from 'react-router-dom';

import update from 'immutability-helper';

import { Button } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

import {
  CapitalizeFirstLetter,
  uniqueCorporateObject,
} from '../../../../reUseComponents/utils/utils';

import { PubSub } from '../../../../services/PubSub';
import ApiService from '../../../../services/ApiService';
import { EMP_CONST } from '../../../../services/Constants';
import { AuthContext } from '../../../../context/AuthContext';
import { GlobalDataContext } from '../../../../context/GlobalDataContext';

import PoliciesList from '../../../commonPages/policiesList/PoliciesList';

const ExeListPolicies = React.memo((props) => {
  const [globalOnLoadData, setGlobalOnLoadData] = useContext(GlobalDataContext);
  // console.log('globalOnLoadData ', globalOnLoadData);

  let isGlobalData;
  !!globalOnLoadData &&
  Object.keys(globalOnLoadData).length > 0 &&
  !!globalOnLoadData.exePolicies
    ? (isGlobalData = true)
    : (isGlobalData = false);

  let isGlobalCorporateData;
  !!globalOnLoadData &&
  Object.keys(globalOnLoadData).length > 0 &&
  !!globalOnLoadData.corporatesData
    ? (isGlobalCorporateData = true)
    : (isGlobalCorporateData = false);

  const [isMobile, setIsMobile] = useState(null);
  const [policiesList, setPoliciesList] = useState(
    (!!isGlobalData && globalOnLoadData.exePolicies) || []
  );

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

  const [currentUser] = useContext(AuthContext);

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

  useEffect(() => {
    getAllCorporates();
    getAllPoliciesByCorID();

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

  const getAllPoliciesByCorID = () => {
    ApiService.get(`${EMP_CONST.URL.exe_policiesList}`)
      .then((response) => {
        // console.log('response getAllEmployeesByCorID ', response);

        if (typeof response !== 'undefined' && response.errCode === 'Success') {
          let fieldsArray = [
            { ...corporateObj, corporateIdVal: corporateIdVal },
          ];

          const newLoadPLData = update(globalOnLoadData, {
            ['exePolicies']: {
              $set: response.data,
            },
            ['exePoliciesFields']: { $set: fieldsArray },
          });
          setGlobalOnLoadData(newLoadPLData);

          setPoliciesList(response.data);
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
    detailsPath: '/executive-home/policies/list-policies',
  };

  const exeListPoliciesTemplate = (
    <Fragment>
      <div className="hpr_pageHeadingWrapper">
        <div className="hpr_page-heading-left-wrapper">
          {!!isMobile && (
            <div className="hpr-breadcrumb-wrapper">
              <Link to={'/executive-home/policies'}>
                <FontAwesomeIcon icon="chevron-left" className="mr-1" />
                Back
              </Link>
            </div>
          )}
          <h3 className="">List Policies</h3>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          {!!policiesList && (
            <PoliciesList
              flexTableArray={policiesList}
              data={viewDetailsData}
            />
          )}
        </div>
      </div>
    </Fragment>
  );

  return exeListPoliciesTemplate;
});

export default ExeListPolicies;
