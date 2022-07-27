import { store, authActions } from './../store';
import * as humps from "humps";

export const fetchWrapper = {
    get: request('GET'),
    post: request('POST'),
    put: request('PUT'),
    delete: request('DELETE')
};

function request(method) {
    return (url, body) => {

        const requestOptions = {
            method,
            headers: buildHeader(url)
        };
        if (body) {
            requestOptions.body = JSON.stringify(humps.decamelizeKeys(body))
        }
        return fetch(url, requestOptions).then(handleResponse);
    }
}

// helper functions

function buildHeader(url) {
    // return auth header with jwt if user is logged in and request is to the api url
    const header = {
        'Content-Type': 'application/json'
    }

    const isApiUrl = url.startsWith('/');
    if (isApiUrl) {
        const csrfToken = getCsrfToken();
        header["X-CSRF-Token"] = csrfToken;

        const token = getAuthToken();
        const isLoggedIn = !!token;
        if (isLoggedIn) {
            header["Authorization"] = token;
        }
    }

    return header;
}

function getAuthToken() {
    const auth = store.getState().auth;
    return auth?.token;
}

function getCsrfToken() {
    return document.querySelector('meta[name="csrf-token"]').content;
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);

        if (!response.ok) {
            if ([401, 403].includes(response.status) && getAuthToken()) {
                // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                const logout = () => store.dispatch(authActions.logout(null));
                logout();
            }

            const error = (data && data.error) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}