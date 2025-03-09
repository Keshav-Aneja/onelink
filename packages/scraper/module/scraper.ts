import metadataExtractor from "../extractors/metadata";
import { urlSchema, type urlType } from "./schema";
import type { IScraper } from "./scraper.interface";
import * as cheerio from "cheerio";
export class Scraper {
  private readonly _url: string;
  constructor(url: string) {
    this._url = url;
  }

  async scrape(): Promise<any> {
    const scrape_url = urlSchema.parse(this._url);
    const response = await fetch(scrape_url);
    const $ = cheerio.load(await response.text());
    return $;
  }
  async extractMetadata(
    data: cheerio.CheerioAPI,
  ): Promise<Record<string, any>> {
    return metadataExtractor(data);
  }
}
