export function formatGetQueries(query: Record<string, any>) {
  const formattedQuery: Record<string, any> = {};

  if (!query) {
    return formattedQuery;
  }

  if ("starred" in query) {
    formattedQuery["is_starred"] = Boolean(query["starred"]);
  }

  return JSON.parse(JSON.stringify(formattedQuery));
}
