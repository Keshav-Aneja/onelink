import metadataExtractor, { WebsiteMetadata } from "../extractors/metadata";
import { urlSchema, type urlType } from "./schema";
import type { IScraper } from "./scraper.interface";
import * as cheerio from "cheerio";
export class Scraper implements IScraper {
  private readonly _url: string;
  constructor(url: string) {
    this._url = url;
  }

  async scrape(): Promise<any> {
    try {
      const scrape_url = urlSchema.parse(this._url);
      const response = await fetch(scrape_url);
      const $ = cheerio.load(await response.text());
      return $;
    } catch (error) {
      console.error(error);
    }
  }
  async extractMetadata(data: cheerio.CheerioAPI): Promise<WebsiteMetadata> {
    return metadataExtractor(data);
  }
}
