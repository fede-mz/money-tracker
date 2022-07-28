import React from 'react';

function HookCheckbox({ label, name, value, title, error, register }) {
    return (
        <div className="form-group text-right">
            <input
                name={name}
                type="checkbox"
                value={value}
                className={`mr-2 ${error ? 'is-invalid' : ''}`}
                {...register(name)}
            />
            <label className="m-2" title={title}>{label}</label>
            <div className="invalid-feedback">{error?.message}</div>
        </div>
    );
}

export { HookCheckbox }