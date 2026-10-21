export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  githubUsername?: string;
  department?: string;
  batch?: string;
  isAdmin: boolean;
}

export interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAdmin: boolean;
  signInWithGitHub: () => Promise<void>;
  signInWithEmail: (email: string, password?: string) => Promise<void>;
  signUpWithEmail: (email: string, name: string, password?: string) => Promise<void>;
  signInWithDemo: (role: "contributor" | "admin") => void;
  signOut: () => Promise<void>;
}
