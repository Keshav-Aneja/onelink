import { WebsiteMetadata } from "../extractors/metadata";
import type { urlType } from "./schema";
import * as cheerio from "cheerio";
export interface IScraper {
  scrape(): Promise<any>;
  extractMetadata(data: cheerio.CheerioAPI): Promise<WebsiteMetadata>;
}
