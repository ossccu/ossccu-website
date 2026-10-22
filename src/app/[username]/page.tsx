"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/frontend/components/Navbar";
import { Footer } from "@/frontend/components/Footer";
import { ProjectCard } from "@/frontend/components/ProjectCard";
import { useAuth } from "@/frontend/contexts/AuthContext";
import { Project } from "@/frontend/types/project";
import { Badge } from "@/frontend/components/ui/badge";
import { Button } from "@/frontend/components/ui/button";
import { Spinner } from "@/frontend/components/ui/spinner";
import {
  Github,
  Globe,
  Linkedin,
  ShieldCheck,
  Award,
  BookOpen,
  GraduationCap,
  Mail,
  User,
  ExternalLink,
  Code2,
  Pin,
  Share2,
  Check,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

export default function ContributorProfilePage() {
  const params = useParams();
  const username = params?.username as string;
  const { user: currentUser } = useAuth();

  const [profile, setProfile] = useState<any | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (!username) return;

    async function loadProfileAndProjects() {
      try {
        setIsLoading(true);
        // 1. Fetch user profile
        const userRes = await fetch(`/api/users/${username}`);
        if (!userRes.ok) {
          setProfile(null);
          setIsLoading(false);
          return;
        }
        const userData = await userRes.json();
        setProfile(userData);

        // 2. Fetch projects
        const projRes = await fetch("/api/projects");
        if (projRes.ok) {
          const allProjects: Project[] = await projRes.json();
          const userProjects = allProjects.filter((p) => {
            if (p.userId && p.userId === userData.id) return true;
            if (p.userEmail && userData.email && p.userEmail.toLowerCase() === userData.email.toLowerCase()) return true;
            if (
              p.author?.githubUsername &&
              userData.githubHandle &&
              p.author.githubUsername.toLowerCase() === userData.githubHandle.toLowerCase()
            ) {
              return true;
            }
            if (
              p.author?.name &&
              userData.name &&
              p.author.name.toLowerCase() === userData.name.toLowerCase()
            ) {
              return true;
            }
            return false;
          });
          setProjects(userProjects);
        }
      } catch (err) {
        console.error("Profile load error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadProfileAndProjects();
  }, [username]);

  const handleShare = async () => {
    if (typeof window !== "undefined") {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        toast.success("Profile link copied to clipboard!");
        setTimeout(() => setCopiedLink(false), 2000);
      } catch {
        toast.error("Failed to copy link.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <Spinner className="size-8 text-primary" />
          <p className="text-sm font-mono text-muted-foreground">Loading contributor profile...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary mx-auto mb-4">
            <User size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Contributor Profile Not Found</h1>
          <p className="text-sm text-muted-foreground max-w-md mb-6">
            We couldn&apos;t find an active open-source contributor profile matching &quot;{username}&quot;.
          </p>
          <Button asChild className="bg-primary text-primary-foreground font-semibold text-xs">
            <Link href="/projects">Explore Community Projects</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const isOwnProfile =
    currentUser &&
    (currentUser.id === profile.id ||
      currentUser.email?.toLowerCase() === profile.email?.toLowerCase() ||
      (currentUser.githubUsername && currentUser.githubUsername.toLowerCase() === username.toLowerCase()));

  // Pinned projects
  const pinnedIds: string[] = profile.pinnedProjectIds || [];
  const pinnedProjects = projects.filter((p) => pinnedIds.includes(p.id));
  const otherProjects = projects.filter((p) => !pinnedIds.includes(p.id));

  const ghStats = profile.githubStats;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-primary selection:text-primary-foreground">
      <Navbar />

      <main className="flex-1 container py-8 sm:py-12">
        {/* Profile Header Banner */}
        <div className="relative bg-card/80 border border-primary/25 rounded-2xl p-6 sm:p-8 backdrop-blur-xl mb-8 overflow-hidden shadow-2xl">
          {/* Subtle Cyber Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-primary/15 rounded-full blur-[100px] pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="relative">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-900 border-2 border-primary/50 overflow-hidden shadow-[0_0_25px_rgba(0,217,255,0.25)] shrink-0">
                  <img
                    src={profile.avatarUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${profile.email}`}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {profile.role === "admin" && (
                  <div
                    className="absolute -bottom-1 -right-1 bg-primary text-slate-950 p-1.5 rounded-lg shadow-md border border-black/40"
                    title="Platform Administrator"
                  >
                    <ShieldCheck size={14} className="stroke-[2.5]" />
                  </div>
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {profile.name}
                  </h1>

                  {/* Verification Badges */}
                  {profile.role === "admin" ? (
                    <Badge className="bg-primary/20 text-primary border border-primary/50 text-xs px-2.5 py-0.5 font-bold shadow-[0_0_15px_rgba(0,217,255,0.3)]">
                      <ShieldCheck size={12} className="mr-1 inline" /> Admin
                    </Badge>
                  ) : (
                    <Badge className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 text-xs px-2.5 py-0.5 font-bold">
                      Verified Member
                    </Badge>
                  )}

                  {/* Executive Role Badge */}
                  {profile.executiveRole && (
                    <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/50 text-xs px-2.5 py-0.5 font-bold shadow-[0_0_20px_rgba(245,158,11,0.25)] flex items-center gap-1">
                      <Award size={12} className="text-amber-400" />
                      {profile.executiveRole}
                    </Badge>
                  )}
                </div>

                <p className="text-sm text-foreground/80 font-mono mb-2">
                  {profile.githubHandle ? `@${profile.githubHandle}` : profile.email}
                </p>

                {ghStats?.bio && (
                  <p className="text-xs text-muted-foreground max-w-xl line-clamp-2">
                    {ghStats.bio}
                  </p>
                )}
              </div>
            </div>

            {/* Profile Action Buttons */}
            <div className="flex items-center gap-2.5 self-start md:self-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="border-primary/30 text-xs gap-1.5 h-9"
              >
                {copiedLink ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
                <span>{copiedLink ? "Copied" : "Share"}</span>
              </Button>

              {isOwnProfile && (
                <Button asChild size="sm" className="bg-primary text-primary-foreground font-bold text-xs h-9">
                  <Link href="/dashboard">Edit Profile</Link>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Credentials, Handles, Live GitHub Stats */}
          <div className="space-y-6">
            {/* 1. University Credentials Card */}
            <div className="bg-card/75 border border-primary/20 rounded-xl p-5 backdrop-blur-md">
              <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-2 mb-4">
                <GraduationCap size={15} className="text-primary" />
                <span>University Credentials</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-muted-foreground block text-[11px] mb-0.5">Student ID</span>
                  <span className="font-mono text-cyan-300 font-bold bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                    {profile.studentId || "Verified Student"}
                  </span>
                </div>

                <div>
                  <span className="text-muted-foreground block text-[11px] mb-0.5">Department</span>
                  <span className="text-white font-medium">
                    {profile.department || "Dept. of Computer Science & Engineering"}
                  </span>
                </div>

                <div>
                  <span className="text-muted-foreground block text-[11px] mb-0.5">Batch</span>
                  <span className="text-slate-300 font-medium">
                    {profile.batch || "City University"}
                  </span>
                </div>

                <div>
                  <span className="text-muted-foreground block text-[11px] mb-0.5">Institutional Email</span>
                  <span className="text-slate-300 font-mono text-[11px] flex items-center gap-1">
                    <Mail size={12} className="text-primary" /> {profile.email}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Coding Handles & Socials */}
            <div className="bg-card/75 border border-primary/20 rounded-xl p-5 backdrop-blur-md">
              <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-2 mb-4">
                <Code2 size={15} className="text-primary" />
                <span>Profiles & Competitive Handles</span>
              </h3>

              <div className="space-y-2 text-xs">
                {profile.githubHandle && (
                  <a
                    href={`https://github.com/${profile.githubHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 rounded-lg bg-background/60 hover:bg-primary/10 border border-primary/20 transition-all text-slate-200 hover:text-white"
                  >
                    <span className="flex items-center gap-2">
                      <Github size={14} className="text-primary" />
                      <span>GitHub</span>
                    </span>
                    <span className="font-mono text-[11px] text-cyan-400">@{profile.githubHandle}</span>
                  </a>
                )}

                {profile.gitlabHandle && (
                  <a
                    href={`https://gitlab.com/${profile.gitlabHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 rounded-lg bg-background/60 hover:bg-primary/10 border border-primary/20 transition-all text-slate-200 hover:text-white"
                  >
                    <span className="flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 fill-[#FC6D26]" viewBox="0 0 24 24">
                        <path d="m23.6 9.57-1.12-3.45a1.1 1.1 0 0 0-2.1 0L19.26 9.6H4.74L3.62 6.12a1.1 1.1 0 0 0-2.1 0L.4 9.57a1.32 1.32 0 0 0 .48 1.48L12 19.38l11.12-8.33a1.32 1.32 0 0 0 .48-1.48Z" />
                      </svg>
                      <span>GitLab</span>
                    </span>
                    <span className="font-mono text-[11px] text-amber-400">@{profile.gitlabHandle}</span>
                  </a>
                )}

                {profile.linkedinUrl && (
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 rounded-lg bg-background/60 hover:bg-primary/10 border border-primary/20 transition-all text-slate-200 hover:text-white"
                  >
                    <span className="flex items-center gap-2">
                      <Linkedin size={14} className="text-blue-400" />
                      <span>LinkedIn</span>
                    </span>
                    <ExternalLink size={12} className="text-muted-foreground" />
                  </a>
                )}

                {profile.codeforcesHandle && (
                  <a
                    href={`https://codeforces.com/profile/${profile.codeforcesHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 rounded-lg bg-background/60 hover:bg-primary/10 border border-primary/20 transition-all text-slate-200 hover:text-white"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                      <span>Codeforces</span>
                    </span>
                    <span className="font-mono text-[11px] text-rose-300">@{profile.codeforcesHandle}</span>
                  </a>
                )}

                {profile.leetcodeHandle && (
                  <a
                    href={`https://leetcode.com/${profile.leetcodeHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 rounded-lg bg-background/60 hover:bg-primary/10 border border-primary/20 transition-all text-slate-200 hover:text-white"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                      <span>LeetCode</span>
                    </span>
                    <span className="font-mono text-[11px] text-amber-300">@{profile.leetcodeHandle}</span>
                  </a>
                )}

                {profile.hackerrankHandle && (
                  <a
                    href={`https://www.hackerrank.com/${profile.hackerrankHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 rounded-lg bg-background/60 hover:bg-primary/10 border border-primary/20 transition-all text-slate-200 hover:text-white"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                      <span>HackerRank</span>
                    </span>
                    <span className="font-mono text-[11px] text-emerald-300">@{profile.hackerrankHandle}</span>
                  </a>
                )}

                {profile.codechefHandle && (
                  <a
                    href={`https://www.codechef.com/users/${profile.codechefHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 rounded-lg bg-background/60 hover:bg-primary/10 border border-primary/20 transition-all text-slate-200 hover:text-white"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-amber-700 inline-block" />
                      <span>CodeChef</span>
                    </span>
                    <span className="font-mono text-[11px] text-amber-200">@{profile.codechefHandle}</span>
                  </a>
                )}

                {profile.portfolioUrl && (
                  <a
                    href={profile.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 rounded-lg bg-background/60 hover:bg-primary/10 border border-primary/20 transition-all text-slate-200 hover:text-white"
                  >
                    <span className="flex items-center gap-2">
                      <Globe size={14} className="text-cyan-400" />
                      <span>Personal Portfolio</span>
                    </span>
                    <ExternalLink size={12} className="text-muted-foreground" />
                  </a>
                )}
              </div>
            </div>

            {/* 3. Live GitHub Activity & Stats */}
            {ghStats && (
              <div className="bg-card/75 border border-primary/20 rounded-xl p-5 backdrop-blur-md">
                <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-2 mb-4">
                  <Github size={15} className="text-primary" />
                  <span>Live GitHub Metrics</span>
                </h3>

                <div className="grid grid-cols-3 gap-2 text-center mb-5">
                  <div className="bg-background/80 p-2.5 rounded-lg border border-primary/20">
                    <span className="text-lg font-bold text-white block">{ghStats.publicRepos}</span>
                    <span className="text-[10px] text-muted-foreground uppercase font-mono">Repos</span>
                  </div>
                  <div className="bg-background/80 p-2.5 rounded-lg border border-primary/20">
                    <span className="text-lg font-bold text-white block">{ghStats.followers}</span>
                    <span className="text-[10px] text-muted-foreground uppercase font-mono">Followers</span>
                  </div>
                  <div className="bg-background/80 p-2.5 rounded-lg border border-primary/20">
                    <span className="text-lg font-bold text-white block">{ghStats.following}</span>
                    <span className="text-[10px] text-muted-foreground uppercase font-mono">Following</span>
                  </div>
                </div>

                {ghStats.topLanguages && ghStats.topLanguages.length > 0 && (
                  <div>
                    <span className="text-xs text-muted-foreground block mb-2 font-mono">
                      Top Languages:
                    </span>
                    <div className="space-y-2">
                      {ghStats.topLanguages.map((lang: any) => (
                        <div key={lang.name}>
                          <div className="flex justify-between text-[11px] mb-1">
                            <span className="text-slate-300 font-medium">{lang.name}</span>
                            <span className="text-muted-foreground font-mono">{lang.percentage}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${lang.percentage}%`,
                                backgroundColor: lang.color || "#00d9ff",
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Pinned Flagship Projects & Full Portfolio */}
          <div className="lg:col-span-2 space-y-8">
            {/* Pinned Flagship Projects */}
            {pinnedProjects.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Pin size={18} className="text-primary fill-primary" />
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Flagship Projects
                  </h2>
                  <Badge className="bg-primary/20 text-primary border border-primary/30 text-[10px]">
                    Pinned Showcase
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pinnedProjects.map((p) => (
                    <div key={p.id} className="relative">
                      <div className="absolute -top-2.5 -right-2.5 z-20">
                        <Badge className="bg-secondary text-secondary-foreground text-[10px] font-bold px-2 py-0.5 flex items-center gap-1 shadow-md">
                          <Sparkles size={11} /> Flagship
                        </Badge>
                      </div>
                      <ProjectCard project={p} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Approved Projects */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen size={18} className="text-primary" />
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Approved Open Source Contributions
                  </h2>
                </div>
                <span className="text-xs font-mono text-muted-foreground">
                  {projects.length} {projects.length === 1 ? "project" : "projects"}
                </span>
              </div>

              {projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(pinnedProjects.length > 0 ? otherProjects : projects).map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-card/40 border border-dashed border-primary/25 rounded-2xl">
                  <Code2 size={32} className="text-primary/40 mx-auto mb-2" />
                  <p className="text-sm font-bold text-white mb-1">No Public Projects Yet</p>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    This contributor hasn&apos;t published any approved projects on the OSSCCU showcase yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
