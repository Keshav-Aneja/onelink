import TagsContent from "@sections/tags";
import CollectionWrapper from "@wrappers/collections-wrapper";
import { HiOutlineTag } from "react-icons/hi";

const Tags = () => {
  return (
    <CollectionWrapper hideBreadcrumbs>
      {/* Page header */}
      <section className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <HiOutlineTag className="text-primary text-lg" />
            <h1 className="text-xl font-semibold tracking-tight">Tags</h1>
          </div>
          <p className="text-xs text-secondary_text">
            Browse all your links by tag — across every collection in one place.
          </p>
        </div>
      </section>
      <TagsContent />
    </CollectionWrapper>
  );
};

export default Tags;
