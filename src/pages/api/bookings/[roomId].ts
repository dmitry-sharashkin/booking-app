// src/pages/api/bookings/[roomId].ts
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { roomId } = req.query;
  const { name } = req.body;

  if (!roomId || typeof roomId !== "string" || !/^[1-9]|10$/.test(roomId)) {
    return res.status(400).json({ error: "Неверный номер комнаты (1–10)" });
  }

  if (!name || typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({ error: "Имя обязательно" });
  }

  try {
    const filePath = path.join(process.cwd(), "src", "data", "bookings.json");
    const rawData = fs.readFileSync(filePath, "utf8");
    const bookings = JSON.parse(rawData);

    if (bookings[roomId] !== null) {
      return res.status(409).json({ error: "Комната уже забронирована" });
    }

    bookings[roomId] = name.trim();

    fs.writeFileSync(filePath, JSON.stringify(bookings, null, 2));

    res.status(200).json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка записи" });
  }
}
