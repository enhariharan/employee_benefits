import React, { Fragment } from 'react';

import Alert from '@material-ui/lab/Alert';

import { EMP_CONST } from '../../services/Constants';

const NoRecords = React.memo(function NoRecords(props) {
  // console.log('props NoRecords ', props);

  const noRecordsTemplate = (
    <Fragment>
      <Alert variant="outlined" severity="warning" className="col m-3">
        {EMP_CONST.NORECORDS}
      </Alert>
    </Fragment>
  );

  return noRecordsTemplate;
});

export default NoRecords;
