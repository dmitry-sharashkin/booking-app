// src/app/page.tsx
"use client";

import { Box, Container, Typography } from "@mui/material";
import { useGetBookingsQuery } from "@/features/bookings/bookingsApi";
import RoomCard from "@/components/RoomCard";

export default function HomePage() {
  const { data: bookings, isLoading, error } = useGetBookingsQuery();

  if (isLoading) return <div className="p-6">Загрузка...</div>;
  if (error) return <div className="p-6 text-red-600">Ошибка загрузки</div>;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Бронирование стейджей
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          justifyContent: "center",
        }}
      >
        {bookings &&
          bookings.map((it) => {
            return (
              <RoomCard
                roomId={it.room_id}
                bookedBy={it.booked_by}
                key={it.room_id}
              />
            );
          })}
      </Box>
    </Container>
  );
}
