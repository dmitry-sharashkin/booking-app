// src/app/api/bookings/route.ts
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getSupabaseClient() {
  const supabaseUrl =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey);
}

export async function GET() {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      console.error(
        "Supabase env vars are missing: SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
      );
      return NextResponse.json(
        { error: "Server misconfiguration: Supabase env vars are missing" },
        { status: 500 }
      );
    }

    const { data, error } = await supabase
      .from("bookings")
      .select("room_id, booked_by, booked_at");

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
      const bookedBy = booking ? booking.booked_by : null;
      return {
        room_id: roomId,
        booked_by: bookedBy,
        booked_at:
          bookedBy && booking?.booked_at != null
            ? booking.booked_at
            : null,
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
    const supabase = getSupabaseClient();
    if (!supabase) {
      console.error(
        "Supabase env vars are missing: SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
      );
      return NextResponse.json(
        { error: "Server misconfiguration: Supabase env vars are missing" },
        { status: 500 }
      );
    }

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
        {
          room_id: room,
          booked_by: name.trim(),
          booked_at: new Date().toISOString(),
        },
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

export async function PATCH(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      console.error(
        "Supabase env vars are missing: SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
      );
      return NextResponse.json(
        { error: "Server misconfiguration: Supabase env vars are missing" },
        { status: 500 }
      );
    }

    const { room } = await request.json();

    if (!room || typeof room !== "string") {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    if (!/^(?:[1-9]|10)$/.test(room)) {
      return NextResponse.json({ error: "Room must be 1-10" }, { status: 400 });
    }

    // We keep room records and only clear assignee.
    const { error } = await supabase
      .from("bookings")
      .upsert(
        { room_id: room, booked_by: null, booked_at: null },
        { onConflict: "room_id" }
      );

    if (error) {
      console.error("Supabase PATCH error:", error);
      return NextResponse.json(
        { error: "Failed to unbook room" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Unexpected error in PATCH /api/bookings:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
