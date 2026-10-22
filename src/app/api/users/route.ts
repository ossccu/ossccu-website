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
    const { userId, role } = body;
    if (!userId || !role || (role !== "student" && role !== "admin")) {
      return NextResponse.json({ error: "Invalid role payload" }, { status: 400 });
    }

    const success = await userService.toggleRole(userId, role);
    return NextResponse.json({ success, userId, role }, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/users error:", error);
    return NextResponse.json({ error: "Failed to update user role" }, { status: 500 });
  }
}
