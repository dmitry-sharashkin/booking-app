// src/app/api/bookings/route.ts
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select("room_id, booked_by");

    if (error) {
      console.error("Supabase GET error:", error);
      return NextResponse.json(
        { error: "Failed to fetch bookings" },
        { status: 500 }
      );
    }

    // Лог для отладки
    console.log("Supabase raw data:", data);

    const allRooms = Array.from({ length: 10 }, (_, i) => {
      const roomId = String(i + 1);
      // Приводим room_id из БД к строке для сравнения
      const booking = data.find((item) => String(item.room_id) === roomId);
      return {
        room_id: roomId,
        booked_by: booking ? booking.booked_by : null,
      };
    });

    return NextResponse.json(allRooms);
  } catch (err) {
    console.error("Unexpected error in GET /api/bookings:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
export async function POST(request: NextRequest) {
  try {
    const { room, name } = await request.json();

    if (
      !room ||
      !name ||
      typeof room !== "string" ||
      typeof name !== "string"
    ) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    if (!/^[1-9]|10$/.test(room)) {
      return NextResponse.json({ error: "Room must be 1–10" }, { status: 400 });
    }

    const { error } = await supabase
      .from("bookings")
      .upsert(
        { room_id: room, booked_by: name.trim() },
        { onConflict: "room_id" }
      );

    if (error) {
      console.error("Supabase POST error:", error);
      return NextResponse.json(
        { error: "Failed to book room" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Unexpected error in POST /api/bookings:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
