import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface stateProps {
  login: boolean;
}
const initialState: stateProps = {
  login: false,
};
const PopupSlice = createSlice({
  name: "popup",
  initialState,
  reducers: {
    loginSwitch: (state, action: PayloadAction<boolean>) => {
      state.login = action.payload;
    },
  },
});
export const { loginSwitch } = PopupSlice.actions;
export default PopupSlice.reducer;
