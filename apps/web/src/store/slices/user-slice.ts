import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  id: string;
  name: string;
  profile_url: string;
  email: string;
}

const initialState: UserState = {
  id: "",
  name: "",
  profile_url: "",
  email: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action: { payload: UserState }) => {
      const userData = action.payload;
      state.id = userData.id;
      state.name = userData.name;
      state.profile_url = userData.profile_url;
      state.email = userData.email;
    },
    resetUser: (state) => {
      state.id = "";
      state.name = "";
      state.email = "";
      state.profile_url = "";
    },
    setUserId: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
    },
    setUserName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
  },
  selectors: {
    selectUser: (state) => state,
    selectUserId: (state) => state.id,
  },
});

export const { addUser, resetUser, setUserId, setUserName } = userSlice.actions;
export const { selectUser, selectUserId } = userSlice.selectors;

export default userSlice.reducer;
