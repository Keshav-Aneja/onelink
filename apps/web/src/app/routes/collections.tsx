import { Fragment, useEffect, useState } from "react";
import { getParentIdFromPath } from "@lib/utils/get-paths";
import CollectionsContent from "@sections/collections";
import LinksContent from "@sections/links";
import LinkDetailCard from "@components/cards/link-details-card";
import CollectionsDetailCard from "@components/cards/collection-details-card";
import { useCollectionByPath } from "@hooks/collections";
import VerifyPassordCard from "@components/cards/verify-password-card";

const CollectionsPage = () => {
  const pathId = getParentIdFromPath();
  const parentCollection = useCollectionByPath(pathId);
  //This is temporary will include the logic for password verification while fetching also
  const [verificationNeeded, setVerificationNeeded] = useState<boolean>(false);

  useEffect(() => {
    if (parentCollection?.is_protected) {
      setVerificationNeeded(true);
    }
  }, [pathId, parentCollection]);

  if (pathId === undefined) {
    return (
      <p className="text-center" role="alert">
        This collection does not exist
      </p>
    );
  }
  if (verificationNeeded && parentCollection && parentCollection.is_protected) {
    return <VerifyPassordCard setVerificationNeeded={setVerificationNeeded} />;
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
