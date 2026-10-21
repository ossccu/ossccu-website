"use client";

import { useState } from "react";
import { Button } from "@/frontend/components/ui/button";
import { Navbar } from "@/frontend/components/Navbar";
import { ProjectShowcase } from "@/frontend/components/ProjectShowcase";
import { ProjectFormDialog } from "@/frontend/components/ProjectFormDialog";
import { EventsSection } from "@/frontend/components/EventsSection";
import { TeamSection } from "@/frontend/components/TeamSection";
import { useProjects } from "@/frontend/hooks/useProjects";
import { ProjectInput } from "@/frontend/types/project";
import {
  Mail,
  MessageCircle,
  Github,
  Zap,
  Sparkles,
  ArrowRight,
  Code,
  Users,
  GitPullRequest,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

export default function Home() {
  const { projects, isLoading, addProject } = useProjects();
  const [submitModalOpen, setSubmitModalOpen] = useState(false);

  // Controlled Contact Form State
  const [contactForm, setContactForm] = useState({
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);

  const approvedProjectCount = projects.filter((p) => p.status === "approved").length;
  const projectDisplayCount = approvedProjectCount > 0 ? approvedProjectCount : 20;

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
    { name: "Web Systems", tag: "Web" },
    { name: "AI / ML", tag: "AI/ML" },
    { name: "IoT & Robotics", tag: "IoT/Robotics" },
    { name: "Dev Tools", tag: "Tools" },
    { name: "Next.js", tag: "Web" },
    { name: "Python", tag: "AI/ML" },
  ];

  const handlePillClick = () => {
    const el = document.getElementById("projects");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleQuickSubmit = async (data: ProjectInput) => {
    await addProject(data);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.email || !contactForm.subject || !contactForm.message) {
      toast.error("Please fill in all contact fields.");
      return;
    }

    setIsSubmittingContact(true);
    // Simulate optimistic transmission
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsSubmittingContact(false);
    toast.success("Thank you! Your message has been sent to the OSSCCU executive team.");
    setContactForm({ email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-primary-foreground">
      {/* Top Sticky Frosted Navigation Bar with Scroll Indicator */}
      <Navbar onOpenSubmitModal={() => setSubmitModalOpen(true)} />

      {/* Hero Section */}
      <section
        id="home"
        className="relative min-h-[92vh] flex flex-col items-center justify-center pt-16 pb-20 overflow-hidden"
      >
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-10 container text-center max-w-4xl px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold uppercase tracking-wider mb-6 animate-in fade-in duration-300">
            <Sparkles size={14} />
            <span>Welcome to OSSCCU</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-4 tracking-tight text-white leading-tight">
            Let&apos;s Build <br />
            <span className="text-secondary bg-secondary/15 px-4 py-1 rounded-xl inline-block border border-secondary/30 shadow-[0_0_20px_rgba(57,255,20,0.2)]">
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
              <a href="#projects">
                Explore Projects
                <ArrowRight size={18} className="ml-2" />
              </a>
            </Button>

            <Button
              variant="outline"
              onClick={() => setSubmitModalOpen(true)}
              className="border-2 border-secondary/60 text-secondary hover:bg-secondary/15 font-bold px-8 py-6 text-base"
            >
              Submit Your Project
            </Button>
          </div>

          {/* Interactive Tech Category Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            <span className="text-xs uppercase font-mono tracking-wider text-muted-foreground mr-1">
              Explore stacks:
            </span>
            {techCategoryPills.map((pill, idx) => (
              <button
                key={idx}
                onClick={handlePillClick}
                className="text-xs px-3 py-1 rounded-full bg-card/60 hover:bg-primary/20 border border-primary/25 hover:border-primary text-foreground/80 hover:text-white transition-all font-mono hover:scale-105"
              >
                #{pill.name}
              </button>
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

      {/* Events & Announcements Section (Dynamic via Drizzle / API) */}
      <EventsSection />

      {/* Projects Showcase Section */}
      <ProjectShowcase
        projects={projects}
        isLoading={isLoading}
        onOpenSubmitModal={() => setSubmitModalOpen(true)}
      />

      {/* About Section & Executive Committee Showcase */}
      <section id="about" className="py-24 bg-card/20 border-t border-primary/20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/30 rounded-full text-primary text-xs font-bold tracking-wider mb-3">
              <Zap size={13} />
              <span>OUR PURPOSE</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              About <span className="text-primary">OSSCCU</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 items-center">
            <div>
              <p className="text-base sm:text-lg text-foreground/80 mb-6 leading-relaxed">
                The <strong>Open Source Software Community at City University (OSSCCU)</strong> is a
                student-led initiative uniting programmers, UI/UX designers, hardware tinkerers,
                and open-source evangelists.
              </p>
              <p className="text-base sm:text-lg text-foreground/80 leading-relaxed">
                We bridge classroom theory and industry production by maintaining real-world open source
                repositories, organizing collaborative sprints, and promoting mentorship across junior and senior cohorts.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-card/60 border border-primary/25 rounded-xl hover:border-primary transition-all hover:bg-primary/5 hover:-translate-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold text-secondary mb-1">500+</div>
                <div className="text-foreground/70 text-xs sm:text-sm font-medium">Active Members</div>
              </div>
              <div className="p-6 bg-card/60 border border-primary/25 rounded-xl hover:border-primary transition-all hover:bg-primary/5 hover:-translate-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold text-secondary mb-1">2023</div>
                <div className="text-foreground/70 text-xs sm:text-sm font-medium">Founded</div>
              </div>
              <div className="p-6 bg-card/60 border border-primary/25 rounded-xl hover:border-primary transition-all hover:bg-primary/5 hover:-translate-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold text-secondary mb-1">{projectDisplayCount}+</div>
                <div className="text-foreground/70 text-xs sm:text-sm font-medium">Open Source Projects</div>
              </div>
              <div className="p-6 bg-card/60 border border-primary/25 rounded-xl hover:border-primary transition-all hover:bg-primary/5 hover:-translate-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold text-secondary mb-1">1,200+</div>
                <div className="text-foreground/70 text-xs sm:text-sm font-medium">Git Commits & PRs</div>
              </div>
            </div>
          </div>

          {/* Pillars */}
          <div className="bg-card/70 border border-primary/30 rounded-2xl p-8 sm:p-10 mb-12">
            <h3 className="text-2xl font-bold mb-8 text-primary">Core Tenets</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-secondary/15 border border-secondary/30 flex items-center justify-center text-secondary shrink-0">
                  <Zap size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base mb-1.5">Learn & Elevate</h4>
                  <p className="text-foreground/70 text-sm leading-relaxed">
                    Gain practical exposure with CI/CD, containerization, and modern frameworks by building in public.
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
                    Senior contributors pair with first-time open-source contributors to guide them through pull requests.
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
                    Ship tools that directly serve City University students, faculty labs, and the global software commons.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Executive Committee Showcase */}
          <TeamSection />
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-background">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/30 rounded-full text-primary text-xs font-bold tracking-wider mb-3">
              <Mail size={13} />
              <span>GET IN TOUCH</span>
            </div>
            <h2 className="text-4xl font-extrabold text-white tracking-tight mb-3">
              Connect with <span className="text-primary">OSSCCU</span>
            </h2>
            <p className="text-foreground/75 text-sm sm:text-base">
              Have questions, want to partner, or suggest an open-source initiative? Reach out to the
              organizing team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <a
              href="mailto:ossccu.club@gmail.com"
              className="bg-card/70 border border-primary/25 rounded-xl p-6 text-center hover:border-primary transition-all hover:-translate-y-1 group"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Mail size={22} />
              </div>
              <h3 className="font-bold text-white mb-1">Email Us</h3>
              <p className="text-primary text-sm font-mono truncate">ossccu.club@gmail.com</p>
            </a>

            <a
              href="https://discord.gg/ossccu"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-card/70 border border-primary/25 rounded-xl p-6 text-center hover:border-secondary transition-all hover:-translate-y-1 group"
            >
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary mx-auto mb-3 group-hover:scale-110 transition-transform">
                <MessageCircle size={22} />
              </div>
              <h3 className="font-bold text-white mb-1">Discord Hub</h3>
              <p className="text-secondary text-sm">Join the Developer Chat</p>
            </a>

            <a
              href="https://github.com/ossccu"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-card/70 border border-primary/25 rounded-xl p-6 text-center hover:border-primary transition-all hover:-translate-y-1 group"
            >
              <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Github size={22} />
              </div>
              <h3 className="font-bold text-white mb-1">GitHub Org</h3>
              <p className="text-cyan-400 text-sm font-mono">github.com/ossccu</p>
            </a>
          </div>

          {/* Contact Form */}
          <div className="bg-card/80 border border-primary/30 rounded-2xl p-6 sm:p-10 max-w-2xl mx-auto backdrop-blur-md shadow-xl">
            <form onSubmit={handleContactSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Your Email Address
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

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Subject / Inquiry Type
                </label>
                <input
                  type="text"
                  required
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  placeholder="e.g. Project Proposal / Workshop Collaboration"
                  className="w-full bg-background/80 border border-primary/30 rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary outline-none transition-colors text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Message
                </label>
                <textarea
                  rows={4}
                  required
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="Describe your question or how you'd like to collaborate..."
                  className="w-full bg-background/80 border border-primary/30 rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary outline-none transition-colors text-sm resize-y"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmittingContact}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold h-11 neon-button text-sm tracking-wide gap-2"
              >
                {isSubmittingContact ? (
                  <span>Sending message...</span>
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    <span>Send Message</span>
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-primary/20 bg-card/40 py-12">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl font-extrabold text-white tracking-wider">
                  OSS<span className="text-primary">CCU</span>
                </span>
              </div>
              <p className="text-foreground/70 text-xs leading-relaxed">
                Open Source Software Community at City University. Dedicated to collaborative
                open-source engineering, education, and open technology.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
                Quick Navigation
              </h4>
              <ul className="space-y-2 text-xs text-foreground/75">
                <li><a href="#home" className="hover:text-primary transition-colors">Home</a></li>
                <li><a href="#projects" className="hover:text-primary transition-colors">Project Showcase</a></li>
                <li><a href="#events" className="hover:text-primary transition-colors">Events & News</a></li>
                <li><a href="#about" className="hover:text-primary transition-colors">About OSSCCU</a></li>
                <li><a href="#contact" className="hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
                Community
              </h4>
              <ul className="space-y-2 text-xs text-foreground/75">
                <li>
                  <a
                    href="https://github.com/ossccu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    GitHub Organization
                  </a>
                </li>
                <li>
                  <a
                    href="https://discord.gg/ossccu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    Discord Community
                  </a>
                </li>
                <li>
                  <a
                    href="https://twitter.com/ossccu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    Twitter / X
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
                Platform Admin
              </h4>
              <p className="text-xs text-foreground/70 mb-3">
                Community maintainers can manage showcase items through the admin console.
              </p>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="border-primary/40 text-primary hover:bg-primary/10 text-xs w-full"
              >
                <a href="/admin">Access Admin Console</a>
              </Button>
            </div>
          </div>

          <div className="border-t border-primary/15 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Open Source Software Community at City University. Licensed under MIT.</p>
            <p>Empowering student creators worldwide.</p>
          </div>
        </div>
      </footer>

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
