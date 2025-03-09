import { createSlice } from "@reduxjs/toolkit";

interface IApplicationConfig {
  redirectTo: string;
  parent_id: string | null;
}

const initialState: IApplicationConfig = {
  redirectTo: "",
  parent_id: null,
};

export const applicationSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setParentId: (state, action: { payload: string | null }) => {
      state.parent_id = action.payload;
    },
  },
  selectors: {
    getParentId: (state) => state.parent_id,
  },
});

export const { setParentId } = applicationSlice.actions;
export const { getParentId } = applicationSlice.selectors;
export default applicationSlice.reducer;
