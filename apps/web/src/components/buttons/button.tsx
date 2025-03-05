import { cn } from "@lib/tailwind-utils";
import { ReactNode } from "react";
import { IconType } from "react-icons";
type ButtonProps = {
  children: ReactNode;
  Icon?: IconType;
  className?: string;
  onClick?: () => void;
};
const Button = ({ children, className, onClick, Icon }: ButtonProps) => {
  return (
    <button
      className={cn(
        "w-fit px-6 py-2 rounded-full border-2 border-white/20 bg-black hover:bg-theme_secondary_black/50 transition-all duration-200 ease-linear flex items-center gap-4 justify-center cursor-pointer text-lg font-medium text-nowrap",
        className,
      )}
      onClick={onClick}
    >
      {Icon ? <Icon className="text-2xl" /> : ""}
      {children}
    </button>
  );
};

export default Button;
