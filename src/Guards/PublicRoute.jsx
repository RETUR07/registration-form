import { Navigate } from 'react-router-dom';
import React, {useContext} from 'react';
import Context from '../Contexts/Context';

const PublicRoute = (children) => {
    const {isAuthorized} = useContext(Context);
    const auth = isAuthorized;
    return !auth ? children : <Navigate to="/ChangeUserInfo" />;
}

export default PublicRoute;
