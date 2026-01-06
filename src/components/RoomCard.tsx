// src/components/RoomCard.tsx
"use client";

import { useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
} from "@mui/material";
import { useBookRoomMutation } from "@/features/bookings/bookingsApi";
import PixelCharacter from "./PixelCharacter";

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
      <Box
        sx={{
          height: 120,
          width: {
            md: "calc(50% - 12px)",
            sm: "100%",
            xs: "100%",
            xxs: "100%",
          },
          cursor: bookedBy ? "default" : "pointer",
          bgcolor: bookedBy ? "#f0f0f0" : "#ffffff",
          "&:hover": !bookedBy ? { bgcolor: "#f9f9f9" } : {},
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          padding: 2,
          border: "1px solid #e0e0e0",
        }}
        onClick={handleOpen}
      >
        <Box>
          <Typography variant="h6" fontWeight={"600"}>
            Стейдж {roomId}
          </Typography>
          {bookedBy ? (
            <Typography color="primary" fontWeight="bold">
              Забронирован: {bookedBy}
            </Typography>
          ) : (
            <Typography color="text.secondary">Свободен</Typography>
          )}
        </Box>
        {bookedBy && <PixelCharacter size={80} name={bookedBy} />}
      </Box>

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
