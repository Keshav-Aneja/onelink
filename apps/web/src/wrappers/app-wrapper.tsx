import { ReactNode } from "react";

const AppWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full min-h-screen h-fit flex flex-col">
      <div className="w-wrapper">{children}</div>
    </div>
  );
};

export default AppWrapper;
