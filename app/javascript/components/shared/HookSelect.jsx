import React from 'react';
import { Controller } from "react-hook-form";
import Select from "react-select";

function HookSelect({ label, name, options, error, control }) {
    return (
        <div className="form-group">
            <label>{label}</label>
            <Controller
                control={control}
                name={name}
                render={({ field: {onChange, onBlur, value} }) => (
                    <Select
                        options={options}
                        placeholder={"Choose Option"}
                        onChange={(option) =>
                            onChange(option.value)
                        }
                        onBlur={onBlur}
                        value={options.filter((option) => value == option.value)}
                        defaultValue={options.filter((option) =>
                            value == option.value
                        )}
                        className={`${error ? 'is-invalid' : ''}`}
                    />
                )}
            />
            <div className="invalid-feedback">{error?.message}</div>
        </div>
    );
}

export { HookSelect }