import { Collection } from "@onelink/entities/models";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: Collection[] = [
  {
    id: "",
    name: "",
    color: "",
    is_protected: false,
    parent_id: "",
    owner_id: "",
    description: "",
    password: "",
  },
];

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
  },
  selectors: {
    getCollection: (state, action: PayloadAction<number>) =>
      state[action.payload],
  },
});

export const { setCollectionName } = collectionSlice.actions;
export const { getCollection } = collectionSlice.selectors;

export default collectionSlice.reducer;
