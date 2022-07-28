import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import * as humps from "humps";
import { fetchWrapper } from './../helpers';

// create slice
const baseUrl = '/api/v1/cash_flows';
const name = 'cashFlows';
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, reducers: {}, extraReducers });

// exports

export const cashFlowsActions = { ...slice.actions, ...extraActions };
export const cashFlowsReducer = slice.reducer;

// implementation

function createInitialState() {
    return {
        loading: false,
        error: null,
        cashFlows: [],
        byCategory: {
            loading: false,
            error: null,
            data: {}
        }
    }
}

function createExtraActions() {
    return {
        getAll: createAsyncThunk(
            `${name}/getAll`,
            async ({ fromDate, toDate }) => {
                const params = new URLSearchParams(humps.decamelizeKeys({ fromDate, toDate })).toString();
                return await fetchWrapper.get(`${baseUrl}.json?${params}`);
            }
        ),
        createNew: createAsyncThunk(
            `${name}/createNew`,
            async ({ accountId, categoryId, description, flowDate, amount, isBalance, tagTitles }) =>
                await fetchWrapper.post(`${baseUrl}.json`, {
                    cashFlow: {
                        accountId, categoryId,
                        description, flowDate, amount, isBalance,
                        tags: (tagTitles ?? []).map( title => ({ title }))
                    }
                })
        ),
        update: createAsyncThunk(
            `${name}/update`,
            async ({ id, accountId, categoryId, description, flowDate, amount, isBalance, tagTitles }) =>
                await fetchWrapper.put(`${baseUrl}/${id}.json`, {
                    cashFlow: {
                        accountId, categoryId,
                        description, flowDate, amount, isBalance,
                        tags: (tagTitles ?? []).map( title => ({ title }))
                    }
                })
        ),
        destroy: createAsyncThunk(
            `${name}/destroy`,
            async ({ id }) =>
                await fetchWrapper.delete(`${baseUrl}/${id}.json`)
        ),
        getByCategory: createAsyncThunk(
            `${name}/getByCategory`,
            async ({ fromDate, toDate, currency }) => {
                const params = new URLSearchParams(humps.decamelizeKeys({ fromDate, toDate, currency })).toString();
                return await fetchWrapper.get(`${baseUrl}/by_category.json?${params}`);
            }
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
            state.cashFlows = action.payload.cashFlows;
        },
        [extraActions.getAll.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.error;
        },
        [extraActions.createNew.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [extraActions.createNew.fulfilled]: (state, action) => {
            state.loading = false;
            state.cashFlows = _.sortBy([...state.cashFlows, action.payload.cashFlow], ['flowDate']);
        },
        [extraActions.createNew.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.error;
        },
        [extraActions.update.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [extraActions.update.fulfilled]: (state, action) => {
            state.loading = false;
            const index = state.cashFlows.findIndex(
                cashFlow => cashFlow.id === action.payload.cashFlow.id
            );
            if (index !== -1) {
                state.cashFlows[index] = action.payload.cashFlow;
            } else {
                state.cashFlows.push(action.payload.cashFlow);
            }
        },
        [extraActions.update.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.error;
        },
        [extraActions.destroy.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [extraActions.destroy.fulfilled]: (state, action) => {
            state.loading = false;
            state.cashFlows = state.cashFlows.filter(cashFlow => cashFlow.id != action.payload.cashFlow.id);
        },
        [extraActions.destroy.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.error;
        },
        [extraActions.getByCategory.pending]: (state) => {
            state.byCategory.loading = true;
            state.byCategory.error = null;
        },
        [extraActions.getByCategory.fulfilled]: (state, action) => {
            state.byCategory.loading = false;
            state.byCategory.data = action.payload;
        },
        [extraActions.getByCategory.rejected]: (state, action) => {
            state.byCategory.loading = false;
            state.byCategory.error = action.error;
        }
    };
}
