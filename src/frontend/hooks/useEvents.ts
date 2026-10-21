"use client";

import { useEffect, useState, useCallback } from "react";
import { CommunityEvent, CommunityEventInput } from "@/frontend/types/event";

const STORAGE_KEY = "ossccu_community_events_v1";

export function useEvents() {
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setIsLoading(true);

      try {
        const res = await fetch("/api/events");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setEvents(data);
            if (typeof window !== "undefined") {
              try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
              } catch {
                // Quota
              }
            }
            setError(null);
            setIsLoading(false);
            return;
          }
        }
      } catch {
        // Fallback
      }

      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setEvents(JSON.parse(stored));
        }
      }
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load community events.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const addEvent = async (input: CommunityEventInput) => {
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (res.ok) {
        const created = await res.json();
        setEvents((prev) => [created, ...prev]);
        return created;
      }
    } catch {
      // Offline fallback
    }

    const localCreated: CommunityEvent = {
      ...input,
      id: `evt-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
    };

    setEvents((prev) => {
      const next = [localCreated, ...prev];
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      }
      return next;
    });

    return localCreated;
  };

  return {
    events,
    isLoading,
    error,
    refresh: fetchEvents,
    addEvent,
  };
}
