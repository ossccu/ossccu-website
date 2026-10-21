"use client";

import { useEffect, useState } from "react";
import { Project, ProjectCategory, ProjectInput, ProjectStatus } from "@/frontend/types/project";
import { useAuth } from "@/frontend/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/frontend/components/ui/dialog";
import { Input } from "@/frontend/components/ui/input";
import { Label } from "@/frontend/components/ui/label";
import { Textarea } from "@/frontend/components/ui/textarea";
import { Button } from "@/frontend/components/ui/button";
import { Switch } from "@/frontend/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/frontend/components/ui/select";
import { Spinner } from "@/frontend/components/ui/spinner";
import { toast } from "sonner";
import { Sparkles, Image as ImageIcon, ShieldAlert, CheckCircle2, UserCheck } from "lucide-react";

interface ProjectFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectToEdit?: Project | null;
  onSubmit: (data: ProjectInput) => Promise<void>;
  isAdmin?: boolean;
}

const CATEGORIES: ProjectCategory[] = ["Web", "AI/ML", "IoT/Robotics", "Tools", "Mobile"];

const SAMPLE_PRESET_IMAGES = [
  {
    label: "Web App",
    url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Code / Editor",
    url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "AI / Analytics",
    url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Hardware / IoT",
    url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
  },
];

