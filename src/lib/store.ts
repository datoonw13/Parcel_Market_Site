import { configureStore } from "@reduxjs/toolkit";
import reducer from "./reducers";
import baseApi, { rtkQueryErrorLogger } from "./features/apis/baseApi";

export const makeStore = () =>
  configureStore({
    reducer,
    middleware: (gdm) => gdm({ serializableCheck: false }).concat(baseApi.middleware).concat(rtkQueryErrorLogger),
  });

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
