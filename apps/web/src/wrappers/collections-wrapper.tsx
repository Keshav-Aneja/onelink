import { ReactNode, useEffect } from "react";
import SidebarWrapper from "./sidebar-wrapper";
import NavigationSidebar from "@components/headers/navigation-sidebar";
import CollectionContentWrapper from "./collections-content-wrapper";
import CollectionsHeader from "@components/headers/collection-header";
import Breadcrumbs from "@components/bread-crumbs";
import ActionHeader from "@components/headers/actions-header";
import action from "@config/action";

type CollectionWrapperProps = {
  children: ReactNode;
};
const CollectionWrapper = ({ children }: CollectionWrapperProps) => {
  useEffect(() => {
    (async () => {
      const feed = await action.post("/links/feed", { sinceDays: 100 });
      console.log(feed);
    })();
  }, []);
  return (
    <main className="w-full h-svh flex font-kustom overflow-hidden">
      <SidebarWrapper>
        <NavigationSidebar />
      </SidebarWrapper>
      <CollectionContentWrapper>
        <CollectionsHeader />
        <Breadcrumbs />
        <ActionHeader />
        <div className="px-3 pb-3 w-full h-full flex flex-col gap-3 overflow-y-auto">
          {children}
        </div>
      </CollectionContentWrapper>
    </main>
  );
};

export default CollectionWrapper;
