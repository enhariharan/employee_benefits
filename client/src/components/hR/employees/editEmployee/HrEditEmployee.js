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

import { PubSub } from '../../../../services/PubSub';
import { AuthContext } from '../../../../context/AuthContext';

import AddEmployee from '../../../commonPages/addEmployee/AddEmployee';

const HrEditEmployee = React.memo((props) => {
  // console.log('HrEditEmployee props ', props);
  const [isMobile, setIsMobile] = useState(null);
  const [currentUser] = useContext(AuthContext);
  useEffect(() => {
    PubSub.subscribe(PubSub.events.IS_MOBILE, (flag) => {
      setIsMobile(flag);
    });
    return () => {
      PubSub.unsubscribe(PubSub.events.IS_MOBILE);
    };
  }, []);

  useEffect(() => {}, []);

  const hrEditEmployeeTemplate = (
    <Fragment>
      <div className="hpr_pageHeadingWrapper">
        <div className="hpr_page-heading-left-wrapper">
          <div className="hpr-breadcrumb-wrapper">
            <Link to={'/hr-home/employees'}>
              <FontAwesomeIcon icon="chevron-left" className="mr-1" />
              Back
            </Link>
          </div>
          <h3 className="">Edit Employee</h3>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <AddEmployee
            propObj={{
              redirectURL: '/hr-home/employees/pending-actions',
              currentObj: props.location.state.currentObj,
              methodType: 'put',
            }}
          ></AddEmployee>
        </div>
      </div>
    </Fragment>
  );

  return hrEditEmployeeTemplate;
});

export default HrEditEmployee;
