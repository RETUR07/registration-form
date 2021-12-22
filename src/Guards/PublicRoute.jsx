import { Navigate } from 'react-router-dom';
import React from 'react';

const PublicRoute = (props) => {
    const auth = props.isAuthorized;
    return !auth ? props.children : <Navigate to="/ChangeUserInfo" />;
}

export default PublicRoute;
