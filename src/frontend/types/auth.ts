export type ExecutiveRole =
  | "Convenor"
  | "Joint Convenor"
  | "Member Secretary"
  | "Joint Member Secretary"
  | "Organizing Secretary"
  | "Assistant Organizing Secretary"
  | null;

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  studentId?: string;
  avatarUrl?: string;
  githubUsername?: string;
  gitlabUsername?: string;
  department?: string;
  batch?: string;
  role: "member" | "admin";
  executiveRole?: ExecutiveRole;
  linkedinUrl?: string;
  codeforcesHandle?: string;
  leetcodeHandle?: string;
  hackerrankHandle?: string;
  codechefHandle?: string;
  portfolioUrl?: string;
  pinnedProjectIds?: string[];
  bookmarkedProjectIds?: string[];
  isAdmin: boolean;
}

export interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAdmin: boolean;
  signInWithOAuth: (provider: "github" | "gitlab") => Promise<void>;
  signInWithGitHub: () => Promise<void>;
  signInWithGitLab: () => Promise<void>;
  signInWithEmail: (email: string, password?: string) => Promise<void>;
  signUpWithEmail: (email: string, name: string, password?: string) => Promise<{ needsOtp: boolean }>;
  verifyEmailOtp: (email: string, token: string) => Promise<boolean>;
  updateUserProfile: (data: Partial<AuthUser>) => Promise<void>;
  toggleBookmark: (projectId: string) => Promise<void>;
  togglePinnedProject: (projectId: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
  signInWithDemo: (role: "contributor" | "admin") => void;
  signOut: () => Promise<void>;
}
