"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/AuthModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Code2,
  Menu,
  X,
  PlusCircle,
  ShieldCheck,
  User,
  LayoutDashboard,
  LogOut,
  LogIn,
  ChevronDown,
} from "lucide-react";

interface NavbarProps {
  onOpenSubmitModal?: () => void;
}

export function Navbar({ onOpenSubmitModal }: NavbarProps) {
  const { user, isAdmin, signOut } = useAuth();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const pathname = usePathname();
  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight > 0) {
        const scrollPercent = (totalScroll / windowHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, scrollPercent)));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: isHomePage ? "#home" : "/#home" },
    { label: "Projects", href: isHomePage ? "#projects" : "/#projects" },
    { label: "Events", href: isHomePage ? "#events" : "/#events" },
    { label: "About", href: isHomePage ? "#about" : "/#about" },
    { label: "Contact", href: isHomePage ? "#contact" : "/#contact" },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (isHomePage && href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.replace("#", "");
      const elem = document.getElementById(targetId);
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
      }
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-primary/20 transition-all">
        {/* Subtle Top Scroll Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-0.5 sm:h-1 bg-transparent overflow-hidden pointer-events-none">
          <div
            className="h-full bg-gradient-to-r from-primary via-emerald-400 to-secondary transition-all duration-150 ease-out shadow-[0_0_12px_rgba(0,217,255,0.7)]"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        <div className="container flex items-center justify-between h-16">
          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-2.5 font-bold tracking-wider group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/40 flex items-center justify-center text-primary group-hover:scale-105 group-hover:border-primary transition-all shadow-[0_0_15px_rgba(0,217,255,0.2)]">
              <Code2 size={20} className="text-primary group-hover:rotate-6 transition-transform" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold text-white tracking-wider flex items-center gap-1.5">
                OSS<span className="text-primary">CCU</span>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </span>
              <span className="text-[10px] tracking-widest uppercase text-muted-foreground hidden sm:inline">
                City University Open Source
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors tracking-wide py-1 border-b-2 border-transparent hover:border-primary/60"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* User Controls & CTAs */}
          <div className="hidden md:flex items-center gap-3">
            {onOpenSubmitModal && (
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenSubmitModal}
                className="border-primary/40 text-primary hover:bg-primary/10 hover:border-primary text-xs font-semibold gap-1.5"
              >
                <PlusCircle size={15} />
                Submit Project
              </Button>
            )}

            {/* User Dropdown or Sign In Button */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 p-1.5 pr-2.5 rounded-full bg-card/80 hover:bg-primary/15 border border-primary/30 transition-all focus:outline-none group">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="w-7 h-7 rounded-full object-cover border border-primary/40"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                        {user.name.charAt(0)}
                      </div>
                    )}
                    <span className="text-xs font-semibold text-white group-hover:text-primary transition-colors max-w-28 truncate">
                      {user.name}
                    </span>
                    <ChevronDown size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-card/95 border-primary/30 backdrop-blur-xl p-1.5 shadow-2xl text-foreground"
                >
                  <DropdownMenuLabel className="p-2">
                    <p className="text-xs font-bold text-white truncate">{user.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="text-[10px] px-2 py-0.2 rounded-full font-mono bg-primary/15 text-primary border border-primary/30">
                        {user.isAdmin ? "Executive Admin" : "Community Contributor"}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-primary/20" />

                  <DropdownMenuItem asChild className="cursor-pointer text-xs focus:bg-primary/15 focus:text-primary">
                    <Link href="/dashboard" className="flex items-center gap-2 w-full py-1.5">
                      <LayoutDashboard size={15} />
                      <span>My Projects & Portfolio</span>
                    </Link>
                  </DropdownMenuItem>

                  {onOpenSubmitModal && (
                    <DropdownMenuItem
                      onClick={onOpenSubmitModal}
                      className="cursor-pointer text-xs focus:bg-primary/15 focus:text-primary py-1.5 gap-2"
                    >
                      <PlusCircle size={15} />
                      <span>Submit New Project</span>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem asChild className="cursor-pointer text-xs focus:bg-primary/15 focus:text-primary">
                    <Link href="/admin" className="flex items-center gap-2 w-full py-1.5">
                      <ShieldCheck size={15} />
                      <span>Admin Console</span>
                      {isAdmin && (
                        <span className="ml-auto text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 rounded">
                          Staff
                        </span>
                      )}
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-primary/20" />

                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="cursor-pointer text-xs text-rose-400 focus:bg-rose-500/15 focus:text-rose-300 py-1.5 gap-2"
                  >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                size="sm"
                onClick={() => setAuthModalOpen(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs tracking-wide shadow-md shadow-primary/20 gap-1.5 neon-button"
              >
                <LogIn size={15} />
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex items-center gap-2 md:hidden">
            {user ? (
              <Button
                asChild
                size="sm"
                variant="outline"
                className="border-primary/40 text-primary hover:bg-primary/10 text-xs px-2.5 h-8 gap-1"
              >
                <Link href="/dashboard">
                  <User size={13} />
                  <span>My Profile</span>
                </Link>
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => setAuthModalOpen(true)}
                className="bg-primary text-primary-foreground text-xs px-2.5 h-8 gap-1"
              >
                <LogIn size={13} />
                <span>Sign In</span>
              </Button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-foreground/80 hover:text-primary rounded-md focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-primary/20 bg-background/95 backdrop-blur-xl px-4 py-5 shadow-2xl animate-in slide-in-from-top duration-200">
            {user && (
              <div className="mb-4 pb-3 border-b border-primary/20 flex items-center gap-3">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border border-primary/40"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    {user.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="text-sm font-bold text-white">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
            )}

            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-base font-medium px-3 py-2 rounded-md hover:bg-primary/10 text-foreground/90 hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              ))}

              <div className="pt-3 border-t border-primary/20 flex flex-col gap-2">
                {user && (
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start border-primary/30 text-white gap-2"
                  >
                    <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      <LayoutDashboard size={16} />
                      My Portfolio Dashboard
                    </Link>
                  </Button>
                )}

                {onOpenSubmitModal && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenSubmitModal();
                    }}
                    className="w-full justify-center border-primary/40 text-primary hover:bg-primary/10 gap-2"
                  >
                    <PlusCircle size={16} />
                    Submit Project
                  </Button>
                )}

                <Button
                  asChild
                  className="w-full justify-center bg-primary text-primary-foreground font-semibold gap-2"
                >
                  <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                    <ShieldCheck size={16} />
                    Admin Console
                  </Link>
                </Button>

                {user && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full justify-center text-rose-400 hover:bg-rose-500/10 gap-2"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </Button>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </>
  );
}
