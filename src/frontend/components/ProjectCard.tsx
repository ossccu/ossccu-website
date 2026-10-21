"use client";

import { useState, useEffect } from "react";
import { Project, GitHubStats } from "@/frontend/types/project";
import { Badge } from "@/frontend/components/ui/badge";
import { Button } from "@/frontend/components/ui/button";
import { fetchGitHubStats } from "@/backend/services/githubService";
import {
  Github,
  ExternalLink,
  Sparkles,
  User,
  Code2,
  Star,
  GitFork,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [imgError, setImgError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [ghStats, setGhStats] = useState<GitHubStats | null>(null);

  useEffect(() => {
    let isMounted = true;
    if (project.githubUrl) {
      fetchGitHubStats(project.githubUrl).then((stats) => {
        if (isMounted && stats.loaded) {
          setGhStats(stats);
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [project.githubUrl]);

  const handleCopyClone = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    let cleanUrl = project.githubUrl.trim().replace(/\/+$/, "");
    if (!cleanUrl.endsWith(".git")) {
      cleanUrl = `${cleanUrl}.git`;
    }
    const cloneCmd = `git clone ${cleanUrl}`;

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(cloneCmd);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = cloneCmd;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      toast.success("Copied git clone command to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy clone command.");
    }
  };

  return (
    <div className="group relative flex flex-col justify-between bg-card/80 backdrop-blur-md border border-primary/25 hover:border-primary/80 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,217,255,0.22)] hover:-translate-y-1.5">
      {/* Top Banner / Image */}
      <div className="relative w-full h-48 bg-slate-950 overflow-hidden border-b border-primary/15">
        {!imgError && project.thumbnailUrl ? (
          <img
            src={project.thumbnailUrl}
            alt={project.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-primary/40 p-4">
            <Code2 size={48} className="mb-2 text-primary/60 group-hover:scale-110 transition-transform" />
            <span className="text-xs uppercase tracking-widest text-slate-400 font-mono">
              {project.category}
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/25 to-transparent pointer-events-none" />

        {/* Category & Badges Overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          <Badge
            variant="outline"
            className="bg-background/85 backdrop-blur-md border-primary/40 text-primary text-[11px] font-semibold px-2.5 py-0.5 shadow-sm"
          >
            {project.category}
          </Badge>

          <div className="flex items-center gap-1.5">
            {project.featured && (
              <Badge className="bg-secondary text-secondary-foreground text-[11px] font-bold px-2 py-0.5 flex items-center gap-1 shadow-md">
                <Sparkles size={11} />
                Featured
              </Badge>
            )}
          </div>
        </div>

        {/* Live GitHub Stats overlay pill (stars & forks) */}
        {ghStats && ghStats.loaded && (
          <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-background/90 backdrop-blur-md border border-primary/30 text-white px-2.5 py-1 rounded-md text-[11px] font-mono shadow-md animate-in fade-in duration-300">
            <span className="flex items-center gap-1 text-amber-300 font-semibold">
              <Star size={12} className="fill-amber-300 text-amber-300" />
              {ghStats.stars.toLocaleString()}
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1 text-slate-300">
              <GitFork size={12} className="text-slate-400" />
              {ghStats.forks.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors line-clamp-1 mb-2">
            {project.title}
          </h3>

          <p className="text-sm text-foreground/75 leading-relaxed line-clamp-3 mb-4">
            {project.description}
          </p>

          {/* Tech Stack Badges */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {project.tags.map((tag, idx) => (
              <span
                key={`${project.id}-tag-${idx}`}
                className="text-[11px] font-medium px-2 py-0.5 rounded bg-primary/10 text-cyan-300 border border-primary/20 tracking-wide"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div>
          {/* Author Details */}
          <div className="pt-3 border-t border-primary/15 flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5 min-w-0">
              {project.author.avatarUrl ? (
                <img
                  src={project.author.avatarUrl}
                  alt={project.author.name}
                  className="w-8 h-8 rounded-full object-cover border border-primary/30 shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shrink-0">
                  <User size={14} />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">
                  {project.author.name}
                </p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {project.author.role}
                </p>
              </div>
            </div>

            {project.author.githubUsername && (
              <span className="text-[10px] text-primary/70 font-mono shrink-0">
                @{project.author.githubUsername}
              </span>
            )}
          </div>

          {/* Actions & Clone CTA */}
          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="flex-1 border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 text-xs font-semibold gap-1.5 h-9"
            >
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="View GitHub Repository"
              >
                <Github size={14} />
                <span>GitHub</span>
              </a>
            </Button>

            {/* Quick Clone Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyClone}
              className={`h-9 px-2.5 text-xs transition-colors border ${
                copied
                  ? "border-emerald-400 bg-emerald-500/10 text-emerald-300"
                  : "border-primary/30 text-foreground/80 hover:text-primary hover:border-primary"
              }`}
              title="Copy 'git clone' command"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span className="hidden sm:inline ml-1">{copied ? "Copied" : "Clone"}</span>
            </Button>

            {project.demoUrl ? (
              <Button
                asChild
                size="sm"
                className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30 text-xs font-semibold gap-1.5 h-9 px-3"
              >
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Visit Live Demo"
                >
                  <ExternalLink size={14} />
                  <span>Demo</span>
                </a>
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
