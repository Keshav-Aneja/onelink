import { CreateCollection } from "@components/cards/create-collection-card";
import { cn } from "@lib/tailwind-utils";
import React, { useCallback, useEffect, useRef } from "react";
import {
  FieldError,
  FieldErrors,
  Path,
  UseFormRegister,
} from "react-hook-form";
import FormError from "./form-error";

type InputProps<T extends Record<string, any>> = {
  label: Path<T>;
  register: UseFormRegister<T>;
  required?: boolean;
  focus?: boolean;
  error?: FieldError;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = <T extends Record<string, any>>({
  label,
  register,
  required = false,
  focus = false,
  error,
  ...props
}: InputProps<T>) => {
  const { ref: registerRef, ...registerRest } = register(label, { required });
  const combinedRef = useCallback(
    (element: HTMLInputElement | null) => {
      registerRef(element);

      if (element && focus) {
        element.focus();
      }
    },
    [registerRef],
  );
  return (
    <div className="flex flex-col gap-1">
      <label className=" first-letter:uppercase text-theme_secondary_white font-medium text-base">
        {label}
        {required && <span className="text-primary text-lg">*</span>}
      </label>
      <input
        {...registerRest}
        ref={combinedRef}
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

export default Input;
