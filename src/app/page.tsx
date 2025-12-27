// src/app/page.tsx
"use client";

import { Box, Container, Typography } from "@mui/material";
import { useGetBookingsQuery } from "@/features/bookings/bookingsApi";
import RoomCard from "@/components/RoomCard";

const rooms = Array.from({ length: 10 }, (_, i) => i + 1);

export default function HomePage() {
  const { data: bookings, isLoading, error } = useGetBookingsQuery();

  if (isLoading) return <div className="p-6">Загрузка...</div>;
  if (error) return <div className="p-6 text-red-600">Ошибка загрузки</div>;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Бронирование комнат
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          justifyContent: "center",
        }}
      >
        {rooms.map((_, i) => {
          const roomId = String(i + 1);
          return (
            <Box
              key={roomId}
              sx={{
                flex: "1 1 calc(25% - 18px)", // фиксировано под 4 колонки
                minWidth: 140,
                maxWidth: "calc(25% - 18px)",
              }}
            >
              <RoomCard roomId={roomId} bookedBy={bookings?.[roomId] || null} />
            </Box>
          );
        })}
      </Box>
    </Container>
  );
}
