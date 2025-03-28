import { Fragment } from "react";
import { getParentIdFromPath } from "@lib/utils/get-paths";
import CollectionsContent from "@sections/collections";
import LinksContent from "@sections/links";
import LinkDetailCard from "@components/cards/link-details-card";
import CollectionsDetailCard from "@components/cards/collection-details-card";

const CollectionsPage = () => {
  const pathId = getParentIdFromPath();
  if (pathId === undefined) {
    return (
      <p className="text-center" role="alert">
        This collection does not exist
      </p>
    );
  }

  return (
    <Fragment>
      <CollectionsContent pathId={pathId} />
      <LinksContent pathId={pathId} />
      <LinkDetailCard />
      <CollectionsDetailCard />
    </Fragment>
  );
};

export default CollectionsPage;
