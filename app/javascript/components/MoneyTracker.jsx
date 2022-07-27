import React from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import {
    useAuthSelector,
    useAccountsSelector, accountsActions,
    useCashFlowsSelector, cashFlowsActions
} from './../store';

function MoneyTracker() {
    const dispatch = useDispatch();
    const { user } = useAuthSelector();
    const { accounts } = useAccountsSelector();
    const { cashFlows, byCategory } = useCashFlowsSelector();

    useEffect(() => {
        if (user) {
            dispatch(accountsActions.getAll());
            dispatch(cashFlowsActions.getAll({ fromDate: '2022-01-01', toDate: '2023-01-01' }));
            dispatch(cashFlowsActions.getByCategory({ fromDate: '2022-01-01', toDate: '2023-01-01', currency: user.primaryCurrency }));
        }
    }, [dispatch, user]);

    return (
        <div>
            <h1>Hi!</h1>
            <p>This will be the dashboard</p>
            <h3>Accounts:</h3>
            {accounts.length &&
                <ul>
                    {accounts.map(account =>
                        <li key={account.id}>{account.title} (balance: {account.balance})</li>
                    )}
                </ul>
            }
            {accounts.loading && <div className="spinner-border spinner-border-sm"></div>}
            {accounts.error && <div className="text-danger">Error loading accounts: {accounts.error.message}</div>}

            <h3>Outcomes by Category:</h3>
            {byCategory.data.outcomes &&
            <ul>
                {byCategory.data.outcomes.byCategories.map(outcome =>
                    <li key={outcome.category.id}>
                        {outcome.category.title}
                        <span>
                            (amount: {outcome.amount})
                        </span>
                    </li>
                )}
            </ul>
            }
            {byCategory.loading && <div className="spinner-border spinner-border-sm"></div>}
            {byCategory.error && <div className="text-danger">Error loading cash flow: {byCategory.error.message}</div>}

            <p>This will be the detail</p>
            <h3>Cash Flow:</h3>
            {cashFlows.length &&
            <ul>
                {cashFlows.map(cashFlow =>
                    <li key={cashFlow.id}>
                        {cashFlow.flow_date}
                        {cashFlow.account.title} {cashFlow.category.title}
                        tags: {cashFlow.tags.map(tag => tag.title).join(', ')}
                        <span>
                            (amount: {cashFlow.amount})
                        </span>
                    </li>
                )}
            </ul>
            }
            {cashFlows.loading && <div className="spinner-border spinner-border-sm"></div>}
            {cashFlows.error && <div className="text-danger">Error loading cash flow: {cashFlows.error.message}</div>}
        </div>
    );
}

export { MoneyTracker };