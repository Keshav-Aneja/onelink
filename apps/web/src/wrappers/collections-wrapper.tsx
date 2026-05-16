import { ReactNode } from "react";
import SidebarWrapper from "./sidebar-wrapper";
import NavigationSidebar from "@components/headers/navigation-sidebar";
import CollectionContentWrapper from "./collections-content-wrapper";
import CollectionsHeader from "@components/headers/collection-header";
import Breadcrumbs from "@components/bread-crumbs";
import ActionHeader from "@components/headers/actions-header";

type CollectionWrapperProps = {
  children: ReactNode;
  hideActionHeader?: boolean;
  hideBreadcrumbs?: boolean;
};
const CollectionWrapper = ({ children, hideActionHeader = false, hideBreadcrumbs = false }: CollectionWrapperProps) => {
  return (
    <main className="w-full h-svh flex font-kustom overflow-hidden">
      <SidebarWrapper>
        <NavigationSidebar />
      </SidebarWrapper>
      <CollectionContentWrapper>
        <CollectionsHeader />
        {!hideBreadcrumbs && <Breadcrumbs />}
        {!hideActionHeader && <ActionHeader />}
        <div className="px-3 pb-3 w-full h-full overflow-y-auto space-y-3">
          {children}
        </div>
      </CollectionContentWrapper>
    </main>
  );
};

export default CollectionWrapper;
