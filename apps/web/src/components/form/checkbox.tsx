import { CreateCollection } from "@components/cards/create-collection-card";
import React from "react";
import { FieldError, Path, UseFormRegister } from "react-hook-form";
import FormError from "./form-error";

type CheckboxProps = {
  label: Path<CreateCollection>;
  register: UseFormRegister<CreateCollection>;
  required?: boolean;
  falseLabel?: string;
  error?: FieldError;
} & React.InputHTMLAttributes<HTMLInputElement>;
const Checkbox = ({
  register,
  required,
  error,
  falseLabel,
  label,
  ...props
}: CheckboxProps) => {
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
