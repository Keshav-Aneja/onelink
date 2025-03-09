import type { CheerioAPI } from "cheerio";

// Define the geo positioning interface
interface GeoPositioning {
  position: string | undefined;
  placename: string | undefined;
  region: string | undefined;
}

// Define the metadata interface
export interface WebsiteMetadata {
  // Basic metadata
  title: string;
  description: string | undefined;
  keywords: string | undefined;
  author: string | undefined;
  viewport: string | undefined;
  charset: string | undefined;
  language: string | undefined;

  // Canonical and alternate URLs
  canonical: string | undefined;
  ampHtml: string | undefined;

  // Open Graph protocol (Facebook, LinkedIn)
  ogTitle: string | undefined;
  ogType: string | undefined;
  ogUrl: string | undefined;
  ogImage: string | undefined;
  ogImageWidth: string | undefined;
  ogImageHeight: string | undefined;
  ogImageAlt: string | undefined;
  ogDescription: string | undefined;
  ogSiteName: string | undefined;
  ogLocale: string | undefined;

  // Twitter Card metadata
  twitterCard: string | undefined;
  twitterSite: string | undefined;
  twitterCreator: string | undefined;
  twitterTitle: string | undefined;
  twitterDescription: string | undefined;
  twitterImage: string | undefined;
  twitterImageAlt: string | undefined;

  // Article specific metadata
  articlePublishedTime: string | undefined;
  articleModifiedTime: string | undefined;
  articleAuthor: string | undefined;
  articleSection: string | undefined;
  articleTag: string | undefined;

  // Dublin Core metadata
  dcTitle: string | undefined;
  dcCreator: string | undefined;
  dcDescription: string | undefined;
  dcPublisher: string | undefined;
  dcDate: string | undefined;

  // Favicon and Apple touch icons
  favicon: string | undefined;
  appleTouchIcon: string | undefined;

  // Structured data
  jsonLd: string | null;

  // Robots directives
  robots: string | undefined;
  googlebot: string | undefined;

  // Pagination
  prevPage: string | undefined;
  nextPage: string | undefined;

  // RSS/Atom feeds
  rssLink: string | undefined;
  atomLink: string | undefined;

  // Verification codes
  googleSiteVerification: string | undefined;
  bingSiteVerification: string | undefined;
  yandexVerification: string | undefined;

  // Mobile app related
  appleMobileWebAppCapable: string | undefined;
  appleMobileWebAppTitle: string | undefined;
  appleMobileWebAppStatusBarStyle: string | undefined;
  applicationName: string | undefined;
  msapplicationTileColor: string | undefined;
  msapplicationTileImage: string | undefined;
  themeColor: string | undefined;

  // Geo positioning
  geo: GeoPositioning;
}

export default function metadataExtractor($: CheerioAPI): WebsiteMetadata {
  return {
    // Basic metadata
    title: $("title").text(),
    description: $('meta[name="description"]').attr("content"),
    keywords: $('meta[name="keywords"]').attr("content"),
    author: $('meta[name="author"]').attr("content"),
    viewport: $('meta[name="viewport"]').attr("content"),
    charset: $("meta[charset]").attr("charset"),
    language: $("html").attr("lang"),

    // Canonical and alternate URLs
    canonical: $('link[rel="canonical"]').attr("href"),
    ampHtml: $('link[rel="amphtml"]').attr("href"),

    // Open Graph protocol (Facebook, LinkedIn)
    ogTitle: $('meta[property="og:title"]').attr("content"),
    ogType: $('meta[property="og:type"]').attr("content"),
    ogUrl: $('meta[property="og:url"]').attr("content"),
    ogImage: $('meta[property="og:image"]').attr("content"),
    ogImageWidth: $('meta[property="og:image:width"]').attr("content"),
    ogImageHeight: $('meta[property="og:image:height"]').attr("content"),
    ogImageAlt: $('meta[property="og:image:alt"]').attr("content"),
    ogDescription: $('meta[property="og:description"]').attr("content"),
    ogSiteName: $('meta[property="og:site_name"]').attr("content"),
    ogLocale: $('meta[property="og:locale"]').attr("content"),

    // Twitter Card metadata
    twitterCard: $('meta[name="twitter:card"]').attr("content"),
    twitterSite: $('meta[name="twitter:site"]').attr("content"),
    twitterCreator: $('meta[name="twitter:creator"]').attr("content"),
    twitterTitle: $('meta[name="twitter:title"]').attr("content"),
    twitterDescription: $('meta[name="twitter:description"]').attr("content"),
    twitterImage: $('meta[name="twitter:image"]').attr("content"),
    twitterImageAlt: $('meta[name="twitter:image:alt"]').attr("content"),

    // Article specific metadata
    articlePublishedTime: $('meta[property="article:published_time"]').attr(
      "content",
    ),
    articleModifiedTime: $('meta[property="article:modified_time"]').attr(
      "content",
    ),
    articleAuthor: $('meta[property="article:author"]').attr("content"),
    articleSection: $('meta[property="article:section"]').attr("content"),
    articleTag: $('meta[property="article:tag"]').attr("content"),

    // Dublin Core metadata
    dcTitle: $('meta[name="DC.title"]').attr("content"),
    dcCreator: $('meta[name="DC.creator"]').attr("content"),
    dcDescription: $('meta[name="DC.description"]').attr("content"),
    dcPublisher: $('meta[name="DC.publisher"]').attr("content"),
    dcDate: $('meta[name="DC.date"]').attr("content"),

    // Favicon and Apple touch icons
    favicon:
      $('link[rel="icon"]').attr("href") ||
      $('link[rel="shortcut icon"]').attr("href"),
    appleTouchIcon: $('link[rel="apple-touch-icon"]').attr("href"),

    // Structured data
    jsonLd: $('script[type="application/ld+json"]').html(),

    // Robots directives
    robots: $('meta[name="robots"]').attr("content"),
    googlebot: $('meta[name="googlebot"]').attr("content"),

    // Pagination
    prevPage: $('link[rel="prev"]').attr("href"),
    nextPage: $('link[rel="next"]').attr("href"),

    // RSS/Atom feeds
    rssLink: $('link[type="application/rss+xml"]').attr("href"),
    atomLink: $('link[type="application/atom+xml"]').attr("href"),

    // Verification codes
    googleSiteVerification: $('meta[name="google-site-verification"]').attr(
      "content",
    ),
    bingSiteVerification: $('meta[name="msvalidate.01"]').attr("content"),
    yandexVerification: $('meta[name="yandex-verification"]').attr("content"),

    // Mobile app related
    appleMobileWebAppCapable: $(
      'meta[name="apple-mobile-web-app-capable"]',
    ).attr("content"),
    appleMobileWebAppTitle: $('meta[name="apple-mobile-web-app-title"]').attr(
      "content",
    ),
    appleMobileWebAppStatusBarStyle: $(
      'meta[name="apple-mobile-web-app-status-bar-style"]',
    ).attr("content"),
    applicationName: $('meta[name="application-name"]').attr("content"),
    msapplicationTileColor: $('meta[name="msapplication-TileColor"]').attr(
      "content",
    ),
    msapplicationTileImage: $('meta[name="msapplication-TileImage"]').attr(
      "content",
    ),
    themeColor: $('meta[name="theme-color"]').attr("content"),

    // Geo positioning
    geo: {
      position: $('meta[name="geo.position"]').attr("content"),
      placename: $('meta[name="geo.placename"]').attr("content"),
      region: $('meta[name="geo.region"]').attr("content"),
    },
  };
}
