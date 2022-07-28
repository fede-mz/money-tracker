import React from 'react';
import { Controller } from "react-hook-form";
import Select from "react-select";

function HookMultiSelect({ label, name, options, error, control }) {
    return (
        <div className="form-group">
            <label>{label}</label>
            <Controller
                control={control}
                name={name}
                render={({ field: {onChange, onBlur, value} }) => (
                    <Select
                        isMulti={true}
                        options={options}
                        placeholder={"Choose Options"}
                        onChange={(options) =>
                            onChange(options?.map((option) => option.value))
                        }
                        onBlur={onBlur}
                        value={options.filter((option) => value?.includes(option.value))}
                        defaultValue={options.filter((option) =>
                            value?.includes(option.value)
                        )}
                        className={`${error ? 'is-invalid' : ''}`}
                    />
                )}
            />
            <div className="invalid-feedback">{error?.message}</div>
        </div>
    );
}

export { HookMultiSelect }