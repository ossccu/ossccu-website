"use client";

import { ShieldCheck, Code2, Users, Star, Award, Layers, Github, Linkedin } from "lucide-react";
import { Badge } from "@/frontend/components/ui/badge";

interface CoreLeader {
  name: string;
  role: string;
  batch: string;
  department: string;
  focus: string;
  image: string;
  githubUrl?: string;
  linkedinUrl?: string;
}

interface BatchRep {
  batch: string;
  name: string;
  role: string;
  department: string;
}

const CORE_LEADERS: CoreLeader[] = [
  {
    name: "Md Shoriful Islam Ashiq",
    role: "Convenor",
    batch: "Batch 60",
    department: "Dept. of Computer Science & Engineering",
    focus: "MERN, Systems & Community Strategy",
    image: "https://avatars.githubusercontent.com/u/22385106?v=4",
    githubUrl: "https://github.com/mdsiaofficial",
    linkedinUrl: "https://linkedin.com/in/mdsiaofficial",
  },
  {
    name: "Md. Anisur Rahman Anik",
    role: "Joint Convenor",
    batch: "Batch 61",
    department: "Dept. of Computer Science & Engineering",
    focus: "Operations, Sprints & Mentorship",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    githubUrl: "https://github.com/ossccu",
    linkedinUrl: "https://linkedin.com",
  },
  {
    name: "MD. Tahsin Ferdous",
    role: "Member Secretary",
    batch: "Batch 61",
    department: "Dept. of Computer Science & Engineering",
    focus: "Documentation, Governance & Workflows",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    githubUrl: "https://github.com/ossccu",
    linkedinUrl: "https://linkedin.com",
  },
  {
    name: "Foysal Ahammed Sami",
    role: "Joint Member Secretary",
    batch: "Batch 62",
    department: "Dept. of Computer Science & Engineering",
    focus: "Technical Events & Hackathons",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    githubUrl: "https://github.com/ossccu",
    linkedinUrl: "https://linkedin.com",
  },
  {
    name: "Rahul Roy Nipon",
    role: "Organizing Secretary",
    batch: "Batch 63",
    department: "Dept. of Computer Science & Engineering",
    focus: "Community Outreach & Workshop Logistics",
    image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80",
    githubUrl: "https://github.com/ossccu",
    linkedinUrl: "https://linkedin.com",
  },
];

const BATCH_REPRESENTATIVES: BatchRep[] = [
  { batch: "Batch 60", name: "Roudra Mondal", role: "Assistant Organizing Secretary", department: "CSE, City University" },
  { batch: "Batch 61", name: "Mohammad Easin Arafat Emon", role: "Assistant Organizing Secretary", department: "CSE, City University" },
  { batch: "Batch 62", name: "Md. Atif Hassan Saumik", role: "Assistant Organizing Secretary", department: "CSE, City University" },
  { batch: "Batch 63", name: "Md. Masum Hossain", role: "Assistant Organizing Secretary", department: "CSE, City University" },
  { batch: "Batch 64", name: "Sizan Molla", role: "Assistant Organizing Secretary", department: "CSE, City University" },
  { batch: "Batch 65", name: "Ebne Talha Bin Faruk", role: "Assistant Organizing Secretary", department: "CSE, City University" },
  { batch: "Batch 66", name: "MD Maruf", role: "Assistant Organizing Secretary", department: "CSE, City University" },
  { batch: "Batch 67", name: "Rifat Shahariar", role: "Assistant Organizing Secretary", department: "CSE, City University" },
  { batch: "Batch 68", name: "Md Mehedi Hasan Khan", role: "Assistant Organizing Secretary", department: "CSE, City University" },
];

