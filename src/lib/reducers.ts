import { combineReducers } from "redux";
import baseApi from "./features/apis/baseApi";
import findProperty from "./features/slices/findPropertySlice";

export default combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  findProperty,
});
