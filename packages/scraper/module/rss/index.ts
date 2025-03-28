import * as cheerio from "cheerio";

export type RSSFeed = {
  title?: string;
  published_date?: string;
  link?: string;
};

export class RSS {
  private readonly _url: string;
  private readonly _rss: string;
  constructor(link: string, rss?: string) {
    this._url = link;
    this._rss = rss ?? "";
  }
  public get url() {
    return this._url;
  }

  public get rss() {
    return this._rss;
  }

  async checkIfValid(url: string) {
    try {
      const fetchURL = new URL(url).toString();
      const response = await fetch(fetchURL, { method: "HEAD" });
      const contentType = response.headers.get("Content-Type") || "";

      const validContentTypes = [
        "application/rss+xml",
        "application/atom+xml",
        "application/xml",
        "text/xml",
        "xml",
        "rss",
        "atom",
      ];

      return (
        response.ok &&
        validContentTypes.some((type) => contentType.includes(type))
      );
    } catch (error) {
      return false;
    }
  }

  async findStandardRSSFeeds(url: string) {
    const parsedURL = new URL(url);
    const origin = parsedURL.host;
    const paths = parsedURL.pathname.split("/").filter(Boolean);
    const firstPath = paths[0] || "";

    const feedPatterns = [
      // YouTube patterns
      {
        matcher: (host: string) => host.includes("youtube"),
        patterns: [
          // Channel ID from query params
          async () => {
            const channelId = parsedURL.searchParams.get("channel_id");
            if (channelId) {
              const feedURL = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
              if (await this.checkIfValid(feedURL)) return feedURL;
            }
            return null;
          },
          // User from path
          async () => {
            if (firstPath) {
              const username = firstPath.includes("@")
                ? firstPath.slice(1)
                : firstPath;
              const feedURL = `https://www.youtube.com/feeds/videos.xml?user=${username}`;
              if (await this.checkIfValid(feedURL)) return feedURL;
            }
            return null;
          },
        ],
      },
      {
        matcher: (host: string) => host.includes("github.com"),
        patterns: [
          async () => {
            let feedURL = `https://${origin}/`;
            const pathLength = paths.length;
            if (pathLength === 1) {
              feedURL = feedURL.concat(`${paths[0]}.atom`);
            } else if (pathLength > 1) {
              feedURL = feedURL.concat(`${paths[0]}/${paths[1]}/commits.atom`);
            }
            if (await this.checkIfValid(feedURL)) return feedURL;
            return null;
          },
        ],
      },
      // Hashnode pattern
      {
        matcher: (host: string) => host.includes("hashnode.dev"),
        patterns: [
          async () => {
            const feedURL = `https://${origin}/rss.xml`;
            if (await this.checkIfValid(feedURL)) return feedURL;
            return null;
          },
        ],
      },
      // Medium pattern
      {
        matcher: (host: string) => host.includes("medium.com"),
        patterns: [
          async () => {
            if (firstPath) {
              const feedURL = `https://${origin}/feed/${firstPath}`;
              if (await this.checkIfValid(feedURL)) return feedURL;
            }
            return null;
          },
        ],
      },
      // Dev.to pattern
      {
        matcher: (host: string) => host.includes("dev.to"),
        patterns: [
          async () => {
            if (firstPath) {
              const feedURL = `https://${origin}/feed/${firstPath}`;
              if (await this.checkIfValid(feedURL)) return feedURL;
            } else {
              const feedURL = `https://${origin}/feed/`;
              if (await this.checkIfValid(feedURL)) return feedURL;
            }
            return null;
          },
        ],
      },
    ];

    // Find the matching domain pattern
    const domainPattern = feedPatterns.find((pattern) =>
      pattern.matcher(origin),
    );

    if (domainPattern) {
      // Try each pattern for the matching domain
      for (const patternFn of domainPattern.patterns) {
        const result = await patternFn();
        if (result) return result;
      }
    }

    return null;
  }

  async findValidRSS() {
    const commonPaths = [
      "/feed",
      "/rss",
      "/atom",
      "/feed.xml",
      "/rss.xml",
      "/atom.xml",
      "/feeds/posts/default",
      "/rss2",
      "/feed/rss",
      "/rss/index.xml",
      "/?feed=rss",
      "/?feed=rss2",
      "/?feed=atom",
      "/all.xml",
      "index.rss",
    ];

    try {
      const originURL = new URL(this._url).origin;
      if (this._rss && this._rss.length > 0) {
        const feedURL = this._rss.startsWith("http")
          ? new URL(this._rss).toString()
          : new URL(this._rss, originURL).toString();
        const isInputValid = await this.checkIfValid(feedURL);
        if (isInputValid) {
          return feedURL;
        }
      } else {
        const standardFeed = await this.findStandardRSSFeeds(this._url);
        if (standardFeed && standardFeed.length > 0) {
          return standardFeed;
        }

        for (const path of commonPaths) {
          const exp_url = new URL(path, originURL).toString();
          const isValid = await this.checkIfValid(exp_url);
          if (isValid) {
            return exp_url;
          }
        }
      }
      return undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async scrapeRSS(days: number = 1) {
    try {
      const now = new Date();
      const daysAgo = new Date();
      daysAgo.setDate(now.getDate() - days);
      const rssURL = await this.findValidRSS();
      if (!rssURL) {
        return null;
      }
      const response = await fetch(rssURL);
      const $ = cheerio.load(await response.text(), {
        xml: true,
      });
      if (!$) {
        console.error("Failed to load RSS feed.");
        return null;
      }
      const rssFeed: RSSFeed[] = [];
      $("item").each((i, el) => {
        const pubDate = $(el).find("pubDate").text();
        const date = pubDate ? new Date(pubDate) : undefined;
        if (date && date >= daysAgo) {
          rssFeed.push({
            title: $(el).find("title").text(),
            published_date: date.toISOString(),
            link: $(el).find("link").text(),
          });
        }
      });
      $("entry").each((i, el) => {
        const pubDate =
          $(el).find("published").text() || $(el).find("updated").text();
        const date = pubDate ? new Date(pubDate) : undefined;
        if (date && date >= daysAgo) {
          rssFeed.push({
            title: this.formatCommitTitle($(el).find("title").text(), rssURL),
            published_date: date.toISOString(),
            link: $(el).find("link").attr("href"),
          });
        }
      });
      return rssFeed;
    } catch (error) {
      console.error("Error fetching RSS:", error);
      return null;
    }
  }

  formatCommitTitle(title: string, url: string) {
    if (url.includes("github") && url.includes("commits.atom")) {
      return `New commit - ${title}`;
    }
    return title;
  }
}
