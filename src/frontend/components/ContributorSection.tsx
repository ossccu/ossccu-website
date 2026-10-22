"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/frontend/components/ui/button";
import { Badge } from "@/frontend/components/ui/badge";
import { Users, Code2, ArrowRight, Sparkles, ExternalLink } from "lucide-react";

interface Contributor {
  id: string;
  name: string;
  avatarUrl: string;
  githubHandle?: string;
  department: string;
  batch: string;
  projectCount: number;
}

const DEFAULT_CONTRIBUTORS: Contributor[] = [
  {
    id: "c-1",
    name: "Md Shoriful Islam Ashiq",
    avatarUrl: "https://avatars.githubusercontent.com/u/22385106?v=4",
    githubHandle: "mdsiaofficial",
    department: "Dept. of Computer Science & Engineering",
    batch: "Batch 60",
    projectCount: 6,
  },
  {
    id: "c-2",
    name: "Tanvir Ahmed",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    githubHandle: "tanvir-dev",
    department: "Dept. of Computer Science & Engineering",
    batch: "Batch 54",
    projectCount: 2,
  },
  {
    id: "c-3",
    name: "Nusrat Jahan",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    githubHandle: "nusrat-jahan",
    department: "Dept. of Computer Science & Engineering",
    batch: "Batch 55",
    projectCount: 2,
  },
  {
    id: "c-4",
    name: "Rifat Mahmud",
    avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
    githubHandle: "rifat-oss",
    department: "Dept. of Computer Science & Engineering",
    batch: "Batch 56",
    projectCount: 3,
  },
  {
    id: "c-5",
    name: "Shahriar Hasan",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    githubHandle: "shahriar-iot",
    department: "Dept. of Computer Science & Engineering",
    batch: "Batch 54",
    projectCount: 1,
  },
  {
    id: "c-6",
    name: "Fatima Noor",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    githubHandle: "fatima-noor",
    department: "Dept. of Computer Science & Engineering",
    batch: "Batch 56",
    projectCount: 1,
  },
];

export function ContributorSection() {
  const [contributors, setContributors] = useState<Contributor[]>(DEFAULT_CONTRIBUTORS);

  useEffect(() => {
    async function loadContributors() {
      try {
        const res = await fetch("/api/users");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            // merge or replace
            const mapped: Contributor[] = data.map((u: any, idx: number) => ({
              id: u.id || `u-${idx}`,
              name: u.name,
              avatarUrl: u.avatarUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${u.email || u.name}`,
              githubHandle: u.githubHandle,
              department: u.department || "Computer Science & Engineering",
              batch: u.batch || "Student Contributor",
              projectCount: u.projectCount || 1,
            }));
            setContributors(mapped);
          }
        }
      } catch {
        // Fallback to defaults
      }
    }

    loadContributors();
  }, []);

  return (
    <section className="py-20 bg-background/50 relative overflow-hidden">
      <div className="container">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/30 rounded-full text-primary text-xs font-bold tracking-wider mb-3">
            <Users size={14} />
            <span>COMMUNITY CONTRIBUTORS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            The Builders of <span className="text-primary">OSS CCU</span>
          </h2>
          <p className="text-foreground/75 text-sm sm:text-base leading-relaxed">
            Meet the students driving open innovation across City University by authoring repositories,
            maintaining tools, and contributing code.
          </p>
        </div>

        {/* Contributor Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {contributors.map((c) => (
            <div
              key={c.id}
              className="bg-card/70 border border-primary/20 hover:border-primary/60 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(0,217,255,0.15)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary/30 bg-slate-900 shrink-0">
                    <img
                      src={c.avatarUrl}
                      alt={c.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-white truncate hover:text-primary transition-colors">
                      {c.name}
                    </h4>
                    <p className="text-[11px] text-muted-foreground font-mono truncate">{c.batch}</p>
                  </div>
                </div>

                <p className="text-xs text-foreground/70 mb-3 truncate">{c.department}</p>

                <div className="flex items-center gap-2 mb-4">
                  <Badge className="bg-primary/15 text-primary border border-primary/30 text-[10px] font-mono gap-1">
                    <Code2 size={11} />
                    <span>{c.projectCount} {c.projectCount === 1 ? "Project" : "Projects"}</span>
                  </Badge>
                </div>
              </div>

              {c.githubHandle && (
                <div className="pt-3 border-t border-primary/15 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-muted-foreground font-mono">
                    @{c.githubHandle}
                  </span>
                  <a
                    href={`https://github.com/${c.githubHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1 text-[11px] font-semibold"
                  >
                    <span>Profile</span>
                    <ExternalLink size={11} />
                  </a>
                </div>
              )}
            </div>
          ))}

          {/* Become a Contributor CTA Card */}
          <div className="bg-gradient-to-br from-primary/10 via-card to-secondary/10 border-2 border-dashed border-primary/40 rounded-2xl p-6 flex flex-col justify-between items-center text-center group hover:border-primary transition-all">
            <div className="my-auto">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary mx-auto mb-3 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(0,217,255,0.2)]">
                <Sparkles size={22} />
              </div>
              <h4 className="text-base font-bold text-white mb-1.5">Become a Contributor</h4>
              <p className="text-xs text-foreground/75 leading-relaxed mb-4">
                Have an open-source project or tool? Submit your repository to get featured in the showcase!
              </p>
            </div>

            <Button
              asChild
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold h-9 text-xs neon-button gap-1.5"
            >
              <Link href="/projects">
                <span>Submit Repository</span>
                <ArrowRight size={13} />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
