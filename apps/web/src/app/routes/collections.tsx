import React, { Fragment } from "react";
import CollectionCard from "@components/cards/collection-card";
import LinkCard from "@components/cards/link-card";
import { useCollections } from "@features/collections/get-collections";
import { useAppDispatch } from "@store/store";
import { addMultipleCollections } from "@store/slices/collections-slice";
import { useStoredCollections } from "@hooks/collections";
const CollectionsPage = () => {
  const storedCollections = useStoredCollections();
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
  const collectionsQuery = useCollections();
  const dispatch = useAppDispatch();

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
  if (collectionsQuery.isSuccess) {
    dispatch(addMultipleCollections(collections));
  }
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
