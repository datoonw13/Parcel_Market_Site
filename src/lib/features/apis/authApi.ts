import baseApi from "./baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    test: build.query<any, void>({
      query: (arg) => ({
        url: "auth/sign-in",
        method: "GET",
        body: arg,
      }),
    }),
  }),
});

export const { useTestQuery } = authApi;
export default authApi;
