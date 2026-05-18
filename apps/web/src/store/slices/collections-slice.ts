import { Collection } from "@onelink/entities/models";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { syncDataThunk } from "@store/thunks/sync-data.thunk";

const initialState: Collection[] = [];

/**
 * Merges an incoming server page (scoped to one parent_id) into the local cache.
 * Items belonging to a different parent_id are preserved untouched.
 */
function mergeByParentId(
  local: Collection[],
  incoming: Collection[],
  parentId: string | null,
): Collection[] {
  const incomingMap = new Map(incoming.map((c) => [c.id, c]));
  const kept = local.filter((c) => !incomingMap.has(c.id) && c.parent_id !== parentId);
  return [...incoming, ...kept];
}

const collectionSlice = createSlice({
  name: "collection",
  initialState,
  reducers: {
    setCollectionName: (
      state,
      action: PayloadAction<{ index: number; name: string }>,
    ) => {
      state[action.payload.index].name = action.payload.name;
    },
    addCollection: (state, action: PayloadAction<Collection>) => {
      state.push(action.payload);
    },
    deleteAllCollections: () => {
      return [];
    },
    addMultipleCollections: (state, action: PayloadAction<Collection[]>) => {
      action.payload.forEach((collection) => {
        state.push(collection);
      });
    },
    deleteCollection: (state, action: PayloadAction<string>) => {
      return state.filter((collection) => collection.id !== action.payload);
    },
    syncCollections: (
      state,
      action: PayloadAction<{ items: Collection[]; parentId: string | null }>,
    ) => {
      return mergeByParentId(state as Collection[], action.payload.items, action.payload.parentId);
    },
  },
  selectors: {
    getCollection: (state: Collection[], index: number) => state[index],
    getAllCollections: (state: Collection[]) => state,
  },
  extraReducers: (builder) => {
    builder.addCase(syncDataThunk.fulfilled, (state, action) => {
      if (!action.payload.collections) return state;
      return mergeByParentId(
        state as Collection[],
        action.payload.collections,
        action.payload.parentId,
      );
    });
  },
});

export const { getCollection, getAllCollections } = collectionSlice.selectors;

export const {
  setCollectionName,
  addCollection,
  deleteAllCollections,
  addMultipleCollections,
  deleteCollection,
  syncCollections,
} = collectionSlice.actions;
export default collectionSlice.reducer;
