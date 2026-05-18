export function openExternalLink(url: string): void {
  const win = window.open(url, "_blank", "noopener,noreferrer");
  if (win) win.opener = null;
}
