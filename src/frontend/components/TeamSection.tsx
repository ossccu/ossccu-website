"use client";

import { Github, Linkedin, ShieldCheck, Code2 } from "lucide-react";

interface TeamMember {
  name: string;
  role: string;
  department: string;
  batch: string;
  image: string;
  githubUrl: string;
  linkedinUrl: string;
  focus: string;
}

const EXECUTIVE_TEAM: TeamMember[] = [
  {
    name: "Tanvir Ahmed",
    role: "President & Co-Founder",
    department: "Dept. of Computer Science & Engineering",
    batch: "Batch 54 (Final Year)",
    image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80",
    githubUrl: "https://github.com/tanvir-dev",
    linkedinUrl: "https://linkedin.com/in/tanvir-ahmed",
    focus: "Cloud Architecture & Club Strategy",
  },
  {
    name: "Nusrat Jahan",
    role: "General Secretary",
    department: "Dept. of Computer Science & Engineering",
    batch: "Batch 55",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    githubUrl: "https://github.com/nusrat-jahan",
    linkedinUrl: "https://linkedin.com/in/nusrat-jahan",
    focus: "Full-Stack Web & Community Ops",
  },
  {
    name: "Rifat Mahmud",
    role: "Technical Lead & Core Maintainer",
    department: "Dept. of Computer Science & Engineering",
    batch: "Executive Board",
    image: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80",
    githubUrl: "https://github.com/rifat-oss",
    linkedinUrl: "https://linkedin.com/in/rifat-mahmud",
    focus: "DevOps, Drizzle ORM & Distributed Systems",
  },
  {
    name: "Shahriar Hasan",
    role: "Hardware & IoT Secretary",
    department: "Dept. of Computer Science & Engineering",
    batch: "Batch 54",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    githubUrl: "https://github.com/shahriar-iot",
    linkedinUrl: "https://linkedin.com/in/shahriar-hasan",
    focus: "Embedded Systems, ESP32 & Robotics",
  },
  {
    name: "Fatima Noor",
    role: "Organizing & Outreach Secretary",
    department: "Dept. of Computer Science & Engineering",
    batch: "Batch 56",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    githubUrl: "https://github.com/fatima-noor",
    linkedinUrl: "https://linkedin.com/in/fatima-noor",
    focus: "Hackathons, Sponsorships & Media",
  },
  {
    name: "Sabbir Hossain",
    role: "DevRel & Documentation Lead",
    department: "Dept. of Computer Science & Engineering",
    batch: "Batch 55",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    githubUrl: "https://github.com/sabbir-docs",
    linkedinUrl: "https://linkedin.com/in/sabbir-hossain",
    focus: "Technical Writing & Mentorship",
  },
];

export function TeamSection() {
  return (
    <div className="mt-20 pt-16 border-t border-primary/20">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary/10 border border-secondary/30 rounded-full text-secondary text-xs font-bold tracking-wider mb-3">
          <ShieldCheck size={14} />
          <span>LEADERSHIP</span>
        </div>
        <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
          Executive <span className="text-secondary">Committee</span>
        </h3>
        <p className="text-foreground/75 text-sm sm:text-base">
          Meet the student leaders, core maintainers, and organizing mentors steering the Open Source
          Software Community at City University.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {EXECUTIVE_TEAM.map((member, index) => (
          <div
            key={index}
            className="group bg-card/75 border border-primary/20 hover:border-primary/70 rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,217,255,0.18)] hover:-translate-y-1.5 flex flex-col justify-between"
          >
            <div>
              {/* Profile Image & Badges */}
              <div className="flex items-center gap-4 mb-5">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-primary/30 group-hover:border-primary transition-colors shrink-0 shadow-md">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                <div className="min-w-0">
                  <h4 className="text-lg font-bold text-white group-hover:text-primary transition-colors truncate">
                    {member.name}
                  </h4>
                  <p className="text-xs font-semibold text-secondary truncate mb-0.5">
                    {member.role}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate font-mono">
                    {member.batch}
                  </p>
                </div>
              </div>

              {/* Department & Focus Area */}
              <p className="text-xs text-foreground/70 mb-3">{member.department}</p>
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-primary/10 border border-primary/20 text-[11px] font-mono text-cyan-300 mb-5">
                <Code2 size={12} className="text-primary shrink-0" />
                <span className="truncate">{member.focus}</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-4 border-t border-primary/15 flex items-center justify-between text-xs text-muted-foreground">
              <span className="text-[11px] uppercase tracking-wider font-mono text-slate-400">
                Connect
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={member.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-background/80 hover:bg-primary/20 border border-primary/30 flex items-center justify-center text-foreground hover:text-primary transition-colors"
                  title="GitHub Profile"
                >
                  <Github size={14} />
                </a>
                <a
                  href={member.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-background/80 hover:bg-secondary/20 border border-secondary/30 flex items-center justify-center text-foreground hover:text-secondary transition-colors"
                  title="LinkedIn Profile"
                >
                  <Linkedin size={14} />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
