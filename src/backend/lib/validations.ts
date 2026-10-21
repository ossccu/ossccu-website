import { ProjectInput } from "@/frontend/types/project";
import { CommunityEventInput } from "@/frontend/types/event";

export function validateProjectInput(input: Partial<ProjectInput>): { valid: boolean; error?: string } {
  if (!input.title || input.title.trim().length < 2) {
    return { valid: false, error: "Project title must be at least 2 characters." };
  }
  if (!input.description || input.description.trim().length < 5) {
    return { valid: false, error: "Project description must be at least 5 characters." };
  }
  if (!input.githubUrl || !input.githubUrl.includes("github.com")) {
    return { valid: false, error: "A valid GitHub repository URL is required." };
  }
  if (!input.author?.name || input.author.name.trim().length === 0) {
    return { valid: false, error: "Author name is required." };
  }
  return { valid: true };
}

export function validateEventInput(input: Partial<CommunityEventInput>): { valid: boolean; error?: string } {
  if (!input.title || input.title.trim().length < 2) {
    return { valid: false, error: "Event title must be at least 2 characters." };
  }
  if (!input.date || input.date.trim().length === 0) {
    return { valid: false, error: "Event date is required." };
  }
  return { valid: true };
}
