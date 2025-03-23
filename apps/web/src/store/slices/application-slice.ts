import { createSlice } from "@reduxjs/toolkit";

interface IApplicationConfig {
  redirectTo: string;
  parent_id: string | null;
  not_found: {
    collections: boolean;
    links: boolean;
  };
}

const initialState: IApplicationConfig = {
  redirectTo: "",
  parent_id: null,
  not_found: {
    collections: true,
    links: true,
  },
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
  },
  selectors: {
    getParentId: (state) => state.parent_id,
    getNotFoundState: (state) => state.not_found,
  },
});

export const { setParentId, setFoundCollection, setFoundLink } =
  applicationSlice.actions;
export const { getParentId, getNotFoundState } = applicationSlice.selectors;
export default applicationSlice.reducer;
