import { VIEW_MODES } from "@config/constants";
import type { ViewMode } from "@hooks/view-preferences";
import { cn } from "@lib/tailwind-utils";

type Props = {
  currentViewMode: ViewMode;
  currentDensity: number;
  currentAccent: string;
  isLoading: boolean;
  onViewModeChange: (mode: ViewMode) => void;
  onDensityChange: (density: number) => void;
};

const ViewModePicker = ({
  currentViewMode,
  currentDensity,
  currentAccent,
  isLoading,
  onViewModeChange,
  onDensityChange,
}: Props) => {
  return (
    <div className="flex flex-col gap-5">
      {/* Default view */}
      <div className="flex flex-col gap-3">
        <div>
          <h3 className="text-sm font-semibold mb-0.5">Default view</h3>
          <p className="text-xs text-secondary_text">
            Default view for your link collections.
          </p>
        </div>
        {isLoading ? (
          <div className="flex gap-2.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 flex-1 rounded-lg bg-theme_secondary_black animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="flex gap-2.5">
            {VIEW_MODES.map(({ mode, icon: Icon, label, description }) => {
              const isActive = currentViewMode === mode;
              return (
                <button
                  key={mode}
                  onClick={() => { if (!isActive) onViewModeChange(mode); }}
                  className={cn(
                    "flex-1 flex flex-col items-center gap-1.5 py-3 px-2 rounded-lg border text-center transition-all duration-150 focus:outline-none",
                    isActive
                      ? "border-primary/60 bg-primary/10 text-white"
                      : "border-white/8 bg-white/3 text-secondary_text hover:border-white/20 hover:text-white",
                  )}
                >
                  <span className={cn("text-xl", isActive && "text-primary")}>
                    <Icon />
                  </span>
                  <span className="text-xs font-medium">{label}</span>
                  <span className="text-[0.6rem] text-secondary_text/60 leading-tight hidden sm:block">
                    {description}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {currentViewMode === "grid" && (
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-secondary_text font-medium uppercase tracking-wider">
              Grid columns
            </span>
            <span className="text-xs font-medium tabular-nums" style={{ color: currentAccent }}>
              {currentDensity}
            </span>
          </div>
          {isLoading ? (
            <div className="h-4 w-full rounded bg-theme_secondary_black animate-pulse" />
          ) : (
            <>
              <input
                type="range"
                min={3}
                max={6}
                step={1}
                value={currentDensity}
                onChange={(e) => onDensityChange(Number(e.target.value))}
                className="w-full h-1 accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-[0.6rem] text-secondary_text/50 px-0.5">
                {[3, 4, 5, 6].map((n) => <span key={n}>{n}</span>)}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewModePicker;
