import Parser from "rss-parser";

const parser = new Parser();

async function parse() {
  const feed = await parser.parseURL("https://medium.com/feed/@keshav.aneja09");
  console.log(feed.title);

  feed.items.forEach((item) => {
    console.log(item.title + " " + item.link);
  });
}

parse();
