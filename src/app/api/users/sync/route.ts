import { NextRequest, NextResponse } from "next/server";
import { userService } from "@/backend/services/userService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.id || !body.email) {
      return NextResponse.json({ error: "Missing required user fields" }, { status: 400 });
    }

    const synced = await userService.syncUser({
      id: body.id,
      email: body.email,
      name: body.name || body.email.split("@")[0],
      avatar_url: body.avatar_url,
      github_handle: body.github_handle,
      role: body.role,
      department: body.department,
      batch: body.batch,
    });

    return NextResponse.json(synced, { status: 200 });
  } catch (error) {
    console.error("POST /api/users/sync error:", error);
    return NextResponse.json({ error: "Failed to sync user" }, { status: 500 });
  }
}
