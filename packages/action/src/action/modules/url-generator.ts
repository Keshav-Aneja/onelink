/**
 * Creates a fully qualified URL by combining baseURL, prefix, and path
 * @param config - Configuration object containing baseURL and prefix
 * @param url - The path to append to the base URL
 * @returns A properly formatted URL
 */
export default function createURL(
  config: { baseURL: string; prefix?: string },
  url: string,
): string {
  if (!config.baseURL) {
    throw new Error("baseURL is required");
  }
  let baseUrl: URL;
  try {
    // Try to parse the baseURL as a complete URL
    baseUrl = new URL(config.baseURL);
  } catch (error) {
    // If it fails, it might not be a valid URL
    throw new Error(`Invalid baseURL: ${config.baseURL}`);
  }

  // Clean the url and prefix
  const cleanUrl = url.replace(/^\/+/, "");
  const prefix = config.prefix ? config.prefix.replace(/^\/+|\/+$/g, "") : "";

  // Construct the path with prefix if it exists
  const pathWithPrefix = prefix ? `${prefix}/${cleanUrl}` : cleanUrl;

  // Ensure the pathname ends with a slash before appending the path
  const pathname = baseUrl.pathname.endsWith("/")
    ? baseUrl.pathname
    : `${baseUrl.pathname}/`;

  // Combine the URL components
  return `${baseUrl.protocol}//${baseUrl.host}${pathname}${pathWithPrefix}`;
}
