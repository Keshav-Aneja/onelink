import { Link } from "@onelink/entities/models";
import { createSlice } from "@reduxjs/toolkit";

const initialState: Link[] = [];

const linkSlice = createSlice({
  name: "link",
  initialState,
  reducers: {
    addLink: (state, action: { payload: Link }) => {
      state.push(action.payload);
    },
    addMultipleLinks: (state, action: { payload: Link[] }) => {
      action.payload.forEach((link) => {
        state.push(link);
      });
    },
  },
  selectors: {
    getAllLinks: (state) => state,
  },
});

export const { addLink, addMultipleLinks } = linkSlice.actions;
export const { getAllLinks } = linkSlice.selectors;

export default linkSlice.reducer;
