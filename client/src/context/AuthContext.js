import React, { useState, useEffect, createContext } from 'react';

export const AuthContext = createContext();

export const AuthProvider = (props) => {
  // console.log('props AuthProvider ', props);
  const storedUser =
    JSON.parse(window.sessionStorage.getItem('visUserCred')) || null;
  const [currentUser, setCurrentUser] = useState(storedUser);

  useEffect(() => {
    // console.log('AuthProvider visUserCred useEffect ', currentUser);
    window.sessionStorage.setItem('visUserCred', JSON.stringify(currentUser));
  }, [currentUser]);

  const handleLogin = (data) => {
    // console.log('AuthProvider log in user ', data);
    setCurrentUser(data);
  };

  const handleLogout = () => {
    // console.log('AuthProvider handleLogout receive');
    window.sessionStorage.removeItem('visUserCred');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={[currentUser, setCurrentUser, handleLogin, handleLogout]}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
