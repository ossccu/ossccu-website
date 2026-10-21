"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";
import { Github, Sparkles, Mail, Lock, User, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const { signInWithGitHub, signInWithEmail, signUpWithEmail, signInWithDemo } = useAuth();
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleGitHub = async () => {
    try {
      setIsSubmitting(true);
      await signInWithGitHub();
      onOpenChange(false);
    } catch {
      // Handled in context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      setIsSubmitting(true);
      if (activeTab === "signin") {
        await signInWithEmail(email, password);
      } else {
        if (!name.trim()) {
          toast.error("Please enter your name.");
          setIsSubmitting(false);
          return;
        }
        await signUpWithEmail(email, name, password);
      }
      onOpenChange(false);
    } catch {
      // Error handled in context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = (role: "contributor" | "admin") => {
    signInWithDemo(role);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-card/95 border-primary/30 text-foreground p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        <DialogHeader className="text-center sm:text-center">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary mx-auto mb-2 shadow-[0_0_20px_rgba(0,217,255,0.2)]">
            <Sparkles size={22} />
          </div>
          <DialogTitle className="text-2xl font-bold text-white tracking-tight">
            Member Access Portal
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Sign in to submit repositories, manage your contributor portfolio, and track review status.
          </DialogDescription>
        </DialogHeader>

        {/* GitHub OAuth Button */}
        <div className="mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleGitHub}
            disabled={isSubmitting}
            className="w-full h-11 border-primary/30 bg-card hover:bg-primary/10 text-white font-medium text-xs gap-2.5 transition-all shadow-sm"
          >
            <Github size={18} />
            <span>Continue with GitHub</span>
          </Button>
        </div>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-primary/20" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-mono text-muted-foreground">
            <span className="bg-card px-2">or with email</span>
          </div>
        </div>

        {/* Email Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "signin" | "signup")}>
          <TabsList className="grid grid-cols-2 bg-background/80 border border-primary/20 p-1 mb-4">
            <TabsTrigger value="signin" className="text-xs font-semibold data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              Sign In
            </TabsTrigger>
            <TabsTrigger value="signup" className="text-xs font-semibold data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              Register
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleEmailSubmit} className="space-y-3.5">
            {activeTab === "signup" && (
              <div className="space-y-1.5">
                <Label htmlFor="auth-name" className="text-xs text-slate-300 flex items-center gap-1.5">
                  <User size={13} /> Full Name
                </Label>
                <Input
                  id="auth-name"
                  type="text"
                  placeholder="e.g. Tanvir Ahmed"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-background/80 border-primary/30 text-sm h-10"
                  required
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="auth-email" className="text-xs text-slate-300 flex items-center gap-1.5">
                <Mail size={13} /> Email Address
              </Label>
              <Input
                id="auth-email"
                type="email"
                placeholder="you@cityuniversity.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background/80 border-primary/30 text-sm h-10"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="auth-pwd" className="text-xs text-slate-300 flex items-center gap-1.5">
                <Lock size={13} /> Password
              </Label>
              <Input
                id="auth-pwd"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background/80 border-primary/30 text-sm h-10"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold h-10 text-xs tracking-wider neon-button mt-2"
            >
              {isSubmitting ? (
                <>
                  <Spinner className="size-4 mr-2" />
                  <span>Processing...</span>
                </>
              ) : activeTab === "signin" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </Tabs>

        {/* Quick Demo Logins for Fast Local Testing */}
        <div className="mt-5 pt-4 border-t border-primary/20 text-center">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-mono mb-2">
            Instant Test Profiles (Local Dev)
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin("contributor")}
              className="text-xs font-semibold px-2.5 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-all flex items-center justify-center gap-1.5"
            >
              <User size={13} /> Demo Contributor
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin("admin")}
              className="text-xs font-semibold px-2.5 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 transition-all flex items-center justify-center gap-1.5"
            >
              <ShieldCheck size={13} /> Demo Admin
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
