import { Navigate } from 'react-router-dom';
import React from 'react';

  const PrivateRoute = (props) => {
    const auth = props.isAuthorized;
    return auth ? props.children : <Navigate to="/AuthForm" />;
  }

  export default PrivateRoute;