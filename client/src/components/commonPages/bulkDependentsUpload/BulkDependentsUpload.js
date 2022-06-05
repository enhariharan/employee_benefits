import React, {
  Fragment,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react';

import Moment from 'react-moment';
import MomentReg from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { EMP_CONST } from '../../../services/Constants';
import ApiService from '../../../services/ApiService';
import { PubSub } from '../../../services/PubSub';

import { Button } from '@material-ui/core';

import NoRecords from '../../../reUseComponents/noRecords/NoRecords';

import ModalWindow from '../../../reUseComponents/modalWindow/modalWindow.jsx';
import { isValidDate } from '../../../reUseComponents/utils/utils';

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  Link,
  useHistory,
} from 'react-router-dom';

const BulkDependentsUpload = React.memo((props) => {
  // console.log('BulkDependentsUpload props ', props);
  const history = useHistory();

  const [validEntriesForBulkData, setValidEntriesForBulkData] = React.useState(
    []
  );
  const [isConfirmBulkUpload, setIsConfirmBulkUpload] = React.useState(false);

  const [isNotValidAllEntries, setIsNotValidAllEntries] = React.useState(false);

  const closeNotValidAllEntriesmModel = (e) => {
    setIsNotValidAllEntries(false);
  };

  const listenNotValidAllEntriesModel = (e) => {};

  const closeConfirmModel = (e) => {
    setIsConfirmBulkUpload(false);
  };

  const submitValidBulkDepData = () => {
    uploadBulkDependentsCB(validEntriesForBulkData);
  };
  const listenConfirmModel = (e) => {
    // console.log('Listen confoirm ', e);
  };

  const uploadBulkDependents = () => {
    let validEntries = props.flexTableArray.filter((obj) => {
      return (
        !!obj['empid'] &&
        !!obj['firstName'] &&
        !!obj['lastName'] &&
        !!obj['relationship'] &&
        (obj['relationship'].toLowerCase() === 'spouse' ||
          obj['relationship'].toLowerCase() === 'father' ||
          obj['relationship'].toLowerCase() === 'mother' ||
          obj['relationship'].toLowerCase() === 'son' ||
          obj['relationship'].toLowerCase() === 'daughter' ||
          obj['relationship'].toLowerCase() === 'wife' ||
          obj['relationship'].toLowerCase() === 'husband' ||
          obj['relationship'].toLowerCase() === 'father-in-law' ||
          obj['relationship'].toLowerCase() === 'mother-in-law') &&
        !!obj['gender'] &&
        !!obj['dob'] &&
        MomentReg(obj['dob'], 'DD/MM/YYYY').isValid()
      );
    });

    setValidEntriesForBulkData(validEntries);

    if (!!validEntries && validEntries.length === 0) {
      setIsNotValidAllEntries(true);
    }

    if (
      !!validEntries &&
      validEntries.length > 0 &&
      props.flexTableArray.length > validEntries.length
    ) {
      // Opening Confirm Box
      setIsConfirmBulkUpload(true);
    }

    if (props.flexTableArray.length === validEntries.length) {
      uploadBulkDependentsCB(validEntries);
    }
  };

  const changeDtToISO = (data) => {
    let newArray = data.map((obj) => {
      let dateFormateCheck = MomentReg(obj.dob, 'DD/MM/YYYY').format(
        'DD/MM/YYYY'
      );
      if (dateFormateCheck === 'Invalid date') {
        return;
      }
      let splitDt = dateFormateCheck.split('/');
      let newDt = new Date(
        parseInt(splitDt[2]),
        parseInt(splitDt[1]) - 1,
        parseInt(splitDt[0])
      );
      // obj.dob = MomentReg(newDt).toISOString();
      obj.dob = MomentReg(newDt).format('DD/MM/YYYY');
      return obj;
    });
    return newArray;
  };

  const uploadBulkDependentsCB = (validEntries) => {
    let modifiedDateFormatArray = changeDtToISO(validEntries);

    if (!!modifiedDateFormatArray && modifiedDateFormatArray.length === 0) {
      return;
    }

    ApiService.post(
      `${EMP_CONST.URL.exe_bulkDependents}?corporateUuid=${props.propObj.corporateUuid}`,
      modifiedDateFormatArray
    )
      .then((response) => {
        // console.log('response uploadBulkEmployee ', response);
        if (
          typeof response !== 'undefined' &&
          response.errCode.toLowerCase() === 'success'
        ) {
          if (
            !!response.data.failedDependents &&
            response.data.failedDependents.length > 0
          ) {
            history.push({
              pathname: props.propObj.redirectURL,
              bulkUploadObj: { isDependant: true },
              state: { failedDependents: response.data.failedDependents },
            });
            let respNotiObj = {
              message: response.message,
              color: 'error',
            };
            PubSub.publish(PubSub.events.SNACKBAR_PROVIDER, respNotiObj);
          } else {
            history.push({
              pathname: props.propObj.redirectURL,
              bulkUploadObj: { isDependant: true },
            });
            let respNotiObj = {
              message: response.message,
              color: 'success',
            };
            PubSub.publish(PubSub.events.SNACKBAR_PROVIDER, respNotiObj);
          }

          // if (
          //   !!response.data.failedDependents &&
          //   validEntriesForBulkData.length >
          //     response.data.failedDependents.length
          // ) {
          //   let respNotiObj = {
          //     message: 'Dependents Added successfully',
          //     color: 'success',
          //   };
          //   PubSub.publish(PubSub.events.SNACKBAR_PROVIDER, respNotiObj);
          // }
        }
      })
      .catch((err) => {
        console.log(`Resend Error ${JSON.stringify(err)} `);

        if (!!err.data.message || !!err.data.errCode) {
          let respNotiObj = {
            message: err.data.message || err.data.errCode,
            color: 'error',
          };
          PubSub.publish(PubSub.events.SNACKBAR_PROVIDER, respNotiObj);
        }
      })
      .finally(() => {
        console.log(`Finally `);
        setIsConfirmBulkUpload(false);
      });
  };

  const bulkDependentsUploadTemplate = (
    <Fragment>
      <div class="hpr-flex-table hpr-flex-table--collapse">
        <div class="hpr-flex-table-row hpr-flex-table-row--head">
          <div
            style={{ width: '15%' }}
            class="hpr-flex-table-cell hpr-flex-table-column-heading"
          >
            Employee Id
          </div>
          <div
            style={{ width: '20%' }}
            class="hpr-flex-table-cell hpr-flex-table-column-heading"
          >
            First Name
          </div>
          <div
            style={{ width: '20%' }}
            class="hpr-flex-table-cell hpr-flex-table-column-heading"
          >
            Last Name
          </div>

          <div
            style={{ width: '15%' }}
            class="hpr-flex-table-cell hpr-flex-table-column-heading"
          >
            Relation
          </div>

          <div
            style={{ width: '15%' }}
            class="hpr-flex-table-cell hpr-flex-table-column-heading"
          >
            Gender
          </div>
          <div
            style={{ width: '15%' }}
            class="hpr-flex-table-cell hpr-flex-table-column-heading"
          >
            DOB
          </div>
        </div>

        {props.flexTableArray.length == 0 && <NoRecords></NoRecords>}

        {props.flexTableArray.length > 0 &&
          props.flexTableArray.map((val, index) => (
            <div class="hpr-flex-table-row">
              <div
                style={{ width: '15%' }}
                class="hpr-flex-table-cell hpr-flex-table-topic-cell"
              >
                <div class="hpr-flex-table-cell--content date-content">
                  <span class="webinar-date">{val.empid}</span>
                </div>
              </div>
              <div style={{ width: '20%' }} class="hpr-flex-table-cell">
                <div class="hpr-flex-table-cell--heading">First Name</div>
                <div class="hpr-flex-table-cell--content title-content">
                  {val.firstName}
                </div>
              </div>

              <div style={{ width: '20%' }} class="hpr-flex-table-cell">
                <div class="hpr-flex-table-cell--heading">Last Name</div>
                <div class="hpr-flex-table-cell--content title-content">
                  {val.lastName}
                </div>
              </div>

              <div style={{ width: '15%' }} class="hpr-flex-table-cell">
                <div class="hpr-flex-table-cell--heading">Relation</div>
                <div class="hpr-flex-table-cell--content title-content">
                  {val.relationship}
                </div>
              </div>

              <div style={{ width: '15%' }} class="hpr-flex-table-cell">
                <div class="hpr-flex-table-cell--heading">Gender</div>
                <div class="hpr-flex-table-cell--content title-content">
                  {val.gender}
                </div>
              </div>

              <div style={{ width: '15%' }} class="hpr-flex-table-cell">
                <div class="hpr-flex-table-cell--heading">DOB</div>
                <div class="hpr-flex-table-cell--content access-link-content">
                  {MomentReg(val.dob, 'DD/MM/YYYY').format('DD/MM/YYYY')}
                </div>
              </div>
            </div>
          ))}
      </div>
      {props.flexTableArray.length > 0 && !!props.propObj.corporateUuid && (
        <div className="row">
          <div className="col-12 hpr-btns-wrapper text-center">
            <Button onClick={uploadBulkDependents} className="hpr-primary-btn">
              <FontAwesomeIcon icon="upload" className="mr-2" /> Upload
              Dependents
            </Button>
          </div>
        </div>
      )}

      {!!isConfirmBulkUpload && (
        <ModalWindow
          dataModel={{
            title: 'Are you sure?',
            description: `<span class='modal-description'>Would you like to remove the few of wrong entries in the " <b>CSV File</b>" ?</span>`,
            primaryBtnTxt: 'Yes',
            secondaryBtnTxt: 'No',
          }}
          closeModal={closeConfirmModel}
          submitModal={(e) =>
            submitValidBulkDepData(e, EMP_CONST.ADDITION_STATUS[1])
          }
          modalOpen={isConfirmBulkUpload}
          handleResponse={listenConfirmModel}
        />
      )}

      {!!isNotValidAllEntries && (
        <ModalWindow
          dataModel={{
            title: 'Error Message',
            description: `<span class='modal-description'>"Invalid data. Either data is missing or is invalid Please correct and re-submit</span>`,
            primaryBtnTxt: 'OK',
          }}
          closeModal={closeNotValidAllEntriesmModel}
          submitModal={(e) => closeNotValidAllEntriesmModel(e)}
          modalOpen={isNotValidAllEntries}
          handleResponse={listenNotValidAllEntriesModel}
        />
      )}
    </Fragment>
  );

  return bulkDependentsUploadTemplate;
});

export default BulkDependentsUpload;
