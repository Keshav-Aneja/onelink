import { IoFolderOpen } from "react-icons/io5";
import { paths } from "./paths";
import { RiNotification4Fill } from "react-icons/ri";
import { FaStar } from "react-icons/fa";

const sidebarItems = [
  {
    label: "Collections",
    Icon: IoFolderOpen,
    path: paths.collections.root.getHref(),
  },
  {
    label: "Notifications",
    Icon: RiNotification4Fill,
    path: paths.notifications.getHref(),
  },
  // {
  //   label: "Shared Collections",
  //   Icon: RiFolderSharedFill,
  //   path: "/shared",
  // },
  {
    label: "Favourites",
    Icon: FaStar,
    path: paths.favourite.getHref(),
  },
];

export default sidebarItems;
