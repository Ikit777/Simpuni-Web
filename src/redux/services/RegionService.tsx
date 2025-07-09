import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const RegionService = createApi({
  reducerPath: "RegionService",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/wilayah",
  }),
  endpoints: (builder) => ({
    GetKecamatan: builder.query({
      query: () => ({
        url: "/districts/63.72.json",
        method: "GET",
      }),
    }),
    GetKelurahan: builder.query({
      query: ({ id }) => ({
        url: `/villages/${id}.json`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetKecamatanQuery,
  useLazyGetKecamatanQuery,
  useGetKelurahanQuery,
  useLazyGetKelurahanQuery,
} = RegionService;
