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
import {
  useBookRoomMutation,
  useClearBookingMutation,
} from "@/features/bookings/bookingsApi";
import PixelCharacter from "./PixelCharacter";

const DAY_MS = 24 * 60 * 60 * 1000;

/** Если с момента брони прошло < 24 ч — только часы:минуты, иначе дата + время */
function formatBookedAt(bookedAt: string | null): string {
  if (!bookedAt) return "";
  const d = new Date(bookedAt);
  if (Number.isNaN(d.getTime())) return bookedAt;

  const elapsed = Date.now() - d.getTime();
  if (elapsed >= 0 && elapsed < DAY_MS) {
    return new Intl.DateTimeFormat("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  }

  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

type RoomCardProps = {
  roomId: string;
  bookedBy: string | null;
  bookedAt: string | null;
};

export default function RoomCard({
  roomId,
  bookedBy,
  bookedAt,
}: RoomCardProps) {
  const bookedAtLabel = formatBookedAt(bookedAt);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [bookRoom, { isLoading }] = useBookRoomMutation();
  const [clearBooking, { isLoading: isClearingBooking }] =
    useClearBookingMutation();

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

  const handleClearBooking = async () => {
    try {
      await clearBooking({ room: roomId }).unwrap();
      handleClose();
    } catch (err) {
      setError("Не удалось снять бронь");
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
              {bookedAtLabel ? ` с ${bookedAtLabel}` : ""}
            </Typography>
          ) : (
            <Typography color="text.secondary">Свободен</Typography>
          )}
        </Box>
        {bookedBy && <PixelCharacter size={80} name={bookedBy} />}
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            Бронирование комнаты {roomId} <br />
          </Box>

          {bookedBy && (
            <Button
              variant="outlined"
              onClick={handleClearBooking}
              disabled={isClearingBooking}
              color="error"
            >
              {isClearingBooking ? "..." : "Разбронировать"}
            </Button>
          )}
        </DialogTitle>

        {bookedBy && (
          <DialogContent>
            <b>
              Внимание стейдж уже забронирован пользователем: {bookedBy}
              {bookedAtLabel ? ` с ${bookedAtLabel}` : ""}
            </b>{" "}
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
