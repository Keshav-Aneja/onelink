import { IoFolderOpen } from "react-icons/io5";
import { paths } from "./paths";
import { FaStar } from "react-icons/fa";
import { MdOutlineRssFeed } from "react-icons/md";
import { HiOutlineTag } from "react-icons/hi";
import { HiOutlineCog6Tooth } from "react-icons/hi2";

const sidebarItems = [
  {
    label: "Collections",
    Icon: IoFolderOpen,
    path: paths.collections.root.getHref(),
  },
  {
    label: "Feeds",
    Icon: MdOutlineRssFeed,
    path: paths.feeds.getHref(),
  },
  {
    label: "Favourites",
    Icon: FaStar,
    path: paths.favourite.getHref(),
  },
  {
    label: "Tags",
    Icon: HiOutlineTag,
    path: paths.tags.getHref(),
  },
  {
    label: "Settings",
    Icon: HiOutlineCog6Tooth,
    path: paths.settings.getHref(),
  },
];

export default sidebarItems;
