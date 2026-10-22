"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/frontend/components/ui/button";
import { Navbar } from "@/frontend/components/Navbar";
import { Footer } from "@/frontend/components/Footer";
import { ProjectCard } from "@/frontend/components/ProjectCard";
import { ContributorSection } from "@/frontend/components/ContributorSection";
import { ProjectFormDialog } from "@/frontend/components/ProjectFormDialog";
import { useProjects } from "@/frontend/hooks/useProjects";
import { useEvents } from "@/frontend/hooks/useEvents";
import { ProjectInput } from "@/frontend/types/project";
import {
  Sparkles,
  ArrowRight,
  Code,
  Users,
  GitPullRequest,
  Calendar,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

export default function Home() {
  const { projects, addProject } = useProjects();
  const { events } = useEvents();
  const [submitModalOpen, setSubmitModalOpen] = useState(false);

  const approvedProjects = projects.filter((p) => p.status === "approved");
  const projectDisplayCount = approvedProjects.length > 0 ? approvedProjects.length : 12;
  const featuredProjects = approvedProjects.slice(0, 3);
  const upcomingEvents = events.filter((e) => e.status === "upcoming" || e.status === "ongoing").slice(0, 2);

  const heroStats = [
    { label: "Community Members", value: "500+", icon: Users, color: "text-primary" },
    {
      label: "Open Source Projects",
      value: `${projectDisplayCount}+`,
      icon: Code,
      color: "text-secondary",
    },
    { label: "Code Contributions", value: "1,200+", icon: GitPullRequest, color: "text-accent" },
  ];

  const techCategoryPills = [
    { name: "Web Systems", href: "/projects" },
    { name: "AI / ML", href: "/projects" },
    { name: "IoT & Robotics", href: "/projects" },
    { name: "Dev Tools", href: "/projects" },
    { name: "Next.js", href: "/projects" },
    { name: "Node.js", href: "/projects" },
  ];

  const handleQuickSubmit = async (data: ProjectInput) => {
    await addProject(data);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-primary-foreground">
      {/* Top Navigation */}
      <Navbar onOpenSubmitModal={() => setSubmitModalOpen(true)} />

      {/* Hero Section */}
      <section
        id="home"
        className="relative min-h-[88vh] flex flex-col items-center justify-center pt-16 pb-20 overflow-hidden"
      >
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-10 container text-center max-w-4xl px-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold uppercase tracking-wider mb-6 animate-in fade-in duration-300">
            <Sparkles size={14} />
            <span>Welcome to OSSCCU</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-4 tracking-tight text-white leading-tight">
            Let&apos;s Build <br />
            <span className="text-secondary bg-secondary/15 px-4 py-1 rounded-xl inline-block border border-secondary/30 shadow-[0_0_20px_rgba(57,255,20,0.2)] font-mono">
              Open Source
            </span>
          </h1>

          <p className="text-base sm:text-xl text-foreground/80 max-w-2xl mx-auto mb-8 leading-relaxed">
            The official <span className="text-primary font-bold">Open Source Software Community at City University</span>.
            We turn student curiosity into production-grade software, collaboratively solving campus problems and empowering developers.
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center flex-wrap items-center mb-8">
            <Button
              asChild
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-8 py-6 text-base shadow-lg shadow-primary/20 neon-button"
            >
              <Link href="/projects">
                Explore Projects
                <ArrowRight size={18} className="ml-2" />
              </Link>
            </Button>

            <Button
              variant="outline"
              onClick={() => setSubmitModalOpen(true)}
              className="border-2 border-secondary/60 text-secondary hover:bg-secondary/15 font-bold px-8 py-6 text-base"
            >
              Submit Your Project
            </Button>
          </div>

          {/* Tech Stacks Discovery Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            <span className="text-xs uppercase font-mono tracking-wider text-muted-foreground mr-1">
              Popular stacks:
            </span>
            {techCategoryPills.map((pill, idx) => (
              <Link
                key={idx}
                href={pill.href}
                className="text-xs px-3 py-1 rounded-full bg-card/60 hover:bg-primary/20 border border-primary/25 hover:border-primary text-foreground/80 hover:text-white transition-all font-mono hover:scale-105"
              >
                #{pill.name}
              </Link>
            ))}
          </div>

          {/* Hero Dynamic Stats Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {heroStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-card/70 border border-primary/25 hover:border-primary/60 rounded-xl p-4 backdrop-blur-md flex items-center justify-center gap-3 transition-all hover:-translate-y-0.5 shadow-md"
                >
                  <div className={`p-2.5 rounded-lg bg-background/80 ${stat.color} border border-primary/20`}>
                    <Icon size={20} />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-extrabold text-white leading-tight font-mono">
                      {stat.value}
                    </div>
                    <div className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Highlight Preview: Featured Projects */}
      <section className="py-20 bg-card/30 border-y border-primary/20">
        <div className="container">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/30 rounded-full text-primary text-xs font-bold tracking-wider mb-2">
                <Code size={13} />
                <span>FEATURED REPOSITORIES</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Handcrafted by <span className="text-primary">City University</span> Students
              </h2>
            </div>

            <Button asChild variant="outline" className="border-primary/40 text-primary hover:bg-primary/10 text-xs font-bold gap-1.5">
              <Link href="/projects">
                <span>View All Projects ({approvedProjects.length})</span>
                <ChevronRight size={14} />
              </Link>
            </Button>
          </div>

          {featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              Loading featured projects...
            </div>
          )}
        </div>
      </section>

      {/* Highlight Preview: Events */}
      <section className="py-20 bg-background border-b border-primary/20">
        <div className="container">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary/10 border border-secondary/30 rounded-full text-secondary text-xs font-bold tracking-wider mb-2">
                <Calendar size={13} />
                <span>UPCOMING HAPPENINGS</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Workshops & <span className="text-secondary">Hackathons</span>
              </h2>
            </div>

            <Button asChild variant="outline" className="border-secondary/40 text-secondary hover:bg-secondary/10 text-xs font-bold gap-1.5">
              <Link href="/events">
                <span>Explore Events Calendar</span>
                <ChevronRight size={14} />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingEvents.map((evt) => (
              <div
                key={evt.id}
                className="bg-card/70 border border-primary/25 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-primary/60 transition-all hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded bg-secondary/15 text-secondary border border-secondary/30 font-mono uppercase">
                      {evt.type}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">
                      {evt.date}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                    {evt.title}
                  </h3>
                  <p className="text-sm text-foreground/75 leading-relaxed mb-6 line-clamp-3">
                    {evt.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-primary/15 flex items-center justify-between">
                  <span className="text-xs text-cyan-300 font-mono">
                    📍 {evt.venue || "City University Main Campus"}
                  </span>
                  <Button asChild size="sm" className="bg-primary text-primary-foreground font-bold text-xs neon-button">
                    <Link href="/events">Details & RSVP</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contributor Showcase Section */}
      <ContributorSection />

      {/* About & Leadership Teaser */}
      <section className="py-20 bg-card/20 border-t border-primary/20">
        <div className="container text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/30 rounded-full text-primary text-xs font-bold tracking-wider mb-4">
            <ShieldCheck size={14} />
            <span>LEADERSHIP & GOVERNANCE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            The Convenor <span className="text-primary">Committee</span>
          </h2>
          <p className="text-foreground/75 text-sm sm:text-base leading-relaxed mb-8">
            Guided by student convenors and batch representatives from Batch 60 through Batch 68,
            OSSCCU is committed to open governance and equal learning opportunities for all.
          </p>

          <div className="flex justify-center gap-4">
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-6 h-11 neon-button text-xs gap-2">
              <Link href="/about">
                <span>Meet the Convenor Committee</span>
                <ArrowRight size={15} />
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-primary/40 text-white hover:bg-primary/10 text-xs px-6 h-11 font-bold">
              <Link href="/contact">Get In Touch</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Global Shared Footer */}
      <Footer />

      {/* Quick Project Submission Modal */}
      <ProjectFormDialog
        open={submitModalOpen}
        onOpenChange={setSubmitModalOpen}
        onSubmit={handleQuickSubmit}
        isAdmin={false}
      />
    </div>
  );
}
