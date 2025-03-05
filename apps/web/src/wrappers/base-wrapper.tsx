import { cn } from "@lib/tailwind-utils";
import { ReactNode } from "react";
type WrapperProps = {
  children: ReactNode;
  className?: string;
};
const BaseWrapper = ({ children, className }: WrapperProps) => {
  return (
    <main className={cn("w-full h-svh min-h-fit", className)}>
      <div className="w-wrapper h-full mx-auto flex flex-col items-center justify-center gap-4 font-kustom">
        {children}
      </div>
    </main>
  );
};

export default BaseWrapper;
