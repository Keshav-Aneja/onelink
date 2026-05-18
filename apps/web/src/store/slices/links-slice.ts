import { Link } from "@onelink/entities/models";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { syncDataThunk } from "@store/thunks/sync-data.thunk";

const initialState: Link[] = [];

/**
 * Merges an incoming server page (scoped to one parent_id) into the local cache.
 * Items belonging to a different parent_id are preserved untouched.
 */
function mergeByParentId(local: Link[], incoming: Link[], parentId: string | null): Link[] {
  const incomingMap = new Map(incoming.map((l) => [l.id, l]));
  const kept = local.filter((l) => !incomingMap.has(l.id) && l.parent_id !== parentId);
  return [...incoming, ...kept];
}

const linkSlice = createSlice({
  name: "link",
  initialState,
  reducers: {
    addLink: (state, action: PayloadAction<Link>) => {
      state.push(action.payload);
    },
    addMultipleLinks: (state, action: PayloadAction<Link[]>) => {
      action.payload.forEach((link) => {
        state.push(link);
      });
    },
    replaceLink: (state, action: PayloadAction<Link>) => {
      const index = state.findIndex((link) => link.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    deleteLink: (state, action: PayloadAction<string>) => {
      return state.filter((link) => link.id !== action.payload);
    },
    syncLinks: (state, action: PayloadAction<{ items: Link[]; parentId: string | null }>) => {
      return mergeByParentId(state as Link[], action.payload.items, action.payload.parentId);
    },
  },
  selectors: {
    getAllLinks: (state) => state,
  },
  extraReducers: (builder) => {
    builder.addCase(syncDataThunk.fulfilled, (state, action) => {
      if (!action.payload.links) return state;
      return mergeByParentId(state as Link[], action.payload.links, action.payload.parentId);
    });
  },
});

export const { addLink, addMultipleLinks, replaceLink, deleteLink, syncLinks } =
  linkSlice.actions;
export const { getAllLinks } = linkSlice.selectors;

export default linkSlice.reducer;
