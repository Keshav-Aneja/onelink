import { useState } from "react";
import { HiOutlineCog6Tooth } from "react-icons/hi2";
import CollectionWrapper from "@wrappers/collections-wrapper";
import { SETTINGS_NAV, type SettingsSectionId } from "@config/constants";
import SettingsSidebar from "@features/settings/components/settings-sidebar";
import AppearanceSection from "@features/settings/components/appearance-section";

const SECTION_COMPONENTS: Record<SettingsSectionId, React.ReactNode> = {
  appearance: <AppearanceSection />,
};

const Settings = () => {
  const [activeSection, setActiveSection] =
    useState<SettingsSectionId>("appearance");
  const activeMeta = SETTINGS_NAV.find((s) => s.id === activeSection)!;

  return (
    <CollectionWrapper hideBreadcrumbs>
      <section className="flex items-center gap-2 mb-6">
        <HiOutlineCog6Tooth className="text-primary text-lg" />
        <h1 className="text-xl font-semibold tracking-tight">Settings</h1>
      </section>

      <div className="flex gap-6 h-[calc(100%-4rem)]">
        <SettingsSidebar
          activeSection={activeSection}
          onSelect={setActiveSection}
        />

        <div className="w-px bg-white/5 shrink-0" />

        <div className="flex-1 overflow-y-auto pb-6 pl-2">
          <div className="mb-5">
            <h2 className="text-sm font-semibold mb-0.5">{activeMeta.label}</h2>
            <p className="text-xs text-secondary_text">
              {activeMeta.description}
            </p>
          </div>
          <div className="max-w-xl">{SECTION_COMPONENTS[activeSection]}</div>
        </div>
      </div>
    </CollectionWrapper>
  );
};

export default Settings;
