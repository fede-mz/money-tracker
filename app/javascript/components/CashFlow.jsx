import React, {useState} from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { useCashFlowsSelector, cashFlowsActions } from './../store';
import moment from "moment";
import { CashFlowForm } from ".";

function CashFlow({ dateSelected, onCashFlowChange }) {
    const dispatch = useDispatch();
    const { cashFlows } = useCashFlowsSelector();
    const [ showModal, setShowModal ] = useState(null);

    useEffect(() => {
        const fromDate = dateSelected.clone().startOf('month').format('YYYY-MM-DD');
        const toDate = dateSelected.clone().endOf('month').format('YYYY-MM-DD');
        dispatch(cashFlowsActions.getAll({ fromDate, toDate }));
    }, [dispatch, dateSelected]);

    const editCashFlow = (cashFlow) => {
        setShowModal({ cashFlow, copy: false });
    }
    const copyCashFlow = (cashFlow) => {
        setShowModal({ cashFlow, copy: true });
    }
    const createNewCashFlow = (cashFlow) => {
        onCashFlowChange(cashFlow);
    }
    const deleteCashFlow = (cashFlow) => {
        dispatch(cashFlowsActions.destroy(cashFlow));
        onCashFlowChange(cashFlow);
    }

    return (
        <div>
            <div className="row p-3 bg-secondary text-white rounded">
                <div className="col-md-2">Date</div>
                <div className="col-md-2">Account</div>
                <div className="col-md-2">Category</div>
                <div className="col-md-2">Description</div>
                <div className="col-md-2">Amount</div>
                <div className="col-md-2">Actions</div>
            </div>
            {cashFlows.length == 0 &&
            <div className="row p-3 bg-light text-dark rounded">
                <div className="col-md-12">
                    No Data
                </div>
            </div>
            }
            {cashFlows.length > 0 &&
            <div className="cash-flow-detail">
                {cashFlows.map(cashFlow =>
                <div className="row p-3 border-bottom" key={cashFlow.id}>
                    <div className="col-md-2">
                        {moment(cashFlow.flowDate, 'YYYY-MM-DD').format("ddd DD MMM")}
                    </div>
                    <div className="col-md-2">
                        {cashFlow.account.title}
                    </div>
                    <div className="col-md-2">
                        {cashFlow.category.title} <br/>
                        <span className="text-secondary text-smaller">
                                {cashFlow.tags.map(tag => tag.title).join(', ')}
                            </span>
                    </div>
                    <div className="col-md-2">
                            <span className="text-secondary text-smaller">
                                {cashFlow.description}
                            </span>
                    </div>
                    <div className="col-md-2">
                            <span className={cashFlow.isBalance ? 'text-primary' : (cashFlow.amountCents < 0 ? 'text-danger' : 'text-success')}>
                                {cashFlow.amount}
                            </span>
                    </div>
                    <div className="col-md-2">
                        <div className="btn-group">
                            <button className="btn btn-link" onClick={() => editCashFlow(cashFlow)}>
                                <i className="fa fa-edit"></i>
                            </button>
                            <button className="btn btn-link" onClick={() => copyCashFlow(cashFlow)}>
                                <i className="fa fa-copy"></i>
                            </button>
                            <button className="btn btn-link" onClick={() => deleteCashFlow(cashFlow)}>
                                <i className="fa fa-trash text-danger"></i>
                            </button>
                        </div>
                    </div>
                </div>
                )}
            </div>
            }
            {cashFlows.loading && <div className="spinner-border spinner-border-sm"></div>}
            {cashFlows.error && <div className="text-danger">Error loading cash flow: {cashFlows.error.message}</div>}

            <div className="float-right">
                <button className="btn btn-link" onClick={() => setShowModal({})}>
                    <i className="fa fa-3x fa-plus-circle text-primary"></i>
                </button>
            </div>
            <CashFlowForm
                isOpen={showModal != null}
                close={() => setShowModal(null)}
                onSave={createNewCashFlow}
                cashFlow={showModal?.cashFlow}
                isCopy={showModal?.copy}
            />
        </div>
    );
}

export { CashFlow };