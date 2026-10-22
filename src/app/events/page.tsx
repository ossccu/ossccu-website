"use client";

import { useState } from "react";
import { Navbar } from "@/frontend/components/Navbar";
import { Footer } from "@/frontend/components/Footer";
import { EventsSection } from "@/frontend/components/EventsSection";
import { ProjectFormDialog } from "@/frontend/components/ProjectFormDialog";
import { useProjects } from "@/frontend/hooks/useProjects";
import { ProjectInput } from "@/frontend/types/project";
import { Calendar, MessageSquare } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";

export default function EventsPage() {
  const { addProject } = useProjects();
  const [submitModalOpen, setSubmitModalOpen] = useState(false);

  const handleQuickSubmit = async (data: ProjectInput) => {
    await addProject(data);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-primary-foreground">
      <Navbar onOpenSubmitModal={() => setSubmitModalOpen(true)} />

      {/* Events Banner */}
      <section className="pt-16 pb-6 bg-card/30 border-b border-primary/20 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[250px] bg-secondary/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="container relative z-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary/15 border border-secondary/35 rounded-full text-secondary text-xs font-bold tracking-wider mb-3">
            <Calendar size={13} />
            <span>ACTIVITIES & CALENDAR</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Community <span className="text-secondary">Events</span>
          </h1>
          <p className="text-foreground/75 text-sm sm:text-base leading-relaxed mb-6">
            Join hands-on coding workshops, 48-hour minihackathons, and tech meetups organized by
            the Open Source Software Community at City University (OSSCCU).
          </p>
          <div className="flex justify-center gap-3">
            <Button
              asChild
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold px-6 h-10 neon-button text-xs gap-2"
            >
              <a href="https://discord.gg/ossccu" target="_blank" rel="noopener noreferrer">
                <MessageSquare size={14} />
                <span>Join Discord Community</span>
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Events Content */}
      <main className="flex-1">
        <EventsSection />
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
