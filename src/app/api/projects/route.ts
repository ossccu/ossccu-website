import { NextRequest, NextResponse } from "next/server";
import { projectService } from "@/backend/services/projectService";
import { validateProjectInput } from "@/backend/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get("all") === "true";
    const userId = searchParams.get("userId");

    if (userId) {
      const userProjects = await projectService.getUserProjects(userId);
      return NextResponse.json(userProjects);
    }

    const data = showAll
      ? await projectService.getProjects()
      : await projectService.getApprovedProjects();

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validateProjectInput(body);

    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const created = await projectService.createProject(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("POST /api/projects error:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
