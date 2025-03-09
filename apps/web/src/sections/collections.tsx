import CollectionCard from "@components/cards/collection-card";
import { Collection } from "@onelink/entities/models";
import { Fragment } from "react";

interface CollectionsContent {
  collections: Collection[];
}
const CollectionsContent = ({ collections }: CollectionsContent) => {
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
