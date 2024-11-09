// components/PrivateRoute.js
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { isAuthenticated, isAdmin } from '../utils/auth';

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            isAuthenticated() && isAdmin() ? (
                <Component {...props} />
            ) : (
                <Navigate replace to="/" />
            )
        }
    />
);

export default PrivateRoute;
