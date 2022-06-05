import React, { Fragment, useContext, useState, useEffect } from 'react';

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  Link,
  useHistory,
} from 'react-router-dom';

import ExeClaimsList from './claimsList/ExeClaimsList';
import ViewCommonDetails from '../../commonPages/viewCommonDetails/ViewCommonDetails';

import { EMP_CONST } from '../../../services/Constants';

const ExeClaims = React.memo((props) => {
  // console.log('ExeClaims props ', props);

  if (
    props.isMobile !== null &&
    !props.isMobile &&
    props.location.pathname === props.match.path
  ) {
    return <Redirect to={`${props.location.pathname}/claims-list`} />;
  }

  const exeClaimsTemplate = (
    <Fragment>
      {!props.isNestedRoute && !!props.isMobile && (
        <div className="hpr-nested-list-items">
          {EMP_CONST.EXECUTIVE_CLAIMS_SUB_MENU.map((val) => (
            <Link to={`${props.homePath}/claims/${val.link}`} className="link">
              {val.name}
            </Link>
          ))}
        </div>
      )}

      <Switch>
        <Route
          exact
          path={`${props.homePath}/claims/claims-list`}
          component={ExeClaimsList}
        />
        <Route
          path={`${props.homePath}/claims/claims-list/:claimId`}
          component={ViewCommonDetails}
        />
      </Switch>
    </Fragment>
  );

  return exeClaimsTemplate;
});

export default ExeClaims;
