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
  onClick?: () => void;
  Loader?: ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;
const Button = ({
  children,
  className,
  onClick,
  Loader,
  Icon,
  loading = false,
  iconSize = "xl",
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(
        "w-fit px-6 py-2 rounded-full border-2 border-white/20 bg-black hover:bg-theme_secondary_black/50 transition-all duration-200 ease-linear flex items-center gap-2 md:gap-4 justify-center cursor-pointer text-sm md:text-base xxl:text-lg font-medium text-nowrap disabled:opacity-50",
        className,
      )}
      onClick={onClick}
      {...props}
    >
      {Icon && !loading ? (
        <Icon
          className={cn(
            iconSize === "sm" && "text-sm xxl:text-lg",
            iconSize === "lg" && "text-lg xxl:text-xl",
            iconSize === "xl" && "text-xl xxl:text-2xl",
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
