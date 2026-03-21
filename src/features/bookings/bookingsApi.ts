// features/bookings/bookingsApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

type Booking = {
  room_id: string;
  booked_by: string | null;
  /** ISO 8601, только если комната забронирована */
  booked_at: string | null;
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
    clearBooking: builder.mutation<void, { room: string }>({
      query: (body) => ({
        url: "bookings",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Bookings"],
    }),
  }),
});

export const {
  useGetBookingsQuery,
  useBookRoomMutation,
  useClearBookingMutation,
} = bookingsApi;
