import { Middleware, MiddlewareAPI } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import toast from "react-hot-toast";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:4000/api/",
  prepareHeaders: async (headers) => {
    headers.set("authorization", `Bearer ${localStorage.getItem("token")}`);

    return headers;
  },
  credentials: "include",
});

export const rtkQueryErrorLogger: Middleware = (_api: MiddlewareAPI) => (next) => (action: any) => {
  if (action.type.includes("rejected") && action?.meta?.arg?.endpointName !== "getRegrid") {
    let errorMessage = "Something went wrong";
    if (typeof action?.payload?.data?.message === "string") {
      errorMessage = action?.payload?.data?.message;
    }
    if (typeof action?.payload?.data?.message === "object") {
      errorMessage = action?.payload?.data?.message[0];
    }
    toast.error(errorMessage);
  }

  return next(action);
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery,
  endpoints: () => ({}),
});

export default baseApi;
