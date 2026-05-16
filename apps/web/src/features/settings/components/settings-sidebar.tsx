import { SETTINGS_NAV, type SettingsSectionId } from "@config/constants";
import { cn } from "@lib/tailwind-utils";

type Props = {
  activeSection: SettingsSectionId;
  onSelect: (id: SettingsSectionId) => void;
};

const SettingsSidebar = ({ activeSection, onSelect }: Props) => {
  return (
    <nav className="w-44 shrink-0 flex flex-col gap-1">
      {SETTINGS_NAV.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onSelect(id)}
          className={cn(
            "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150 text-left focus:outline-none",
            activeSection === id
              ? "bg-primary/10 text-primary font-medium"
              : "text-secondary_text hover:bg-white/5 hover:text-white",
          )}
        >
          <Icon className="text-base shrink-0" />
          {label}
        </button>
      ))}
    </nav>
  );
};

export default SettingsSidebar;
