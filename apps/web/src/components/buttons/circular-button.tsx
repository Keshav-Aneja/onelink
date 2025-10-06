import { ReactNode } from "react";
type CircularButtonProps = {
  children: ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
  onClick?: () => void;
  name?: string;
};
const CircularButton = ({
  children,
  ref,
  onClick,
  name,
}: CircularButtonProps) => {
  return (
    <button
      className="w-10 h-10 md:w-12 md:h-12 rounded-full  bg-black flex items-center justify-center border-1 border-white/40 cursor-pointer relative"
      aria-description="profile_button"
      ref={ref}
      onClick={onClick}
      name={name ?? ""}
    >
      {children}
    </button>
  );
};

export default CircularButton;
