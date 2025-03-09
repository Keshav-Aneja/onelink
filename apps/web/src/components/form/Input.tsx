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

type InputProps = {
  label: Path<CreateCollection>;
  register: UseFormRegister<CreateCollection>;
  required?: boolean;
  focus?: boolean;
  error?: FieldError;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = ({
  label,
  register,
  required = false,
  focus = false,
  error,
  ...props
}: InputProps) => {
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
