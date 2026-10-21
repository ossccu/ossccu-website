export type ProjectCategory = "Web" | "AI/ML" | "IoT/Robotics" | "Tools" | "Mobile";

export type ProjectStatus = "approved" | "pending" | "rejected";

export interface ProjectContributor {
  name: string;
  role: string;
  avatarUrl?: string;
  githubUsername?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  category: ProjectCategory;
  tags: string[];
  author: ProjectContributor;
  githubUrl: string;
  demoUrl?: string;
  featured?: boolean;
  status: ProjectStatus;
  userId?: string;
  userEmail?: string;
  submittedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export type ProjectInput = Omit<Project, "id" | "createdAt" | "updatedAt"> & {
  status?: ProjectStatus;
  submittedAt?: string;
  userId?: string;
  userEmail?: string;
};

export interface GitHubStats {
  stars: number;
  forks: number;
  openIssues?: number;
  language?: string;
  loaded: boolean;
}
