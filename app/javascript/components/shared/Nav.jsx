import React from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { useAuthSelector, authActions } from './../../store';

function Nav() {
    const dispatch = useDispatch();
    const { user } = useAuthSelector();

    const logout = () => dispatch(authActions.logout(null));

    // only show nav when logged in
    if (!user) return null;
    
    return (
        <nav className="navbar navbar-expand navbar-dark bg-dark">
            <div className="navbar-nav">
                <button onClick={logout} className="btn btn-link nav-item nav-link">Logout</button>
            </div>
        </nav>
    );
}

export { Nav };