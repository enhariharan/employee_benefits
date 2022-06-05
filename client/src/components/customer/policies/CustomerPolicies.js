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

import PolicyDetails from '../policies/policyDetails/PolicyDetails';
import PolicyECard from '../policies/policyECard/PolicyECard';
import AddDependencies from '../policies/addDependencies/AddDependencies';
import ViewMembers from '../policies/viewMembers/ViewMembers';
import ViewCommonDetails from '../../commonPages/viewCommonDetails/ViewCommonDetails';

import { EMP_CONST } from '../../../services/Constants';

const CustomerPolicies = React.memo((props) => {
  // console.log('CustomerPolicies props ', props);

  if (
    props.isMobile !== null &&
    !props.isMobile &&
    props.location.pathname === props.match.path
  ) {
    return <Redirect to={`${props.location.pathname}/policy-details`} />;
  }

  const customerPoliciesTemplate = (
    <Fragment>
      {props.isNestedRoute !== null &&
        !props.isNestedRoute &&
        props.isMobile !== null &&
        !!props.isMobile && (
          <div className="hpr-nested-list-items">
            {EMP_CONST.CUST_POLICIES_SUB_MENU.map((val) => (
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
          path={`${props.homePath}/policies/policy-details`}
          component={PolicyDetails}
        />
        <Route
          path={`${props.homePath}/policies/policy-ecards`}
          component={PolicyECard}
        />
        <Route
          path={`${props.homePath}/policies/add-dependencies`}
          component={AddDependencies}
        />
        <Route
          exact
          path={`${props.homePath}/policies/view-members`}
          component={ViewMembers}
        />
        <Route
          path={`${props.homePath}/policies/view-members/:member`}
          component={ViewCommonDetails}
        />
      </Switch>
    </Fragment>
  );

  return customerPoliciesTemplate;
});

export default CustomerPolicies;
