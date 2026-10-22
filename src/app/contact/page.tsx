"use client";

import { useState } from "react";
import { Navbar } from "@/frontend/components/Navbar";
import { Footer } from "@/frontend/components/Footer";
import { ProjectFormDialog } from "@/frontend/components/ProjectFormDialog";
import { useProjects } from "@/frontend/hooks/useProjects";
import { ProjectInput } from "@/frontend/types/project";
import { Button } from "@/frontend/components/ui/button";
import { Mail, MessageCircle, Github, MapPin, Send } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const { addProject } = useProjects();
  const [submitModalOpen, setSubmitModalOpen] = useState(false);

  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuickSubmit = async (data: ProjectInput) => {
    await addProject(data);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.subject || !contactForm.message) {
      toast.error("Please fill in all contact fields.");
      return;
    }

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsSubmitting(false);
    toast.success("Thank you! Your message has been sent to the OSSCCU Convenor Committee.");
    setContactForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-primary-foreground">
      <Navbar onOpenSubmitModal={() => setSubmitModalOpen(true)} />

      {/* Contact Banner */}
      <section className="pt-20 pb-12 bg-card/25 border-b border-primary/20 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="container relative z-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/30 rounded-full text-primary text-xs font-bold tracking-wider mb-4">
            <Mail size={14} />
            <span>GET IN TOUCH</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight mb-4">
            Connect with <span className="text-primary">OSSCCU</span>
          </h1>
          <p className="text-foreground/75 text-base sm:text-lg leading-relaxed">
            Have questions, want to sponsor a minihackathon, or propose an open-source initiative?
            Our Convenor Committee is here to support you.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-16 container flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {/* Contact Details & Links */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-2">Contact Channels</h2>
            <p className="text-sm text-foreground/70 mb-6">
              Reach out directly through official community hubs or visit us on campus.
            </p>

            <a
              href="mailto:ossccu.club@gmail.com"
              className="bg-card/70 border border-primary/20 hover:border-primary rounded-xl p-5 flex items-center gap-4 transition-all hover:-translate-y-1 group block"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                <Mail size={22} />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-white text-sm">Official Email</h4>
                <p className="text-xs text-primary font-mono truncate">ossccu.club@gmail.com</p>
              </div>
            </a>

            <a
              href="https://discord.gg/ossccu"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-card/70 border border-secondary/25 hover:border-secondary rounded-xl p-5 flex items-center gap-4 transition-all hover:-translate-y-1 group block"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary/10 border border-secondary/30 flex items-center justify-center text-secondary shrink-0 group-hover:scale-110 transition-transform">
                <MessageCircle size={22} />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-white text-sm">Discord Community</h4>
                <p className="text-xs text-secondary font-mono truncate">discord.gg/ossccu</p>
              </div>
            </a>

            <a
              href="https://github.com/ossccu"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-card/70 border border-primary/20 hover:border-primary rounded-xl p-5 flex items-center gap-4 transition-all hover:-translate-y-1 group block"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-cyan-400 shrink-0 group-hover:scale-110 transition-transform">
                <Github size={22} />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-white text-sm">GitHub Organization</h4>
                <p className="text-xs text-cyan-400 font-mono truncate">github.com/ossccu</p>
              </div>
            </a>

            <div className="bg-card/70 border border-primary/20 rounded-xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shrink-0">
                <MapPin size={22} />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-white text-sm">Campus Location</h4>
                <p className="text-xs text-foreground/70">
                  City University Main Campus, Khagan, Birulia, Savar, Dhaka.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Form */}
          <div className="lg:col-span-2 bg-card/80 border border-primary/30 rounded-2xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">Send Us a Direct Message</h3>
            <p className="text-xs text-muted-foreground mb-6">
              Fill in your inquiry and our team will get back to you within 24 hours.
            </p>

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="e.g. Tanvir Ahmed"
                    className="w-full bg-background/80 border border-primary/30 rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary outline-none transition-colors text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="student@cityuniversity.edu"
                    className="w-full bg-background/80 border border-primary/30 rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary outline-none transition-colors text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Subject / Topic
                </label>
                <input
                  type="text"
                  required
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  placeholder="e.g. Minihackathon Partnership / Project Submission Help"
                  className="w-full bg-background/80 border border-primary/30 rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary outline-none transition-colors text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Message Body
                </label>
                <textarea
                  rows={5}
                  required
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="Tell us about your project, idea, or how you want to collaborate..."
                  className="w-full bg-background/80 border border-primary/30 rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary outline-none transition-colors text-sm resize-y"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold h-11 neon-button text-xs tracking-wider gap-2 mt-2"
              >
                {isSubmitting ? (
                  <span>Sending message...</span>
                ) : (
                  <>
                    <Send size={15} />
                    <span>Send Message to Convenor Committee</span>
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
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
