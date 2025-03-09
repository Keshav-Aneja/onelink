import type { urlType } from "./schema";
import * as cheerio from "cheerio";
export interface IScraper {
  scrape(url: urlType): Promise<any>;
  extractMetadata(data: cheerio.CheerioAPI): Promise<Record<string, string>>;
}
