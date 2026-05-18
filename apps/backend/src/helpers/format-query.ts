export interface GetLinksQuery {
  is_starred?: boolean;
  subscribed?: boolean;
}

export function formatGetQueries(query: Record<string, string>): GetLinksQuery {
  const result: GetLinksQuery = {};
  if (!query) return result;
  if ("starred" in query) {
    result.is_starred = query["starred"] === "true";
  }
  return result;
}
