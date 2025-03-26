import { cn } from "@lib/tailwind-utils";
import { SidebarItem } from "@onelink/entities/types";
interface SidebarButtonProps {
  item: SidebarItem;
  //TODO: remove these and move them to redux store
  active: boolean;
  setActive: React.Dispatch<React.SetStateAction<string>>;
}
const SidebarButton = ({ item, active, setActive }: SidebarButtonProps) => {
  const { Icon, label } = item;
  return (
    <button
      className={cn(
        "w-full aspect-square flex items-center justify-center cursor-pointer text-xl text-theme_secondary_white group border-1 border-transparent rounded-md relative hover:text-primary transition-all duration-200 ease-linear",
        active && "border-primary text-primary shadow-lg shadow-primary/20",
      )}
      onClick={() => {
        setActive(label);
      }}
    >
      {active && (
        <div className="w-full h-full absolute top-0 left-0 border-3 blur-md border-primary"></div>
      )}
      <Icon />
      <div className="group-hover:opacity-100 opacity-0 pointer-events-none absolute top-1/2 -translate-y-1/2 left-18 text-nowrap text-sm bg-primary text-black border-1 border-black font-medium px-3 py-1 rounded-md transition-all duration-200 ease-linear z-[100]">
        {label}
      </div>
    </button>
  );
};

export default SidebarButton;
