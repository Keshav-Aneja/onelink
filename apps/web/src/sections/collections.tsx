import CollectionCard from "@components/cards/collection-card";
import { useCollections } from "@features/collections/get-collections";
import { useStoredCollections } from "@hooks/collections";
import { addMultipleCollections } from "@store/slices/collections-slice";
import { useAppDispatch } from "@store/store";
import { Fragment, useEffect, useState } from "react";
import CollectionCardSuspense from "@components/cards/collection-card-suspense";
interface CollectionsContent {
  pathId: string | null;
}
const CollectionsContent = ({ pathId }: CollectionsContent) => {
  const collections = useStoredCollections(pathId);

  const dispatch = useAppDispatch();

  const [shouldFetchCollections, setShouldFetchCollections] = useState<boolean>(
    !collections || collections.length === 0,
  );
  const collectionsQuery = useCollections(shouldFetchCollections, pathId);

  useEffect(() => {
    setShouldFetchCollections(!collections || collections.length === 0);
  }, [pathId]);

  useEffect(() => {
    if (collectionsQuery.isSuccess && collectionsQuery.data?.data) {
      setShouldFetchCollections(false);
      if (!collections || collections.length === 0) {
        dispatch(addMultipleCollections(collectionsQuery.data.data));
      }
    }
  }, [collectionsQuery.isSuccess, collectionsQuery.data, dispatch]);

  if (collectionsQuery.isLoading) {
    return (
      <div className="w-full grid grid-cols-6 xxl:grid-cols-7 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <CollectionCardSuspense key={i} />
        ))}
      </div>
    );
  }
  if (!collections) {
    return null;
  }

  return (
    <Fragment>
      {/* {collections.length === 0 && <Mascot />} */}
      <div className="w-full grid grid-cols-3 md:grid-cols-6 xxl:grid-cols-7 gap-1 md:gap-3">
        {collections.map((collection) => (
          <CollectionCard data={collection} key={collection.id} />
        ))}
      </div>
    </Fragment>
  );
};

export default CollectionsContent;
