import { useEffect } from "react";
import { extractUrls, isValidUrl } from "@lib/utils/extractUrls";

interface UseClipboardUrlDetectorOptions {
  enabled: boolean;
  onUrlsDetected: (urls: string[]) => void;
}

/**
 * Custom hook to detect URLs in clipboard when Ctrl+V is pressed
 * @param options - Configuration options
 * @param options.enabled - Whether the hook is active
 * @param options.onUrlsDetected - Callback function when URLs are detected
 */
export function useClipboardUrlDetector({
  enabled,
  onUrlsDetected,
}: UseClipboardUrlDetectorOptions) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleKeyDown = async (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "v") {
        try {
          if (!navigator.clipboard || !navigator.clipboard.readText) {
            console.warn("Clipboard API not available");
            return;
          }

          // Read clipboard text
          const clipboardText = await navigator.clipboard.readText();

          if (!clipboardText) {
            return;
          }

          const urls = extractUrls(clipboardText);
          const validUrls = urls.filter(isValidUrl);

          if (validUrls.length > 0) {
            event.preventDefault();

            onUrlsDetected(validUrls);
          }
        } catch (error) {
          console.error("Failed to read clipboard:", error);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled, onUrlsDetected]);
}
