import React from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

import { history } from 'helpers';
import { Nav, PrivateRoute } from './components/shared';
import { Login, MoneyTracker } from './components';

function App() {
    history.navigate = useNavigate();
    history.location = useLocation();

    return (
        <div className="app-container bg-light">
            <Nav />
            <div className="container pt-4 pb-4">
                <Routes>
                    <Route
                        path="/"
                        element={
                            <PrivateRoute>
                                <MoneyTracker />
                            </PrivateRoute>
                        }
                    />
                    <Route path="/login" element={<Login />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </div>
    );
}

export { App };