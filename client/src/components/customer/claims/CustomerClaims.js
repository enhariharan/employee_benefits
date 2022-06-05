import React, { Fragment, useContext, useState, useEffect } from 'react';

import CustomerClaimStatus from '../claims/customerClaimStatus/CustomerClaimStatus';
import CustomerIntiateClaim from '../claims/customerIntiateClaim/CustomerIntiateClaim';
import ViewCommonDetails from '../../commonPages/viewCommonDetails/ViewCommonDetails';

import { EMP_CONST } from '../../../services/Constants';

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  Link,
  useHistory,
} from 'react-router-dom';

const CustomerClaims = React.memo((props) => {
  // console.log('CustomerHospitals props ', props);

  if (
    props.isMobile !== null &&
    !props.isMobile &&
    props.location.pathname === props.match.path
  ) {
    return <Redirect to={`${props.location.pathname}/claim-status`} />;
  }

  const customerClaimsTemplate = (
    <Fragment>
      {props.isNestedRoute !== null &&
        !props.isNestedRoute &&
        props.isMobile !== null &&
        !!props.isMobile && (
          <div className="hpr-nested-list-items">
            {EMP_CONST.CUST_CLAIMS_SUB_MENU.map((val) => (
              <Link
                to={`${props.homePath}/claims/${val.link}`}
                className="link"
              >
                {val.name}
              </Link>
            ))}
          </div>
        )}

      <Switch>
        <Route
          exact
          path={`${props.homePath}/claims/claim-status`}
          component={CustomerClaimStatus}
        />
        <Route
          path={`${props.homePath}/claims/claim-status/:claimId`}
          component={ViewCommonDetails}
        />
        <Route
          path={`${props.homePath}/claims/intiate-claim`}
          component={CustomerIntiateClaim}
        />
      </Switch>
    </Fragment>
  );

  return customerClaimsTemplate;
});

export default CustomerClaims;
