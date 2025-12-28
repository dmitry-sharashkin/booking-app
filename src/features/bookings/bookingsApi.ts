// features/bookings/bookingsApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const a = { room_id: "1", booked_by: null };

type Booking = {
  room_id: string;
  booked_by: null;
};
export const bookingsApi = createApi({
  reducerPath: "bookingsApi",
  tagTypes: ["Bookings"],
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    getBookings: builder.query<Booking[], void>({
      query: () => "bookings", // → /api/bookings
      providesTags: ["Bookings"],
    }),
    bookRoom: builder.mutation<void, { room: string; name: string }>({
      query: (body) => ({
        url: "bookings",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Bookings"],
    }),
  }),
});

export const { useGetBookingsQuery, useBookRoomMutation } = bookingsApi;
