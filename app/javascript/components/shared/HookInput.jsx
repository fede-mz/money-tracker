import React from 'react';

function HookInput({ label, name, error, type, register }) {
    return (
        <div className="form-group">
            <label>{label}</label>
            <input
                name={name}
                type={type ? type : "text"}
                className={`form-control ${error ? 'is-invalid' : ''}`}
                {...register(name)}
            />
            <div className="invalid-feedback">{error?.message}</div>
        </div>
    );
}

export { HookInput }