import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SelectionState {
  selectedIds: string[];
  anchorId: string | null;
}

const initialState: SelectionState = {
  selectedIds: [],
  anchorId: null,
};

const selectionSlice = createSlice({
  name: "selection",
  initialState,
  reducers: {
    toggleSelection: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const idx = state.selectedIds.indexOf(id);
      if (idx === -1) {
        state.selectedIds.push(id);
      } else {
        state.selectedIds.splice(idx, 1);
      }
      state.anchorId = id;
    },
    setRangeSelection: (
      state,
      action: PayloadAction<{ ids: string[]; anchorId: string }>,
    ) => {
      const { ids, anchorId } = action.payload;
      // Merge range into existing selection without duplicates
      const set = new Set(state.selectedIds);
      ids.forEach((id) => set.add(id));
      state.selectedIds = Array.from(set);
      state.anchorId = anchorId;
    },
    selectAll: (state, action: PayloadAction<string[]>) => {
      state.selectedIds = action.payload;
      state.anchorId = null;
    },
    clearSelection: (state) => {
      state.selectedIds = [];
      state.anchorId = null;
    },
    removeFromSelection: (state, action: PayloadAction<string[]>) => {
      const toRemove = new Set(action.payload);
      state.selectedIds = state.selectedIds.filter((id) => !toRemove.has(id));
    },
  },
  selectors: {
    getSelectedIds: (state) => state.selectedIds,
    getAnchorId: (state) => state.anchorId,
    getSelectionCount: (state) => state.selectedIds.length,
  },
});

export const {
  toggleSelection,
  setRangeSelection,
  selectAll,
  clearSelection,
  removeFromSelection,
} = selectionSlice.actions;

export const { getSelectedIds, getAnchorId, getSelectionCount } =
  selectionSlice.selectors;

export default selectionSlice.reducer;
