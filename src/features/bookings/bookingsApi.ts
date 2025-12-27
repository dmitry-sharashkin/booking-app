// src/features/bookings/bookingsApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type Booking = string | null;
export type Bookings = Record<string, Booking>;

export const bookingsApi = createApi({
  reducerPath: "bookingsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/bookings" }),
  tagTypes: ["Bookings"],
  endpoints: (builder) => ({
    getBookings: builder.query<Bookings, void>({
      query: () => "",
      providesTags: ["Bookings"],
    }),
    bookRoom: builder.mutation<Bookings, { roomId: string; name: string }>({
      query: ({ roomId, name }) => ({
        url: `/${roomId}`,
        method: "POST",
        body: { name },
      }),
      invalidatesTags: ["Bookings"],
    }),
  }),
});

export const { useGetBookingsQuery, useBookRoomMutation } = bookingsApi;
