export type Category = "social" | "film" | "audio";

export interface Project {
  id: string;
  client: string;
  title: string;
  category: Category;
  services: string[];
  /** Optional embeddable media. When absent, the card shows title + tags only. */
  media?: { type: "youtube" | "vimeo" | "audio"; url: string };
}

export const categoryLabels: Record<Category | "all", string> = {
  all: "Alle",
  social: "Social Media",
  film: "Film & Werbung",
  audio: "Audio & Podcast",
};

export const projects: Project[] = [
  { id: "stilberater", client: "Stilberater", title: "Social Media Videoproduktion", category: "social", services: ["Videoedit", "Animation", "Sounddesign"] },
  { id: "plasmazentrum", client: "Plasmazentrum Würzburg", title: "Social Media Aufmerksamkeitskampagne", category: "social", services: ["Konzeption", "Kameraführung", "Bildbearbeitung", "Videoedit"] },
  { id: "arrow", client: "Arrow", title: "Arrowsphere Teaser Video", category: "film", services: ["Videoedit", "Animation", "Sounddesign", "Voiceover"] },
  { id: "deloitte", client: "Deloitte Deutschland", title: "Videoreihe „Hidden Movers Award"", category: "film", services: ["Videoedit"] },
  { id: "giz", client: "Giz", title: "Kurzdokumentation „My Region is the Lab"", category: "film", services: ["Videoedit"] },
  { id: "rkw", client: "RKW", title: "Videoreihe „Social Entrepreneurship – Behind the Scenes"", category: "film", services: ["Videoedit"] },
  { id: "techfounders", client: "Techfounders", title: "Demo Day Teaser", category: "film", services: ["Videoedit"] },
  { id: "munich-business", client: "Munich Business", title: "Videos zu „Social Innovation Strategy"", category: "film", services: ["Videoedit"] },
  { id: "prismasuite", client: "Prismasuite", title: "VLC Produktion", category: "film", services: ["Videoedit", "Animation", "Sounddesign"] },
  { id: "forstory", client: "forstory", title: "Impact Film Production", category: "film", services: ["Videoedit"] },
  { id: "media-monks", client: "Media Monks", title: "Research Project Metaverse", category: "film", services: ["Forschung"] },
  { id: "bundespolizei", client: "Bundespolizei", title: "Aufmerksamkeitskampagne „Gefahren am Bahnsteig"", category: "film", services: ["Konzeption", "Videoedit"] },
  { id: "cisco", client: "Cisco", title: "Podcast „Zukunft Verstehen"", category: "audio", services: ["Texten", "Einsprechen"] },
  { id: "sascha-lobo", client: "Sascha Lobo", title: "Audioschnittprojekte", category: "audio", services: ["Audiobearbeitung & -schnitt"] },
  { id: "podcast-3", client: "Podcast (Titel folgt)", title: "Podcast-Bearbeitung", category: "audio", services: ["Audioschnitt", "Sounddesign"] },
];
