import React from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { useCategoriesSelector, categoriesActions } from './../store';

function MoneyTracker() {
    const dispatch = useDispatch();
    const { categories } = useCategoriesSelector();

    useEffect(() => {
        dispatch(categoriesActions.getAll());
    }, [dispatch]);

    return (
        <div>
            <h1>Hi!</h1>
            <p>You're logged in!!</p>
            <h3>Categories from secure api end point:</h3>
            {categories.length &&
                <ul>
                    {categories.map(category =>
                        <li key={category.id}>{category.title} (budget: {category.budget})</li>
                    )}
                </ul>
            }
            {categories.loading && <div className="spinner-border spinner-border-sm"></div>}
            {categories.error && <div className="text-danger">Error loading categories: {categories.error.message}</div>}
        </div>
    );
}

export { MoneyTracker };