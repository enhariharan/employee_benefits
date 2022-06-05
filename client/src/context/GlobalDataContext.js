import React, { createContext, useState } from 'react';

export const GlobalDataContext = createContext();

export const GlobalDataProvider = (props) => {
  const [globalOnLoadData, setGlobalOnLoadData] = useState({
    notificationCount: 0,
  });
  return (
    <GlobalDataContext.Provider value={[globalOnLoadData, setGlobalOnLoadData]}>
      {props.children}
    </GlobalDataContext.Provider>
  );
};
