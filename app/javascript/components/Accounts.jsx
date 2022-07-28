import React from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { useAccountsSelector, accountsActions } from './../store';

function Accounts() {
    const dispatch = useDispatch();
    const { accounts } = useAccountsSelector();

    useEffect(() => {
        dispatch(accountsActions.getAll());
    }, [dispatch]);

    return (
        <div>
            <div className="row p-3 bg-secondary text-white rounded">
                <div className="col-md-12">
                    Accounts
                </div>
            </div>
            {accounts.map(account =>
                <div className="row p-3 border-bottom" key={account.id}>
                    <div className="col-md-8">
                        {account.title}
                    </div>
                    <div className="col-md-4">
                        <span className={account.balanceCents < 0 ? 'text-danger' : 'text-success'}>
                            {account.balance}
                        </span>
                    </div>
                </div>
            )}
            {accounts.loading && <div className="spinner-border spinner-border-sm"></div>}
            {accounts.error && <div className="text-danger">Error loading accounts: {accounts.error.message}</div>}
        </div>
    );
}

export { Accounts };