import React, { Fragment, useEffect, useState } from "react";
import CollectionCard from "@components/cards/collection-card";
import LinkCard from "@components/cards/link-card";
import { useCollections } from "@features/collections/get-collections";
import { useAppDispatch } from "@store/store";
import { addMultipleCollections } from "@store/slices/collections-slice";
import { useStoredCollections } from "@hooks/collections";
import { getParentIdFromPath } from "@lib/utils/get-paths";

const CollectionsPage = () => {
  //TODO: handle the case for pathId undefined;
  const pathId = getParentIdFromPath();
  console.log("PATH ID", pathId);
  const storedCollections = useStoredCollections(pathId);
  console.log("STORED COLLECTIONS", storedCollections);
  const dispatch = useAppDispatch();

  const [shouldFetchCollections, setShouldFetchCollections] = useState<boolean>(
    !storedCollections || storedCollections.length === 0,
  );
  const collectionsQuery = useCollections(shouldFetchCollections, pathId);

  useEffect(() => {
    setShouldFetchCollections(
      !storedCollections || storedCollections.length === 0,
    );
  }, [pathId]);

  useEffect(() => {
    if (collectionsQuery.isSuccess && collectionsQuery.data?.data) {
      console.log("FETCH COMPLETE");
      setShouldFetchCollections(false);
      if (!storedCollections || storedCollections.length === 0) {
        dispatch(addMultipleCollections(collectionsQuery.data.data));
      }
    }
  }, [collectionsQuery.isSuccess, collectionsQuery.data, dispatch]);

  if (storedCollections) {
    return (
      <Fragment>
        <div className="w-full grid grid-cols-6 xxl:grid-cols-7 gap-3">
          {storedCollections.map((collection) => (
            <CollectionCard data={collection} key={collection.id} />
          ))}
        </div>
      </Fragment>
    );
  }

  if (collectionsQuery.isLoading) {
    return <div>Loading</div>;
  }
  if (!collectionsQuery.data || !collectionsQuery.data?.success) {
    return (
      <React.Fragment>
        <div className="w-full grid grid-cols-6 xxl:grid-cols-7 gap-3"></div>
        <div className="w-full grid grid-cols-6 xxl:grid-cols-7 gap-3">
          <LinkCard data={{ ogImage: "f" }} />
          <LinkCard data={{ ogImage: "" }} />
          <LinkCard data={{ ogImage: "" }} />
          <LinkCard data={{ ogImage: "" }} />
        </div>
      </React.Fragment>
    );
  }
  const collections = collectionsQuery.data.data;
  if (!collections || collections.length === 0) {
    return <p className="text-center">No Collections found</p>;
  }
  return (
    <Fragment>
      <div className="w-full grid grid-cols-6 xxl:grid-cols-7 gap-3">
        {collections.map((collection) => (
          <CollectionCard data={collection} key={collection.id} />
        ))}
      </div>
    </Fragment>
  );
};

export default CollectionsPage;
