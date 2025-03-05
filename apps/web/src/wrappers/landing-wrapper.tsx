import { ReactNode } from "react";

const LandingWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <main className="w-full h-svh min-h-fit">
      <div className="w-wrapper h-full mx-auto flex flex-col items-center justify-center gap-4 font-kustom">
        {children}
      </div>
    </main>
  );
};

export default LandingWrapper;
