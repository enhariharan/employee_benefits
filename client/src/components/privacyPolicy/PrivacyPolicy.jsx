import React, { Fragment, useContext, useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  Link,
  useHistory,
} from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './privacyPolicy.scss';
import StaticHeader from '../staticHeader/StaticHeader.jsx';

const PrivacyPolicy = React.memo((props) => {
  console.log('PrivacyPolicy ');

  const privacyPolicyTemplate = (
    <Fragment>
      <StaticHeader />
      <div className="container">
        <div className="hpr_pageContentWrapper">
          <div className="hpr_pageHeadingWrapper">
            <div className="hpr-static-page-wrapper">
              <div className="hpr_page-heading-left-wrapper">
                <div className="hpr-static-pagination_icon">
                  <Link to={'/login'}>
                    <FontAwesomeIcon icon="home" />
                  </Link>
                </div>
                <h3>PrivacyPolicy</h3>
              </div>
            </div>
          </div>

          <div className="hpr-coming-soon-text">Coming Soon!!!</div>
        </div>
      </div>
    </Fragment>
  );

  return privacyPolicyTemplate;
});

export default PrivacyPolicy;
