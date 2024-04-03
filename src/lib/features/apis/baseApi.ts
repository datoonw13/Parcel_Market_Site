import { Middleware, MiddlewareAPI } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.REACT_APP_API}/api/v1/`,
  prepareHeaders: async (headers) => {
    headers.set("authorization", `Bearer ${localStorage.getItem("token")}`);

    return headers;
  },
});

export const rtkQueryErrorLogger: Middleware = (_api: MiddlewareAPI) => (next) => (action) => next(action);

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery,
  endpoints: () => ({}),
});

export default baseApi;
