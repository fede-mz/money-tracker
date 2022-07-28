import React from 'react';
import { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import {
    cashFlowsActions,
    useAccountsSelector,
    useCategoriesSelector,
    useTagsSelector,
    useCashFlowsSelector
} from './../store';
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

function CashFlowForm({ isOpen, close, onSave }) {
    const dispatch = useDispatch();
    const { accounts } = useAccountsSelector();
    const { categories } = useCategoriesSelector();
    const { tags } = useTagsSelector();
    const { error } = useCashFlowsSelector();

    // form validation rules 
    const validationSchema = Yup.object().shape({
        accountId: Yup.number().required('Account is required'),
        categoryId: Yup.number().required('Category is required'),
        tagTitles: Yup.array(),
        description: Yup.string(),
        flowDate: Yup.date().required('Date is required'),
        amount: Yup.number().required('Amount is required'),
        isIncome: Yup.boolean().required('Must indicate Income or Outcome'),
        isBalance: Yup.boolean()
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors, isSubmitting } = formState;

    function onSubmit({ flowDate, accountId, categoryId, tagTitles, description, amount, isBalance }) {
        return dispatch(cashFlowsActions.createNew({ flowDate, accountId, categoryId, tagTitles, description, amount, isBalance }))
                .then(() => {
                    onSave({ flowDate, accountId, categoryId, tagTitles, description, amount, isBalance });
                    close();
                });
    }

    return (
        <Modal isOpen={isOpen} toggle={close}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <ModalHeader toggle={close}>Cash Flow</ModalHeader>
                <ModalBody>
                    <div className="form-group">
                        <label>Date</label>
                        <input name="flowDate" type="text" {...register('flowDate')} className={`form-control ${errors.flowDate ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.flowDate?.message}</div>
                    </div>
                    <div className="form-group">
                        <label>Account</label>
                        <input name="accountId" type="text" {...register('accountId')} className={`form-control ${errors.accountId ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.accountId?.message}</div>
                    </div>
                    <div className="form-group">
                        <label>Category</label>
                        <input name="categoryId" type="text" {...register('categoryId')} className={`form-control ${errors.categoryId ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.categoryId?.message}</div>
                    </div>
                    <div className="form-group">
                        <label>Tags</label>
                        <input name="tagTitles" type="text" {...register('tagTitles')} className={`form-control ${errors.tagTitles ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.tagTitles?.message}</div>
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <input name="description" type="text" {...register('description')} className={`form-control ${errors.description ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.description?.message}</div>
                    </div>
                    <div className="form-group">
                        <label>Income / Outcome</label>
                        <input name="isIncome" type="text" {...register('isIncome')} className={`form-control ${errors.isIncome ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.isIncome?.message}</div>
                    </div>
                    <div className="form-group">
                        <label>Amount</label>
                        <input name="amount" type="text" {...register('amount')} className={`form-control ${errors.amount ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.amount?.message}</div>
                    </div>
                    <div className="form-group">
                        <label title="For balance means that it's not accounted for Income/Outcome by Category">For Balance Purposes</label>
                        <input name="isBalance" type="text" {...register('isBalance')} className={`form-control ${errors.isBalance ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.isBalance?.message}</div>
                    </div>
                    {error &&
                    <div className="alert alert-danger mt-3 mb-0">{error.message}</div>
                    }
                </ModalBody>
                <ModalFooter>
                    <button disabled={isSubmitting} className="btn btn-primary mt-1">
                        {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                        Save
                    </button>
                    <button disabled={isSubmitting} className="btn btn-primary mt-1" onClick={close}>
                        {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                        Cancel
                    </button>
                </ModalFooter>
            </form>
        </Modal>
    )
}

export { CashFlowForm };