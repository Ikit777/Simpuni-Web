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

export const DocumentService = createApi({
  reducerPath: "DocumentService",
  baseQuery: baseQueryWithLogging,
  endpoints: (builder) => ({
    List: builder.query({
      query: (params) => {
        const url = new URL(
          "/api/admin/archive_files",
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
    Get: builder.query({
      query: ({ slug }) => ({
        url: `/api/admin/archive_files/${slug}`,
        method: "GET",
      }),
    }),
    Add: builder.mutation({
      query: ({ data }) => ({
        url: "/api/admin/archive_files",
        method: "POST",
        body: data,
      }),
    }),
    Update: builder.mutation({
      query: ({ slug, data }) => ({
        url: `/api/admin/archive_files/${slug}`,
        method: "POST",
        body: data,
      }),
    }),
    Delete: builder.mutation({
      query: ({ slug }) => ({
        url: `/api/admin/archive_files/${slug}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useListQuery,
  useLazyListQuery,
  useGetQuery,
  useLazyGetQuery,
  useAddMutation,
  useUpdateMutation,
  useDeleteMutation,
} = DocumentService;
