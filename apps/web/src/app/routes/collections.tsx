import { Fragment, useEffect, useState } from "react";
import { useParentIdFromPath } from "@lib/utils/get-paths";
import CollectionsContent from "@sections/collections";
import LinksContent from "@sections/links";
import SharedWithMe from "@sections/shared-with-me";
import CollectionsDetailCard from "@components/cards/collection-details-card";
import { useCollectionByPath } from "@hooks/collections";
import VerifyPassordCard from "@components/cards/verify-password-card";
import { useDataSync } from "@hooks/sync";

const CollectionsPage = () => {
  const pathId = useParentIdFromPath();
  const parentCollection = useCollectionByPath(pathId);
  const [verificationNeeded, setVerificationNeeded] = useState<boolean>(false);

  useDataSync(pathId);

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
      {pathId === null && <SharedWithMe />}
      <CollectionsDetailCard />
    </Fragment>
  );
};

export default CollectionsPage;
