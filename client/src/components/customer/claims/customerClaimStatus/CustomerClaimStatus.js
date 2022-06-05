import React, { Fragment, useContext, useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './customerClaimStatus.scss';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  Link,
  useHistory,
} from 'react-router-dom';

import { PubSub } from '../../../../services/PubSub';
import ApiService from '../../../../services/ApiService';
import { EMP_CONST } from '../../../../services/Constants';
import { AuthContext } from '../../../../context/AuthContext';

import ClaimStatus from '../../../commonPages/claimStatus/ClaimStatus';

const CustomerClaimStatus = React.memo((props) => {
  // console.log('CustomerNetworkHospitals props ', props);
  const [isMobile, setIsMobile] = useState(null);
  const [claimsData, setClaimsData] = useState([]);
  const [currentUser] = useContext(AuthContext);
  useEffect(() => {
    getClaimStatus();
    PubSub.subscribe(PubSub.events.IS_MOBILE, (flag) => {
      setIsMobile(flag);
    });
    return () => {
      PubSub.unsubscribe(PubSub.events.IS_MOBILE);
    };
  }, []);

  const getClaimStatus = () => {
    if (currentUser === null) {
      return;
    }

    ApiService.get(`${EMP_CONST.URL.cust_claimStatus}${currentUser.empid}`)
      .then((response) => {
        // console.log('response getClaimStatus ', response);
        if (typeof response !== 'undefined') {
          setClaimsData(response.data);
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
    detailsPath: '/customer-home/claims/claim-status',
  };

  const customerClaimStatusTemplate = (
    <Fragment>
      <div className="hpr_pageHeadingWrapper">
        <div className="hpr_page-heading-left-wrapper">
          {!!isMobile && (
            <div className="hpr-breadcrumb-wrapper">
              <Link to={'/customer-home/claims'}>
                <FontAwesomeIcon icon="chevron-left" className="mr-1" />
                Back
              </Link>
            </div>
          )}
          <h3 className="">Claim Status</h3>
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

  return customerClaimStatusTemplate;
});

export default CustomerClaimStatus;
