import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  prepareHeaders: async (headers) => {
    const session = await getSession();
    const token = session?.user.access_token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithLogging: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // console.log('Request:', args);
  const result = await baseQuery(args, api, extraOptions);
  // console.log('Response:', result);
  if ("error" in result) {
    console.error("Error:", result.error);
  }
  return result;
};

export const AuthService = createApi({
  reducerPath: "AuthService",
  baseQuery: baseQueryWithLogging,
  endpoints: (builder) => ({
    Me: builder.query({
      query: () => ({
        url: "/api/me",
        method: "GET",
      }),
    }),
    Login: builder.mutation({
      query: ({ data }) => ({
        url: "/api/login",
        method: "POST",
        body: data,
      }),
    }),
    Logout: builder.mutation({
      query: () => ({
        url: "/api/logout",
        method: "POST",
      }),
    }),
    UpdateProfile: builder.mutation({
      query: ({ data }) => ({
        url: "/api/change_profile",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useMeQuery,
  useLazyMeQuery,
  useLoginMutation,
  useLogoutMutation,
  useUpdateProfileMutation,
} = AuthService;
