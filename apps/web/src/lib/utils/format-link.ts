export default function formatLink(link: string) {
  if (link.includes("http")) {
    return formatWWW(link.split("/")[2]);
  }
  return formatWWW(link.split("/")[0]);
}

function formatWWW(link: string) {
  if (link.includes("www")) {
    return link.split(".")[1];
  }
  return link;
}
