import React from 'react';
import { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { useAuthSelector, authActions } from './../store';
import { history } from './../helpers';
import { HookInput } from "./shared";

function Login() {
    const dispatch = useDispatch();
    const { user, error } = useAuthSelector();

    useEffect(() => {
        // redirect to home if already logged in
        if (user) history.navigate('/');
    }, [user]);

    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors, isSubmitting } = formState;

    function onSubmit({ email, password }) {
        return dispatch(authActions.login({ email, password }));
    }

    return (
        <div className="col-md-6 offset-md-3 mt-5">
            <div className="alert alert-info">
                Email: fede.mz@gmail.com<br />
                Password: password1
            </div>
            <div className="card">
                <h4 className="card-header">Login</h4>
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <HookInput
                            label="Email"
                            name="email"
                            error={errors.email}
                            register={register}
                        />
                        <HookInput
                            label="Password"
                            name="password"
                            error={errors.password}
                            type="password"
                            register={register}
                        />
                        <button disabled={isSubmitting} className="btn btn-primary mt-1">
                            {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                            Login
                        </button>
                        {error &&
                            <div className="alert alert-danger mt-3 mb-0">{error.message}</div>
                        }
                    </form>
                </div>
            </div>
        </div>
    )
}

// form validation rules
const validationSchema = Yup.object().shape({
    email: Yup.string().required('Email is required'),
    password: Yup.string().required('Password is required')
});

export { Login };