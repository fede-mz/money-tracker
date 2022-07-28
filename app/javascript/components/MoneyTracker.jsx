import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { useAuthSelector } from './../store';
import moment from "moment";
import { Accounts, Outcomes, CashFlow } from ".";

function MoneyTracker() {
    const dispatch = useDispatch();
    const { user } = useAuthSelector();
    const [dateSelected, setNewDate] = useState(moment());
    const month = dateSelected.format("MMM YYYY");

    return (
        <div className="row mt-5">
            <div className="col-12 text-center h3">
                <button className="btn btn-link mr-3" onClick={() => setNewDate(dateSelected.add(-1, 'months').clone())}>
                    <i className="fa fa-angle-left"></i>
                </button>
                <span>{month}</span>
                <button className="btn btn-link ml-3" onClick={() => setNewDate(dateSelected.add(1, 'months').clone())}>
                    <i className="fa fa-angle-right"></i>
                </button>
            </div>
            <div className="col-lg-8 px-lg-3 col-md-12">
                <CashFlow dateSelected={dateSelected} />
            </div>
            <div className="col-lg-4 px-lg-3 col-md-12">
                <div className="row">
                    <div className="col-lg-12 col-md-6">
                        <Accounts />
                    </div>
                    <div className="col-lg-12 col-md-6 mt-lg-5">
                        <Outcomes dateSelected={dateSelected} currency={user.primaryCurrency} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export { MoneyTracker };