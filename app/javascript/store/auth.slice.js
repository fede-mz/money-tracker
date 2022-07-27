import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { history, fetchWrapper } from './../helpers';

// create slice

const baseUrl = '/api/v1/auth';
const name = 'auth';
const initialState = createInitialState();
const reducers = createReducers();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, reducers, extraReducers });

// exports

export const authActions = { ...slice.actions, ...extraActions };
export const authReducer = slice.reducer;

// implementation

function createInitialState() {
    const token = localStorage.getItem('token');
    return {
        // initialize state from local storage to enable user to stay logged in
        token: token,
        error: null
    }
}

function createReducers() {
    return {
        logout(state = null) {
            if (state) {
                state.token = null;
                state.error = null;
            }
            localStorage.removeItem('token');
            history.navigate('/login');
        }
    }
}

function createExtraActions() {
    return {
        login: createAsyncThunk(
            `${name}/login`,
            async ({ email, password }) =>
                await fetchWrapper.post(`${baseUrl}/login.json`, { email, password })
        )
    };
}

function createExtraReducers() {
    const { pending, fulfilled, rejected } = extraActions.login;
    return {
        [pending]: (state) => {
            state.error = null;
        },
        [fulfilled]: (state, action) => {
            // store jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('token', action.payload.token);
            state.token = action.payload.token;

            // get return url from location state or default to home page
            const { from } = history.location.state || { from: { pathname: '/' } };
            history.navigate(from);
        },
        [rejected]: (state, action) => {
            state.error = action.error;
        }
    };
}
