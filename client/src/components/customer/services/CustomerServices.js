import React, { Fragment, useContext, useState, useEffect } from 'react';

import CustomerInsuranceEnquiry from '../services/customerInsuranceEnquiry/CustomerInsuranceEnquiry';
import CustomerReportIssue from '../services/customerReportIssue/CustomerReportIssue';
import CustomerIssuesList from '../services/customerIssuesList/CustomerIssuesList';
import CustomerHelpLine from '../services/customerHelpLine/CustomerHelpLine';
import ContactDetails from '../services/contactDetails/ContactDetails';

import { EMP_CONST } from '../../../services/Constants';

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  Link,
  useHistory,
} from 'react-router-dom';

const CustomerServices = React.memo((props) => {
  // console.log('CustomerServices props ', props);

  if (
    props.isMobile !== null &&
    !props.isMobile &&
    props.location.pathname === props.match.path
  ) {
    return <Redirect to={`${props.location.pathname}/insurance-enquiry`} />;
  }

  const customerServicesTemplate = (
    <Fragment>
      {props.isNestedRoute !== null &&
        !props.isNestedRoute &&
        props.isMobile !== null &&
        !!props.isMobile && (
          <div className="hpr-nested-list-items">
            {EMP_CONST.CUST_SERVICES_SUB_MENU.map((val) => (
              <Link
                to={`${props.homePath}/services/${val.link}`}
                className="link"
              >
                {val.name}
              </Link>
            ))}
          </div>
        )}

      <Switch>
        <Route
          path={`${props.homePath}/services/insurance-enquiry`}
          component={CustomerInsuranceEnquiry}
        />
        <Route
          path={`${props.homePath}/services/issues-list`}
          component={CustomerIssuesList}
        />
        <Route
          path={`${props.homePath}/services/report-issue`}
          component={CustomerReportIssue}
        />
        <Route
          path={`${props.homePath}/services/help-line`}
          component={CustomerHelpLine}
        />
        <Route
          path={`${props.homePath}/services/contact-details`}
          component={ContactDetails}
        />
      </Switch>
    </Fragment>
  );

  return customerServicesTemplate;
});

export default CustomerServices;
