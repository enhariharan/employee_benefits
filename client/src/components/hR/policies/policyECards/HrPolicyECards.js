import React, { Fragment, useContext, useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './hrPolicyECards.scss';
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

const HrPolicyECards = React.memo((props) => {
  // console.log('HrPolicyECards props ', props);
  const [currentUser] = useContext(AuthContext);

  const hrPolicyECardsTemplate = (
    <Fragment>
      <div className="hpr-breadcrumb-wrapper">
        <Link to={'/hr-home/policies'}>
          <FontAwesomeIcon icon="chevron-left" className="mr-1" />
          Back
        </Link>
      </div>
      <div className="hpr_pageHeadingWrapper">
        <h3 className="">Policy eCards</h3>
      </div>
      <div className="row">
        <div className="col-12"></div>
      </div>
    </Fragment>
  );

  return hrPolicyECardsTemplate;
});

export default HrPolicyECards;
