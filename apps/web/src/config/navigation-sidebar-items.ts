import { IoFolderOpen } from "react-icons/io5";
import { paths } from "./paths";
import { RiFolderSharedFill, RiNotification4Fill } from "react-icons/ri";
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
    path: "",
  },
  {
    label: "Shared Collections",
    Icon: RiFolderSharedFill,
    path: "",
  },
  {
    label: "Favourite",
    Icon: FaStar,
    path: "",
  },
];

export default sidebarItems;
