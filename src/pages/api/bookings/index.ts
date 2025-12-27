// src/pages/api/bookings/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  try {
    const filePath = path.join(process.cwd(), "src", "data", "bookings.json");
    const data = fs.readFileSync(filePath, "utf8");
    const bookings = JSON.parse(data);
    res.status(200).json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка чтения данных" });
  }
}
