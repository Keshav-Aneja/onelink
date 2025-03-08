import { createSlice } from "@reduxjs/toolkit";

interface IApplicationConfig {
  redirectTo: string;
}

const initialState: IApplicationConfig = {
  redirectTo: "",
};

export const applicationSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setRedirectPath: (state, action: { payload: string }) => {
      state.redirectTo = action.payload;
    },
  },
  selectors: {
    getRedirectPath: (state) => state.redirectTo,
  },
});

export const { setRedirectPath } = applicationSlice.actions;
export const { getRedirectPath } = applicationSlice.selectors;
export default applicationSlice.reducer;
