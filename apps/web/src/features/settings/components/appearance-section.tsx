import { useSettings } from "@features/settings/get-settings";
import { useUpdateSettings } from "@features/settings/update-settings";
import type { ViewMode } from "@hooks/view-preferences";
import { cn } from "@lib/tailwind-utils";
import AccentColorPicker from "./accent-color-picker";
import ViewModePicker from "./view-mode-picker";
import { RiImageLine, RiFolderOpenLine } from "react-icons/ri";

const AppearanceSection = () => {
  const { data, isLoading } = useSettings();
  const currentAccent = data?.data?.accent_color ?? "#f63f94";
  const currentViewMode: ViewMode = (data?.data?.view_mode as ViewMode) ?? "grid";
  const currentDensity = data?.data?.grid_density ?? 6;
  const showOgImage = data?.data?.show_og_image ?? true;
  const showCollectionTree = data?.data?.show_collection_tree ?? false;
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

      <div className="h-px bg-white/5" />

      <div className="flex flex-col gap-3">
        <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">
          Link Cards
        </span>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RiImageLine className="text-lg text-white/70" />
            <span className="text-sm text-white/80">Show open graph image</span>
          </div>
          <button
            disabled={isLoading}
            onClick={() => mutate({ show_og_image: !showOgImage })}
            className={cn(
              "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
              showOgImage ? "bg-primary" : "bg-white/20",
            )}
          >
            <span
              className={cn(
                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
                showOgImage ? "translate-x-5" : "translate-x-0",
              )}
            />
          </button>
        </div>
      </div>

      <div className="h-px bg-white/5" />

      <div className="flex flex-col gap-3">
        <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">
          Layout
        </span>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RiFolderOpenLine className="text-lg text-white/70" />
            <div className="flex flex-col">
              <span className="text-sm text-white/80">Collection hierarchy tree</span>
              <span className="text-xs text-white/40">Show a collapsible folder tree on the right side</span>
            </div>
          </div>
          <button
            disabled={isLoading}
            onClick={() => mutate({ show_collection_tree: !showCollectionTree })}
            className={cn(
              "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
              showCollectionTree ? "bg-primary" : "bg-white/20",
            )}
          >
            <span
              className={cn(
                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
                showCollectionTree ? "translate-x-5" : "translate-x-0",
              )}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppearanceSection;
