"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Mail, MessageCircle, Github, Zap } from "lucide-react";
import { useState } from "react";

/**
 * OSSCCU Website - Cyberpunk Themed
 * Design Philosophy: High-contrast neon colors, dynamic animations, bold typography
 * Color Palette: Dark background (#0a0e27), Cyan (#00d9ff), Lime Green (#39ff14), Magenta (#ff006e)
 */

export default function Home() {
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);

  const announcements = [
    {
      title: "OSSCCU Minihack 2025: Code & Create",
      description: "Join us for an exciting minihackathon where open-source enthusiasts collaborate to build amazing projects.",
      date: "March 15, 2025",
      image: "https://private-us-east-1.manuscdn.com/sessionFile/A7iFtyXGjlnyzBzOWtF7el/sandbox/ZLZSBfxgSOTs970Z4tn9j6-img-2_1770701921000_na1fn_Y29tbXVuaXR5LWhlcm8.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvQTdpRnR5WEdqbG55ekJ6T1d0RjdlbC9zYW5kYm94L1pMWlNCZnhnU09Uczk3MFo0dG45ajYtaW1nLTJfMTc3MDcwMTkyMTAwMF9uYTFmbl9ZMjl0YlhWdWFYUjVMV2hsY204LnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=j7dHTP8v1oAJZFdFF~8jLNyD9W66g1--Ph4susjWiXgJk5~WoiRnUkUi97KAm4qfa4EFpVE1mEXw36mCtUKQVgnOdeq6PTtluzj446dcotsj6Ej8idqifjgrP7kWV3bccApLHc60BGtA7GOaYjlrMb3H-THAMj0zEV-utq6SLo-nk6HMxeiCrYSHEeYVM8V1hBXUOIkzTItJg~jLNt9BsC~jGVeZfiyUrwu8E77GafBCJJs-NnQ00GSOVbiikA~LGARAD18YAtZZR~jhalFt13imwax0YitzJpguM0YlyEZxmxEnXu8dKc3p3ScyeyXuTsQNWCe0JsPyvwTUcDeN3A__",
    },
    {
      title: "Spring Semester Kickoff",
      description: "Meet the OSSCCU community, learn about our projects, and find your perfect open-source contribution.",
      date: "January 20, 2025",
      image: "https://private-us-east-1.manuscdn.com/sessionFile/A7iFtyXGjlnyzBzOWtF7el/sandbox/ZLZSBfxgSOTs970Z4tn9j6-img-3_1770701929000_na1fn_cHJvamVjdHMtc2hvd2Nhc2U.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvQTdpRnR5WEdqbG55ekJ6T1d0RjdlbC9zYW5kYm94L1pMWlNCZnhnU09Uczk3MFo0dG45ajYtaW1nLTFfMTc3MDcwMTkyOTAwMF9uYTFmbl9jSEp2YW1WamRITXRjMmh2ZDJOaGMyVS5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=VqW7kKPrbTROCx6LX3HHa7GwyvuDC5qaOcgnceCuw4fv9t-Uh6VmMl46n66q4c8Nsyw4ElHMN129Y-icbx87CPROUh1HlTSFhHhygcoKfgDvQTWQp1L0wz0TcU3dcEeLwAQU1HEMRI6Ejj3ohBzvJSSKmS~GFUWds~KBNWIu-8kH-puOSWfBGM07P-38ab8DKHDyb-sGjJcxny0HMzXMytOqrPFWOg0VR9XtV4qbtMN~Va1YU3YwHYtSavHJHF8ol8lRQCLsrBuiqtBz9n2Ni37JYfFVnQKNfqfp6EDYRxnH-v1fovfglRlxvNn-w3sOn83lN9fg3kdhff6EZMuKMA__",
    },
  ];

  const projects = [
    {
      name: "Study Companion",
      description: "A collaborative study platform for open-source learning and knowledge sharing.",
      tags: ["React", "Node.js", "MongoDB"],
      github: "#",
    },
    {
      name: "Code Collab",
      description: "Real-time collaborative code editor for pair programming and code reviews.",
      tags: ["TypeScript", "WebSocket", "React"],
      github: "#",
    },
    {
      name: "OSS Dashboard",
      description: "Analytics dashboard for tracking open-source contributions and community metrics.",
      tags: ["Python", "Django", "D3.js"],
      github: "#",
    },
    {
      name: "Community Bot",
      description: "Discord bot for managing OSSCCU community events and notifications.",
      tags: ["Python", "Discord.py", "PostgreSQL"],
      github: "#",
    },
    {
      name: "Contribution Tracker",
      description: "Tool to help members track their open-source contributions and impact.",
      tags: ["Vue.js", "Firebase", "GitHub API"],
      github: "#",
    },
    {
      name: "Learning Hub",
      description: "Curated resources and tutorials for learning open-source development.",
      tags: ["Next.js", "Markdown", "Tailwind"],
      github: "#",
    },
  ];

  const communityStats = [
    { label: "Active Members", value: "500+" },
    { label: "Founded", value: "2023" },
    { label: "Projects", value: "20+" },
    { label: "Contributors", value: "1000+" },
  ];

  const nextAnnouncement = () => {
    setCurrentAnnouncement((prev) => (prev + 1) % announcements.length);
  };

  const prevAnnouncement = () => {
    setCurrentAnnouncement((prev) => (prev - 1 + announcements.length) % announcements.length);
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-primary/30">
        <div className="container flex items-center justify-between h-16">
          <div className="text-2xl font-bold text-primary">OSSCCU</div>
          <div className="hidden md:flex gap-8 items-center">
            <a href="#about" className="hover:text-primary transition-colors">About</a>
            <a href="#projects" className="hover:text-primary transition-colors">Projects</a>
            <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/80 neon-button">
              Join Now
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://private-us-east-1.manuscdn.com/sessionFile/A7iFtyXGjlnyzBzOWtF7el/sandbox/ZLZSBfxgSOTs970Z4tn9j6-img-1_1770701926000_na1fn_aGVyby13YXZlLWJn.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvQTdpRnR5WEdqbG55ekJ6T1d0RjdlbC9zYW5kYm94L1pMWlNCZnhnU09Uczk3MFo0dG45ajYtaW1nLTFfMTc3MDcwMTkyNjAwMF9uYTFmbl9hR1Z5YnkxM1lYWmxMV0puLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=PJvXRLEkHo3KdqI24nvbePYwLi4LxhbMRQr6DeFCTHquDWWtKPITyei9khJEFA2WcwBUgtiXbO5craZvWJpp2h2OvYTMlAIbB2xlKpD-uneT3btb4TW4z-t18IzuhvTsWpyOpAFauQ~kZDmMBpPPUwtg3WdKmC84vKIHMhpwAHzmjdrIGTD9gbH2gj-5aY44BdfIz4bqrQndesixAZfGVmZSXshw6vkHgXIY3VXSc1Rn3yCqqJUc3AdEplb6~RNeVlHj46Mo~u66dRFhYAPpOjM2OhMmsEpKcOV85mLD3HcUxgJPgUWOT~us2VRPc9YKGv-y1~F7HXdINGxKtCLunA__"
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-background/40"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-white">
            let's build
          </h1>
          <h2 className="text-4xl md:text-6xl font-bold mb-8 text-secondary bg-secondary/20 inline-block px-6 py-3 rounded">
            open source
          </h2>
          <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto mb-12">
            Join the <span className="text-primary font-bold shadow-lg">Open Source Software Community City University</span> . Collaborate, learn, and create amazing projects together.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/80 neon-button px-8 py-6 text-lg">
              JOIN NOW
            </Button>
            <Button className="border-2 border-primary text-primary hover:bg-primary/10 neon-button px-8 py-6 text-lg">
              LEARN MORE
            </Button>
          </div>
        </div>
      </section>

      {/* Announcement Carousel */}
      <section className="py-20 bg-background/50 border-y border-primary/20">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div className="inline-block px-4 py-2 bg-primary/20 border border-primary rounded text-primary text-sm font-bold">
              ANNOUNCEMENT
            </div>
          </div>

          <div className="relative flex items-center gap-8">
            <button
              onClick={prevAnnouncement}
              className="p-3 hover:bg-primary/20 rounded transition-colors"
            >
              <ChevronLeft className="text-primary" size={24} />
            </button>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <h3 className="text-3xl font-bold mb-4 text-primary">
                  {announcements[currentAnnouncement].title}
                </h3>
                <p className="text-foreground/70 mb-6">
                  {announcements[currentAnnouncement].description}
                </p>
                <p className="text-sm text-secondary font-bold mb-6">
                  {announcements[currentAnnouncement].date}
                </p>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/80 neon-button">
                  LEARN MORE
                </Button>
              </div>
              <div className="order-1 md:order-2">
                <img
                  src={announcements[currentAnnouncement].image}
                  alt="Announcement"
                  className="rounded-lg border-2 border-primary/30 w-full h-64 object-cover"
                />
              </div>
            </div>

            <button
              onClick={nextAnnouncement}
              className="p-3 hover:bg-primary/20 rounded transition-colors"
            >
              <ChevronRight className="text-primary" size={24} />
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="container">
          <h2 className="text-4xl font-bold mb-12 text-center">
            About <span className="text-primary">OSSCCU</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div>
              <p className="text-lg text-foreground/80 mb-6">
                The Open Source Software Community at City University is a vibrant community of developers, designers, and enthusiasts dedicated to building amazing open-source projects. Founded in 2023, we've grown to over 500 active members collaborating on meaningful contributions to the open-source ecosystem.
              </p>
              <p className="text-lg text-foreground/80">
                We believe in the power of collaboration, transparency, and community-driven development. Whether you're a beginner or an experienced developer, there's a place for you in OSSCCU.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {communityStats.map((stat, index) => (
                <div
                  key={index}
                  className="p-6 border-2 border-primary/30 rounded-lg hover:border-primary transition-colors hover:bg-primary/5"
                >
                  <div className="text-3xl font-bold text-secondary mb-2">{stat.value}</div>
                  <div className="text-foreground/70">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border-2 border-primary/30 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-6 text-primary">Why Join OSSCCU?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex gap-4">
                <Zap className="text-secondary flex-shrink-0" size={24} />
                <div>
                  <h4 className="font-bold mb-2">Learn & Grow</h4>
                  <p className="text-foreground/70">Develop your skills through real-world open-source projects and mentorship.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <MessageCircle className="text-primary flex-shrink-0" size={24} />
                <div>
                  <h4 className="font-bold mb-2">Community</h4>
                  <p className="text-foreground/70">Connect with like-minded developers and build lasting friendships.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Github className="text-accent flex-shrink-0" size={24} />
                <div>
                  <h4 className="font-bold mb-2">Impact</h4>
                  <p className="text-foreground/70">Make a real difference by contributing to projects that matter.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-background/50 border-y border-primary/20">
        <div className="container">
          <h2 className="text-4xl font-bold mb-12 text-center">
            Featured <span className="text-secondary">Projects</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {projects.map((project, index) => (
              <div
                key={index}
                className="bg-card border-2 border-primary/30 rounded-lg p-6 hover:border-primary hover:shadow-lg hover:shadow-primary/20 transition-all group"
              >
                <h3 className="text-xl font-bold mb-3 text-primary group-hover:text-secondary transition-colors">
                  {project.name}
                </h3>
                <p className="text-foreground/70 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="text-xs px-3 py-1 bg-primary/10 text-primary rounded-full border border-primary/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Button className="w-full bg-accent/20 text-accent border border-accent hover:bg-accent/30 neon-button">
                  View on GitHub
                </Button>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/80 neon-button px-8 py-6 text-lg">
              SEE ALL PROJECTS
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="container">
          <h2 className="text-4xl font-bold mb-12 text-center">
            Get in <span className="text-accent">Touch</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-card border-2 border-primary/30 rounded-lg p-8 text-center hover:border-primary transition-colors">
              <Mail className="text-primary mx-auto mb-4" size={32} />
              <h3 className="font-bold mb-2">Email</h3>
              <p className="text-foreground/70">contact@ossccu.edu</p>
            </div>
            <div className="bg-card border-2 border-primary/30 rounded-lg p-8 text-center hover:border-primary transition-colors">
              <MessageCircle className="text-secondary mx-auto mb-4" size={32} />
              <h3 className="font-bold mb-2">Discord</h3>
              <p className="text-foreground/70">Join our Discord community</p>
            </div>
            <div className="bg-card border-2 border-primary/30 rounded-lg p-8 text-center hover:border-primary transition-colors">
              <Github className="text-accent mx-auto mb-4" size={32} />
              <h3 className="font-bold mb-2">GitHub</h3>
              <p className="text-foreground/70">github.com/ossccu</p>
            </div>
          </div>

          <div className="bg-card border-2 border-primary/30 rounded-lg p-8 max-w-2xl mx-auto">
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full bg-background border-2 border-primary/30 rounded px-4 py-2 text-foreground placeholder-foreground/50 focus:border-primary outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Subject</label>
                <input
                  type="text"
                  placeholder="Message subject"
                  className="w-full bg-background border-2 border-primary/30 rounded px-4 py-2 text-foreground placeholder-foreground/50 focus:border-primary outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Message</label>
                <textarea
                  placeholder="Your message here..."
                  rows={5}
                  className="w-full bg-background border-2 border-primary/30 rounded px-4 py-2 text-foreground placeholder-foreground/50 focus:border-primary outline-none transition-colors"
                ></textarea>
              </div>
              <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80 neon-button">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-primary/20 bg-background/50 py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="font-bold text-primary mb-4">OSSCCU</h4>
              <p className="text-foreground/70 text-sm">Open Source Software Community at City University</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li><a href="#about" className="hover:text-primary transition-colors">About</a></li>
                <li><a href="#projects" className="hover:text-primary transition-colors">Projects</a></li>
                <li><a href="#contact" className="hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li><a href="#" className="hover:text-primary transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">GitHub</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Twitter</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary/20 pt-8 text-center text-foreground/70 text-sm">
            <p>&copy; 2025 Open Source Software Community at City University. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
