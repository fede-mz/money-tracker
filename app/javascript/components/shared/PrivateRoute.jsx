import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthSelector } from "../../store";
import { history } from './../../helpers';

function PrivateRoute({ children }) {
    const { user } = useAuthSelector();
    if (!user) {
        // not logged in so redirect to login page with the return url
        return <Navigate to="/login" state={{ from: history.location }} />
    }

    // authorized so return child components
    return children;
}

export { PrivateRoute };