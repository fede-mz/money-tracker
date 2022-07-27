import { configureStore } from '@reduxjs/toolkit';

import { authReducer } from './auth.slice';
import { categoriesReducer } from './categories.slice';
import { useSelector } from "react-redux";

export * from './auth.slice';
export * from './categories.slice';

// store

export const store = configureStore({
    reducer: {
        auth: authReducer,
        categories: categoriesReducer
    }
});

// selectors

export function useAuthSelector () {
    return useSelector(state => state.auth);
}

export function useCategoriesSelector () {
    return useSelector(state => state.categories);
}