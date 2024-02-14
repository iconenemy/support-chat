import { apiSlice } from "../../app/api/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    logout: builder.mutation<void, void>({
      query: () => ({ url: "auth/logout" }),
    }),
  }),
});

export const { useLogoutMutation } = authApiSlice;
