import React from 'react';
import { useSnackbar } from 'notistack';

const NotiStack = React.memo(function NotiStack(props) {
  const { enqueueSnackbar } = useSnackbar();
  //   console.log('props NotiStack ', props);
  const messageCont = () => {
    return (
      <div
        style={{ maxWidth: 400 }}
        dangerouslySetInnerHTML={{
          __html: props.dataModel.message || '',
        }}
      />
    );
  };
  enqueueSnackbar(messageCont(), {
    variant: props.dataModel.color,
    autoHideDuration: props.dataModel.autoHideDuration || 3000,
    anchorOrigin: {
      vertical: 'top',
      horizontal: 'right',
    },
  });
  return null;
});

export default NotiStack;
