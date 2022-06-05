import React, { Fragment, useContext, useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './contactDetails.scss';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  Link,
  useHistory,
} from 'react-router-dom';

import Paper from '@material-ui/core/Paper';

import Moment from 'react-moment';

import { camelCaseToSentenseText } from '../../../../reUseComponents/utils/utils';

import ApiService from '../../../../services/ApiService';
import { EMP_CONST } from '../../../../services/Constants';
import { AuthContext } from '../../../../context/AuthContext';
import { PubSub } from '../../../../services/PubSub';

const ContactDetails = React.memo((props) => {
  // console.log('ContactDetails props ', props);

  const [isMobile, setIsMobile] = useState(null);

  const [currentUser] = useContext(AuthContext);
  const [customerPDData, setCustomerPDData] = useState({});

  useEffect(() => {
    getPolicyDetails();
    PubSub.subscribe(PubSub.events.IS_MOBILE, (flag) => {
      setIsMobile(flag);
    });
    return () => {
      PubSub.unsubscribe(PubSub.events.IS_MOBILE);
    };
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

  const contactChildFragment = (customerPDData, val) => {
    return (
      <Fragment>
        <div className="col">
          <div className="row ">
            <div className="col-12 text-left">
              {camelCaseToSentenseText(val)}
            </div>
            <div className="col-12 text-left contact-val-bold">
              {`${customerPDData[val]}`}
            </div>
          </div>
        </div>
      </Fragment>
    );
  };

  const contactDetailsTemplate = (
    <Fragment>
      <div className="hpr_pageHeadingWrapper">
        <div className="hpr_page-heading-left-wrapper">
          {!!isMobile && (
            <div className="hpr-breadcrumb-wrapper">
              <Link to={'/customer-home/services'}>
                <FontAwesomeIcon icon="chevron-left" className="mr-1" />
                Back
              </Link>
            </div>
          )}
          <h3 className="">Contact Details</h3>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <Fragment>
            <Paper elevation={1} className="hpr-emp-pd-wrapper">
              <Fragment>
                {Object.keys(customerPDData).some((k) => {
                  return ~k.indexOf('visistaSPOC1') && !!customerPDData[k];
                }) && (
                  <div className="col-12">
                    <fieldset className="col-12 hpr-fieldset-wrapper ">
                      <legend>Visista SPOC 1</legend>
                      <div className="row">
                        {Object.keys(customerPDData).map((val) => {
                          return (
                            <Fragment>
                              {!!customerPDData[val] &&
                                val
                                  .toLocaleLowerCase()
                                  .includes('visistaspoc1') &&
                                contactChildFragment(customerPDData, val)}
                            </Fragment>
                          );
                        })}
                      </div>
                    </fieldset>
                  </div>
                )}

                {Object.keys(customerPDData).some((k) => {
                  return ~k.indexOf('visistaSPOC2') && !!customerPDData[k];
                }) && (
                  <div className="col-12">
                    <fieldset className="col-12 hpr-fieldset-wrapper ">
                      <legend>Visista SPOC 2</legend>
                      <div className="row">
                        {Object.keys(customerPDData).map((val) => {
                          return (
                            <Fragment>
                              {!!customerPDData[val] &&
                                val
                                  .toLocaleLowerCase()
                                  .includes('visistaspoc2') &&
                                contactChildFragment(customerPDData, val)}
                            </Fragment>
                          );
                        })}
                      </div>
                    </fieldset>
                  </div>
                )}

                {Object.keys(customerPDData).some((k) => {
                  return ~k.indexOf('visistaSPOC3') && !!customerPDData[k];
                }) && (
                  <div className="col-12">
                    <fieldset className="col-12 hpr-fieldset-wrapper ">
                      <legend>Visista SPOC 3</legend>
                      <div className="row">
                        {Object.keys(customerPDData).map((val) => {
                          return (
                            <Fragment>
                              {!!customerPDData[val] &&
                                val
                                  .toLocaleLowerCase()
                                  .includes('visistaspoc3') &&
                                contactChildFragment(customerPDData, val)}
                            </Fragment>
                          );
                        })}
                      </div>
                    </fieldset>
                  </div>
                )}

                {Object.keys(customerPDData).some((k) => {
                  return ~k.indexOf('TPASPOC1') && !!customerPDData[k];
                }) && (
                  <div className="col-12">
                    <fieldset className="col-12 hpr-fieldset-wrapper ">
                      <legend>TPA SPOC 1</legend>
                      <div className="row">
                        {Object.keys(customerPDData).map((val) => {
                          return (
                            <Fragment>
                              {!!customerPDData[val] &&
                                val.toLocaleLowerCase().includes('tpaspoc1') &&
                                contactChildFragment(customerPDData, val)}
                            </Fragment>
                          );
                        })}
                      </div>
                    </fieldset>
                  </div>
                )}

                {Object.keys(customerPDData).some((k) => {
                  return ~k.indexOf('TPASPOC2') && !!customerPDData[k];
                }) && (
                  <div className="col-12">
                    <fieldset className="col-12 hpr-fieldset-wrapper ">
                      <legend>TPA SPOC 2</legend>
                      <div className="row">
                        {Object.keys(customerPDData).map((val) => {
                          return (
                            <Fragment>
                              {!!customerPDData[val] &&
                                val.toLocaleLowerCase().includes('tpaspoc2') &&
                                contactChildFragment(customerPDData, val)}
                            </Fragment>
                          );
                        })}
                      </div>
                    </fieldset>
                  </div>
                )}

                {Object.keys(customerPDData).some((k) => {
                  return ~k.indexOf('TPASPOC3') && !!customerPDData[k];
                }) && (
                  <div className="col-12">
                    <fieldset className="col-12 hpr-fieldset-wrapper ">
                      <legend>TPA SPOC 3</legend>
                      <div className="row">
                        {Object.keys(customerPDData).map((val) => {
                          return (
                            <Fragment>
                              {!!customerPDData[val] &&
                                val.toLocaleLowerCase().includes('tpaspoc3') &&
                                contactChildFragment(customerPDData, val)}
                            </Fragment>
                          );
                        })}
                      </div>
                    </fieldset>
                  </div>
                )}

                {Object.keys(customerPDData).some((k) => {
                  return ~k.indexOf('clientSPOC1') && !!customerPDData[k];
                }) && (
                  <div className="col-12">
                    <fieldset className="col-12 hpr-fieldset-wrapper ">
                      <legend>Client SPOC 1</legend>
                      <div className="row">
                        {Object.keys(customerPDData).map((val) => {
                          return (
                            <Fragment>
                              {!!customerPDData[val] &&
                                val
                                  .toLocaleLowerCase()
                                  .includes('clientspoc1') &&
                                contactChildFragment(customerPDData, val)}
                            </Fragment>
                          );
                        })}
                      </div>
                    </fieldset>
                  </div>
                )}

                {Object.keys(customerPDData).some((k) => {
                  return ~k.indexOf('clientSPOC2') && !!customerPDData[k];
                }) && (
                  <div className="col-12">
                    <fieldset className="col-12 hpr-fieldset-wrapper ">
                      <legend>Client SPOC 2</legend>
                      <div className="row">
                        {Object.keys(customerPDData).map((val) => {
                          return (
                            <Fragment>
                              {!!customerPDData[val] &&
                                val
                                  .toLocaleLowerCase()
                                  .includes('clientspoc2') &&
                                contactChildFragment(customerPDData, val)}
                            </Fragment>
                          );
                        })}
                      </div>
                    </fieldset>
                  </div>
                )}

                {Object.keys(customerPDData).some((k) => {
                  return ~k.indexOf('clientSPOC3') && !!customerPDData[k];
                }) && (
                  <div className="col-12">
                    <fieldset className="col-12 hpr-fieldset-wrapper ">
                      <legend>Client SPOC 3</legend>
                      <div className="row">
                        {Object.keys(customerPDData).map((val) => {
                          return (
                            <Fragment>
                              {!!customerPDData[val] &&
                                val
                                  .toLocaleLowerCase()
                                  .includes('clientspoc3') &&
                                contactChildFragment(customerPDData, val)}
                            </Fragment>
                          );
                        })}
                      </div>
                    </fieldset>
                  </div>
                )}
              </Fragment>
            </Paper>
          </Fragment>
        </div>
      </div>
    </Fragment>
  );

  return contactDetailsTemplate;
});

export default ContactDetails;
