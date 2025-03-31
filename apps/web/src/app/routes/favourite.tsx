import FavouriteLinksContent from "@sections/favourite-links";
import CollectionWrapper from "@wrappers/collections-wrapper";

const Favourite = () => {
  return (
    <CollectionWrapper>
      <section className="flex flex-col gap-1">
        <h1 className="text-3xl font-medium">Favourite Links</h1>
        <p className="text-sm text-theme_secondary_white w-1/2">
          Bookmark your essential links with a simple star. Access your curated
          collection anytime—all your favorites, organized in one convenient
          place.
        </p>
      </section>
      <FavouriteLinksContent />
    </CollectionWrapper>
  );
};

export default Favourite;
