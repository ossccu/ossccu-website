"use client";

import { useState, useMemo } from "react";
import { useEvents } from "@/frontend/hooks/useEvents";
import { CommunityEvent, EventType } from "@/frontend/types/event";
import { Badge } from "@/frontend/components/ui/badge";
import { Button } from "@/frontend/components/ui/button";
import { Spinner } from "@/frontend/components/ui/spinner";
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Flame,
  CheckCircle2,
} from "lucide-react";

export function EventsSection() {
  const { events, isLoading } = useEvents();
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  const upcomingEvents = useMemo(() => {
    return events.filter((e) => e.status === "upcoming" || e.status === "ongoing");
  }, [events]);

  const pastEvents = useMemo(() => {
    return events.filter((e) => e.status === "past");
  }, [events]);

  const displayedEvents = activeTab === "upcoming" ? upcomingEvents : pastEvents;

  const renderTypeBadge = (type: EventType) => {
    switch (type) {
      case "hackathon":
        return (
          <Badge className="bg-secondary/20 text-secondary border border-secondary/40 text-[11px] font-bold uppercase tracking-wider gap-1">
            <Flame size={12} /> Hackathon
          </Badge>
        );
      case "workshop":
        return (
          <Badge className="bg-primary/20 text-primary border border-primary/40 text-[11px] font-bold uppercase tracking-wider gap-1">
            <Sparkles size={12} /> Workshop
          </Badge>
        );
      case "meetup":
        return (
          <Badge className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[11px] font-bold uppercase tracking-wider gap-1">
            <Calendar size={12} /> Meetup
          </Badge>
        );
      case "seminar":
        return (
          <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold uppercase tracking-wider gap-1">
            <CheckCircle2 size={12} /> Seminar
          </Badge>
        );
    }
  };

  return (
    <section id="events" className="py-24 bg-card/25 border-y border-primary/20 relative overflow-hidden">
      {/* Ambient background light */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[600px] h-[400px] bg-secondary/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="container relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/30 rounded-full text-primary text-xs font-bold tracking-wider mb-3">
            <Calendar size={13} />
            <span>COMMUNITY CALENDAR</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Events & <span className="text-primary">Bootcamps</span>
          </h2>
          <p className="text-foreground/75 text-base md:text-lg">
            Level up your software engineering skills, participate in 48-hour minihackathons, and
            collaborate in live open-source sprint workshops.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center justify-center mb-10">
          <div className="inline-flex p-1 rounded-xl bg-card/80 border border-primary/30 backdrop-blur-md shadow-lg">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`text-xs sm:text-sm font-bold px-5 py-2.5 rounded-lg transition-all flex items-center gap-2 ${
                activeTab === "upcoming"
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "text-foreground/70 hover:text-white hover:bg-primary/10"
              }`}
            >
              <span>Upcoming Events</span>
              <span
                className={`text-[10px] px-2 py-0.2 rounded-full font-mono ${
                  activeTab === "upcoming"
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {upcomingEvents.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("past")}
              className={`text-xs sm:text-sm font-bold px-5 py-2.5 rounded-lg transition-all flex items-center gap-2 ${
                activeTab === "past"
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "text-foreground/70 hover:text-white hover:bg-primary/10"
              }`}
            >
              <span>Past Highlights</span>
              <span
                className={`text-[10px] px-2 py-0.2 rounded-full font-mono ${
                  activeTab === "past"
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {pastEvents.length}
              </span>
            </button>
          </div>
        </div>

        {/* Events Grid */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Spinner className="size-8 text-primary" />
            <p className="text-sm text-muted-foreground font-mono">Loading community events...</p>
          </div>
        ) : displayedEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedEvents.map((evt: CommunityEvent) => (
              <div
                key={evt.id}
                className="group bg-card/80 border border-primary/25 hover:border-primary/80 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,217,255,0.2)] hover:-translate-y-1.5"
              >
                <div>
                  {/* Banner Image */}
                  <div className="relative w-full h-48 bg-slate-950 overflow-hidden border-b border-primary/15">
                    {evt.bannerImage ? (
                      <img
                        src={evt.bannerImage}
                        alt={evt.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-950 to-slate-800 text-primary/40">
                        <Calendar size={48} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent pointer-events-none" />

                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                      {renderTypeBadge(evt.type)}
                      {evt.status === "ongoing" && (
                        <Badge className="bg-emerald-500 text-slate-950 text-[10px] font-bold animate-pulse">
                          Live Now
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors line-clamp-2 mb-3">
                      {evt.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-foreground/75 line-clamp-3 mb-6 leading-relaxed">
                      {evt.description}
                    </p>

                    {/* Metadata Row */}
                    <div className="space-y-2 pt-4 border-t border-primary/15 text-xs text-muted-foreground font-medium">
                      <div className="flex items-center gap-2 text-secondary font-semibold">
                        <Calendar size={14} className="shrink-0" />
                        <span>{evt.date}</span>
                      </div>
                      {evt.time && (
                        <div className="flex items-center gap-2 text-foreground/80">
                          <Clock size={14} className="shrink-0 text-primary" />
                          <span>{evt.time}</span>
                        </div>
                      )}
                      {evt.venue && (
                        <div className="flex items-center gap-2 text-foreground/80">
                          <MapPin size={14} className="shrink-0 text-cyan-400" />
                          <span className="truncate">{evt.venue}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <div className="p-6 pt-0">
                  <Button
                    asChild
                    className={`w-full font-bold h-10 text-xs tracking-wider gap-2 ${
                      activeTab === "upcoming"
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 neon-button"
                        : "border border-primary/30 bg-card hover:bg-primary/10 text-white"
                    }`}
                  >
                    <a
                      href={evt.registrationUrl || "#contact"}
                      target={evt.registrationUrl?.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                    >
                      <span>{activeTab === "upcoming" ? "Register / Inquire" : "View Archive"}</span>
                      {evt.registrationUrl?.startsWith("http") ? (
                        <ExternalLink size={13} />
                      ) : (
                        <ArrowRight size={13} />
                      )}
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="py-20 text-center bg-card/40 border border-dashed border-primary/30 rounded-2xl p-8 max-w-lg mx-auto backdrop-blur-md">
            <div className="w-14 h-14 rounded-2xl bg-secondary/10 border border-secondary/30 flex items-center justify-center text-secondary mx-auto mb-4">
              <Calendar size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {activeTab === "upcoming" ? "No Upcoming Events Scheduled Yet" : "No Past Archive Entries"}
            </h3>
            <p className="text-sm text-foreground/75 mb-6 leading-relaxed">
              We&apos;re cooking up the next hackathon and workshop series. Stay tuned on our Discord
              community to get first access to registrations!
            </p>
            <Button
              asChild
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold px-6 h-11 neon-button gap-2 text-xs"
            >
              <a href="https://discord.gg/ossccu" target="_blank" rel="noopener noreferrer">
                <MessageSquare size={16} />
                <span>Join Discord Community</span>
              </a>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
