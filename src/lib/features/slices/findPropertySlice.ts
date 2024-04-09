import { IFindPropertyAbout, IFindPropertyInfo } from "@/types/property";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IInitialState {
  info: IFindPropertyInfo | null;
  about: IFindPropertyAbout | null;
}

const initialState: IInitialState = {
  info: null,
  about: null,
};

export const findPropertySlice = createSlice({
  name: "findProperty",
  initialState,
  reducers: {
    setInfo: (state, action: PayloadAction<IInitialState["info"]>) => {
      state.info = action.payload;
    },
    setAbout: (state, action: PayloadAction<IInitialState["about"]>) => {
      state.about = action.payload;
    },
  },
});

export const { setAbout, setInfo } = findPropertySlice.actions;

export default findPropertySlice.reducer;
