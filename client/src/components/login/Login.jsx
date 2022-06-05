import React, {
  Fragment,
  useState,
  useContext,
  useEffect,
  useRef,
} from 'react';

import { Button } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import MenuItem from '@material-ui/core/MenuItem';

// import images
import aboutUsImg from '../../assets/images/Aboutus.png';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ApiService from '../../services/ApiService';
import { PubSub } from '../../services/PubSub';
import {
  EMP_CONST,
  LOCALHOST_SUB_DOMAIN_BASE_URL,
} from '../../services/Constants';
import { AuthContext } from '../../context/AuthContext';
import { GlobalDataContext } from '../../context/GlobalDataContext';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  Link,
  useHistory,
} from 'react-router-dom';

import './login.scss';

const Login = React.memo((props) => {
  const [currentUser, setCurrentUser, handleLogin] = useContext(AuthContext);
  const [globalOnLoadData, setGlobalOnLoadData] = useContext(GlobalDataContext);

  const [isMobile, setIsMobile] = useState(false);
  const [isCorporate, setIsCorporate] = useState(false);
  useEffect(() => {
    let hostName = window.location.hostname;
    !hostName.startsWith('www') ? setIsCorporate(true) : setIsCorporate(false);

    if (!!globalOnLoadData && Object.keys(globalOnLoadData).length > 0) {
      setGlobalOnLoadData({});
    }
    // console.log('Login isMobile ', isMobile);
    PubSub.subscribe(PubSub.events.IS_MOBILE, (flag) => {
      setIsMobile(flag);
    });
    return () => {
      PubSub.unsubscribe(PubSub.events.IS_MOBILE);
    };
  }, []);

  const history = useHistory();

  const loginTemplate = (
    <Fragment>
      <div className="hpr_loginBGWrapper">
        <div className="container-fluid h-100">
          <div className="row h-100 align-items-center text-center hpr-login-bg">
            <div className="col-lg-9 h-100 hpr-login-left-panel d-none d-lg-block">
              <img src={aboutUsImg} alt="" />
            </div>
            <div className="col-lg-3 h-100 hpr-login-right-panel">
              <div className="hpr_loginBoxWrapper text-left">
                <div className="hpr_lRHeaderWrapper justify-content-between">
                  <div className="hpr_lRTxtWrapper">Login to your account.</div>
                  <div className="hpr_lBlogoWrapper">
                    <img src="./visista-logo-2.png" width="110" alt="" />
                  </div>
                </div>

                <Formik
                  initialValues={{
                    loginUserName: '',
                    loginPassword: '',
                  }}
                  validationSchema={Yup.object().shape({
                    loginUserName: Yup.string().required(
                      'Username is required'
                    ),
                    loginPassword: Yup.string()
                      .min(4, 'Too Short!')
                      .max(16, 'Too Long!')
                      .required('Password is required'),
                  })}
                  onSubmit={(values, { setSubmitting }) => {
                    // console.log('values values ', values);

                    let postData = {
                      username: values.loginUserName,
                      password: values.loginPassword,
                    };

                    if (
                      window.location.hostname.toLowerCase() === 'localhost'
                    ) {
                      postData.subdomain = LOCALHOST_SUB_DOMAIN_BASE_URL;
                    } else {
                      postData.subdomain = window.location.hostname;
                    }

                    ApiService.post(`${EMP_CONST.URL.login}`, postData)
                      .then((response) => {
                        // console.log('response Login results  ', response);
                        handleLogin(response.data.user);
                        if (
                          response.data.user !== null &&
                          typeof response.data.user !== 'undefined'
                        ) {
                          let roleOfUser = response.data.user.role.toLowerCase();
                          switch (roleOfUser) {
                            case 'hr':
                              return !!isMobile
                                ? history.push('/hr-home/employees')
                                : history.push(
                                    '/hr-home/employees/pending-actions'
                                  );

                            case 'executive':
                              return !!isMobile
                                ? history.push('/executive-home/corporates')
                                : history.push(
                                    '/executive-home/corporates/list-corporates'
                                  );

                            case 'manager':
                              return !!isMobile
                                ? history.push('/executive-home/corporates')
                                : history.push(
                                    '/executive-home/corporates/list-corporates'
                                  );

                            case 'customer':
                              return !!isMobile
                                ? history.push('/customer-home/policies')
                                : history.push(
                                    '/customer-home/policies/policy-details'
                                  );

                            default:
                              break;
                          }
                        }
                      })
                      .catch((err) => {
                        console.log(`Resend Error ${JSON.stringify(err)} `);
                        if (
                          !!err.data &&
                          (!!err.data.errCode || !!err.data.message)
                        ) {
                          let respNotiObj = {
                            message: err.data.message || err.data.errCode,
                            color: 'error',
                          };
                          PubSub.publish(
                            PubSub.events.SNACKBAR_PROVIDER,
                            respNotiObj
                          );
                        }
                      })
                      .finally(() => {
                        console.log(`Finally `);
                      });

                    setTimeout(() => {
                      setSubmitting(false);
                    }, 500);
                  }}
                  render={({
                    handleSubmit,
                    handleReset,
                    handleChange,
                    isSubmitting,
                    handleBlur,
                    values,
                    errors,
                    touched,
                    dirty,
                    submitForm,
                  }) => (
                    <div className="hpr_lRFormFieldsWrapper">
                      <Form>
                        {/* <pre>{JSON.stringify(isCorporate)}</pre> */}
                        <div className="hpr_lRTxtFieldsWrapper">
                          <TextField
                            id="loginUserName"
                            label=""
                            type="text"
                            placeholder="Username"
                            variant="outlined"
                            value={values.loginUserName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            InputProps={{
                              startAdornment: <FontAwesomeIcon icon="user" />,
                            }}
                            className={
                              errors.loginUserName &&
                              touched.loginUserName &&
                              'error'
                            }
                          />
                          {errors.loginUserName && touched.loginUserName && (
                            <div className="hpr_lRTxtFieldsError">
                              {errors.loginUserName}
                            </div>
                          )}
                        </div>

                        <div className="hpr_lRTxtFieldsWrapper">
                          <TextField
                            id="loginPassword"
                            // placeholder="Password"
                            placeholder={
                              !!isCorporate ? 'DDMMYYYY' : 'Password'
                            }
                            label=""
                            type="password"
                            variant="outlined"
                            value={values.loginPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            InputProps={{
                              startAdornment: <FontAwesomeIcon icon="key" />,
                            }}
                            className={
                              errors.loginPassword &&
                              touched.loginPassword &&
                              'error'
                            }
                          />
                          {errors.loginPassword && touched.loginPassword && (
                            <div className="hpr_lRTxtFieldsError">
                              {errors.loginPassword}
                            </div>
                          )}
                        </div>

                        <div className="hpr_lRTxtFieldsWrapper mt-4">
                          <Button
                            className="hpr_formSubmit col-12"
                            disabled={isSubmitting}
                            onClick={submitForm}
                          >
                            Log in
                          </Button>
                        </div>
                      </Form>
                    </div>
                  )}
                />

                <div className="col-12 text-center hpr_login-footer-privacy-wrapper">
                  <div className="hpr-footer-content-link">
                    <a
                      href={'https://www.visistarisk.com/about-visista/'}
                      target="_blank"
                    >
                      About Us
                    </a>
                    <a
                      href={'https://www.visistarisk.com/privacy-policy/'}
                      target="_blank"
                    >
                      Privacy Policy
                    </a>
                  </div>

                  <span className="hpr-footer-content">
                    Disclaimer: Visista has made every attempt to ensure the
                    accuracy and reliability of the information provided on this
                    website. However, the information is provided “as is”
                    without warranty of kind, Visista does not accept any
                    responsibility or liability for the accuracy, content,
                    completeness, legality or reliability of the information
                    contained on this website.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );

  return loginTemplate;
});

export default Login;
