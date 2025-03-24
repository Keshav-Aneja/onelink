import { Link } from "@onelink/entities/models";
import { createSlice } from "@reduxjs/toolkit";

interface IApplicationConfig {
  redirectTo: string;
  parent_id: string | null;
  not_found: {
    collections: boolean;
    links: boolean;
  };
  selectedLink: Link | null;
}

const initialState: IApplicationConfig = {
  redirectTo: "",
  parent_id: null,
  not_found: {
    collections: true,
    links: true,
  },
  selectedLink: null,
};

export const applicationSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setParentId: (state, action: { payload: string | null }) => {
      state.parent_id = action.payload;
    },
    setFoundCollection: (state, action: { payload: boolean }) => {
      state.not_found = {
        ...state.not_found,
        collections: action.payload,
      };
    },
    setFoundLink: (state, action: { payload: boolean }) => {
      state.not_found = {
        ...state.not_found,
        links: action.payload,
      };
    },
    setSelectedLink: (state, action: { payload: Link | null }) => {
      state.selectedLink = action.payload;
    },
  },
  selectors: {
    getParentId: (state) => state.parent_id,
    getNotFoundState: (state) => state.not_found,
    getSelectedLink: (state) => state.selectedLink,
  },
});

export const {
  setParentId,
  setFoundCollection,
  setFoundLink,
  setSelectedLink,
} = applicationSlice.actions;
export const { getParentId, getNotFoundState, getSelectedLink } =
  applicationSlice.selectors;
export default applicationSlice.reducer;
