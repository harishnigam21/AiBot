import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  _id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  pic: string | null;
  gender?: string;
  dob?: string;
  email: string;
}

interface stateProps {
  userInfo: User | null;
  loginStatus: "loading" | "unauthenticated" | "authenticated";
}

const initialState: stateProps = {
  userInfo: null,
  loginStatus: "unauthenticated",
};
const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      const data = action.payload;
      state.userInfo = data;
    },
    setLoginStatus: (
      state,
      action: PayloadAction<"loading" | "unauthenticated" | "authenticated">,
    ) => {
      state.loginStatus = action.payload;
    },
  },
});
export const { setUser, setLoginStatus } = UserSlice.actions;
export default UserSlice.reducer;
