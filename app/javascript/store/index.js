import { configureStore } from '@reduxjs/toolkit';
import { useSelector } from "react-redux";

import { authReducer } from './auth.slice';
import { accountsReducer } from "./accounts.slice";
import { categoriesReducer } from './categories.slice';
import { tagsReducer } from './tags.slice';
import { cashFlowsReducer } from './cash-flows.slice';

export * from './auth.slice';
export * from './accounts.slice';
export * from './categories.slice';
export * from './tags.slice';
export * from './cash-flows.slice';

// store

export const store = configureStore({
    reducer: {
        auth: authReducer,
        accounts: accountsReducer,
        categories: categoriesReducer,
        tags: tagsReducer,
        cashFlows: cashFlowsReducer
    }
});

// selectors

export function useAuthSelector () {
    return useSelector(state => state.auth);
}

export function useAccountsSelector () {
    return useSelector(state => state.accounts);
}

export function useCategoriesSelector () {
    return useSelector(state => state.categories);
}

export function useTagsSelector () {
    return useSelector(state => state.tags);
}

export function useCashFlowsSelector () {
    return useSelector(state => state.cashFlows);
}