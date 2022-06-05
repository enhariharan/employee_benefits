import React, { Fragment, useContext, useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './hrPolicyDetails.scss';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  Link,
  useHistory,
} from 'react-router-dom';

import { Button } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';

import { PubSub } from '../../../../services/PubSub';
import ApiService from '../../../../services/ApiService';
import { EMP_CONST } from '../../../../services/Constants';
import { AuthContext } from '../../../../context/AuthContext';

import PoliciesList from '../../../commonPages/policiesList/PoliciesList';

const HrPolicyDetails = React.memo((props) => {
  // console.log('HrPolicyDetails props ', props);
  const [isMobile, setIsMobile] = useState(null);
  const [policyIdVal, setpolicyIdVal] = useState('');
  const [policyData, setPolicyData] = useState([]);
  const [currentUser] = useContext(AuthContext);

  const handleChangePolicy = (e) => {
    if (!!e.target.value) {
      setpolicyIdVal(e.target.value);
    }
  };

  useEffect(() => {
    getPolicyDetails();
    PubSub.subscribe(PubSub.events.IS_MOBILE, (flag) => {
      setIsMobile(flag);
    });
    return () => {
      PubSub.unsubscribe(PubSub.events.IS_MOBILE);
    };
  }, []);

  const getPolicyDetails = () => {
    if (currentUser === null) {
      return;
    }

    let url = `${EMP_CONST.URL.hr_policyDetails}`;
    if (!!policyIdVal) {
      url = `${url}/${policyIdVal}`;
    }
    url = `${url}?${EMP_CONST.CORPORATEUUID}=${currentUser.corporateUuid}`;

    ApiService.get(url)
      .then((response) => {
        // console.log('response getClaimStatus ', response);
        // if (typeof response !== 'undefined') {
        if (
          typeof response !== 'undefined' &&
          !!response.data &&
          response.data.length > 0
        ) {
          setPolicyData(response.data);
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
    pageHeading: 'Policy Id',
    detailsPath: '/hr-home/policies/policy-details',
  };

  const hrPolicyDetailsTemplate = (
    <Fragment>
      <div className="hpr_pageHeadingWrapper">
        <div className="hpr_page-heading-left-wrapper">
          {!!isMobile && (
            <div className="hpr-breadcrumb-wrapper">
              <Link to={'/hr-home/policies'}>
                <FontAwesomeIcon icon="chevron-left" className="mr-1" />
                Back
              </Link>
            </div>
          )}
          <h3 className="">Policy Details</h3>
        </div>
        <div className="hpr-flex-table-filter-sort-wrapper align-items-center employee-pending-filter-wrapper">
          <TextField
            id="policyIdVal"
            label="Policy Id"
            type="text"
            value={policyIdVal}
            size="small"
            className="status-select-wrapper"
            onChange={handleChangePolicy}
            variant="outlined"
          ></TextField>

          <Button
            disabled={!policyIdVal}
            className="hpr-filter-sort-submit filter-go-btn"
            onClick={getPolicyDetails}
          >
            GO
          </Button>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          {!!policyData && (
            <PoliciesList flexTableArray={policyData} data={viewDetailsData} />
          )}
        </div>
      </div>
    </Fragment>
  );

  return hrPolicyDetailsTemplate;
});

export default HrPolicyDetails;
