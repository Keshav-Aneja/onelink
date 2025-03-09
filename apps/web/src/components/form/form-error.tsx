import { Fragment } from "react";
import { FieldError } from "react-hook-form";

interface FormErrorProps {
  error: FieldError;
  label?: string;
}

const FromError = ({ error, label }: FormErrorProps) => {
  return (
    <Fragment>
      {error?.type === "required" && (
        <p role="alert" className="text-primary text-sm first-letter:uppercase">
          {label} cannot be empty
        </p>
      )}
      {(error?.type === "too_small" ||
        error?.type === "too_big" ||
        error?.type === "invalid_string") && (
        <p role="alert" className="text-primary text-sm first-letter:uppercase">
          {error.message}
        </p>
      )}
    </Fragment>
  );
};

export default FromError;
