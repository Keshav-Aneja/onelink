import { cn } from "@lib/tailwind-utils";
import { SidebarItem } from "@onelink/entities/types";
import { getActiveTab, setActiveTab } from "@store/slices/application-slice";
import { useAppDispatch, useAppSelector } from "@store/store";
import { useNavigate } from "react-router";
interface SidebarButtonProps {
  item: SidebarItem;
}
const SidebarButton = ({ item }: SidebarButtonProps) => {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector(getActiveTab);
  const { Icon, label } = item;
  const active = activeTab === label;
  const navigator = useNavigate();
  return (
    <button
      className={cn(
        "w-full aspect-square flex items-center justify-center cursor-pointer text-xl text-theme_secondary_white group border-1 border-transparent rounded-md relative hover:text-primary transition-all duration-200 ease-linear",
        active && "border-primary text-primary shadow-lg shadow-primary/20",
      )}
      onClick={() => {
        dispatch(setActiveTab(label));
        navigator(item.path);
      }}
    >
      {active && (
        <div className="w-full h-full absolute top-0 left-0 border-3 blur-md border-primary"></div>
      )}
      <Icon />
      <div className="group-hover:opacity-100 opacity-0 pointer-events-none absolute top-1/2 -translate-y-1/2 left-14 text-nowrap text-sm bg-primary text-black border-1 border-black font-medium px-3 py-1 rounded-md transition-all duration-200 ease-linear z-[100]">
        {label}
      </div>
    </button>
  );
};

export default SidebarButton;
