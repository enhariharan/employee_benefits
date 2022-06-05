import React, { Fragment, useContext, useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import sampleBulkEmployee from '../../../../assets/images/sample-bulk-employee.csv';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  Link,
  useHistory,
} from 'react-router-dom';

import XLSX from 'xlsx';

import { AuthContext } from '../../../../context/AuthContext';

import { Button, Tooltip } from '@material-ui/core';

import {
  CapitalizeFirstLetter,
  sheetJSFT,
} from '../../../../reUseComponents/utils/utils';

import BulkEmployeeUpload from '../../../commonPages/bulkEmployeeUpload/BulkEmployeeUpload';

const HrBulkUploadEmployee = React.memo((props) => {
  // console.log('ExeBulkUploadDependents props ', props);

  const [currentUser] = useContext(AuthContext);

  const [bulkDependentsData, setBulkDependentsData] = useState([]);

  const fileInput = React.createRef();

  const handleChangeBulk = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file) => {
    // console.log('file ', file);
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;
    reader.onload = ({ target: { result } }) => {
      const wb = XLSX.read(result, {
        type: rABS ? 'binary' : 'array',
        cellDates: true,
        cellNF: false,
        cellText: false,
      });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      setBulkDependentsData(data);
    };
    if (rABS) reader.readAsBinaryString(file);
    else reader.readAsArrayBuffer(file);
  };

  const downloadSampleBulkEmp = () => {
    window.open(sampleBulkEmployee, '_blank');
  };

  const hrBulkUploadEmployeeTemplate = (
    <Fragment>
      <div className="hpr_pageHeadingWrapper">
        <div className="hpr_page-heading-left-wrapper">
          <div className="hpr-breadcrumb-wrapper">
            <Link to={'/hr-home/employees'}>
              <FontAwesomeIcon icon="chevron-left" className="mr-1" />
              Back
            </Link>
          </div>
          <h3 className="">Bulk Upload employees</h3>
        </div>

        <div className="hpr-flex-table-filter-sort-wrapper align-items-center employee-pending-filter-wrapper">
          <Fragment>
            <Button
              onClick={() => fileInput.current.click()}
              className="hpr-filter-sort-submit filter-go-btn ml-3"
            >
              <FontAwesomeIcon icon="upload" className="mr-2" /> Upload CSV
            </Button>
            <input
              ref={fileInput}
              type="file"
              hidden
              accept={sheetJSFT}
              onChange={handleChangeBulk}
            />
            {/* <Tooltip title="Download Sample CSV" className="hpr-help-wrapper"> */}
            <Button
              className="hpr-download-template-wrapper"
              onClick={downloadSampleBulkEmp}
            >
              <FontAwesomeIcon icon="download" className="mr-2" /> Download
              Template
            </Button>
            {/* </Tooltip> */}
          </Fragment>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <BulkEmployeeUpload
            flexTableArray={bulkDependentsData}
            propObj={{
              redirectURL: '/hr-home/employees/list-employees',
              corporateUuid: currentUser.corporateUuid,
            }}
          ></BulkEmployeeUpload>
        </div>
      </div>
    </Fragment>
  );

  return hrBulkUploadEmployeeTemplate;
});

export default HrBulkUploadEmployee;
