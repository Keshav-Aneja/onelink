import { Collection } from "@onelink/entities/models";
import { createSlice } from "@reduxjs/toolkit";
import { syncDataThunk } from "@store/thunks/sync-data.thunk";

const initialState: Collection[] = [];

const collectionSlice = createSlice({
  name: "collection",
  initialState,
  reducers: {
    setCollectionName: (
      state,
      action: { payload: { index: number; name: string } },
    ) => {
      state[action.payload.index].name = action.payload.name;
    },
    addCollection: (state, action: { payload: Collection }) => {
      state.push(action.payload);
    },
    deleteAllCollections: () => {
      return [];
    },
    addMultipleCollections: (state, action: { payload: Collection[] }) => {
      action.payload.forEach((collection) => {
        state.push(collection);
      });
    },
    deleteCollection: (state, action: { payload: string }) => {
      return state.filter((collection) => collection.id !== action.payload);
    },
    syncCollections: (state, action: { payload: Collection[] | undefined }) => {
      if (!action.payload) return state;

      // Create a map of incoming collections by ID for fast lookup
      const incomingMap = new Map(
        action.payload.map((collection) => [collection.id, collection])
      );

      // Create a map of existing collections by ID
      const existingMap = new Map(state.map((collection) => [collection.id, collection]));

      // Update existing collections and track which ones we've seen
      const updatedCollections: Collection[] = [];

      // Add or update collections from the server
      action.payload.forEach((serverCollection) => {
        updatedCollections.push(serverCollection);
      });

      // Keep collections that are in state but not in the incoming payload
      // (they might belong to different parent_ids)
      state.forEach((localCollection) => {
        if (!incomingMap.has(localCollection.id)) {
          // Only keep if it has a different parent_id than the synced ones
          const sampleParentId = action.payload[0]?.parent_id;
          if (localCollection.parent_id !== sampleParentId) {
            updatedCollections.push(localCollection);
          }
        }
      });

      return updatedCollections;
    },
  },
  selectors: {
    getCollection: (state: Collection[], index: number) => state[index],
    getAllCollections: (state: Collection[]) => state,
  },
  extraReducers: (builder) => {
    builder.addCase(syncDataThunk.fulfilled, (state, action) => {
      if (!action.payload.collections) return state;

      const incomingMap = new Map(
        action.payload.collections.map((collection) => [collection.id, collection])
      );

      const updatedCollections: Collection[] = [];

      // Add or update collections from the server
      action.payload.collections.forEach((serverCollection) => {
        updatedCollections.push(serverCollection);
      });

      // Keep collections that belong to different parent_ids
      state.forEach((localCollection) => {
        if (!incomingMap.has(localCollection.id)) {
          const sampleParentId = action.payload.collections?.[0]?.parent_id;
          if (localCollection.parent_id !== sampleParentId) {
            updatedCollections.push(localCollection);
          }
        }
      });

      return updatedCollections;
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
