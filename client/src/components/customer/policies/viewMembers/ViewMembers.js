import React, { Fragment, useContext, useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './viewMembers.scss';
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

import PolicyDependencies from '../../../commonPages/policyDependencies/PolicyDependencies';

const ViewMembers = React.memo((props) => {
  // console.log('ViewMembers props ', props);
  const [viewMembersData, setViewMembersData] = useState([]);
  const [currentUser] = useContext(AuthContext);

  useEffect(() => {
    getVewMembers();
  }, []);

  const getVewMembers = () => {
    if (currentUser === null) {
      return;
    }
    ApiService.get(
      `${EMP_CONST.URL.cust_viewMembers}/${currentUser.empid}/${EMP_CONST.DEPENDENTS}?corporateUuid=${currentUser.corporateUuid}`
    )
      .then((response) => {
        console.log('response getVewMembers ', response);
        if (typeof response !== 'undefined') {
          setViewMembersData(response.data.dependents);
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

  const viewDetailsData = {
    pageHeading: 'View Details',
    detailsPath: '/customer-home/policies/view-members',
    empId: currentUser.empid,
  };

  const viewMembersTemplate = (
    <Fragment>
      <div className="hpr_pageHeadingWrapper">
        <div className="hpr_page-heading-left-wrapper">
          <div className="hpr-breadcrumb-wrapper">
            <Link to={'/customer-home'}>
              <FontAwesomeIcon icon="chevron-left" className="mr-1" />
              Back
            </Link>
          </div>
          <h3 className="">View Members</h3>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          {!!viewMembersData && (
            <PolicyDependencies
              flexTableArray={viewMembersData}
              data={viewDetailsData}
            />
          )}
        </div>
      </div>
    </Fragment>
  );

  return viewMembersTemplate;
});

export default ViewMembers;
