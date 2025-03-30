import { getAllCollections } from "@store/slices/collections-slice";
import { useAppSelector } from "@store/store";

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
export function useCollectionByPath(pathId: string | null | undefined) {
  const collections = useAppSelector(getAllCollections);
  if (pathId === undefined) {
    return undefined;
  }
  if (!collections || collections.length === 0) {
    return undefined;
  }
  return collections.find((collection) => collection.id === pathId);
}
