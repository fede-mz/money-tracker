import React from 'react';
import { Controller } from "react-hook-form";
import DatePicker from "react-datepicker";

function HookDatepicker({ label, name, error, control }) {
    return (
        <div className="form-group">
            <label>{label}</label>
            <Controller
                control={control}
                name={name}
                render={({ field }) => (
                    <DatePicker
                        placeholderText='Select date'
                        onChange={field.onChange}
                        selected={field.value}
                    />
                )}
            />
            <div className="invalid-feedback">{error?.message}</div>
        </div>
    );
}

export { HookDatepicker }