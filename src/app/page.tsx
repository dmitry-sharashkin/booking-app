// src/app/page.tsx
"use client";

import { Grid, Container, Typography } from "@mui/material";
import { useGetBookingsQuery } from "@/features/bookings/bookingsApi";
import RoomCard from "@/components/RoomCard";

export default function HomePage() {
  const { data: bookings, isLoading, error } = useGetBookingsQuery();

  if (isLoading) return <div className="p-6">Загрузка...</div>;
  if (error) return <div className="p-6 text-red-600">Ошибка загрузки</div>;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Бронирование комнат
      </Typography>
      <Grid container spacing={3}>
        {Array.from({ length: 10 }, (_, i) => {
          const roomId = String(i + 1);
          return (
            <Grid item xs={6} sm={4} md={3} key={roomId}>
              <RoomCard roomId={roomId} bookedBy={bookings?.[roomId] || null} />{" "}
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
}
