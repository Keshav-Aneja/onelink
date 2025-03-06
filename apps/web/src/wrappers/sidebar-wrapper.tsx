import { ReactNode } from "react";

type SidebarWrapperProps = {
  children: ReactNode;
};
const SidebarWrapper = ({ children }: SidebarWrapperProps) => {
  return (
    <aside className="--sidebar-wrapper h-full w-20 p-3">{children}</aside>
  );
};

export default SidebarWrapper;
