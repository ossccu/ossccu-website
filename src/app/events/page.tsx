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
