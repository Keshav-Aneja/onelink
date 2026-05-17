import FavouriteLinksContent from "@sections/favourite-links";
import CollectionWrapper from "@wrappers/collections-wrapper";
import { FaStar } from "react-icons/fa";

const Favourite = () => {
  return (
    <CollectionWrapper>
      <section className="flex items-start justify-between gap-4 mb-4 flex-shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FaStar className="text-primary text-lg" />
            <h1 className="text-xl font-semibold tracking-tight">Favourites</h1>
          </div>
          <p className="text-xs text-secondary_text">
            Bookmark your essential links with a simple star. All your favourites, in one place.
          </p>
        </div>
      </section>
      <FavouriteLinksContent />
    </CollectionWrapper>
  );
};

export default Favourite;
