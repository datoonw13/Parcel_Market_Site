import { combineReducers } from "redux";
import baseApi from "./features/apis/baseApi";

export default combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
});
