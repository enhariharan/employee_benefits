import React, { Fragment, useContext, useState, useEffect } from 'react';

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  Link,
  useHistory,
} from 'react-router-dom';

import HrClaimsList from './hrClaimsList/HrClaimsList';
import ViewCommonDetails from '../../commonPages/viewCommonDetails/ViewCommonDetails';

import { EMP_CONST } from '../../../services/Constants';

const HrClaims = React.memo((props) => {
  // console.log('HrClaims props ', props);

  if (
    props.isMobile !== null &&
    !props.isMobile &&
    props.location.pathname === props.match.path
  ) {
    return <Redirect to={`${props.location.pathname}/claim-status`} />;
  }

  const hrClaimsTemplate = (
    <Fragment>
      {props.isNestedRoute !== null &&
        !props.isNestedRoute &&
        props.isMobile !== null &&
        !!props.isMobile && (
          <div className="hpr-nested-list-items">
            {EMP_CONST.HR_CLAIMS_SUB_MENU.map((val) => (
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
          component={HrClaimsList}
        />

        <Route
          path={`${props.homePath}/claims/claim-status/:claimId`}
          component={ViewCommonDetails}
        />
      </Switch>
    </Fragment>
  );

  return hrClaimsTemplate;
});

export default HrClaims;
