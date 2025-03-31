import { getAllFavLinks } from "@store/slices/favourite-links-slice";
import { getAllLinks } from "@store/slices/links-slice";
import { useAppSelector } from "@store/store";

export function useStoredLinks(pathId: string | null | undefined) {
  const links = useAppSelector(getAllLinks);
  if (pathId === undefined) {
    return [];
  }
  if (!links || links.length === 0) {
    return undefined;
  }
  return links.filter((link) => link.parent_id === pathId);
}

export function useStoredFavouriteLinks() {
  const links = useAppSelector(getAllFavLinks);

  if (!links || links.length === 0) {
    return undefined;
  }
  return links;
}
