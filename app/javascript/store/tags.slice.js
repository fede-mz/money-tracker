import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { fetchWrapper } from './../helpers';

// create slice
const baseUrl = '/api/v1/tags';
const name = 'tags';
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, reducers: {}, extraReducers });

// exports

export const tagsActions = { ...slice.actions, ...extraActions };
export const tagsReducer = slice.reducer;

// implementation

function createInitialState() {
    return {
        loading: false,
        error: null,
        tags: []
    }
}

function createExtraActions() {
    return {
        getAll: createAsyncThunk(
            `${name}/getAll`,
            async () => await fetchWrapper.get(`${baseUrl}.json`)
        )
    }
}

function createExtraReducers() {
    const { pending, fulfilled, rejected } = extraActions.getAll;
    return {
        [pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [fulfilled]: (state, action) => {
            state.loading = false;
            state.tags = action.payload.tags;
        },
        [rejected]: (state, action) => {
            state.loading = false;
            state.error = action.error;
        }
    };
}
