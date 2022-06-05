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

import ClaimStatus from '../../../commonPages/claimStatus/ClaimStatus';

const ExeClaimsList = React.memo((props) => {
  // console.log('ExeClaimsList props ', props);

  const [globalOnLoadData, setGlobalOnLoadData] = useContext(GlobalDataContext);

  const [isMobile, setIsMobile] = useState(null);

  let isGlobalData;
  !!globalOnLoadData &&
  Object.keys(globalOnLoadData).length > 0 &&
  !!globalOnLoadData.exeClaims
    ? (isGlobalData = true)
    : (isGlobalData = false);

  let isGlobalCorporateData;
  !!globalOnLoadData &&
  Object.keys(globalOnLoadData).length > 0 &&
  !!globalOnLoadData.corporatesData
    ? (isGlobalCorporateData = true)
    : (isGlobalCorporateData = false);

  const [claimsList, setClaimsList] = useState(
    (!!isGlobalData && globalOnLoadData.exeClaims) || []
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
    if (!!globalOnLoadData.selectedCorporate) {
      getAllClaimsByCorID('', globalOnLoadData.selectedCorporate.uuid);
    }

    PubSub.subscribe(PubSub.events.IS_MOBILE, (flag) => {
      setIsMobile(flag);
    });
    return () => {
      PubSub.unsubscribe(PubSub.events.IS_MOBILE);
    };
  }, []);

  useEffect(() => {
    if (!!globalOnLoadData.pendingActionsData) {
      getAllCorporates();
    }
  }, [!!globalOnLoadData.pendingActionsData]);

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

  const getAllClaimsByCorID = (e, corpUuid) => {
    const corporateUuid = corpUuid || corporateObj.uuid;
    if (!corporateUuid) {
      return;
    }
    ApiService.get(
      `${EMP_CONST.URL.hr_claimStatus}?corporateUuid=${corporateUuid}`
    )
      .then((response) => {
        // console.log('response getAllEmployeesByCorID ', response);
        if (typeof response !== 'undefined') {
          let fieldsArray = [
            { ...corporateObj, corporateIdVal: corporateIdVal },
          ];
          const newGlobalOnLoadData = update(globalOnLoadData, {
            ['exeClaims']: {
              $set: response,
            },
            ['exeClaimsFields']: { $set: fieldsArray },
          });
          setGlobalOnLoadData(newGlobalOnLoadData);

          setClaimsList(response.data);
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
    detailsPath: '/executive-home/claims/claims-list',
  };

  const exeClaimsListTemplate = (
    <Fragment>
      {/* <pre>{JSON.stringify(globalOnLoadData)}</pre> */}
      <div className="hpr_pageHeadingWrapper">
        <div className="hpr_page-heading-left-wrapper">
          {!!isMobile && (
            <div className="hpr-breadcrumb-wrapper">
              <Link to={'/executive-home/claims'}>
                <FontAwesomeIcon icon="chevron-left" className="mr-1" />
                Back
              </Link>
            </div>
          )}
          <h3 className="">Claims List</h3>
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
            className="status-select-wrapper"
            variant="outlined"
          >
            {corporatesData.map((obj) => (
              <MenuItem key={obj} value={obj.companyName}>
                {CapitalizeFirstLetter(obj.companyName)}
              </MenuItem>
            ))}
          </TextField>

          <Button
            disabled={!corporateIdVal}
            className="hpr-filter-sort-submit filter-go-btn"
            onClick={(e) => getAllClaimsByCorID(e, corporateObj.uuid)}
          >
            GO
          </Button>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          {!!claimsList && (
            <ClaimStatus flexTableArray={claimsList} data={viewDetailsData} />
          )}
        </div>
      </div>
    </Fragment>
  );

  return exeClaimsListTemplate;
});

export default ExeClaimsList;
