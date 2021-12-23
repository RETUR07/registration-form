import { Navigate } from 'react-router-dom';
import React, {useContext} from 'react';
import Context from '../Contexts/Context';

  const PrivateRoute = (props) => {
    const {isAuthorized} = useContext(Context);
    const auth = isAuthorized;
    return auth ? props.children : <Navigate to="/AuthForm" />;
  }

  export default PrivateRoute;