import CollectionCard from "@components/cards/collection-card";
import LinkCard from "@components/cards/link-card";
import CollectionWrapper from "@wrappers/collections-wrapper";

const CollectionsRoot = () => {
  return (
    <CollectionWrapper>
      <div className="w-full grid grid-cols-7 gap-3">
        <CollectionCard />
        <CollectionCard />
        <CollectionCard />
        <CollectionCard />
      </div>
      <div className="w-full grid grid-cols-7 gap-3">
        <LinkCard data={{ ogImage: "f" }} />
        <LinkCard data={{ ogImage: "" }} />
        <LinkCard data={{ ogImage: "" }} />
        <LinkCard data={{ ogImage: "" }} />
      </div>
    </CollectionWrapper>
  );
};

export default CollectionsRoot;
