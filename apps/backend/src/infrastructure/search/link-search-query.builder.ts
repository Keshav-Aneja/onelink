import type { Knex } from "knex";

// ts_rank normalization flag: divide by (1 + log(document length))
const TS_RANK_NORMALIZATION = 1;

// Trigram similarity threshold — below this, fuzzy matches are excluded
const SIMILARITY_THRESHOLD = 0.15;

// Weight applied to ts_rank vs trigram similarity in the final score.
// Higher ts_rank_weight favours semantic/stemmed matches; lower favours typo-tolerance.
const TS_RANK_WEIGHT = 0.7;
const SIMILARITY_WEIGHT = 0.3;

// Hardcoded — never derived from user input, safe to interpolate directly into SQL
const TRIGRAM_FIELDS = ["name", "description", "site_description", "keywords"] as const;

export interface SearchFilters {
  collection_id?: string | null;
  tag?: string;
  starred?: boolean;
}

export class LinkSearchQueryBuilder {
  /**
   * Applies a WHERE clause matching rows via full-text search (tsvector) OR trigram
   * similarity, then orders by a weighted hybrid score combining both signals.
   *
   * Weight classes on search_vector: A=name, B=description, C=site_description, D=keywords
   */
  static apply(query: Knex.QueryBuilder, search_query: string, filters?: SearchFilters): Knex.QueryBuilder {
    const tsQuery = this.toTsQuery(search_query);

    // Greatest-similarity expression for ORDER BY — column names are from a static
    // whitelist so direct interpolation is safe; only search_query goes via binding.
    const greatestExpr = `GREATEST(${TRIGRAM_FIELDS.map(
      (f) => `similarity(coalesce(${f}, ''), ?)`
    ).join(", ")})`;

    let result = query
      .where((builder) => {
        builder
          .whereRaw("search_vector @@ to_tsquery('english', ?)", [tsQuery])
          .orWhere((fuzzy) => {
            for (const field of TRIGRAM_FIELDS) {
              fuzzy.orWhereRaw(
                `similarity(coalesce(${field}, ''), ?) > ?`,
                [search_query, SIMILARITY_THRESHOLD]
              );
            }
          });
      })
      .orderByRaw(
        `(? * ts_rank(search_vector, to_tsquery('english', ?), ?) + ? * ${greatestExpr}) DESC`,
        [
          TS_RANK_WEIGHT,
          tsQuery,
          TS_RANK_NORMALIZATION,
          SIMILARITY_WEIGHT,
          ...TRIGRAM_FIELDS.map(() => search_query),
        ]
      );

    if (filters) {
      if (filters.collection_id !== undefined) {
        result = result.andWhere("links.parent_id", filters.collection_id);
      }
      if (filters.tag) {
        result = result
          .join("link_tags", "link_tags.link_id", "links.id")
          .join("tags", "tags.id", "link_tags.tag_id")
          .andWhere("tags.name", filters.tag)
          .andWhere("link_tags.confirmed", true);
      }
      if (filters.starred === true) {
        result = result.andWhere("links.is_starred", true);
      }
    }

    return result;
  }

  /**
   * Converts a raw user query into a safe prefix-match tsquery string.
   * Each whitespace-separated token becomes `token:*`, joined with AND (&).
   * Injection-safe: tokens are extracted via regex, never passed raw into SQL.
   */
  static toTsQuery(raw: string): string {
    const tokens = raw
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean)
      .map((t) => t.replace(/[^a-z0-9]/g, ""))
      .filter((t) => t.length > 0);

    if (tokens.length === 0) return "''";
    return tokens.map((t) => `${t}:*`).join(" & ");
  }
}
