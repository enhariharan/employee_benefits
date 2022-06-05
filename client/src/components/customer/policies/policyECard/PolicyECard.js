import React, { Fragment, useContext, useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './policyECard.scss';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  Link,
  useHistory,
} from 'react-router-dom';

import Paper from '@material-ui/core/Paper';

import { PubSub } from '../../../../services/PubSub';
import ApiService from '../../../../services/ApiService';
import { EMP_CONST } from '../../../../services/Constants';
import { AuthContext } from '../../../../context/AuthContext';

import { Button } from '@material-ui/core';

const PolicyECard = React.memo((props) => {
  // console.log('PolicyECard props ', props);
  const [currentUser] = useContext(AuthContext);
  const [isClickPolicy, setIsClickPolicy] = useState(false);

  const viewPolicy = () => {
    if (currentUser === null) {
      return;
    }
    setIsClickPolicy(true);
    // ApiService.get(`${EMP_CONST.URL.cust_policyEcard}${currentUser.empid}`)
    ApiService.get(
      `${EMP_CONST.URL.cust_policyEcard}?empid=${currentUser.empid}&corporateUuid=${currentUser.corporateUuid}`
    )
      .then((response) => {
        // console.log('response PolicyECard ', response);

        if (typeof response !== 'undefined' && !!response.data.isSuccess) {
          let link = document.createElement('a');
          link.href = response.data.ecardUrl;
          link.dispatchEvent(new MouseEvent('click'));
          // window.open(response.data.ecardUrl, '_blank');
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
        setIsClickPolicy(false);
      });
  };

  const policyECardTemplate = (
    <Fragment>
      <div className="hpr_pageHeadingWrapper">
        <div className="hpr_page-heading-left-wrapper">
          <div className="hpr-breadcrumb-wrapper">
            <Link to={'/customer-home'}>
              <FontAwesomeIcon icon="chevron-left" className="mr-1" />
              Back
            </Link>
          </div>
          <h3 className="">Policy eCard</h3>
        </div>
      </div>

      <div className="row">
        <div className="col text-center mt-1">
          <Paper
            elevation={1}
            className="hpr-emp-pd-wrapper hpr_formPrimaryBtnWrapper"
          >
            <Button onClick={viewPolicy} disabled={!!isClickPolicy}>
              View E-Card
            </Button>
          </Paper>
        </div>
      </div>
    </Fragment>
  );

  return policyECardTemplate;
});

export default PolicyECard;
