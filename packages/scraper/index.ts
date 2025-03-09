export * from "./module/index";
export * from "./extractors/metadata";

/**
 * 
 * How to use?
 * 
 * 

async function scrape() {
  const scraper = new Scraper(
    "https://kustom.cc",
  );
  const data = await scraper.scrape();
  const metadata = await scraper.extractMetadata(data);
  console.log(metadata);
}
scrape();

 */
