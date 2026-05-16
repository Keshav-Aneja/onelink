import { HiCheck } from "react-icons/hi2";
import { ACCENT_PALETTE } from "@config/constants";
import { cn } from "@lib/tailwind-utils";

type Props = {
  currentAccent: string;
  isLoading: boolean;
  onChange: (hex: string) => void;
};

const AccentColorPicker = ({ currentAccent, isLoading, onChange }: Props) => {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <h3 className="text-sm font-semibold mb-0.5">Accent color</h3>
        <p className="text-xs text-secondary_text">
          Customize the accent color used across the app.
        </p>
      </div>

      {isLoading ? (
        <div className="flex gap-2.5 flex-wrap">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="w-8 h-8 rounded-full bg-theme_secondary_black animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="flex gap-2.5 flex-wrap">
          {ACCENT_PALETTE.map(({ label, hex }) => {
            const isActive = hex === currentAccent;
            return (
              <button
                key={hex}
                title={label}
                onClick={() => { if (!isActive) onChange(hex); }}
                className="relative w-8 h-8 rounded-full transition-transform duration-150 hover:scale-110 focus:outline-none"
                style={{ backgroundColor: hex }}
              >
                {isActive && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <HiCheck className="text-white text-sm drop-shadow" />
                  </span>
                )}
                {isActive && (
                  <span
                    className="absolute inset-0 rounded-full"
                    style={{ boxShadow: `0 0 0 2px #111, 0 0 0 4px ${hex}` }}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}

      <p className="text-xs text-secondary_text/60">
        Current:{" "}
        <span className="font-mono" style={{ color: currentAccent }}>
          {currentAccent}
        </span>
      </p>
    </div>
  );
};

export default AccentColorPicker;
