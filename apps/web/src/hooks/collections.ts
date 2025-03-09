import { getParentIdFromPath } from "@lib/utils/get-paths";
import { getAllCollections } from "@store/slices/collections-slice";
import { useAppSelector } from "@store/store";
import { useLocation } from "react-router";

export function useStoredCollections(pathId: string | null | undefined) {
  const collections = useAppSelector(getAllCollections);
  if (pathId === undefined) {
    return [];
  }
  if (!collections || collections.length === 0) {
    return undefined;
  }
  return collections.filter((collection) => collection.parent_id === pathId);
}
