export type Category = "social" | "film" | "audio";

export interface Project {
  id: string;
  client: string;
  title: string;
  category: Category;
  services: string[];
  /** Optional embeddable media. When absent, the card shows title + tags only. */
  media?: { type: "youtube" | "vimeo" | "audio"; url: string };
  /** Summary shown in the project detail modal. Placeholder copy until real text is provided. */
  description?: string;
  /** Optional external link shown in the modal. The button is hidden when this is absent. */
  link?: { url: string; label?: string };
}

export const categoryLabels: Record<Category | "all", string> = {
  all: "Alle",
  social: "Social Media",
  film: "Film & Werbung",
  audio: "Audio & Podcast",
};

// NOTE: `description` texts below are placeholders — replace with real project
// summaries. Add an optional `link: { url, label }` per project to show a button.
export const projects: Project[] = [
  { id: "stilberater", client: "Stilberater", title: "Social Media Videoproduktion", category: "social", services: ["Videoedit", "Animation", "Sounddesign"], description: "Laufende Social-Media-Betreuung für den Stilberater: Konzeption und Schnitt von Shorts und YouTube-Videos, inkl. Animation und Sounddesign. (Platzhalter — echter Text folgt.)" },
  { id: "plasmazentrum", client: "Plasmazentrum Würzburg", title: "Social Media Aufmerksamkeitskampagne", category: "social", services: ["Konzeption", "Kameraführung", "Bildbearbeitung", "Videoedit"], description: "Aufmerksamkeitskampagne von der Konzeption über die Kameraführung bis zur Bildbearbeitung und zum finalen Schnitt. (Platzhalter — echter Text folgt.)" },
  { id: "arrow", client: "Arrow", title: "Arrowsphere Teaser Video", category: "film", services: ["Videoedit", "Animation", "Sounddesign", "Voiceover"], description: "Teaser-Video für Arrowsphere: Schnitt, Animation, Sounddesign und Voiceover zu einem prägnanten Produkt-Teaser kombiniert. (Platzhalter — echter Text folgt.)" },
  { id: "deloitte", client: "Deloitte Deutschland", title: 'Videoreihe „Hidden Movers Award“', category: "film", services: ["Videoedit"], description: "Schnitt einer mehrteiligen Videoreihe rund um den Hidden Movers Award. (Platzhalter — echter Text folgt.)" },
  { id: "giz", client: "Giz", title: 'Kurzdokumentation „My Region is the Lab“', category: "film", services: ["Videoedit"], description: "Schnitt einer Kurzdokumentation über regionale Innovationsprojekte. (Platzhalter — echter Text folgt.)" },
  { id: "rkw", client: "RKW", title: 'Videoreihe „Social Entrepreneurship – Behind the Scenes“', category: "film", services: ["Videoedit"], description: "Behind-the-Scenes-Videoreihe zum Thema Social Entrepreneurship. (Platzhalter — echter Text folgt.)" },
  { id: "techfounders", client: "Techfounders", title: "Demo Day Teaser", category: "film", services: ["Videoedit"], description: "Energiegeladener Teaser zum Demo Day mit pointiertem Schnitt. (Platzhalter — echter Text folgt.)" },
  { id: "munich-business", client: "Munich Business", title: 'Videos zu „Social Innovation Strategy"', category: "film", services: ["Videoedit"], description: "Videoproduktion zur Social Innovation Strategy. (Platzhalter — echter Text folgt.)" },
  { id: "prismasuite", client: "Prismasuite", title: "VLC Produktion", category: "film", services: ["Videoedit", "Animation", "Sounddesign"], description: "Produktion inkl. Schnitt, Animation und Sounddesign für Prismasuite. (Platzhalter — echter Text folgt.)" },
  { id: "forstory", client: "forstory", title: "Impact Film Production", category: "film", services: ["Videoedit"], description: "Schnitt einer Impact-orientierten Filmproduktion. (Platzhalter — echter Text folgt.)" },
  { id: "media-monks", client: "Media Monks", title: "Research Project Metaverse", category: "film", services: ["Forschung"], description: "Recherche- und Researcharbeit zu einem Metaverse-Projekt. (Platzhalter — echter Text folgt.)" },
  { id: "bundespolizei", client: "Bundespolizei", title: 'Aufmerksamkeitskampagne „Gefahren am Bahnsteig"', category: "film", services: ["Konzeption", "Videoedit"], description: "Konzeption und Schnitt einer Aufklärungskampagne zu Gefahren am Bahnsteig. (Platzhalter — echter Text folgt.)" },
  { id: "cisco", client: "Cisco", title: 'Podcast „Zukunft Verstehen"', category: "audio", services: ["Texten", "Einsprechen"], description: "Mitarbeit am Podcast „Zukunft Verstehen“: Texten und Einsprechen von Beiträgen. (Platzhalter — echter Text folgt.)" },
  { id: "sascha-lobo", client: "Sascha Lobo", title: "Audioschnittprojekte", category: "audio", services: ["Audiobearbeitung & -schnitt"], description: "Audiobearbeitung und Schnitt verschiedener Projekte für Sascha Lobo. (Platzhalter — echter Text folgt.)" },
  { id: "podcast-3", client: "Podcast (Titel folgt)", title: "Podcast-Bearbeitung", category: "audio", services: ["Audioschnitt", "Sounddesign"], description: "Audioschnitt und Sounddesign für einen Podcast. (Platzhalter — Titel und Text folgen.)" },
];
