import React, { Fragment, useContext, useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './hrClaimsList.scss';
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
import TextField from '@material-ui/core/TextField';

import { PubSub } from '../../../../services/PubSub';
import ApiService from '../../../../services/ApiService';
import { EMP_CONST } from '../../../../services/Constants';
import { AuthContext } from '../../../../context/AuthContext';
import { GlobalDataContext } from '../../../../context/GlobalDataContext';

import ClaimStatus from '../../../commonPages/claimStatus/ClaimStatus';

const HrClaimsList = React.memo((props) => {
  // console.log('HrClaimStatus props ', props);

  const [globalOnLoadData, setGlobalOnLoadData] = useContext(GlobalDataContext);
  const [currentUser] = useContext(AuthContext);
  // console.log('HrClaimsList globalOnLoadData ', globalOnLoadData);

  let isGlobalData;
  !!globalOnLoadData &&
  Object.keys(globalOnLoadData).length > 0 &&
  !!globalOnLoadData.hrClaimsList
    ? (isGlobalData = true)
    : (isGlobalData = false);

  const [isMobile, setIsMobile] = useState(null);
  const [claimIdVal, setClaimIdVal] = useState(
    (!!isGlobalData && globalOnLoadData.hrClaimsListFields[0].claimIdVal) || ''
  );
  const [claimsData, setClaimsData] = useState(
    (!!isGlobalData && globalOnLoadData.hrClaimsList) || []
  );

  const handleChangeClaim = (e) => {
    setClaimIdVal(e.target.value);
  };
  useEffect(() => {
    getClaimStatus();
    PubSub.subscribe(PubSub.events.IS_MOBILE, (flag) => {
      setIsMobile(flag);
    });
    return () => {
      PubSub.unsubscribe(PubSub.events.IS_MOBILE);
    };
  }, []);

  // console.log('isMobile HrClaimsList ', isMobile);

  const getClaimStatus = () => {
    if (currentUser === null) {
      return;
    }

    let url = `${EMP_CONST.URL.hr_claimStatus}`;
    if (!!claimIdVal) {
      url = `${url}/${claimIdVal}`;
    }
    url = `${url}?${EMP_CONST.CORPORATEUUID}=${currentUser.corporateUuid}`;

    ApiService.get(url)
      .then((response) => {
        // console.log('response getClaimStatus ', response);
        if (typeof response !== 'undefined') {
          let responseClaims;
          if (!!response.data && response.data.length > 0) {
            responseClaims = response.data;
          }

          if (
            Object.keys(response).length > 0 &&
            !!response &&
            !response.data
          ) {
            responseClaims = [response];
          }

          setClaimsData(responseClaims);
          let fieldsArray = [
            {
              claimIdVal: claimIdVal,
            },
          ];
          const newGlobalOnLoadData = update(globalOnLoadData, {
            ['hrClaimsList']: {
              $set: responseClaims,
            },
            ['hrClaimsListFields']: { $set: fieldsArray },
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
    pageHeading: 'Claim Id',
    detailsPath: '/hr-home/claims/claim-status',
  };

  const hrClaimsListTemplate = (
    <Fragment>
      <div className="hpr_pageHeadingWrapper">
        <div className="hpr_page-heading-left-wrapper">
          {!!isMobile && (
            <div className="hpr-breadcrumb-wrapper">
              <Link to={'/hr-home/claims'}>
                <FontAwesomeIcon icon="chevron-left" className="mr-1" />
                Back
              </Link>
            </div>
          )}
          <h3 className="">Claim Status</h3>
        </div>
        <div className="hpr-flex-table-filter-sort-wrapper align-items-center employee-pending-filter-wrapper">
          <TextField
            label="Claim Id"
            type="text"
            value={claimIdVal}
            size="small"
            className="status-select-wrapper"
            onChange={handleChangeClaim}
            variant="outlined"
          ></TextField>

          <Button
            disabled={!claimIdVal}
            className="hpr-filter-sort-submit filter-go-btn"
            onClick={getClaimStatus}
          >
            GO
          </Button>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          {!!claimsData && (
            <ClaimStatus flexTableArray={claimsData} data={viewDetailsData} />
          )}
        </div>
      </div>
    </Fragment>
  );

  return hrClaimsListTemplate;
});

export default HrClaimsList;
