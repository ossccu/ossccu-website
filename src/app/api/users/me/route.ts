import { NextRequest, NextResponse } from "next/server";
import { userService } from "@/backend/services/userService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, email } = body;
    if (!id && !email) {
      return NextResponse.json({ error: "Missing identity" }, { status: 400 });
    }

    let user = id ? await userService.getUserById(id) : null;
    if (!user && email) {
      user = await userService.getUserByEmail(email);
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("POST /api/users/me error:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) {
      return NextResponse.json({ error: "Missing user id" }, { status: 400 });
    }

    // Safety: enforce that user cannot mutate read-only fields directly via /me
    delete data.role;
    delete data.executiveRole;
    delete data.name;
    delete data.email;
    delete data.studentId;
    delete data.batch;
    delete data.department;

    const updated = await userService.updateUser(id, data);
    return NextResponse.json({ success: true, user: updated }, { status: 200 });
  } catch (error) {
    console.error("PUT /api/users/me error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
