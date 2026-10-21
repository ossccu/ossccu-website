"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/frontend/contexts/AuthContext";
import { useProjects } from "@/frontend/hooks/useProjects";
import { Project, ProjectInput, ProjectStatus } from "@/frontend/types/project";
import { ProjectFormDialog } from "@/frontend/components/ProjectFormDialog";
import { AuthModal } from "@/frontend/components/AuthModal";
import { Navbar } from "@/frontend/components/Navbar";
import { Button } from "@/frontend/components/ui/button";
import { Badge } from "@/frontend/components/ui/badge";
import { Spinner } from "@/frontend/components/ui/spinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/frontend/components/ui/alert-dialog";
import {
  Sparkles,
  PlusCircle,
  Edit2,
  Trash2,
  Github,
  ExternalLink,
  Code2,
  Clock,
  CheckCircle2,
  XCircle,
  Star,
  User,
  GraduationCap,
  Layers,
  ArrowRight,
  LogIn,
} from "lucide-react";
import { toast } from "sonner";
import { fetchGitHubStats } from "@/backend/services/githubService";

type TabFilter = "all" | "approved" | "pending" | "rejected";

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { projects, isLoading: projectsLoading, addProject, updateProject, deleteProject } = useProjects();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [totalStars, setTotalStars] = useState(0);

  // Filter projects belonging to this user
  const userProjects = useMemo(() => {
    if (!user) return [];
    return projects.filter((p) => {
      if (p.userId && p.userId === user.id) return true;
      if (p.userEmail && p.userEmail.toLowerCase() === user.email.toLowerCase()) return true;
      if (user.githubUsername && p.author.githubUsername?.toLowerCase() === user.githubUsername.toLowerCase()) return true;
      if (p.author.name.toLowerCase() === user.name.toLowerCase()) return true;
      return false;
    });
  }, [projects, user]);

  // Tab filtered projects
  const filteredProjects = useMemo(() => {
    if (activeTab === "all") return userProjects;
    return userProjects.filter((p) => p.status === activeTab);
  }, [userProjects, activeTab]);

  // Counts
  const counts = useMemo(() => {
    const approved = userProjects.filter((p) => p.status === "approved").length;
    const pending = userProjects.filter((p) => p.status === "pending").length;
    const rejected = userProjects.filter((p) => p.status === "rejected").length;
    return { all: userProjects.length, approved, pending, rejected };
  }, [userProjects]);

  // Aggregate stars earned
  useEffect(() => {
    let isMounted = true;
    async function calculateStars() {
      let starsCount = 0;
      for (const p of userProjects) {
        if (p.githubUrl) {
          const stats = await fetchGitHubStats(p.githubUrl);
          if (stats.loaded) {
            starsCount += stats.stars;
          }
        }
      }
      if (isMounted) setTotalStars(starsCount);
    }
    if (userProjects.length > 0) {
      calculateStars();
    }
    return () => {
      isMounted = false;
    };
  }, [userProjects]);

  const handleOpenAdd = () => {
    setEditingProject(null);
    setFormDialogOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project);
    setFormDialogOpen(true);
  };

  const handleFormSubmit = async (data: ProjectInput) => {
    if (editingProject) {
      await updateProject(editingProject.id, data);
    } else {
      await addProject(data);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;
    try {
      setIsDeleting(true);
      await deleteProject(projectToDelete.id);
      toast.success(`Removed "${projectToDelete.title}" from your portfolio.`);
      setProjectToDelete(null);
    } catch {
      toast.error("Failed to delete project.");
    } finally {
      setIsDeleting(false);
    }
  };

  const renderStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] px-2 py-0.5 gap-1">
            <CheckCircle2 size={11} /> Approved & Live
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] px-2 py-0.5 gap-1 animate-pulse">
            <Clock size={11} /> Under Review
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] px-2 py-0.5 gap-1">
            <XCircle size={11} /> Rejected
          </Badge>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-primary-foreground">
      {/* Top Navbar */}
      <Navbar onOpenSubmitModal={handleOpenAdd} />

      <main className="container flex-1 py-10 sm:py-12">
        {authLoading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <Spinner className="size-8 text-primary" />
            <p className="text-sm text-muted-foreground font-mono">Loading contributor profile...</p>
          </div>
        ) : !user ? (
          /* Not Signed In Guard */
          <div className="max-w-md mx-auto my-12 text-center bg-card/80 border border-primary/30 rounded-2xl p-8 backdrop-blur-md shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary mx-auto mb-4 shadow-[0_0_20px_rgba(0,217,255,0.2)]">
              <User size={28} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Sign In to View Portfolio</h2>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Connect your account to access your personal project portfolio, submit new repositories,
              and track community moderation reviews.
            </p>
            <Button
              onClick={() => setAuthModalOpen(true)}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold h-11 neon-button gap-2 text-sm"
            >
              <LogIn size={16} /> Sign In or Register
            </Button>
          </div>
        ) : (
          /* Contributor Portfolio Dashboard */
          <>
            {/* Profile Header Card */}
            <div className="bg-gradient-to-r from-card/90 via-slate-900 to-card/90 border border-primary/30 rounded-2xl p-6 sm:p-8 mb-8 backdrop-blur-md shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                <div className="flex items-center gap-4 sm:gap-6">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-primary/40 shadow-[0_0_20px_rgba(0,217,255,0.25)]"
                    />
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-primary/20 border-2 border-primary/40 flex items-center justify-center text-primary text-2xl font-bold">
                      {user.name.charAt(0)}
                    </div>
                  )}

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                        {user.name}
                      </h1>
                      <Badge className="bg-primary/20 text-primary border border-primary/40 text-[11px] font-semibold">
                        {user.isAdmin ? "Executive Board" : "Community Contributor"}
                      </Badge>
                    </div>

                    <p className="text-xs sm:text-sm text-muted-foreground mb-2 flex items-center gap-2">
                      <GraduationCap size={15} className="text-secondary shrink-0" />
                      <span>{user.batch || "City University"} • {user.department || "Computer Science"}</span>
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-foreground/80 font-mono">
                      <span>{user.email}</span>
                      {user.githubUsername && (
                        <>
                          <span>•</span>
                          <a
                            href={`https://github.com/${user.githubUsername}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-1"
                          >
                            <Github size={13} />
                            <span>@{user.githubUsername}</span>
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <Button
                    onClick={handleOpenAdd}
                    className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90 font-bold h-11 px-5 neon-button gap-2 text-xs sm:text-sm shadow-md shadow-primary/20"
                  >
                    <PlusCircle size={16} /> Submit New Project
                  </Button>
                </div>
              </div>
            </div>

            {/* Metrics Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-card border border-primary/20 p-5 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    My Submissions
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                    {counts.all}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                  <Layers size={20} />
                </div>
              </div>

              <div className="bg-card border border-primary/20 p-5 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    Approved & Live
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1">
                    {counts.approved}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 size={20} />
                </div>
              </div>

              <div className="bg-card border border-primary/20 p-5 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    Pending Review
                  </p>
                  <h3 className={`text-2xl sm:text-3xl font-extrabold mt-1 ${counts.pending > 0 ? "text-amber-400" : "text-white"}`}>
                    {counts.pending}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Clock size={20} />
                </div>
              </div>

              <div className="bg-card border border-primary/20 p-5 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    Stars Earned
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-300 mt-1">
                    {totalStars}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300">
                  <Star size={20} className="fill-amber-300" />
                </div>
              </div>
            </div>

            {/* Status Tabs */}
            <div className="flex items-center justify-between gap-3 mb-6 border-b border-primary/20 pb-3">
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`text-xs sm:text-sm font-semibold px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    activeTab === "all"
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "text-foreground/70 hover:text-white hover:bg-primary/10"
                  }`}
                >
                  <span>All Projects</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-black/20">
                    {counts.all}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("approved")}
                  className={`text-xs sm:text-sm font-semibold px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    activeTab === "approved"
                      ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                      : "text-foreground/70 hover:text-white hover:bg-emerald-500/10"
                  }`}
                >
                  <CheckCircle2 size={13} />
                  <span>Approved ({counts.approved})</span>
                </button>

                <button
                  onClick={() => setActiveTab("pending")}
                  className={`text-xs sm:text-sm font-semibold px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    activeTab === "pending"
                      ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                      : "text-foreground/70 hover:text-white hover:bg-amber-500/10"
                  }`}
                >
                  <Clock size={13} />
                  <span>Pending ({counts.pending})</span>
                </button>

                {counts.rejected > 0 && (
                  <button
                    onClick={() => setActiveTab("rejected")}
                    className={`text-xs sm:text-sm font-semibold px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                      activeTab === "rejected"
                        ? "bg-rose-500 text-white font-bold"
                        : "text-foreground/70 hover:text-white hover:bg-rose-500/10"
                    }`}
                  >
                    <XCircle size={13} />
                    <span>Rejected ({counts.rejected})</span>
                  </button>
                )}
              </div>

              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-primary gap-1 hidden sm:flex"
              >
                <Link href="/#projects">
                  <span>View Public Showcase</span>
                  <ArrowRight size={13} />
                </Link>
              </Button>
            </div>

            {/* Projects Grid */}
            {projectsLoading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3">
                <Spinner className="size-8 text-primary" />
                <p className="text-sm text-muted-foreground font-mono">Loading repositories...</p>
              </div>
            ) : filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-card/85 border border-primary/20 hover:border-primary/60 rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,217,255,0.18)]"
                  >
                    <div>
                      {/* Banner */}
                      <div className="relative w-full h-44 bg-slate-950 overflow-hidden border-b border-primary/15">
                        {project.thumbnailUrl ? (
                          <img
                            src={project.thumbnailUrl}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-primary/40">
                            <Code2 size={40} />
                          </div>
                        )}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                          <Badge
                            variant="outline"
                            className="bg-background/80 backdrop-blur-md border-primary/40 text-primary text-[10px]"
                          >
                            {project.category}
                          </Badge>
                          {renderStatusBadge(project.status)}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">
                          {project.title}
                        </h3>
                        <p className="text-xs text-foreground/75 line-clamp-3 mb-4 leading-relaxed">
                          {project.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {project.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-cyan-300 border border-primary/20 font-mono"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-5 pt-0 border-t border-primary/10 mt-auto">
                      <div className="flex items-center justify-between gap-2 pt-3">
                        <div className="flex items-center gap-1.5">
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="h-8 px-2.5 text-xs border-primary/30 text-primary hover:bg-primary/10 gap-1"
                          >
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Open GitHub"
                            >
                              <Github size={13} />
                              <span>Repo</span>
                            </a>
                          </Button>

                          {project.demoUrl && (
                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="h-8 px-2.5 text-xs border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 gap-1"
                            >
                              <a
                                href={project.demoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Open Live Demo"
                              >
                                <ExternalLink size={13} />
                                <span>Demo</span>
                              </a>
                            </Button>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenEdit(project)}
                            className="h-8 px-2.5 text-xs border-primary/40 text-primary hover:bg-primary/20 gap-1"
                          >
                            <Edit2 size={12} />
                            <span>Edit</span>
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setProjectToDelete(project)}
                            className="h-8 px-2 text-xs border-destructive/40 text-destructive hover:bg-destructive/15"
                            title="Delete project"
                          >
                            <Trash2 size={13} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center bg-card/30 border border-dashed border-primary/30 rounded-2xl p-8 max-w-md mx-auto">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-3">
                  <Sparkles size={22} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">No projects in this view</h3>
                <p className="text-xs text-muted-foreground mb-6">
                  {activeTab === "all"
                    ? "You haven't submitted any repositories yet. Share your open-source projects with the community!"
                    : `No projects found with status "${activeTab}".`}
                </p>
                <Button
                  onClick={handleOpenAdd}
                  className="bg-primary text-primary-foreground font-semibold text-xs gap-1.5"
                >
                  <PlusCircle size={15} /> Submit Your First Project
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Project Form Dialog */}
      <ProjectFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        projectToEdit={editingProject}
        onSubmit={handleFormSubmit}
      />

      {/* Auth Modal */}
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />

      {/* Delete Confirmation Alert */}
      <AlertDialog
        open={!!projectToDelete}
        onOpenChange={(open) => !open && setProjectToDelete(null)}
      >
        <AlertDialogContent className="bg-card border-destructive/40 text-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Remove &quot;{projectToDelete?.title}&quot;?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to remove this project from your portfolio? It will also be
              removed from the public showcase.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isDeleting}
              className="border-primary/30 text-foreground"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Spinner className="size-4" /> Deleting...
                </>
              ) : (
                "Confirm Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
