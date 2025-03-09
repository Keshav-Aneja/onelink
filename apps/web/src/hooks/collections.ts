import { getCollectionByParent } from "@store/slices/collections-slice";
import { useAppSelector } from "@store/store";

export function useStoredCollections() {
  const collections = useAppSelector((state) =>
    getCollectionByParent(state, null),
  );
  if (!collections || collections.length === 0) {
    return undefined;
  }
  return collections;
}
