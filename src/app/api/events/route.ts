import { NextRequest, NextResponse } from "next/server";
import { eventService } from "@/backend/services/eventService";
import { validateEventInput } from "@/backend/lib/validations";

export async function GET() {
  try {
    const data = await eventService.getEvents();
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/events error:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validateEventInput(body);

    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const created = await eventService.createEvent(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("POST /api/events error:", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
