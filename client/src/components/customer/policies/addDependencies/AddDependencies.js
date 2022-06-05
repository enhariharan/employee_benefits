import React, { Fragment, useContext, useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './addDependencies.scss';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  Link,
  useHistory,
} from 'react-router-dom';

import { AuthContext } from '../../../../context/AuthContext';

import AddDependent from '../../../commonPages/addDependent/AddDependent';

const AddDependencies = React.memo((props) => {
  // console.log('AddDependencies props ', props);

  const [currentUser] = useContext(AuthContext);

  const addDependenciesTemplate = (
    <Fragment>
      <div className="hpr_pageHeadingWrapper">
        <div className="hpr_page-heading-left-wrapper">
          <div className="hpr-breadcrumb-wrapper">
            <Link to={'/customer-home'}>
              <FontAwesomeIcon icon="chevron-left" className="mr-1" />
              Back
            </Link>
          </div>
          <h3 className="">Add Dependencies</h3>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <AddDependent
            propObj={{
              redirectURL: '/customer-home/policies/view-members',
              currentObj: { empId: currentUser.empid },
            }}
          ></AddDependent>
        </div>
      </div>
    </Fragment>
  );

  return addDependenciesTemplate;
});

export default AddDependencies;
