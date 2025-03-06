import NotificationBox from "@components/popover/notification-box";
import ProfileBox from "@components/popover/profile-box";
import Searchbar from "@components/search-bar";

const CollectionsHeader = () => {
  return (
    <header className="p-2 xxl:p-3 flex items-center gap-4">
      <Searchbar />
      <NotificationBox />
      <ProfileBox />
    </header>
  );
};

export default CollectionsHeader;
