import { Link } from "@onelink/entities/models";
import { createSlice } from "@reduxjs/toolkit";
import { syncDataThunk } from "@store/thunks/sync-data.thunk";

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
    replaceLink: (state, action: { payload: Link }) => {
      const index = state.findIndex((link) => link.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    deleteLink: (state, action: { payload: string }) => {
      return state.filter((state) => state.id !== action.payload);
    },
    syncLinks: (state, action: { payload: Link[] | undefined }) => {
      if (!action.payload) return state;

      const incomingMap = new Map(
        action.payload.map((link) => [link.id, link]),
      );

      const updatedLinks: Link[] = [];

      action.payload.forEach((serverLink) => {
        updatedLinks.push(serverLink);
      });

      // Keep links that are in state but not in the incoming payload
      state.forEach((localLink) => {
        if (!incomingMap.has(localLink.id)) {
          const sampleParentId = action.payload?.[0]?.parent_id;
          if (localLink.parent_id !== sampleParentId) {
            updatedLinks.push(localLink);
          }
        }
      });

      return updatedLinks;
    },
  },
  selectors: {
    getAllLinks: (state) => state,
  },
  extraReducers: (builder) => {
    builder.addCase(syncDataThunk.fulfilled, (state, action) => {
      if (!action.payload.links) return state;

      const incomingMap = new Map(
        action.payload.links.map((link) => [link.id, link]),
      );

      const updatedLinks: Link[] = [];

      // Add or update links from the server
      action.payload.links.forEach((serverLink) => {
        updatedLinks.push(serverLink);
      });

      // Keep links that belong to different parent_ids
      state.forEach((localLink) => {
        if (!incomingMap.has(localLink.id)) {
          const sampleParentId = action.payload.links?.[0]?.parent_id;
          if (localLink.parent_id !== sampleParentId) {
            updatedLinks.push(localLink);
          }
        }
      });

      return updatedLinks;
    });
  },
});

export const { addLink, addMultipleLinks, replaceLink, deleteLink, syncLinks } =
  linkSlice.actions;
export const { getAllLinks } = linkSlice.selectors;

export default linkSlice.reducer;
