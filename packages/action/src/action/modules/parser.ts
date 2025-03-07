/**
 *
 * @param response - Takes the response of the fetch API call
 * @returns - The appropriate content type
 */
export default async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) return response.json();
  return response.text() as any;
}
