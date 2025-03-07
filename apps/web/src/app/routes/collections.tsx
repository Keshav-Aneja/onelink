import React from "react";
import CollectionCard from "@components/cards/collection-card";
import LinkCard from "@components/cards/link-card";
const CollectionsPage = () => {
  return (
    <React.Fragment>
      <div className="w-full grid grid-cols-6 xxl:grid-cols-7 gap-3">
        <CollectionCard />
        <CollectionCard />
        <CollectionCard />
        <CollectionCard />
      </div>
      <div className="w-full grid grid-cols-6 xxl:grid-cols-7 gap-3">
        <LinkCard data={{ ogImage: "f" }} />
        <LinkCard data={{ ogImage: "" }} />
        <LinkCard data={{ ogImage: "" }} />
        <LinkCard data={{ ogImage: "" }} />
      </div>
    </React.Fragment>
  );
};

export default CollectionsPage;
