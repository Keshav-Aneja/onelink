import { ReactNode } from "react";
import SidebarWrapper from "./sidebar-wrapper";
import NavigationSidebar from "@components/headers/navigation-sidebar";
import CollectionContentWrapper from "./collections-content-wrapper";
import CollectionsHeader from "@components/headers/collection-header";
import Breadcrumbs from "@components/bread-crumbs";
import CollectionTreeSidebar from "@components/sidebars/collection-tree-sidebar";
import { useSettings } from "@features/settings/get-settings";
import { useMatch } from "react-router-dom";
import { useParentIdFromPath } from "@lib/utils/get-paths";
import { useClipboardLinkHandler } from "@hooks/useClipboardLinkHandler";
import { useCollectionByPath } from "@hooks/collections";

type CollectionWrapperProps = {
  children: ReactNode;
  hideBreadcrumbs?: boolean;
  selfScroll?: boolean;
};
function useGlobalClipboardHandler() {
  const onCollectionRoute = useMatch("/collections/*");
  const pathId = useParentIdFromPath();
  const currentCollection = useCollectionByPath(pathId);
  // On collection routes use the path-resolved ID; on all other pages default to null (root/home).
  const parentId = onCollectionRoute ? pathId : null;
  // Disable when collection is unknown or password-protected (not yet verified).
  const enabled = parentId !== undefined && !currentCollection?.is_protected;
  useClipboardLinkHandler({ parentId, enabled });
}

const CollectionWrapper = ({ children, hideBreadcrumbs = false, selfScroll = false }: CollectionWrapperProps) => {
  const { data } = useSettings();
  const showTree = data?.data?.show_collection_tree ?? false;

  useGlobalClipboardHandler();

  return (
    <main className="w-full h-svh flex font-kustom overflow-hidden">
      <SidebarWrapper>
        <NavigationSidebar />
      </SidebarWrapper>
      <CollectionContentWrapper>
        <CollectionsHeader />
        {!hideBreadcrumbs && <Breadcrumbs />}
        <div className={`px-3 pb-3 w-full flex-1 min-h-0 space-y-3 ${selfScroll ? "overflow-hidden flex flex-col" : "overflow-y-auto"}`}>
          {children}
        </div>
      </CollectionContentWrapper>
      {showTree && <CollectionTreeSidebar />}
    </main>
  );
};

export default CollectionWrapper;