export function TeamSection() {
  return (
    <div className="py-12">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary/15 border border-secondary/35 rounded-full text-secondary text-xs font-bold tracking-wider mb-3">
          <ShieldCheck size={14} />
          <span>OFFICIAL COMMITTEE</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          Convenor <span className="text-secondary">Committee</span>
        </h2>
        <p className="text-foreground/75 text-sm sm:text-base leading-relaxed">
          The official leadership body and batch representatives steering the Open Source
          Software Community at City University (OSSCCU).
        </p>
      </div>

      {/* Part 1: Core Leadership (5 Highlighted Cards) */}
      <div className="mb-16">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
            <Award size={18} />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">Core Leadership</h3>
            <p className="text-xs text-muted-foreground">Executive Convenors and Member Secretaries</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CORE_LEADERS.map((leader, index) => {
            const isConvenor = index === 0;
            return (
              <div
                key={leader.name}
                className={`group bg-card/80 border rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between ${
                  isConvenor
                    ? "border-secondary/60 bg-gradient-to-b from-card to-secondary/5 shadow-[0_0_30px_rgba(57,255,20,0.15)] md:col-span-2 lg:col-span-1"
                    : "border-primary/25 hover:border-primary/70 hover:shadow-[0_0_25px_rgba(0,217,255,0.18)]"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-primary/40 group-hover:border-primary transition-colors shrink-0 shadow-md bg-slate-900">
                      <img
                        src={leader.image}
                        alt={leader.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    </div>
                    <Badge
                      className={`text-[11px] font-mono uppercase tracking-wider font-bold ${
                        isConvenor
                          ? "bg-secondary text-slate-950 hover:bg-secondary"
                          : "bg-primary/20 text-primary border border-primary/40"
                      }`}
                    >
                      {leader.batch}
                    </Badge>
                  </div>

                  <h4 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                    {leader.name}
                  </h4>
                  <div className="inline-block text-xs font-semibold text-secondary mb-2">
                    {leader.role}
                  </div>
                  <p className="text-xs text-foreground/70 mb-3">{leader.department}</p>

                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-primary/10 border border-primary/20 text-[11px] font-mono text-cyan-300">
                    <Code2 size={12} className="text-primary shrink-0" />
                    <span className="truncate">{leader.focus}</span>
                  </div>
                </div>

                <div className="pt-4 mt-5 border-t border-primary/15 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                    City University
                  </span>
                  <div className="flex items-center gap-2">
                    {leader.githubUrl && (
                      <a
                        href={leader.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-lg bg-background/80 hover:bg-primary/20 border border-primary/30 flex items-center justify-center text-foreground hover:text-primary transition-colors"
                        title="GitHub Profile"
                      >
                        <Github size={14} />
                      </a>
                    )}
                    {leader.linkedinUrl && (
                      <a
                        href={leader.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-lg bg-background/80 hover:bg-secondary/20 border border-secondary/30 flex items-center justify-center text-foreground hover:text-secondary transition-colors"
                        title="LinkedIn Profile"
                      >
                        <Linkedin size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Part 2: Assistant Organizing Secretaries (Batch 60–68) */}
      <div>
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-secondary/10 border border-secondary/30 flex items-center justify-center text-secondary">
            <Users size={18} />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">Assistant Organizing Secretaries</h3>
            <p className="text-xs text-muted-foreground">Batch Representatives (Batch 60 – 68)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BATCH_REPRESENTATIVES.map((rep) => (
            <div
              key={rep.batch}
              className="bg-card/60 border border-primary/20 hover:border-primary/60 rounded-xl p-4 transition-all hover:bg-primary/5 hover:-translate-y-1 flex items-center justify-between gap-3 shadow-sm"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-secondary/15 text-secondary border border-secondary/30 text-[10px] font-mono px-2 py-0">
                    {rep.batch}
                  </Badge>
                  <span className="text-[11px] text-muted-foreground font-mono truncate">
                    {rep.role}
                  </span>
                </div>
                <h5 className="font-bold text-white text-sm sm:text-base truncate group-hover:text-primary">
                  {rep.name}
                </h5>
                <p className="text-xs text-foreground/60 truncate">{rep.department}</p>
              </div>

              <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center text-primary shrink-0">
                <Layers size={16} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
