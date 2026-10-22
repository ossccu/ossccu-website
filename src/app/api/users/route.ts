import { NextRequest, NextResponse } from "next/server";
import { userService } from "@/backend/services/userService";

export async function GET() {
  try {
    const list = await userService.getUsers();
    return NextResponse.json(list, { status: 200 });
  } catch (error) {
    console.error("GET /api/users error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, ...updates } = body;
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const updated = await userService.updateUser(userId, updates);
    return NextResponse.json({ success: true, user: updated }, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/users error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
