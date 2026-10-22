"use client";

import { useState } from "react";
import { Navbar } from "@/frontend/components/Navbar";
import { Footer } from "@/frontend/components/Footer";
import { TeamSection } from "@/frontend/components/TeamSection";
import { ContributorSection } from "@/frontend/components/ContributorSection";
import { ProjectFormDialog } from "@/frontend/components/ProjectFormDialog";
import { useProjects } from "@/frontend/hooks/useProjects";
import { ProjectInput } from "@/frontend/types/project";
import { ShieldCheck, Zap, MessageCircle, Github, Target, Compass } from "lucide-react";

export default function AboutPage() {
  const { addProject } = useProjects();
  const [submitModalOpen, setSubmitModalOpen] = useState(false);

  const handleQuickSubmit = async (data: ProjectInput) => {
    await addProject(data);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-primary-foreground">
      <Navbar onOpenSubmitModal={() => setSubmitModalOpen(true)} />

      {/* About Banner */}
      <section className="pt-20 pb-16 bg-card/25 border-b border-primary/20 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="container relative z-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/30 rounded-full text-primary text-xs font-bold tracking-wider mb-4">
            <ShieldCheck size={14} />
            <span>WHO WE ARE</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight mb-6">
            About <span className="text-primary">OSSCCU</span>
          </h1>
          <p className="text-foreground/80 text-base sm:text-lg leading-relaxed">
            The <strong>Open Source Software Community at City University (OSSCCU)</strong> is a student-led
            ecosystem of developers, system tinkerer and designers building production-grade software in public.
          </p>
        </div>
      </section>

      {/* Mission & Vision Grid */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-card/70 border border-primary/25 rounded-2xl p-8 hover:border-primary/60 transition-all">
              <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary mb-5">
                <Target size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Our Mission</h2>
              <p className="text-foreground/75 text-sm sm:text-base leading-relaxed">
                Empower every City University student with hands-on software development experience through
                real-world open-source contributions, rigorous code reviews, and community-driven mentorship.
              </p>
            </div>

            <div className="bg-card/70 border border-secondary/25 rounded-2xl p-8 hover:border-secondary/60 transition-all">
              <div className="w-12 h-12 rounded-xl bg-secondary/15 border border-secondary/30 flex items-center justify-center text-secondary mb-5">
                <Compass size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Our Vision</h2>
              <p className="text-foreground/75 text-sm sm:text-base leading-relaxed">
                Position City University as a recognized hub for world-class open-source engineering, producing
                engineers who actively contribute to global developer ecosystems, public goods, and tech companies.
              </p>
            </div>
          </div>

          {/* Pillars */}
          <div className="bg-card/50 border border-primary/20 rounded-2xl p-8 sm:p-10 mb-16">
            <h3 className="text-2xl font-bold mb-8 text-primary">Core Tenets</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-secondary/15 border border-secondary/30 flex items-center justify-center text-secondary shrink-0">
                  <Zap size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base mb-1.5">Learn & Elevate</h4>
                  <p className="text-foreground/70 text-sm leading-relaxed">
                    Gain practical exposure with CI/CD, modern full-stack frameworks, and containerization by building in public.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shrink-0">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base mb-1.5">Peer Mentorship</h4>
                  <p className="text-foreground/70 text-sm leading-relaxed">
                    Senior contributors pair with first-time open-source contributors to guide them through pull requests and code standards.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center text-accent shrink-0">
                  <Github size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base mb-1.5">Civic Campus Impact</h4>
                  <p className="text-foreground/70 text-sm leading-relaxed">
                    Ship tools and services that directly serve City University students, labs, and faculty commons.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Official Convenor Committee Section */}
          <TeamSection />
        </div>
      </section>

      {/* Community Contributor Section */}
      <ContributorSection />

      {/* Quick Submission Modal */}
      <ProjectFormDialog
        open={submitModalOpen}
        onOpenChange={setSubmitModalOpen}
        onSubmit={handleQuickSubmit}
        isAdmin={false}
      />

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
