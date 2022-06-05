import React, { Fragment, useContext, useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './empPolicyDetails.scss';

import Paper from '@material-ui/core/Paper';

import Moment from 'react-moment';

import { camelCaseToSentenseText } from '../../../reUseComponents/utils/utils';

import ApiService from '../../../services/ApiService';
import { EMP_CONST } from '../../../services/Constants';
import { AuthContext } from '../../../context/AuthContext';
import { PubSub } from '../../../services/PubSub';

const EmpPolicyDetails = React.memo((props) => {
  // console.log('EmpPolicyDetails props ', props);

  const [currentUser] = useContext(AuthContext);
  const [customerPDData, setCustomerPDData] = useState({});

  useEffect(() => {
    getPolicyDetails();
  }, []);

  const getPolicyDetails = () => {
    if (currentUser === null) {
      return;
    }
    ApiService.get(`${EMP_CONST.URL.cust_policyDetails}`)
      .then((response) => {
        // console.log('response getPolicyDetails ', response);
        if (
          typeof response !== 'undefined' &&
          !!response.errCode &&
          !!response.data &&
          Object.keys(response.data).length > 0
        ) {
          setCustomerPDData(response.data[0]);
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

  const empPolicyDetailsTemplate = (
    <Fragment>
      <Paper elevation={1} className="hpr-emp-pd-wrapper">
        {Object.keys(customerPDData).map((val) => {
          return (
            <Fragment>
              {!!customerPDData[val] &&
                !val.toLowerCase().includes('uuid') &&
                !val.toLowerCase().includes('spoc') &&
                val.toLowerCase() !== 'premiumperfamily' &&
                val.toLowerCase() !== 'numberofdependents' &&
                val.toLowerCase() !== 'numberoffamilies' &&
                customerPDData[val] !== '0.00' && (
                  <div className="row">
                    {val.toLocaleLowerCase() === 'fromdate' ||
                    val.toLocaleLowerCase() === 'todate' ? (
                      <Fragment>
                        <div className="col">
                          {camelCaseToSentenseText(val)} :
                        </div>
                        <div className="col">
                          <Moment format="DD/MM/YYYY">{`${customerPDData[val]}`}</Moment>
                        </div>
                      </Fragment>
                    ) : (
                      <Fragment>
                        <div className="col">
                          {camelCaseToSentenseText(val)} :
                        </div>
                        <div className="col">{`${customerPDData[val]}`}</div>
                      </Fragment>
                    )}
                  </div>
                )}
            </Fragment>
          );
        })}
      </Paper>
    </Fragment>
  );

  return empPolicyDetailsTemplate;
});

export default EmpPolicyDetails;
