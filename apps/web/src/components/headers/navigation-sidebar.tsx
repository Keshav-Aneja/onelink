import SidebarButton from "@components/buttons/sidebar-button";
import sidebarItems from "@config/navigation-sidebar-items";
import { useState } from "react";

const NavigationSidebar = () => {
  //TODO: move this state to the redux store later.
  const [active, setActive] = useState(sidebarItems[0].label);
  return (
    <aside className="w-full h-full flex flex-col items-center gap-4">
      <img
        src="/images/logo.webp"
        alt="OneLink"
        className="w-full h-auto hue-rotate-90"
      />
      {sidebarItems.map((item, _i) => (
        <SidebarButton
          key={item.label}
          item={item}
          active={item.label === active}
          setActive={setActive}
        />
      ))}
    </aside>
  );
};
export default NavigationSidebar;
