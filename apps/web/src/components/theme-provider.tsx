import { useEffect } from "react";
import { useSettings } from "@features/settings/get-settings";

const DEFAULT_ACCENT = "#f63f94";

export const ThemeProvider = () => {
  const { data } = useSettings();
  const accent = data?.data?.accent_color ?? DEFAULT_ACCENT;

  useEffect(() => {
    document.documentElement.style.setProperty("--color-primary", accent);
    document.documentElement.style.setProperty("--color-gradient", accent);
  }, [accent]);

  return null;
};
