import type { CheerioAPI } from "cheerio";

export default function metadataExtractor($: CheerioAPI) {
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
