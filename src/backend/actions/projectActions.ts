"use server";

import { projectService } from "@/backend/services/projectService";
import { ProjectInput } from "@/frontend/types/project";

export async function fetchProjectsAction(showAll = false) {
  return showAll ? await projectService.getProjects() : await projectService.getApprovedProjects();
}

export async function createProjectAction(input: ProjectInput) {
  return await projectService.createProject(input);
}

export async function updateProjectAction(id: string, updates: Partial<ProjectInput>) {
  return await projectService.updateProject(id, updates);
}

export async function deleteProjectAction(id: string) {
  return await projectService.deleteProject(id);
}
