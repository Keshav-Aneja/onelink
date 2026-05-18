import { PiGridFour, PiListBullets, PiRows, PiPaintBrush } from "react-icons/pi";
import type { ViewMode } from "@hooks/view-preferences";
import type { IconType } from "react-icons";

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
export const ROOT_PATH = "Home";

export enum Pages {
  COLLECTIONS = "/collections",
  AUTHENTICATION = "/auth",
}

export const Intervals = {
  DATA_SYNC: 60 * 1000,
};

export const ACCENT_PALETTE: { label: string; hex: string }[] = [
  { label: "Pink",   hex: "#f63f94" },
  { label: "Red",    hex: "#e94560" },
  { label: "Orange", hex: "#f97316" },
  { label: "Amber",  hex: "#f59e0b" },
  { label: "Green",  hex: "#22c55e" },
  { label: "Teal",   hex: "#14b8a6" },
  { label: "Cyan",   hex: "#06b6d4" },
  { label: "Blue",   hex: "#3b82f6" },
  { label: "Indigo", hex: "#6366f1" },
  { label: "Violet", hex: "#8b5cf6" },
  { label: "Purple", hex: "#a855f7" },
  { label: "Rose",   hex: "#fb7185" },
];

export const VIEW_MODES: { mode: ViewMode; icon: React.ElementType; label: string; description: string }[] = [
  { mode: "grid",    icon: PiGridFour,    label: "Grid",    description: "Card grid with thumbnails" },
  { mode: "list",    icon: PiListBullets, label: "List",    description: "Detailed rows with metadata" },
  { mode: "compact", icon: PiRows,        label: "Compact", description: "Dense rows, minimal spacing" },
];

export const SETTINGS_NAV = [
  {
    id: "appearance" as const,
    label: "Appearance",
    icon: PiPaintBrush,
    description: "Customize how the app looks and feels.",
  },
] satisfies { id: string; label: string; icon: IconType; description: string }[];

export type SettingsSectionId = typeof SETTINGS_NAV[number]["id"];
