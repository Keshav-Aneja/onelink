import { CreateCollection } from "@components/cards/create-collection-card";
import { cn } from "@lib/tailwind-utils";
import React from "react";
import { FieldError, Path, UseFormRegister } from "react-hook-form";
import FormError from "./form-error";

type TextareaProps = {
  label: Path<CreateCollection>;
  register: UseFormRegister<CreateCollection>;
  required?: boolean;
  error?: FieldError;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = ({
  label,
  register,
  required = false,
  error,
  ...props
}: TextareaProps) => {
  return (
    <div className="flex flex-col gap-1">
      <label className=" first-letter:uppercase text-theme_secondary_white font-medium text-base">
        {label}
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
