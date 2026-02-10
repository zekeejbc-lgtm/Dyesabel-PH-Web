export interface Story {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  date: string;
}

export interface Founder {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
}

export interface NavLink {
  label: string;
  href: string;
  isButton?: boolean;
}

export interface ChapterActivity {
  id: string;
  title: string;
  description: string;
  date: string;
  imageUrl: string;
}

export interface Chapter {
  id: string;
  name: string;
  location: string;
  logo: string;
  image?: string; // Cover image for the chapter
  description?: string;
  president?: string;
  email?: string;
  phone?: string;
  facebook?: string;
  activities?: ChapterActivity[]; // Added for persistence
}

export interface PillarActivity {
  id: string;
  title: string;
  date: string;
  description: string;
  imageUrl: string;
}

export interface Pillar {
  id: string;
  title: string;
  excerpt: string;
  description: string;
  aim: string;
  imageUrl: string;
  activities: PillarActivity[];
}

export type UserRole = 'auditor' | 'admin' | 'chapter_head';

export interface User {
  username: string;
  role: UserRole;
  chapterId?: string; // Only for chapter_head
}