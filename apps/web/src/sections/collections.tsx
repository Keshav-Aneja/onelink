import CollectionCard from "@components/cards/collection-card";
import CollectionListItem from "@components/cards/collection-list-item";
import { useCollections } from "@features/collections/get-collections";
import { useStoredCollections } from "@hooks/collections";
import { useViewPreferences } from "@hooks/view-preferences";
import { addMultipleCollections } from "@store/slices/collections-slice";
import { useAppDispatch } from "@store/store";
import { Fragment, useEffect, useState } from "react";
import CollectionCardSuspense from "@components/cards/collection-card-suspense";

interface CollectionsContent {
  pathId: string | null;
}

const DENSITY_GRID_CLASSES: Record<number, string> = {
  3: "grid-cols-1 md:grid-cols-2",
  4: "grid-cols-1 md:grid-cols-3",
  5: "grid-cols-1 md:grid-cols-4",
  6: "grid-cols-1 md:grid-cols-6",
};

const CollectionsContent = ({ pathId }: CollectionsContent) => {
  const collections = useStoredCollections(pathId);
  const dispatch = useAppDispatch();
  const { prefs } = useViewPreferences(pathId);

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
  }, [collectionsQuery.isSuccess, collectionsQuery.data]);

  if (collectionsQuery.isLoading) {
    const gridClass =
      DENSITY_GRID_CLASSES[prefs.gridDensity] ?? DENSITY_GRID_CLASSES[6];
    return (
      <div className={`w-full grid ${gridClass} gap-3`}>
        {Array.from({ length: 4 }).map((_, i) => (
          <CollectionCardSuspense key={i} />
        ))}
      </div>
    );
  }

  if (!collections || collections.length === 0) {
    return null;
  }

  // List / Compact view — both render as a flat list row
  if (prefs.viewMode === "list" || prefs.viewMode === "compact") {
    return (
      <Fragment>
        <div className="w-full flex flex-col border border-white/8 rounded-md overflow-hidden mb-1">
          {collections.map((collection) => (
            <CollectionListItem data={collection} key={collection.id} />
          ))}
        </div>
      </Fragment>
    );
  }

  // Grid view (default)
  const gridClass =
    DENSITY_GRID_CLASSES[prefs.gridDensity] ?? DENSITY_GRID_CLASSES[6];

  return (
    <Fragment>
      <div className={`w-full grid ${gridClass} gap-1 md:gap-3`}>
        {collections.map((collection) => (
          <CollectionCard data={collection} key={collection.id} />
        ))}
      </div>
    </Fragment>
  );
};

export default CollectionsContent;
