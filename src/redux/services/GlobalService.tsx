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

export const GlobalService = createApi({
  reducerPath: "GlobalService",
  baseQuery: baseQueryWithLogging,
  endpoints: (builder) => ({
    CountEveryState: builder.query({
      query: (params) => {
        const url = new URL(
          "/api/admin/denunciations/count/every_state_by_month_year",
          process.env.NEXT_PUBLIC_API_URL
        );

        if (Object.keys(params).length > 0) {
          Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, String(value));
          });
        }

        return {
          url: url.toString(),
          method: "GET",
        };
      },
    }),
    CountDone: builder.query({
      query: (params) => {
        const url = new URL(
          "/api/admin/denunciations/count/done_by_year",
          process.env.NEXT_PUBLIC_API_URL
        );

        if (Object.keys(params).length > 0) {
          Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, String(value));
          });
        }

        return {
          url: url.toString(),
          method: "GET",
        };
      },
    }),
    CountBuildingPermit: builder.query({
      query: () => ({
        url: "/api/admin/buildings/count/building_permit",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCountEveryStateQuery,
  useLazyCountEveryStateQuery,
  useCountDoneQuery,
  useLazyCountDoneQuery,
  useCountBuildingPermitQuery,
  useLazyCountBuildingPermitQuery,
} = GlobalService;
