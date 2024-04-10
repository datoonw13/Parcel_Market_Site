import { IFindPropertyAbout, IFindPropertyInfo } from "@/types/property";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IInitialState {
  info: IFindPropertyInfo | null;
  about: IFindPropertyAbout | null;
  selectedParcelNumber: null | string;
}

const initialState: IInitialState = {
  info: null,
  about: null,
  selectedParcelNumber: null,
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
    setSelectedParcelNumber: (state, action: PayloadAction<string | null>) => {
      state.selectedParcelNumber = action.payload;
    },
  },
});

export const { setAbout, setInfo, setSelectedParcelNumber } = findPropertySlice.actions;

export default findPropertySlice.reducer;
