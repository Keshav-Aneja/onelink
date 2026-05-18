import { cn } from "@lib/tailwind-utils";
import React, { ReactNode } from "react";
import { IconType } from "react-icons";
import { ImSpinner2 } from "react-icons/im";
type ButtonProps = {
  children: ReactNode;
  Icon?: IconType;
  iconSize?: "sm" | "lg" | "xl";
  className?: string;
  loading?: boolean;
  Loader?: ReactNode;
  variant?: "default" | "primary";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;
const Button = ({
  children,
  className,
  onClick,
  Loader,
  Icon,
  loading = false,
  iconSize = "xl",
  variant = "default",
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(
        "w-fit flex items-center justify-center gap-1.5 font-medium text-nowrap transition-colors disabled:opacity-50 cursor-pointer",
        variant === "default" &&
          "px-6 py-2 rounded-full border-2 border-white/20 bg-black hover:bg-theme_secondary_black/50 gap-2 md:gap-4 text-sm md:text-base xxl:text-lg",
        variant === "primary" &&
          "px-3 py-1.5 bg-primary hover:bg-primary/90 text-white text-xs",
        className,
      )}
      onClick={onClick}
      {...props}
    >
      {Icon && !loading ? (
        <Icon
          className={cn(
            variant === "primary"
              ? "text-sm"
              : cn(
                  iconSize === "sm" && "text-sm xxl:text-lg",
                  iconSize === "lg" && "text-lg xxl:text-xl",
                  iconSize === "xl" && "text-xl xxl:text-2xl",
                ),
          )}
        />
      ) : (
        ""
      )}
      {loading ? (
        Loader ? (
          Loader
        ) : (
          <ImSpinner2 className="animate-spin" />
        )
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
