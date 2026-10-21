"use client";

import { useState, useMemo } from "react";
import { Project, ProjectCategory } from "@/types/project";
import { ProjectCard } from "@/components/ProjectCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Search, Sparkles, Filter, X, PlusCircle } from "lucide-react";
import Link from "next/link";

interface ProjectShowcaseProps {
  projects: Project[];
  isLoading?: boolean;
  onOpenSubmitModal?: () => void;
}

const CATEGORIES: (ProjectCategory | "All")[] = [
  "All",
  "Web",
  "AI/ML",
  "IoT/Robotics",
  "Tools",
  "Mobile",
];

export function ProjectShowcase({
  projects,
  isLoading = false,
  onOpenSubmitModal,
}: ProjectShowcaseProps) {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Only public approved projects
  const approvedProjects = useMemo(() => {
    return projects.filter((p) => p.status === "approved");
  }, [projects]);

  // Filter projects by category and search query
  const filteredProjects = useMemo(() => {
    return approvedProjects.filter((project) => {
      // Category filter
      const matchesCategory =
        selectedCategory === "All" || project.category === selectedCategory;

      if (!matchesCategory) return false;

      // Search query filter
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const inTitle = project.title.toLowerCase().includes(q);
      const inDesc = project.description.toLowerCase().includes(q);
      const inTags = project.tags.some((t) => t.toLowerCase().includes(q));
      const inAuthor =
        project.author.name.toLowerCase().includes(q) ||
        project.author.role.toLowerCase().includes(q) ||
        (project.author.githubUsername &&
          project.author.githubUsername.toLowerCase().includes(q));

      return inTitle || inDesc || inTags || inAuthor;
    });
  }, [approvedProjects, selectedCategory, searchQuery]);

  // Counts per category based on approved projects
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: approvedProjects.length };
    CATEGORIES.forEach((cat) => {
      if (cat !== "All") {
        counts[cat] = approvedProjects.filter((p) => p.category === cat).length;
      }
    });
    return counts;
  }, [approvedProjects]);

  return (
    <section id="projects" className="py-24 bg-background relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="container relative z-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles size={14} />
            Community Innovation
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Open Source <span className="text-primary">Showcase</span>
          </h2>
          <p className="text-foreground/75 text-base md:text-lg">
            Explore cutting-edge systems, open-source utilities, and hardware prototypes crafted by
            passionate student engineers at City University.
          </p>
        </div>

        {/* Filter and Search Controls */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8 bg-card/50 backdrop-blur-md p-4 rounded-xl border border-primary/20 shadow-lg">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {CATEGORIES.map((category) => {
              const count = categoryCounts[category] || 0;
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`text-xs font-semibold px-3 py-2 rounded-lg whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "text-foreground/70 hover:text-white hover:bg-primary/10 border border-transparent"
                  }`}
                >
                  <span>{category}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search bar & Submit action */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-72">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects, tags, authors..."
                className="pl-9 pr-8 bg-background/80 border-primary/30 focus-visible:border-primary text-sm h-10 w-full"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {onOpenSubmitModal ? (
              <Button
                onClick={onOpenSubmitModal}
                size="sm"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold h-10 px-3.5 gap-1.5 shrink-0"
              >
                <PlusCircle size={16} />
                <span className="hidden sm:inline">Submit</span>
              </Button>
            ) : (
              <Button
                asChild
                size="sm"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold h-10 px-3.5 gap-1.5 shrink-0"
              >
                <Link href="/admin">
                  <PlusCircle size={16} />
                  <span className="hidden sm:inline">Submit</span>
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Content Area */}
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <Spinner className="size-8 text-primary" />
            <p className="text-sm text-muted-foreground font-mono">
              Loading community repositories...
            </p>
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-card/30 border border-dashed border-primary/30 rounded-xl p-8 max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
              <Filter size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No matching projects found</h3>
            <p className="text-sm text-foreground/70 mb-6">
              We couldn&apos;t find any project matching your search or category filter. Try refining
              your query or reset the filters.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="border-primary/40 text-primary hover:bg-primary/10"
            >
              Reset Filters
            </Button>
          </div>
        )}

        {/* Bottom CTA Banner */}
        <div className="mt-16 bg-gradient-to-r from-card via-slate-900 to-card border border-primary/30 rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Building something awesome for City University?
            </h3>
            <p className="text-foreground/75 text-sm sm:text-base max-w-xl">
              Get your open-source project featured, attract collaborators, and gain recognition from
              peers and faculty mentors.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {onOpenSubmitModal ? (
              <Button
                onClick={onOpenSubmitModal}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-6 h-11 neon-button"
              >
                Submit Community Project
              </Button>
            ) : (
              <Button
                asChild
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-6 h-11 neon-button"
              >
                <Link href="/admin">Submit Community Project</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
