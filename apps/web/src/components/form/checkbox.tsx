import React from "react";
import { FieldError, Path, UseFormRegister } from "react-hook-form";
import FormError from "./form-error";

type CheckboxProps<T extends Record<string, any>> = {
  label: Path<T>;
  register: UseFormRegister<T>;
  required?: boolean;
  falseLabel?: string;
  error?: FieldError;
} & React.InputHTMLAttributes<HTMLInputElement>;
const Checkbox = <T extends Record<string, any>>({
  register,
  required,
  error,
  falseLabel,
  label,
  ...props
}: CheckboxProps<T>) => {
  const labelInput = label.split("_").join(" ");
  return (
    <div className="flex  gap-2">
      <input
        type="checkbox"
        {...register(label, { required })}
        {...props}
        aria-invalid={error ? "true" : "false"}
        className="--ol-checkbox"
      />
      <label className="first-letter:uppercase text-theme_secondary_white font-medium text-base">
        {falseLabel ? falseLabel : labelInput}
      </label>
      {error && <FormError error={error} />}
    </div>
  );
};

export default Checkbox;