export function ProjectFormDialog({
  open,
  onOpenChange,
  projectToEdit,
  onSubmit,
  isAdmin = false,
}: ProjectFormDialogProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ProjectCategory>("Web");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [tagsString, setTagsString] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorRole, setAuthorRole] = useState("");
  const [authorGithub, setAuthorGithub] = useState("");
  const [authorAvatar, setAuthorAvatar] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<ProjectStatus>(isAdmin ? "approved" : "pending");

  // Sync state when projectToEdit changes or modal opens
  useEffect(() => {
    if (projectToEdit) {
      setTitle(projectToEdit.title);
      setDescription(projectToEdit.description);
      setCategory(projectToEdit.category);
      setThumbnailUrl(projectToEdit.thumbnailUrl || "");
      setTagsString(projectToEdit.tags.join(", "));
      setAuthorName(projectToEdit.author.name);
      setAuthorRole(projectToEdit.author.role);
      setAuthorGithub(projectToEdit.author.githubUsername || "");
      setAuthorAvatar(projectToEdit.author.avatarUrl || "");
      setGithubUrl(projectToEdit.githubUrl);
      setDemoUrl(projectToEdit.demoUrl || "");
      setFeatured(!!projectToEdit.featured);
      setStatus(projectToEdit.status || "approved");
    } else {
      // If user is logged in, prefill their contributor info
      setTitle("");
      setDescription("");
      setCategory("Web");
      setThumbnailUrl(
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80"
      );
      setTagsString("React, TypeScript, TailwindCSS");
      setAuthorName(user?.name || "");
      setAuthorRole(user ? `${user.batch || "Student Contributor"}` : "Student Contributor");
      setAuthorGithub(user?.githubUsername || "");
      setAuthorAvatar(user?.avatarUrl || "");
      setGithubUrl("https://github.com/ossccu/");
      setDemoUrl("");
      setFeatured(false);
      setStatus(isAdmin ? "approved" : "pending");
    }
  }, [projectToEdit, open, isAdmin, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a project title.");
      return;
    }
    if (!description.trim()) {
      toast.error("Please enter a project description.");
      return;
    }
    if (!githubUrl.trim()) {
      toast.error("Please enter a valid GitHub repository URL.");
      return;
    }
    if (!authorName.trim()) {
      toast.error("Please enter the primary author or maintainer name.");
      return;
    }

    const tags = tagsString
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const projectData: ProjectInput = {
      title: title.trim(),
      description: description.trim(),
      category,
      thumbnailUrl:
        thumbnailUrl.trim() ||
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
      tags: tags.length > 0 ? tags : ["Open Source", category],
      author: {
        name: authorName.trim(),
        role: authorRole.trim() || "Student Contributor",
        githubUsername: authorGithub.trim() || undefined,
        avatarUrl:
          authorAvatar.trim() ||
          (authorGithub.trim() ? `https://github.com/${authorGithub.trim()}.png` : undefined),
      },
      githubUrl: githubUrl.trim(),
      demoUrl: demoUrl.trim() || undefined,
      featured,
      userId: projectToEdit ? projectToEdit.userId : user?.id,
      userEmail: projectToEdit ? projectToEdit.userEmail : user?.email,
      status: isAdmin ? status : (projectToEdit ? projectToEdit.status : "pending"),
      submittedAt: projectToEdit?.submittedAt || new Date().toISOString(),
    };

    try {
      setIsSubmitting(true);
      await onSubmit(projectData);

      if (!isAdmin && !projectToEdit) {
        toast.success(
          "Your project has been submitted for review by the OSSCCU executive team!",
          { duration: 5000 }
        );
      } else {
        toast.success(
          projectToEdit ? "Project updated successfully!" : "New project published successfully!"
        );
      }

      onOpenChange(false);
    } catch (err: unknown) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to save project.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-primary/30 text-foreground p-6 sm:p-8">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary text-sm font-semibold mb-1">
            <Sparkles size={16} />
            <span>
              {projectToEdit
                ? "Modify Project Record"
                : isAdmin
                ? "Register Community Project (Admin)"
                : "Submit Your Open-Source Project"}
            </span>
          </div>
          <DialogTitle className="text-2xl font-bold text-white">
            {projectToEdit ? "Edit Project" : "Submit Community Project"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            {isAdmin
              ? "Fill in the project specifications below. Changes persist instantly."
              : "Share your open-source work with the City University community. All submissions are reviewed for approval before being showcased."}
          </DialogDescription>
        </DialogHeader>

        {/* User Binding Indicator */}
        {user && !projectToEdit && !isAdmin && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300">
            <UserCheck size={18} className="shrink-0" />
            <div>
              <p className="font-semibold text-white">
                Linked to Contributor Profile: <span className="text-emerald-400">{user.name}</span>
              </p>
              <p className="text-muted-foreground">
                This repository will automatically appear in your personal dashboard portfolio.
              </p>
            </div>
          </div>
        )}

        {!user && !projectToEdit && !isAdmin && (
          <div className="flex items-start gap-3 p-3.5 rounded-lg bg-primary/10 border border-primary/30 text-xs text-foreground/90">
            <CheckCircle2 size={18} className="text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-primary mb-0.5">Community Submission Workflow</p>
              <p className="text-foreground/75 leading-relaxed">
                Your repository will be verified by the OSSCCU review team and published to the
                public showcase upon approval. You can also sign in to manage your submissions in your portfolio.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="title" className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Project Title <span className="text-red-400">*</span>
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Study Companion"
                className="bg-background/80 border-primary/30 focus-visible:border-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Category
              </Label>
              <Select
                value={category}
                onValueChange={(val: ProjectCategory) => setCategory(val)}
              >
                <SelectTrigger id="category" className="bg-background/80 border-primary/30">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="bg-card border-primary/30 text-foreground">
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Admin Status Selector */}
          {isAdmin && (
            <div className="p-3.5 rounded-lg bg-background/60 border border-primary/30 space-y-2">
              <Label htmlFor="admin-status" className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <ShieldAlert size={14} /> Moderation Status
              </Label>
              <Select
                value={status}
                onValueChange={(val: ProjectStatus) => setStatus(val)}
              >
                <SelectTrigger id="admin-status" className="bg-background border-primary/30 text-sm">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent className="bg-card border-primary/30 text-foreground">
                  <SelectItem value="approved">Approved (Live on Public Showcase)</SelectItem>
                  <SelectItem value="pending">Pending Review</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Description / Impact Summary <span className="text-red-400">*</span>
            </Label>
            <Textarea
              id="description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this project do and how does it benefit City University students or the open-source community?"
              className="bg-background/80 border-primary/30 focus-visible:border-primary resize-y"
              required
            />
          </div>

          {/* Cover Image & Presets */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="thumbnail" className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Cover Image URL
              </Label>
              <span className="text-[11px] text-muted-foreground">Select a tech preset or paste URL</span>
            </div>
            <div className="flex gap-2">
              <Input
                id="thumbnail"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                placeholder="https://..."
                className="bg-background/80 border-primary/30 text-xs font-mono"
              />
            </div>
            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <ImageIcon size={12} /> Presets:
              </span>
              {SAMPLE_PRESET_IMAGES.map((preset) => (
                <button
                  type="button"
                  key={preset.label}
                  onClick={() => setThumbnailUrl(preset.url)}
                  className="text-[11px] px-2 py-0.5 rounded border border-primary/20 bg-primary/5 hover:bg-primary/20 text-primary transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tech Stack Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags" className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Tech Stack Badges (comma-separated)
            </Label>
            <Input
              id="tags"
              value={tagsString}
              onChange={(e) => setTagsString(e.target.value)}
              placeholder="e.g. Python, Django, Next.js, IoT, Docker"
              className="bg-background/80 border-primary/30"
            />
          </div>

          {/* Author Details */}
          <div className="p-4 rounded-lg bg-background/50 border border-primary/20 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              Contributor Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="authorName" className="text-xs text-slate-300">
                  Author / Contributor Name <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="authorName"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Tanvir Ahmed"
                  className="bg-background border-primary/30 text-sm"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="authorRole" className="text-xs text-slate-300">
                  Role / Designation
                </Label>
                <Input
                  id="authorRole"
                  value={authorRole}
                  onChange={(e) => setAuthorRole(e.target.value)}
                  placeholder="e.g. Student Contributor / Maintainer"
                  className="bg-background border-primary/30 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="authorGithub" className="text-xs text-slate-300">
                  GitHub Username
                </Label>
                <Input
                  id="authorGithub"
                  value={authorGithub}
                  onChange={(e) => setAuthorGithub(e.target.value)}
                  placeholder="e.g. tanvir-dev"
                  className="bg-background border-primary/30 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="authorAvatar" className="text-xs text-slate-300">
                  Avatar Photo URL (Optional)
                </Label>
                <Input
                  id="authorAvatar"
                  value={authorAvatar}
                  onChange={(e) => setAuthorAvatar(e.target.value)}
                  placeholder="Auto-derived from GitHub if empty"
                  className="bg-background border-primary/30 text-sm"
                />
              </div>
            </div>
          </div>

          {/* URLs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="githubUrl" className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                GitHub Repository URL <span className="text-red-400">*</span>
              </Label>
              <Input
                id="githubUrl"
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/ossccu/..."
                className="bg-background/80 border-primary/30 font-mono text-xs"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="demoUrl" className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Live Demo URL (Optional)
              </Label>
              <Input
                id="demoUrl"
                type="url"
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                placeholder="https://myproject.demo.com"
                className="bg-background/80 border-primary/30 font-mono text-xs"
              />
            </div>
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-primary/20">
            <div className="space-y-0.5">
              <div className="text-sm font-semibold text-white">Feature on Top of Showcase</div>
              <div className="text-xs text-muted-foreground">
                Highlight this repository with a badge and priority sorting.
              </div>
            </div>
            <Switch
              checked={featured}
              onCheckedChange={setFeatured}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          <DialogFooter className="gap-2 pt-2 border-t border-primary/20">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-primary/30 text-foreground"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold gap-2 min-w-28"
            >
              {isSubmitting ? (
                <>
                  <Spinner className="size-4" />
                  <span>Saving...</span>
                </>
              ) : projectToEdit ? (
                "Update Project"
              ) : isAdmin ? (
                "Publish Project"
              ) : (
                "Submit for Review"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
