import { NextRequest, NextResponse } from "next/server";
import { userService } from "@/backend/services/userService";
import { fetchGitHubUserProfile } from "@/backend/services/githubService";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const user = await userService.getUserByUsername(username);

    if (!user) {
      return NextResponse.json({ error: "Contributor not found" }, { status: 404 });
    }

    let githubStats = null;
    if (user.githubHandle) {
      githubStats = await fetchGitHubUserProfile(user.githubHandle);
    }

    return NextResponse.json({ ...user, githubStats }, { status: 200 });
  } catch (error) {
    console.error("GET /api/users/[username] error:", error);
    return NextResponse.json({ error: "Failed to fetch user profile" }, { status: 500 });
  }
}
