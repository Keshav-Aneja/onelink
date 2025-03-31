import { Link } from "@onelink/entities/models";
import { createSlice } from "@reduxjs/toolkit";

const initialState: Link[] = [];

const favouriteLinkSlice = createSlice({
  name: "favouriteLinks",
  initialState,
  reducers: {
    addFavLink: (state, action: { payload: Link }) => {
      state.push(action.payload);
    },
    addMultipleFavLinks: (state, action: { payload: Link[] }) => {
      action.payload.forEach((link) => {
        state.push(link);
      });
    },
    replaceFavLink: (state, action: { payload: Link }) => {
      const index = state.findIndex((link) => link.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    deleteFavLink: (state, action: { payload: string }) => {
      return state.filter((state) => state.id !== action.payload);
    },
  },
  selectors: {
    getAllFavLinks: (state) => state,
  },
});

export const {
  addFavLink,
  addMultipleFavLinks,
  replaceFavLink,
  deleteFavLink,
} = favouriteLinkSlice.actions;
export const { getAllFavLinks } = favouriteLinkSlice.selectors;

export default favouriteLinkSlice.reducer;
