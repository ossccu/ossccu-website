export type EventType = "hackathon" | "workshop" | "seminar" | "meetup";
export type EventStatus = "upcoming" | "ongoing" | "past";

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  venue?: string;
  type: EventType;
  status: EventStatus;
  registrationUrl?: string;
  bannerImage?: string;
  createdAt?: string;
}

export type CommunityEventInput = Omit<CommunityEvent, "id" | "createdAt">;
