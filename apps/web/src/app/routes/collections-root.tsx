import CollectionWrapper from "@wrappers/collections-wrapper";
import { Outlet } from "react-router";

const CollectionsRoot = () => {
  return (
    <CollectionWrapper>
      <Outlet />
    </CollectionWrapper>
  );
};

export default CollectionsRoot;
