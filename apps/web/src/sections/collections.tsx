import CollectionCard from "@components/cards/collection-card";
import { useCollections } from "@features/collections/get-collections";
import { useStoredCollections } from "@hooks/collections";
import { addMultipleCollections } from "@store/slices/collections-slice";
import { useAppDispatch } from "@store/store";
import { Fragment, useEffect, useState } from "react";
import Loader from "../app/loader";
interface CollectionsContent {
  pathId: string | null;
}
const CollectionsContent = ({ pathId }: CollectionsContent) => {
  const collections = useStoredCollections(pathId);
  const dispatch = useAppDispatch();

  const [shouldFetchCollections, setShouldFetchCollections] =
    useState<boolean>(!collections);
  const collectionsQuery = useCollections(shouldFetchCollections, pathId);

  useEffect(() => {
    setShouldFetchCollections(!collections);
  }, [pathId]);

  useEffect(() => {
    if (collectionsQuery.isSuccess && collectionsQuery.data?.data) {
      setShouldFetchCollections(false);
      if (!collections) {
        dispatch(addMultipleCollections(collectionsQuery.data.data));
      }
    }
  }, [collectionsQuery.isSuccess, collectionsQuery.data, dispatch]);

  if (collectionsQuery.isLoading) {
    return <Loader />;
  }
  if (!collections) {
    return <p>No stored collections found</p>;
  }
  return (
    <Fragment>
      {collections.length === 0 && (
        <p className="text-center">No Collections found</p>
      )}
      <div className="w-full grid grid-cols-6 xxl:grid-cols-7 gap-3">
        {collections.map((collection) => (
          <CollectionCard data={collection} key={collection.id} />
        ))}
      </div>
    </Fragment>
  );
};

export default CollectionsContent;
