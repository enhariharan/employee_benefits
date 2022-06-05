import React, { Fragment, useContext, useState, useEffect } from 'react';

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  Link,
  useHistory,
} from 'react-router-dom';

import HrPolicyDetails from './policyDetails/HrPolicyDetails';
import HrPolicyECards from './policyECards/HrPolicyECards';
import ViewCommonDetails from '../../commonPages/viewCommonDetails/ViewCommonDetails';

import { EMP_CONST } from '../../../services/Constants';

const HrPolicies = React.memo((props) => {
  // console.log('HrPolicies props ', props);

  if (
    props.isMobile !== null &&
    !props.isMobile &&
    props.location.pathname === props.match.path
  ) {
    return <Redirect to={`${props.location.pathname}/policy-details`} />;
  }

  const hrPoliciesTemplate = (
    <Fragment>
      {!props.isNestedRoute && !!props.isMobile && (
        <div className="hpr-nested-list-items">
          {EMP_CONST.HR_POLICIES_SUB_MENU.map((val) => (
            <Link
              to={`${props.homePath}/policies/${val.link}`}
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
          path={`${props.homePath}/policies/policy-details`}
          component={HrPolicyDetails}
        />

        <Route
          path={`${props.homePath}/policies/policy-details/:policyId`}
          component={ViewCommonDetails}
        />

        <Route
          path={`${props.homePath}/policies/policy-ecards`}
          component={HrPolicyECards}
        />
      </Switch>
    </Fragment>
  );

  return hrPoliciesTemplate;
});

export default HrPolicies;
