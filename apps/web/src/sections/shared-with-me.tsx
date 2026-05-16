import { useSharedWithMe, type SharedCollectionItem } from "@features/shares/users/shared-with-me";
import { paths } from "@config/paths";
import { BiSolidFolder } from "react-icons/bi";
import { useNavigate } from "react-router";

const SharedWithMe = () => {
  const { data: res } = useSharedWithMe();
  const sharedCollections = res?.data ?? [];

  if (sharedCollections.length === 0) return null;

  return (
    <section className="w-full">
      <div className="flex items-center gap-2 mb-2 px-1">
        <span className="text-xs text-theme_secondary_white/50 uppercase tracking-wide font-medium">
          Shared with me
        </span>
      </div>
      <div className="w-full grid grid-cols-2 md:grid-cols-4 xxl:grid-cols-5 gap-1 md:gap-3">
        {sharedCollections.map((item) => (
          <SharedCollectionCard key={item.share_id} item={item} />
        ))}
      </div>
    </section>
  );
};

function SharedCollectionCard({ item }: { item: SharedCollectionItem }) {
  const navigate = useNavigate();

  return (
    <button
      onDoubleClick={() => navigate(paths.sharedCollection.getHref(item.collection.id))}
      title={`Shared by ${item.shared_by_email}`}
      className="w-full min-h-10 md:min-h-12 md:h-32 xxl:h-40 rounded-none md:rounded-md border-b border-x-0 md:border-2 border-white/20 text-white cursor-pointer group relative flex flex-col items-center justify-center gap-2 hover:border-white/40 transition-colors bg-transparent overflow-hidden"
    >
      <div
        className="absolute inset-0 rounded-md opacity-[0.07]"
        style={{ backgroundColor: item.collection.color ?? "#7c6cfc" }}
      />
      <BiSolidFolder
        className="text-xl md:text-6xl xxl:text-7xl"
        style={{ color: item.collection.color ?? "#7c6cfc" }}
      />
      <p className="text-xs md:text-sm xxl:text-base select-none truncate w-fit md:w-[90%] text-center font-medium">
        {item.collection.name}
      </p>
      <span className="text-[10px] md:text-xs text-theme_secondary_white/40 truncate max-w-[90%]">
        from {item.shared_by_email}
      </span>
    </button>
  );
}

export default SharedWithMe;
