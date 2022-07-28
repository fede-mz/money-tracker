import React from 'react';

function HookRadios({ options, name, error, register }) {
    return (
        <div className="form-group">
            {options.map(option =>
                <React.Fragment key={option.value}>
                    <input
                        name={name}
                        type="radio"
                        value={option.value}
                        className={`${error ? 'is-invalid' : ''}`}
                        {...register(name)}
                    />
                    <label className="m-2">{option.label}</label>
                </React.Fragment>
            )}
            <div className="invalid-feedback">{error?.message}</div>
        </div>
    );
}

export { HookRadios }