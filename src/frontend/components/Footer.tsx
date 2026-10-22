"use client";

import Link from "next/link";
import { useAuth } from "@/frontend/contexts/AuthContext";
import { Button } from "@/frontend/components/ui/button";
import { ShieldCheck } from "lucide-react";

export function Footer() {
  const { user, isAdmin } = useAuth();
  const showAdminLink = Boolean(isAdmin || user?.role === "admin");

  return (
    <footer className="border-t border-primary/20 bg-card/40 py-12 mt-auto">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl font-extrabold text-white tracking-wider font-mono">
                OSS<span className="text-primary">CCU</span>
              </span>
            </div>
            <p className="text-foreground/70 text-xs leading-relaxed">
              Open Source Software Community at City University (OSSCCU). Dedicated to collaborative
              open-source engineering, education, and open technology.
            </p>
          </div>

          {/* Quick Nav */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs text-foreground/75">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-primary transition-colors">
                  Projects Showcase
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-primary transition-colors">
                  Events & Workshops
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  About & Committee
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Community Links */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              Community Hubs
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
                  className="hover:text-secondary transition-colors"
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

          {/* Platform / Admin (Strictly guarded) */}
          <div>
            {showAdminLink ? (
              <div>
                <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
                  Platform Admin
                </h4>
                <p className="text-xs text-foreground/70 mb-3">
                  Verified staff and convenors can manage showcases, events, and role delegations.
                </p>
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="border-primary/40 text-primary hover:bg-primary/10 text-xs w-full gap-1.5"
                >
                  <Link href="/admin">
                    <ShieldCheck size={14} />
                    <span>Access Admin Console</span>
                  </Link>
                </Button>
              </div>
            ) : (
              <div>
                <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
                  Get Involved
                </h4>
                <p className="text-xs text-foreground/70 mb-3">
                  Have an open-source project? Join our community of student contributors and showcase your work.
                </p>
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="border-secondary/40 text-secondary hover:bg-secondary/10 text-xs w-full"
                >
                  <Link href="/projects">Explore Community Work</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-primary/15 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Open Source Software Community at City University (OSSCCU). Licensed under MIT.
          </p>
          <p>City University, Savar, Dhaka, Bangladesh.</p>
        </div>
      </div>
    </footer>
  );
}
