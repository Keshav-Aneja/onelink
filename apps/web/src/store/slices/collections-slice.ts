import { getParentPath } from "@lib/utils/get-paths";
import { Collection } from "@onelink/entities/models";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getParentId } from "./application-slice";

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
  },
  selectors: {
    getCollection: (state: Collection[], index: number) => state[index],
    getAllCollections: (state: Collection[]) => state,
  },
});

export const { getCollection, getAllCollections } = collectionSlice.selectors;

export const {
  setCollectionName,
  addCollection,
  deleteAllCollections,
  addMultipleCollections,
} = collectionSlice.actions;
export default collectionSlice.reducer;
