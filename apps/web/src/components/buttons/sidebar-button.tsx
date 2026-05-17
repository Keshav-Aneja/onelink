import { cn } from "@lib/tailwind-utils";
import { SidebarItem } from "@onelink/entities/types";
import { getActiveTab, setActiveTab } from "@store/slices/application-slice";
import { useAppDispatch, useAppSelector } from "@store/store";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
interface SidebarButtonProps {
  item: SidebarItem;
  badge?: number;
}
const SidebarButton = ({ item, badge }: SidebarButtonProps) => {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector(getActiveTab);
  const { Icon, label, path: itemPath } = item;
  const active = activeTab === itemPath.split("/")[1];
  const navigator = useNavigate();
  const path = useLocation();
  useEffect(() => {
    const activePath = path.pathname.split("/")[1];
    if (activePath) {
      dispatch(setActiveTab(activePath));
    }
  }, [path.pathname]);
  return (
    <button
      className={cn(
        "w-full aspect-square flex items-center justify-center cursor-pointer text-xl text-theme_secondary_white group border-1 border-transparent rounded-md relative hover:text-primary transition-all duration-200 ease-linear",
        active && "border-primary text-primary shadow-lg shadow-primary/20",
      )}
      onClick={() => {
        dispatch(setActiveTab(itemPath.split("/")[1]));
        navigator(item.path);
      }}
    >
      {active && (
        <div className="w-full h-full absolute top-0 left-0 border-3 blur-md border-primary"></div>
      )}
      <Icon />
      {badge != null && badge > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[1rem] h-4 px-0.5 rounded-full bg-primary text-black text-[9px] font-bold flex items-center justify-center">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
      <div className="group-hover:opacity-100 opacity-0 pointer-events-none absolute top-1/2 -translate-y-1/2 left-14 text-nowrap text-sm bg-primary text-black border-1 border-black font-medium px-3 py-1 rounded-md transition-all duration-200 ease-linear z-[100]">
        {label}
      </div>
    </button>
  );
};

export default SidebarButton;
