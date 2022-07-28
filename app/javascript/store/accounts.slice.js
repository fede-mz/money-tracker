import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { fetchWrapper } from './../helpers';

// create slice
const baseUrl = '/api/v1/accounts';
const name = 'accounts';
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, reducers: {}, extraReducers });

// exports

export const accountsActions = { ...slice.actions, ...extraActions };
export const accountsReducer = slice.reducer;

// implementation

function createInitialState() {
    return {
        loading: false,
        error: null,
        accounts: []
    }
}

function createExtraActions() {
    return {
        getAll: createAsyncThunk(
            `${name}/getAll`,
            async () => await fetchWrapper.get(`${baseUrl}.json`)
        ),
        getDetail: createAsyncThunk(
            `${name}/getDetail`,
            async (accountId) => await fetchWrapper.get(`${baseUrl}/${accountId}.json`)
        )
    }
}

function createExtraReducers() {
    return {
        [extraActions.getAll.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [extraActions.getAll.fulfilled]: (state, action) => {
            state.loading = false;
            state.accounts = action.payload.accounts;
        },
        [extraActions.getAll.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.error;
        },
        [extraActions.getDetail.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [extraActions.getDetail.fulfilled]: (state, action) => {
            state.loading = false;
            const index = state.accounts.findIndex(
                account => account.id === action.payload.account.id
            );
            if (index !== -1) {
                state.accounts[index] = action.payload.account;
            } else {
                state.accounts.push(action.payload.account);
            }
        },
        [extraActions.getDetail.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.error;
        }
    };
}
