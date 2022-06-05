import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';

import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ ...props }) => {
  const [currentUser] = useContext(AuthContext);
  // console.log('PrivateRoute logged in user is', currentUser);

  return currentUser !== null && !!currentUser ? (
    currentUser.role === 'hr' ? (
      <Redirect to="/hr-home" />
    ) : currentUser.role === 'executive' ? (
      <Redirect to="/executive-home" />
    ) : currentUser.role === 'customer' ? (
      <Redirect to="/customer-home" />
    ) : (
      <Redirect to="/login" />
    )
  ) : (
    <Redirect to="/login" />
  );
};

export default PrivateRoute;
