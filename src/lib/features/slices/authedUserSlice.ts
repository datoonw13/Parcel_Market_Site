import { UserModel } from "@/types/auth";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import authApi from "../apis/authApi";

interface IInitialState {
  user: UserModel | null;
  pending: boolean;
  token: string | null;
  redirectUrl: string;
}

const initialState: IInitialState = {
  user: null,
  pending: true,
  token: null,
  redirectUrl: "",
};

export const authedUserSlice = createSlice({
  name: "authedUser",
  initialState,
  reducers: {
    setAuthedUser: (state, action: PayloadAction<UserModel | null>) => {
      state.user = action.payload;
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
    setAuthPending: (state, action: PayloadAction<boolean>) => {
      state.pending = action.payload;
    },
    logOut: () => {
      localStorage.removeItem("token");
      return { ...initialState, pending: false };
    },
    setRedirectUrl: (state, action: PayloadAction<string>) => {
      state.redirectUrl = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(authApi.endpoints.auth.matchFulfilled, (state) => {
      state.pending = true;
    });
  },
});

export const { setAuthPending, setAuthedUser, setToken, logOut, setRedirectUrl } = authedUserSlice.actions;

export default authedUserSlice.reducer;
