/**
 * Extracts URLs from a given text string
 * @param text - The text to extract URLs from
 * @returns Array of unique valid URLs found in the text
 */
export function extractUrls(text: string): string[] {
  if (!text || typeof text !== "string") {
    return [];
  }

  // Regex pattern to match URLs (http, https)
  const urlPattern =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;

  const matches = text.match(urlPattern);

  if (!matches) {
    return [];
  }

  // Remove duplicates and return
  return Array.from(new Set(matches));
}

/**
 * Validates if a string is a valid URL
 * @param url - The URL string to validate
 * @returns true if valid URL, false otherwise
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
