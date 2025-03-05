import NotificationBox from "@components/popover/notification-box";
import ProfileBox from "@components/popover/profile-box";
import Searchbar from "@components/search-bar";

const CollectionsHeader = () => {
  return (
    <header className="p-3 flex items-center gap-4">
      <img
        src="/images/logo.webp"
        alt="OneLink"
        className="w-12 h-12 hue-rotate-90"
      />
      <Searchbar />
      <NotificationBox />
      <ProfileBox />
    </header>
  );
};

export default CollectionsHeader;
