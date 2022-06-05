import React, { Fragment, useContext, useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './policyDetails.scss';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  Link,
  useHistory,
} from 'react-router-dom';

import { PubSub } from '../../../../services/PubSub';

import EmpPolicyDetails from '../../../commonPages/empPolicyDetails/EmpPolicyDetails';

const PolicyDetails = React.memo((props) => {
  // console.log('PolicyDetails props ', props);

  const [isMobile, setIsMobile] = useState(null);

  useEffect(() => {
    PubSub.subscribe(PubSub.events.IS_MOBILE, (flag) => {
      setIsMobile(flag);
    });
    return () => {
      PubSub.unsubscribe(PubSub.events.IS_MOBILE);
    };
  }, []);

  const policyDetailsTemplate = (
    <Fragment>
      <div className="hpr_pageHeadingWrapper">
        <div className="hpr_page-heading-left-wrapper">
          {!!isMobile && (
            <div className="hpr-breadcrumb-wrapper">
              <Link to={'/customer-home'}>
                <FontAwesomeIcon icon="chevron-left" className="mr-1" />
                Back
              </Link>
            </div>
          )}
          <h3 className="">Policy Details</h3>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <EmpPolicyDetails></EmpPolicyDetails>
        </div>
      </div>
    </Fragment>
  );

  return policyDetailsTemplate;
});

export default PolicyDetails;
