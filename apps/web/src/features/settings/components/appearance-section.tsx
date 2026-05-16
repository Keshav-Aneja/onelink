import { useSettings } from "@features/settings/get-settings";
import { useUpdateSettings } from "@features/settings/update-settings";
import type { ViewMode } from "@hooks/view-preferences";
import AccentColorPicker from "./accent-color-picker";
import ViewModePicker from "./view-mode-picker";

const AppearanceSection = () => {
  const { data, isLoading } = useSettings();
  const currentAccent = data?.data?.accent_color ?? "#f63f94";
  const currentViewMode: ViewMode = (data?.data?.view_mode as ViewMode) ?? "grid";
  const currentDensity = data?.data?.grid_density ?? 6;
  const { mutate } = useUpdateSettings();

  return (
    <div className="flex flex-col gap-6">
      <AccentColorPicker
        currentAccent={currentAccent}
        isLoading={isLoading}
        onChange={(hex) => mutate({ accent_color: hex })}
      />

      <div className="h-px bg-white/5" />

      <ViewModePicker
        currentViewMode={currentViewMode}
        currentDensity={currentDensity}
        currentAccent={currentAccent}
        isLoading={isLoading}
        onViewModeChange={(mode) => mutate({ view_mode: mode })}
        onDensityChange={(density) => mutate({ grid_density: density })}
      />
    </div>
  );
};

export default AppearanceSection;
