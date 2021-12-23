import { Navigate } from 'react-router-dom';
import React, {useContext} from 'react';
import Context from '../Contexts/Context';

  const PrivateRoute = (children) => {
    const {isAuthorized} = useContext(Context);
    const auth = isAuthorized;
    return auth ? children : <Navigate to="/" />;
  }

  export default PrivateRoute;