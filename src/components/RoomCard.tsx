// src/components/RoomCard.tsx
"use client";

import { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import { useBookRoomMutation } from "@/features/bookings/bookingsApi";

type RoomCardProps = {
  roomId: string;
  bookedBy: string | null;
};

export default function RoomCard({ roomId, bookedBy }: RoomCardProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [bookRoom, { isLoading }] = useBookRoomMutation();

  const handleOpen = () => {
    if (!open) setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setName("");
    setError("");
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Укажите имя");
      return;
    }
    try {
      await bookRoom({ room: roomId, name }).unwrap();
      handleClose();
    } catch (err) {
      setError("Не удалось забронировать комнату");
    }
  };

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          height: 120,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          cursor: bookedBy ? "default" : "pointer",
          bgcolor: bookedBy ? "#f0f0f0" : "#ffffff",
          "&:hover": !bookedBy ? { bgcolor: "#f9f9f9" } : {},
        }}
        onClick={handleOpen}
      >
        <CardContent sx={{ p: 1, textAlign: "center" }}>
          <Typography variant="h6">Стейдж {roomId}</Typography>
          {bookedBy ? (
            <Typography color="primary" fontWeight="bold">
              Забронирована: {bookedBy}
            </Typography>
          ) : (
            <Typography color="text.secondary">Свободна</Typography>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          Бронирование комнаты {roomId} <br />
        </DialogTitle>
        {bookedBy && (
          <DialogContent>
            <b>Внимание стейдж уже забронирован пользователем: {bookedBy}</b>{" "}
            <br />
            Вы уверенны, что хотите забронировать этот стейдж?
          </DialogContent>
        )}
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Ваше имя"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!error}
            helperText={error}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Отмена</Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "..." : "Забронировать"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
