import { combineReducers } from "redux";
import baseApi from "./features/apis/baseApi";
import findProperty from "./features/slices/findPropertySlice";
import authedUser from "./features/slices/authedUserSlice";

export default combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  findProperty,
  authedUser,
});
