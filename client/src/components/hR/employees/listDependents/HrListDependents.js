import React, { Fragment, useContext, useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './hrListDependents.scss';
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

const HrListDependents = React.memo((props) => {
  // console.log('HrListDependents props ', props);

  const hrListDependentsTemplate = (
    <Fragment>
      <div className="hpr-breadcrumb-wrapper">
        <Link to={'/hr-home/employees'}>
          <FontAwesomeIcon icon="chevron-left" className="mr-1" />
          Back
        </Link>
      </div>
      <div className="hpr_pageHeadingWrapper">
        <h3 className="">List Dependents</h3>
      </div>
      <div className="row">
        <div className="col-12"></div>
      </div>
    </Fragment>
  );

  return hrListDependentsTemplate;
});

export default HrListDependents;
