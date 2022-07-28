import React from 'react';
import { useEffect } from 'react';
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import {
    cashFlowsActions, tagsActions, categoriesActions,
    useAccountsSelector, useCategoriesSelector, useTagsSelector, useCashFlowsSelector
} from './../store';
import moment from "moment";
import {
    HookInput, HookRadios, HookCheckbox,
    HookDatepicker, HookSelect, HookMultiSelect
} from "./shared";

function CashFlowForm({ isOpen, close, onSave, cashFlow, isCopy }) {
    const dispatch = useDispatch();
    const { accounts } = useAccountsSelector();
    const { categories } = useCategoriesSelector();
    const { tags } = useTagsSelector();
    const { error } = useCashFlowsSelector();

    useEffect(() => {
        dispatch(tagsActions.getAll());
        dispatch(categoriesActions.getAll());
    }, [dispatch])

    const accountOptions = accounts.map(({id, title}) => ({ value: id, label: title }));
    const categoriesOptions = categories.map(({id, title}) => ({ value: id, label: title }));
    const tagsOptions = tags.map(({id, title}) => ({ value: title, label: title }));

    const formOptions = {
        resolver: yupResolver(validationSchema)
    };

    // edit or copy
    if (cashFlow) {
        formOptions.defaultValues = {
            id: isCopy ? null : cashFlow.id,
            flowDate: new Date(cashFlow.flowDate),
            accountId: cashFlow.account.id,
            categoryId: cashFlow.category.id,
            tagTitles: cashFlow.tags?.map(tag => tag.title),
            description: cashFlow.description,
            isIncome: cashFlow.amountCents > 0 ? 'true' : 'false',
            amount: Math.abs(cashFlow.amountCents) / 100,
            isBalance: cashFlow.isBalance ? "true" : null
        }
    } else {
        formOptions.defaultValues = defaultValues;
    }

    // get functions to build form with useForm() hook
    const { register, handleSubmit, formState, reset, control, methods } = useForm(formOptions);
    const { errors, isSubmitting } = formState;

    useEffect(() => reset(formOptions.defaultValues), [cashFlow])

    function onSubmit({ id, flowDate, accountId, categoryId, tagTitles, description, isIncome, amount, isBalance }) {
        // fix timezone issue
        flowDate = moment(flowDate).format("YYYY-MM-DD");
        // amount sign
        amount = Math.abs(amount) * (isIncome ? 1 : -1);
        // is balance
        isBalance = isBalance == null ? false : isBalance;
        if (!!id) {
            console.log('update');
            // update
            return dispatch(cashFlowsActions.update({
                id, flowDate, accountId, categoryId, tagTitles, description, amount, isBalance
            })).then(() => {
                onSave({flowDate, accountId, categoryId, tagTitles, description, amount, isBalance});
                close();
            });
        } else {
            // create!
            return dispatch(cashFlowsActions.createNew({
                flowDate, accountId, categoryId, tagTitles, description, amount, isBalance
            })).then(() => {
                onSave({flowDate, accountId, categoryId, tagTitles, description, amount, isBalance});
                close();
            });
        }
    }

    return (
        <Modal isOpen={isOpen} toggle={close}>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <ModalHeader toggle={close}>Cash Flow</ModalHeader>
                    <ModalBody>
                        <HookDatepicker
                            label="Date"
                            name="flowDate"
                            control={control}
                            error={errors.flowDate}
                        />
                        <HookSelect
                            label="Account"
                            name="accountId"
                            options={accountOptions}
                            control={control}
                            error={errors.accountId}
                        />
                        <HookSelect
                            label="Category"
                            name="categoryId"
                            options={categoriesOptions}
                            control={control}
                            error={errors.categoryId}
                        />
                        <HookMultiSelect
                            label="Tags"
                            name="tagTitles"
                            options={tagsOptions}
                            control={control}
                            error={errors.tagTitles}
                        />
                        <HookInput
                            label="Description"
                            name="description"
                            error={errors.description}
                            register={register}
                        />
                        <HookRadios
                            options={[{value: "true", label: "Income"},{value: "false", label: "Outcome"}]}
                            name="isIncome"
                            error={errors.isIncome}
                            register={register}
                        />
                        <HookInput
                            label="Amount"
                            name="amount"
                            error={errors.amount}
                            register={register}
                        />
                        <HookCheckbox
                            label="For Balance Purposes"
                            title="For balance means that it's not accounted for Income/Outcome by Category"
                            name="isBalance"
                            error={errors.isBalance}
                            register={register}
                        />
                        {error &&
                        <div className="alert alert-danger mt-3 mb-0">{error.message}</div>
                        }
                    </ModalBody>
                    <ModalFooter>
                        <button disabled={isSubmitting} className="btn btn-primary mt-1">
                            {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                            Save
                        </button>
                        <button type="button" disabled={isSubmitting} className="btn btn-secondary mt-1" onClick={close}>
                            {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                            Cancel
                        </button>
                    </ModalFooter>
                </form>
            </FormProvider>
        </Modal>
    )
}

// form validation rules
const validationSchema = Yup.object().shape({
    flowDate: Yup.date('').required('Date is required'),
    accountId: Yup.number('').required('Account is required'),
    categoryId: Yup.number('').required('Category is required'),
    tagTitles: Yup.array('').nullable(),
    description: Yup.string('').nullable(),
    isIncome: Yup.boolean('').required('Must indicate Income or Outcome'),
    amount: Yup.number('').required('Amount is required'),
    isBalance: Yup.boolean('').nullable()
});

const defaultValues = {
    flowDate: new Date(),
    accountId: null,
    categoryId: null,
    tagTitles: null,
    description: null,
    isIncome: "false",
    amount: null,
    isBalance: null
}

export { CashFlowForm };