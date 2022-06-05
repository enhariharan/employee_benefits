import React, { Fragment, useContext, useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './hrAddEmployee.scss';
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

import AddEmployee from '../../../commonPages/addEmployee/AddEmployee';

const HrAddEmployee = React.memo((props) => {
  // console.log('ListEmployees props ', props);
  const [isMobile, setIsMobile] = useState(null);
  const [claimsData, setClaimsData] = useState([]);
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

  const getClaimStatus = () => {
    if (currentUser === null) {
      return;
    }
    ApiService.get(`${EMP_CONST.URL.cust_claimStatus}${currentUser.empid}`)
      .then((response) => {
        // console.log('response getClaimStatus ', response);
        if (typeof response !== 'undefined') {
          setClaimsData(response);
        }
      })
      .catch((err) => {
        console.log(`Resend Error ${JSON.stringify(err)} `);
        if (!!err.data && (!!err.data.errCode || !!err.data.message)) {
          let respNotiObj = {
            message: err.data.message || err.data.errCode,
            color: 'error',
          };
          PubSub.publish(PubSub.events.SNACKBAR_PROVIDER, respNotiObj);
        }
      })
      .finally(() => {
        console.log(`Finally `);
      });
  };

  const hrAddEmployeeTemplate = (
    <Fragment>
      <div className="hpr_pageHeadingWrapper">
        <div className="hpr_page-heading-left-wrapper">
          <div className="hpr-breadcrumb-wrapper">
            <Link to={'/hr-home/employees'}>
              <FontAwesomeIcon icon="chevron-left" className="mr-1" />
              Back
            </Link>
          </div>
          <h3 className="">Add Employee</h3>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <AddEmployee
            propObj={{
              redirectURL: '/hr-home/employees/list-employees',
              methodType: 'post',
            }}
          ></AddEmployee>
        </div>
      </div>
    </Fragment>
  );

  return hrAddEmployeeTemplate;
});

export default HrAddEmployee;
