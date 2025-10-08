import { createSelector } from "@reduxjs/toolkit";
import { getAllCollections } from "@store/slices/collections-slice";
import { useAppSelector } from "@store/store";

// Single shared selector instance - all components use the same cache!
const selectCollectionsByParentId = createSelector(
  [getAllCollections, (_state, pathId: string | null | undefined) => pathId],
  (collections, pathId) => {
    if (pathId === undefined) return [];
    if (!collections || collections.length === 0) return undefined;
    return collections.filter((c) => c.parent_id === pathId);
  }
);

export function useStoredCollections(pathId: string | null | undefined) {
  return useAppSelector((state) => selectCollectionsByParentId(state, pathId));
}

// Single shared selector instance for finding by ID
const selectCollectionById = createSelector(
  [getAllCollections, (_state, pathId: string | null | undefined) => pathId],
  (collections, pathId) => {
    if (pathId === undefined) return undefined;
    if (!collections || collections.length === 0) return undefined;
    return collections.find((collection) => collection.id === pathId);
  }
);

export function useCollectionByPath(pathId: string | null | undefined) {
  return useAppSelector((state) => selectCollectionById(state, pathId));
}
