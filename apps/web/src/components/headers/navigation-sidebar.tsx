import SidebarButton from "@components/buttons/sidebar-button";
import sidebarItems from "@config/navigation-sidebar-items";

const NavigationSidebar = () => {
  return (
    <aside className="w-full h-full flex flex-col items-center gap-4">
      <img
        src="/images/logo.webp"
        alt="OneLink"
        className="w-full h-auto hue-rotate-90"
      />
      {sidebarItems.map((item, _i) => (
        <SidebarButton key={item.label} item={item} />
      ))}
    </aside>
  );
};
export default NavigationSidebar;
