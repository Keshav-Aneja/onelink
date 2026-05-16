import type { WebsiteMetadata } from "./extractors/metadata";

const STOP_WORDS = new Set([
  "the",
  "a",
  "an",
  "in",
  "of",
  "and",
  "or",
  "to",
  "for",
  "with",
  "is",
  "are",
  "be",
  "was",
  "were",
  "has",
  "have",
  "had",
  "on",
  "at",
  "by",
  "from",
  "as",
  "it",
  "its",
  "this",
  "that",
  "but",
  "not",
  "if",
  "we",
  "our",
  "you",
  "your",
  "he",
  "she",
  "they",
  "their",
  "my",
  "about",
  "into",
  "than",
  "then",
  "so",
  "up",
  "out",
  "no",
  "all",
  "more",
  "also",
  "just",
  "can",
  "do",
  "new",
  "how",
  "what",
  "when",
  "which",
  "who",
  "will",
  "use",
  "using",
  "used",
  "get",
  "via",
  "per",
]);

const OG_TYPE_MAP: Record<string, string> = {
  "video.other": "video",
  "video.movie": "video",
  "video.episode": "video",
  "video.tv_show": "video",
  article: "article",
  "music.song": "music",
  "music.album": "music",
  "music.playlist": "music",
  book: "book",
  profile: "profile",
  website: "website",
};

function normalize(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "")
    .replace(/^-+|-+$/g, "");
}

function isValid(tag: string): boolean {
  return (
    tag.length > 1 &&
    tag.length <= 40 &&
    !STOP_WORDS.has(tag) &&
    !/^\d+$/.test(tag)
  );
}

export function deriveTags(meta: WebsiteMetadata, url: string): string[] {
  const candidates: string[] = [];

  if (meta.keywords) {
    meta.keywords.split(/[,;]/).forEach((k) => candidates.push(k));
  }

  if (meta.articleTag) candidates.push(meta.articleTag);
  if (meta.articleSection) candidates.push(meta.articleSection);

  try {
    const host = new URL(url).hostname.replace(/^www\./, "").split(".")[0];
    if (host) candidates.push(host);
  } catch {}

  if (meta.ogType && OG_TYPE_MAP[meta.ogType]) {
    candidates.push(OG_TYPE_MAP[meta.ogType] as string);
  }

  return [...new Set(candidates.map(normalize).filter(isValid))].slice(0, 8);
}
