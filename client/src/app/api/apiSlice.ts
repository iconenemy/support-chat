import {
  BaseQueryFn,
  fetchBaseQuery,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
} from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";

import { logout, tokenReceived } from "../../features/auth/authSlice";
import { IRefreshTokensRes } from "../../features/auth/auth.type";
import { RootState, persistor } from "../store";

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5000/api",
  credentials: "include",
  prepareHeaders: (headers: Headers, { getState }) => {
    const accessToken = (getState() as RootState).persistedReducer.auth.tokens.access_token;
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return headers;
  },
});

const baseQueryWithRefresh: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // wait until the mutex is available without locking it
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    // checking whether the mutex is locked
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshResult = await baseQuery(
          "auth/refresh",
          api,
          extraOptions
        );
        const tokens = refreshResult.data as IRefreshTokensRes;

        if (tokens) {
          api.dispatch(tokenReceived(tokens));
          // retry the initial query
          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(logout())
          persistor.purge();
        }
      } finally {
        // release must be called once the mutex should be released again.
        release();
      }
    } else {
      // wait until the mutex is available without locking it
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithRefresh,
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    refresh: builder.query<IRefreshTokensRes, void>({
      query: () => ({url: "auth/refresh"}),
    })
  }),
});

export const { useRefreshQuery } = apiSlice;