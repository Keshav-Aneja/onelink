import { Collection, Link } from "@onelink/entities/models";
import { createSlice } from "@reduxjs/toolkit";
import type { RSSFeed } from "@onelink/scraper/rss";
import sidebarItems from "@config/navigation-sidebar-items";
interface IApplicationConfig {
  redirectTo: string;
  parent_id: string | null;
  not_found: {
    collections: boolean;
    links: boolean;
  };
  selectedLink: Link | null;
  selectedCollection: Collection | null;
  feed: RSSFeed[] | null;
  activeTab: string;
  securedCollections: string[];
}

const initialState: IApplicationConfig = {
  redirectTo: "",
  parent_id: null,
  not_found: {
    collections: true,
    links: true,
  },
  selectedCollection: null,
  selectedLink: null,
  feed: null,
  activeTab: sidebarItems[0].label,
  securedCollections: [],
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
    setSelectedCollection: (state, action: { payload: Collection | null }) => {
      state.selectedCollection = action.payload;
    },
    setFeed: (state, action: { payload: RSSFeed[] | null }) => {
      state.feed = action.payload;
    },
    setActiveTab: (state, action: { payload: string }) => {
      state.activeTab = action.payload;
    },
    addToSecuredCollection: (state, action: { payload: string }) => {
      state.securedCollections.push(action.payload);
    },
  },
  selectors: {
    getParentId: (state) => state.parent_id,
    getNotFoundState: (state) => state.not_found,
    getSelectedLink: (state) => state.selectedLink,
    getSelectedCollection: (state) => state.selectedCollection,
    getFeed: (state) => state.feed,
    getActiveTab: (state) => state.activeTab,
    getSecuredCollection: (state) => state.securedCollections,
  },
});

export const {
  setParentId,
  setFoundCollection,
  setFoundLink,
  setSelectedLink,
  setFeed,
  setActiveTab,
  setSelectedCollection,
  addToSecuredCollection,
} = applicationSlice.actions;
export const {
  getParentId,
  getNotFoundState,
  getSelectedLink,
  getFeed,
  getActiveTab,
  getSelectedCollection,
  getSecuredCollection,
} = applicationSlice.selectors;
export default applicationSlice.reducer;
