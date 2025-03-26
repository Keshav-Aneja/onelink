import { Link } from "@onelink/entities/models";
import { createSlice } from "@reduxjs/toolkit";
import type { RSSFeed } from "@onelink/scraper/rss";
interface IApplicationConfig {
  redirectTo: string;
  parent_id: string | null;
  not_found: {
    collections: boolean;
    links: boolean;
  };
  selectedLink: Link | null;
  feed: RSSFeed[] | null;
}

const initialState: IApplicationConfig = {
  redirectTo: "",
  parent_id: null,
  not_found: {
    collections: true,
    links: true,
  },
  selectedLink: null,
  feed: null,
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
    setFeed: (state, action: { payload: RSSFeed[] | null }) => {
      state.feed = action.payload;
    },
  },
  selectors: {
    getParentId: (state) => state.parent_id,
    getNotFoundState: (state) => state.not_found,
    getSelectedLink: (state) => state.selectedLink,
    getFeed: (state) => state.feed,
  },
});

export const {
  setParentId,
  setFoundCollection,
  setFoundLink,
  setSelectedLink,
  setFeed,
} = applicationSlice.actions;
export const { getParentId, getNotFoundState, getSelectedLink, getFeed } =
  applicationSlice.selectors;
export default applicationSlice.reducer;
