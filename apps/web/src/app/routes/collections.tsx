import React, { Fragment, useEffect, useState } from "react";
import CollectionCard from "@components/cards/collection-card";
import LinkCard from "@components/cards/link-card";
import { useCollections } from "@features/collections/get-collections";
import { useAppDispatch } from "@store/store";
import { addMultipleCollections } from "@store/slices/collections-slice";
import { useStoredCollections } from "@hooks/collections";
import { getParentIdFromPath } from "@lib/utils/get-paths";
import CollectionsContent from "@sections/collections";

const CollectionsPage = () => {
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
      if (!storedCollections) {
        dispatch(addMultipleCollections(collectionsQuery.data.data));
      }
    }
  }, [collectionsQuery.isSuccess, collectionsQuery.data, dispatch]);

  if (pathId === undefined) {
    console.log("RENDER 1");
    return (
      <p className="text-center" role="alert">
        This collection does not exist
      </p>
    );
  }

  if (storedCollections) {
    console.log("RENDER 2");
    return (
      <Fragment>
        <CollectionsContent collections={storedCollections} />
      </Fragment>
    );
  }

  if (collectionsQuery.isLoading) {
    console.log("RENDER 3");

    return <div>Loading</div>;
  }
  if (!collectionsQuery.data || !collectionsQuery.data?.success) {
    console.log("RENDER 4");
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
  console.log("FETCHED COLLECTIONS", collections);
  if (!collections || collections.length === 0) {
    console.log("RENDER 5");

    return <p className="text-center">No Collections found</p>;
  }
  console.log("RENDER 6");

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
