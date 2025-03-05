import { ReactNode } from "react";
type CircularButtonProps = {
  children: ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
  onClick?: () => void;
};
const CircularButton = ({ children, ref, onClick }: CircularButtonProps) => {
  return (
    <button
      className="w-12 h-12 rounded-full  bg-black flex items-center justify-center border-1 border-white/40 cursor-pointer relative"
      aria-description="profile_button"
      ref={ref}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default CircularButton;
