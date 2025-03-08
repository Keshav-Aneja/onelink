import { cn } from "@lib/tailwind-utils";
import React, { ReactNode } from "react";
import { IconType } from "react-icons";
type ButtonProps = {
  children: ReactNode;
  Icon?: IconType;
  className?: string;
  onClick?: () => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;
const Button = ({
  children,
  className,
  onClick,
  Icon,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(
        "w-fit px-6 py-2 rounded-full border-2 border-white/20 bg-black hover:bg-theme_secondary_black/50 transition-all duration-200 ease-linear flex items-center gap-4 justify-center cursor-pointer text-base xxl:text-lg font-medium text-nowrap",
        className,
      )}
      onClick={onClick}
      {...props}
    >
      {Icon ? <Icon className="text-xl xxl:text-2xl" /> : ""}
      {children}
    </button>
  );
};

export default Button;
