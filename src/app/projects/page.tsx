"use client";

import { useState } from "react";
import { Navbar } from "@/frontend/components/Navbar";
import { Footer } from "@/frontend/components/Footer";
import { ProjectShowcase } from "@/frontend/components/ProjectShowcase";
import { ProjectFormDialog } from "@/frontend/components/ProjectFormDialog";
import { useProjects } from "@/frontend/hooks/useProjects";
import { ProjectInput } from "@/frontend/types/project";
import { Code2, PlusCircle } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";

export default function ProjectsPage() {
  const { projects, isLoading, addProject } = useProjects();
  const [submitModalOpen, setSubmitModalOpen] = useState(false);

  const handleQuickSubmit = async (data: ProjectInput) => {
    await addProject(data);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-primary-foreground">
      <Navbar onOpenSubmitModal={() => setSubmitModalOpen(true)} />

      {/* Projects Banner */}
      <section className="pt-16 pb-8 bg-card/30 border-b border-primary/20 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="container relative z-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/30 rounded-full text-primary text-xs font-bold tracking-wider mb-3">
            <Code2 size={13} />
            <span>COMMUNITY REPOSITORIES</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Open Source <span className="text-primary">Showcase</span>
          </h1>
          <p className="text-foreground/75 text-sm sm:text-base leading-relaxed mb-6">
            Explore verified open-source web apps, CLI tools, IoT firmware, and algorithms built by
            City University students and contributors.
          </p>

          <Button
            onClick={() => setSubmitModalOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-6 h-11 neon-button text-xs gap-2"
          >
            <PlusCircle size={15} />
            <span>Submit Your Project</span>
          </Button>
        </div>
      </section>

      {/* Main Showcase Grid */}
      <main className="flex-1">
        <ProjectShowcase
          projects={projects}
          isLoading={isLoading}
          onOpenSubmitModal={() => setSubmitModalOpen(true)}
        />
      </main>

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
