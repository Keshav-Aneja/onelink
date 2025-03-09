import { cn } from "@lib/tailwind-utils";
import React from "react";
import { FieldError, Path, UseFormRegister } from "react-hook-form";
import FormError from "./form-error";

type TextareaProps<T extends Record<string, any>> = {
  label: Path<T>;
  register: UseFormRegister<T>;
  required?: boolean;
  error?: FieldError;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = <T extends Record<string, any>>({
  label,
  register,
  required = false,
  error,
  ...props
}: TextareaProps<T>) => {
  return (
    <div className="flex flex-col gap-1">
      <label className=" first-letter:uppercase text-theme_secondary_white font-medium text-base">
        {label}
        {required && <span className="text-primary text-lg">*</span>}
      </label>
      <textarea
        {...register(label, { required })}
        {...props}
        className={cn(
          "border-1 border-theme_secondary_white/60 px-3 py-2 rounded-md text-sm",
          error && "border-primary focus:outline-2 focus:outline-primary",
        )}
        aria-invalid={error ? "true" : "false"}
      />
      {error && <FormError error={error} />}
    </div>
  );
};

export default Textarea;
