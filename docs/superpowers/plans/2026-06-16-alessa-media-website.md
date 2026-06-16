# alessa media Website — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a light, playful one-pager portfolio for the freelance video/audio editor "alessa media" with scroll animations and a filterable, animated project carousel.

**Architecture:** Static site built with Astro. Content (projects) lives in a typed data file so it can be extended without touching markup. Pure filtering logic is unit-tested with Vitest. Sections are small focused `.astro` components composed in `index.astro`. Interactivity (carousel, filter, scroll-reveal) is client-side TypeScript using GSAP + ScrollTrigger, with native CSS scroll-snap for the carousel track. Deployed to GitHub Pages via GitHub Actions.

**Tech Stack:** Astro, Tailwind CSS v4 (`@tailwindcss/vite`, CSS-first `@theme`), GSAP + ScrollTrigger, @fontsource (Plus Jakarta Sans), Vitest, GitHub Pages.

---

## File Structure

```
alessa.media/
├── astro.config.mjs            # Astro + Tailwind vite plugin, site/base for Pages
├── tsconfig.json
├── package.json
├── vitest.config.ts            # test runner config
├── public/                     # static assets (favicon, images)
├── .github/workflows/deploy.yml
└── src/
    ├── data/projects.ts        # Category type + Project type + projects array
    ├── lib/filter.ts           # pure filterProjects() — unit tested
    ├── lib/filter.test.ts
    ├── styles/global.css        # Tailwind import + @theme design tokens + base styles
    ├── layouts/Base.astro       # <html> shell, fonts, global css, <slot/>
    ├── scripts/reveal.ts        # GSAP scroll-reveal (respects reduced-motion)
    ├── scripts/carousel.ts      # carousel + category filtering behavior
    ├── components/
    │   ├── Nav.astro
    │   ├── Hero.astro
    │   ├── Work.astro           # filter chips + carousel markup, renders projects
    │   ├── ProjectCard.astro    # single card (video / audio-waveform / title variants)
    │   ├── Skills.astro
    │   ├── About.astro
    │   ├── Contact.astro
    │   └── Footer.astro
    └── pages/index.astro        # composes all sections
```

---

## Task 1: Scaffold Astro project into the existing repo

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `public/`, `src/pages/index.astro` (via scaffold)

- [ ] **Step 1: Scaffold Astro minimal template into a temp dir**

The repo root already has `.git`, `docs/`, `README.md`, `.gitignore`. Scaffold into a temp dir so those are not clobbered.

Run:
```bash
npm create astro@latest tmp-astro -- --template minimal --install false --git false --yes
```
Expected: a `tmp-astro/` folder containing `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/`, `public/`.

- [ ] **Step 2: Move the scaffold into the repo root, keeping our README/.gitignore**

Run:
```bash
rsync -a tmp-astro/ ./ --exclude README.md --exclude .gitignore
rm -rf tmp-astro
```
Expected: `astro.config.mjs`, `package.json`, `tsconfig.json`, `src/pages/index.astro`, `public/` now exist in repo root; existing `README.md`/`.gitignore`/`docs/` untouched.

- [ ] **Step 3: Append Astro ignores to .gitignore**

Edit `.gitignore` so it contains (append if missing):
```
# astro
dist/
.astro/
node_modules/
```

- [ ] **Step 4: Install dependencies**

Run:
```bash
npm install
```
Expected: `node_modules/` created, no errors.

- [ ] **Step 5: Verify dev build works**

Run:
```bash
npm run build
```
Expected: "Complete!" / `dist/` produced with no errors.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: scaffold Astro project"
```

---

## Task 2: Add Tailwind v4 + design tokens + Base layout

**Files:**
- Modify: `astro.config.mjs`
- Create: `src/styles/global.css`, `src/layouts/Base.astro`

- [ ] **Step 1: Add Tailwind integration**

Run:
```bash
npx astro add tailwind --yes
```
Expected: installs `tailwindcss` + `@tailwindcss/vite`, adds the vite plugin to `astro.config.mjs`, may create `src/styles/global.css`.

- [ ] **Step 2: Install fonts package**

Run:
```bash
npm install @fontsource-variable/plus-jakarta-sans
```
Expected: package added.

- [ ] **Step 3: Write `src/styles/global.css` with Tailwind import + design tokens**

```css
@import "tailwindcss";

@theme {
  --color-ink: #15103a;
  --color-muted: #6b6790;
  --color-faint: #a5a1c0;
  --color-surface: #fbfafe;
  --color-line: #f0edf9;
  --color-violet: #7c3aed;
  --color-pink: #ec4899;
  --color-amber: #f59e0b;
  --font-display: "Plus Jakarta Sans Variable", system-ui, sans-serif;
}

:root {
  --gradient: linear-gradient(110deg, var(--color-violet), var(--color-pink) 55%, var(--color-amber));
}

html {
  scroll-behavior: smooth;
  font-family: var(--font-display);
  color: var(--color-ink);
  background: #ffffff;
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
}

.text-gradient {
  background: var(--gradient);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.bg-gradient {
  background: var(--gradient);
}

/* Elements revealed on scroll start hidden; reveal.ts animates them in.
   If JS/GSAP is unavailable, this fallback keeps them visible. */
.reveal { opacity: 0; transform: translateY(24px); }
.no-js .reveal, .reveal.is-visible { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) {
  .reveal { opacity: 1; transform: none; }
}
```

- [ ] **Step 4: Write `src/layouts/Base.astro`**

```astro
---
import "@fontsource-variable/plus-jakarta-sans";
import "../styles/global.css";

interface Props {
  title?: string;
  description?: string;
}
const {
  title = "alessa media — Freelance Video & Audio Editor",
  description = "Schnitt, der hängen bleibt. Shorts, YouTube, Werbung & Podcasts für Creator und Marken.",
} = Astro.props;
---

<!doctype html>
<html lang="de" class="no-js">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <title>{title}</title>
    <script is:inline>
      document.documentElement.classList.remove("no-js");
    </script>
  </head>
  <body class="bg-white text-ink antialiased">
    <slot />
  </body>
</html>
```

- [ ] **Step 5: Verify build**

Run:
```bash
npm run build
```
Expected: build succeeds.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: tailwind v4 design tokens and base layout"
```

---

## Task 3: Project data model + filter logic (TDD)

**Files:**
- Create: `src/data/projects.ts`, `src/lib/filter.ts`, `src/lib/filter.test.ts`, `vitest.config.ts`

- [ ] **Step 1: Install Vitest**

Run:
```bash
npm install -D vitest
```

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    environment: "node",
  },
});
```

- [ ] **Step 3: Add test script to `package.json`**

In `package.json` `"scripts"`, add:
```json
"test": "vitest run"
```

- [ ] **Step 4: Create `src/data/projects.ts`**

```ts
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
  { id: "deloitte", client: "Deloitte Deutschland", title: "Videoreihe „Hidden Movers Award“", category: "film", services: ["Videoedit"] },
  { id: "giz", client: "Giz", title: "Kurzdokumentation „My Region is the Lab“", category: "film", services: ["Videoedit"] },
  { id: "rkw", client: "RKW", title: "Videoreihe „Social Entrepreneurship – Behind the Scenes“", category: "film", services: ["Videoedit"] },
  { id: "techfounders", client: "Techfounders", title: "Demo Day Teaser", category: "film", services: ["Videoedit"] },
  { id: "munich-business", client: "Munich Business", title: "Videos zu „Social Innovation Strategy“", category: "film", services: ["Videoedit"] },
  { id: "prismasuite", client: "Prismasuite", title: "VLC Produktion", category: "film", services: ["Videoedit", "Animation", "Sounddesign"] },
  { id: "forstory", client: "forstory", title: "Impact Film Production", category: "film", services: ["Videoedit"] },
  { id: "media-monks", client: "Media Monks", title: "Research Project Metaverse", category: "film", services: ["Forschung"] },
  { id: "bundespolizei", client: "Bundespolizei", title: "Aufmerksamkeitskampagne „Gefahren am Bahnsteig“", category: "film", services: ["Konzeption", "Videoedit"] },
  { id: "cisco", client: "Cisco", title: "Podcast „Zukunft Verstehen“", category: "audio", services: ["Texten", "Einsprechen"] },
  { id: "sascha-lobo", client: "Sascha Lobo", title: "Audioschnittprojekte", category: "audio", services: ["Audiobearbeitung & -schnitt"] },
  { id: "podcast-3", client: "Podcast (Titel folgt)", title: "Podcast-Bearbeitung", category: "audio", services: ["Audioschnitt", "Sounddesign"] },
];
```

> Note: the 3rd podcast and exact media/embed URLs are open items in the spec (§9). Placeholder entry kept so the audio filter has content; replace `client`/`title`/`media` when Alessa provides them.

- [ ] **Step 5: Write the failing test `src/lib/filter.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { filterProjects } from "./filter";
import type { Project } from "../data/projects";

const sample: Project[] = [
  { id: "a", client: "A", title: "A", category: "social", services: [] },
  { id: "b", client: "B", title: "B", category: "film", services: [] },
  { id: "c", client: "C", title: "C", category: "audio", services: [] },
  { id: "d", client: "D", title: "D", category: "film", services: [] },
];

describe("filterProjects", () => {
  it("returns all projects for category 'all'", () => {
    expect(filterProjects(sample, "all")).toHaveLength(4);
  });

  it("returns only projects of the given category", () => {
    const film = filterProjects(sample, "film");
    expect(film).toHaveLength(2);
    expect(film.every((p) => p.category === "film")).toBe(true);
  });

  it("returns empty array when no project matches", () => {
    const none = filterProjects([], "social");
    expect(none).toEqual([]);
  });

  it("does not mutate the input array", () => {
    const copy = [...sample];
    filterProjects(sample, "film");
    expect(sample).toEqual(copy);
  });
});
```

- [ ] **Step 6: Run test to verify it fails**

Run:
```bash
npm test
```
Expected: FAIL — cannot resolve `./filter` (module not found).

- [ ] **Step 7: Write `src/lib/filter.ts`**

```ts
import type { Project, Category } from "../data/projects";

export function filterProjects(
  projects: Project[],
  category: Category | "all",
): Project[] {
  if (category === "all") return [...projects];
  return projects.filter((p) => p.category === category);
}
```

- [ ] **Step 8: Run test to verify it passes**

Run:
```bash
npm test
```
Expected: PASS — 4 tests green.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: project data model and tested filter logic"
```

---

## Task 4: Nav + Hero components

**Files:**
- Create: `src/components/Nav.astro`, `src/components/Hero.astro`

- [ ] **Step 1: Write `src/components/Nav.astro`**

```astro
---
const links = [
  { href: "#work", label: "Work" },
  { href: "#skills", label: "Skills" },
  { href: "#about", label: "Über mich" },
  { href: "#contact", label: "Kontakt" },
];
---
<header class="sticky top-0 z-50 border-b border-line/80 bg-white/85 backdrop-blur">
  <nav class="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
    <a href="#top" class="text-lg font-extrabold tracking-tight">alessa media</a>
    <ul class="hidden gap-6 text-sm font-medium text-muted sm:flex">
      {links.map((l) => (
        <li><a href={l.href} class="transition-colors hover:text-ink">{l.label}</a></li>
      ))}
    </ul>
    <a href="#contact" class="rounded-full bg-gradient px-4 py-2 text-sm font-semibold text-white sm:hidden">Kontakt</a>
  </nav>
</header>
```

- [ ] **Step 2: Write `src/components/Hero.astro`**

```astro
---
---
<section id="top" class="mx-auto max-w-5xl px-6 pb-20 pt-16 text-center sm:pt-24">
  <p class="reveal mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-faint">
    Freelance Video &amp; Audio Editor
  </p>
  <h1 class="reveal text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-7xl">
    <span class="text-gradient">Ideen in<br />Bewegung.</span>
  </h1>
  <p class="reveal mx-auto mt-6 max-w-md text-base leading-relaxed text-muted">
    Ich schneide Shorts, YouTube, Werbung &amp; Podcasts — für Creator und Marken, die auffallen wollen.
  </p>
  <div class="reveal mt-8 flex flex-wrap justify-center gap-3">
    <a href="#work" class="rounded-full bg-gradient px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet/25 transition-transform hover:scale-[1.03]">▶ Showreel</a>
    <a href="#work" class="rounded-full border border-line px-6 py-3 text-sm font-semibold transition-colors hover:bg-surface">Projekte ansehen</a>
  </div>
</section>
```

- [ ] **Step 3: Wire into `src/pages/index.astro` to verify rendering**

Replace the contents of `src/pages/index.astro` with:
```astro
---
import Base from "../layouts/Base.astro";
import Nav from "../components/Nav.astro";
import Hero from "../components/Hero.astro";
---
<Base>
  <Nav />
  <main>
    <Hero />
  </main>
</Base>
```

- [ ] **Step 4: Verify build + visual check**

Run:
```bash
npm run build
```
Expected: build succeeds. Then run `npm run dev` and open the URL; confirm sticky nav + gradient hero headline render.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: nav and hero sections"
```

---

## Task 5: Skills, About, Contact, Footer components

**Files:**
- Create: `src/components/Skills.astro`, `src/components/About.astro`, `src/components/Contact.astro`, `src/components/Footer.astro`

- [ ] **Step 1: Write `src/components/Skills.astro`**

```astro
---
const skills = [
  "Video Editing", "Short-Form / Reels", "Animation", "Sounddesign",
  "Audioschnitt", "Color Grading", "Voiceover / Einsprechen",
  "Konzeption", "Storytelling", "Untertitel / Motion",
];
---
<section id="skills" class="mx-auto max-w-5xl px-6 py-20">
  <p class="reveal mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-faint">Was ich kann</p>
  <div class="flex flex-wrap gap-3">
    {skills.map((s) => (
      <span class="reveal rounded-full border border-line px-4 py-2 text-sm font-semibold transition-colors hover:border-violet hover:text-violet">{s}</span>
    ))}
  </div>
</section>
```

- [ ] **Step 2: Write `src/components/About.astro`**

```astro
---
---
<section id="about" class="bg-surface">
  <div class="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 py-20 sm:flex-row sm:items-start">
    <div class="reveal h-28 w-28 flex-shrink-0 rounded-3xl bg-gradient"></div>
    <div class="reveal">
      <p class="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-faint">Über mich</p>
      <p class="max-w-xl text-lg leading-relaxed text-ink">
        Hi, ich bin Alessa — Cutterin aus Leidenschaft. Ich verwandle Rohmaterial in
        Geschichten, die Menschen festhalten. Von schnellen Shorts bis zum sauberen Podcast-Mix.
      </p>
    </div>
  </div>
</section>
```

> Note: About text & image are open items (spec §9) — replace copy and swap the gradient block for a real photo (`<img>`) when provided.

- [ ] **Step 3: Write `src/components/Contact.astro`**

```astro
---
const socials = [
  { label: "Instagram", href: "#" },
  { label: "TikTok", href: "#" },
  { label: "YouTube", href: "#" },
  { label: "LinkedIn", href: "#" },
];
const email = "hallo@alessa.media";
---
<section id="contact" class="bg-gradient text-white">
  <div class="mx-auto max-w-5xl px-6 py-24 text-center">
    <h2 class="reveal text-3xl font-extrabold tracking-tight sm:text-4xl">Lust auf Zusammenarbeit?</h2>
    <p class="reveal mt-3 text-base opacity-90">Erzähl mir von deinem Projekt.</p>
    <a href={`mailto:${email}`} class="reveal mt-7 inline-block rounded-full bg-white px-7 py-3 text-sm font-bold text-ink transition-transform hover:scale-[1.03]">{email}</a>
    <ul class="reveal mt-7 flex flex-wrap justify-center gap-5 text-sm opacity-90">
      {socials.map((s) => (
        <li><a href={s.href} class="underline-offset-4 hover:underline">{s.label}</a></li>
      ))}
    </ul>
  </div>
</section>
```

> Note: email + social URLs are open items (spec §9) — replace `email` and `socials[].href` with real values.

- [ ] **Step 4: Write `src/components/Footer.astro`**

```astro
---
const year = new Date().getFullYear();
---
<footer class="mx-auto max-w-5xl px-6 py-8 text-center text-xs text-faint">
  © {year} alessa media · <a href="#" class="hover:text-muted">Impressum</a>
</footer>
```

- [ ] **Step 5: Add components to `src/pages/index.astro`**

Update `src/pages/index.astro` to:
```astro
---
import Base from "../layouts/Base.astro";
import Nav from "../components/Nav.astro";
import Hero from "../components/Hero.astro";
import Skills from "../components/Skills.astro";
import About from "../components/About.astro";
import Contact from "../components/Contact.astro";
import Footer from "../components/Footer.astro";
---
<Base>
  <Nav />
  <main>
    <Hero />
    <Skills />
    <About />
    <Contact />
  </main>
  <Footer />
</Base>
```

- [ ] **Step 6: Verify build**

Run:
```bash
npm run build
```
Expected: build succeeds; all sections render.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: skills, about, contact, footer sections"
```

---

## Task 6: Work section markup — filter chips + carousel + ProjectCard

**Files:**
- Create: `src/components/ProjectCard.astro`, `src/components/Work.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Write `src/components/ProjectCard.astro`**

```astro
---
import type { Project } from "../data/projects";
interface Props { project: Project }
const { project } = Astro.props;
const isAudio = project.category === "audio";
const bars = [40, 70, 100, 60, 85, 45, 75, 55, 90, 35, 65, 50, 80, 42, 68];
---
<article
  class="project-card group shrink-0 snap-center"
  data-category={project.category}
  style="scroll-snap-align:center"
>
  <div class="relative h-[260px] w-[230px] overflow-hidden rounded-3xl bg-gradient shadow-xl shadow-violet/20 transition-transform duration-500 sm:w-[260px]">
    {isAudio ? (
      <div class="flex h-full flex-col justify-between p-5 text-white">
        <span class="text-2xl">🎧</span>
        <div class="flex h-10 items-center gap-[3px]">
          {bars.map((h) => (
            <span class="flex-1 rounded-sm bg-white/80" style={`height:${h}%`}></span>
          ))}
        </div>
      </div>
    ) : (
      <div class="absolute inset-0 flex items-center justify-center">
        <span class="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-xl text-violet">▶</span>
      </div>
    )}
    <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/45 to-transparent p-5 text-white">
      <p class="text-xs opacity-85">{project.client}</p>
      <h3 class="text-base font-extrabold leading-tight">{project.title}</h3>
    </div>
  </div>
  <div class="mt-3 flex max-w-[260px] flex-wrap gap-1.5">
    {project.services.map((s) => (
      <span class="rounded-full bg-surface px-2.5 py-1 text-[11px] font-medium text-muted">{s}</span>
    ))}
  </div>
</article>
```

- [ ] **Step 2: Write `src/components/Work.astro`**

```astro
---
import { projects, categoryLabels, type Category } from "../data/projects";
import ProjectCard from "./ProjectCard.astro";
const chips: (Category | "all")[] = ["all", "social", "film", "audio"];
---
<section id="work" class="overflow-hidden py-20">
  <div class="mx-auto max-w-5xl px-6">
    <p class="reveal mb-6 text-center text-xs font-semibold uppercase tracking-[0.2em] text-faint">Ausgewählte Arbeiten</p>
    <div class="reveal mb-10 flex flex-wrap justify-center gap-2" id="work-filters">
      {chips.map((c, i) => (
        <button
          class:list={["filter-chip rounded-full px-4 py-2 text-sm font-semibold transition-colors", i === 0 ? "is-active bg-gradient text-white" : "border border-line"]}
          data-filter={c}
          type="button"
        >{categoryLabels[c]}</button>
      ))}
    </div>
  </div>

  <div
    id="work-track"
    class="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-[calc(50%-130px)] pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]{display:none}"
  >
    {projects.map((p) => <ProjectCard project={p} />)}
  </div>

  <div class="mx-auto mt-2 flex max-w-5xl items-center justify-center gap-5 px-6">
    <button id="work-prev" type="button" aria-label="Vorheriges Projekt" class="flex h-10 w-10 items-center justify-center rounded-full border border-line text-violet transition-colors hover:bg-surface">‹</button>
    <button id="work-next" type="button" aria-label="Nächstes Projekt" class="flex h-10 w-10 items-center justify-center rounded-full border border-line text-violet transition-colors hover:bg-surface">›</button>
  </div>
</section>
```

> The track uses native CSS scroll-snap; the prev/next buttons and filtering are wired in Task 8. Active-card scaling is handled there via IntersectionObserver.

- [ ] **Step 3: Insert `<Work />` into `src/pages/index.astro`**

Add the import `import Work from "../components/Work.astro";` and place `<Work />` between `<Hero />` and `<Skills />`.

- [ ] **Step 4: Verify build + visual check**

Run:
```bash
npm run build
```
Expected: succeeds. `npm run dev` → confirm chips render, cards scroll horizontally and snap, audio card shows waveform.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: work section with filter chips and project carousel markup"
```

---

## Task 7: Carousel behavior + category filtering (client TS)

**Files:**
- Create: `src/scripts/carousel.ts`
- Modify: `src/components/Work.astro` (add script import)

- [ ] **Step 1: Write `src/scripts/carousel.ts`**

```ts
export function initCarousel(): void {
  const track = document.getElementById("work-track");
  const filters = document.getElementById("work-filters");
  const prev = document.getElementById("work-prev");
  const next = document.getElementById("work-next");
  if (!track || !filters) return;

  const cards = () =>
    Array.from(track.querySelectorAll<HTMLElement>(".project-card"));

  // --- active-card scaling via IntersectionObserver ---
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const inner = entry.target.querySelector<HTMLElement>(":scope > div");
        if (!inner) continue;
        inner.style.transform = entry.intersectionRatio > 0.75 ? "scale(1)" : "scale(0.88)";
        inner.style.opacity = entry.intersectionRatio > 0.4 ? "1" : "0.55";
      }
    },
    { root: track, threshold: [0, 0.4, 0.75, 1] },
  );
  cards().forEach((c) => io.observe(c));

  // --- prev / next ---
  const step = () => {
    const first = cards().find((c) => !c.hidden);
    return first ? first.offsetWidth + 24 : 280;
  };
  prev?.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: "smooth" }));
  next?.addEventListener("click", () => track.scrollBy({ left: step(), behavior: "smooth" }));

  // --- category filtering ---
  filters.addEventListener("click", (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>(".filter-chip");
    if (!btn) return;
    const filter = btn.dataset.filter ?? "all";

    filters.querySelectorAll<HTMLElement>(".filter-chip").forEach((chip) => {
      const active = chip === btn;
      chip.classList.toggle("is-active", active);
      chip.classList.toggle("bg-gradient", active);
      chip.classList.toggle("text-white", active);
      chip.classList.toggle("border", !active);
      chip.classList.toggle("border-line", !active);
    });

    cards().forEach((card) => {
      const show = filter === "all" || card.dataset.category === filter;
      card.hidden = !show;
    });
    track.scrollTo({ left: 0, behavior: "smooth" });
  });
}
```

- [ ] **Step 2: Import and run the script in `src/components/Work.astro`**

Append to the bottom of `src/components/Work.astro`:
```astro
<script>
  import { initCarousel } from "../scripts/carousel.ts";
  initCarousel();
</script>
```

- [ ] **Step 3: Verify build + behavior**

Run:
```bash
npm run build
```
Expected: succeeds. `npm run dev` → click a category chip: only matching cards remain, chip highlights, track resets to start. Prev/next scroll one card. Center card is larger/sharper than neighbors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: carousel navigation, active-card scaling, category filtering"
```

---

## Task 8: Scroll-reveal animations (GSAP ScrollTrigger)

**Files:**
- Create: `src/scripts/reveal.ts`
- Modify: `src/layouts/Base.astro` (run reveal script)

- [ ] **Step 1: Install GSAP**

Run:
```bash
npm install gsap
```

- [ ] **Step 2: Write `src/scripts/reveal.ts`**

```ts
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function initReveal(): void {
  const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
  if (els.length === 0) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    els.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  els.forEach((el) => {
    gsap.fromTo(
      el,
      { autoAlpha: 0, y: 24 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
        onComplete: () => el.classList.add("is-visible"),
      },
    );
  });
}
```

- [ ] **Step 3: Run reveal in `src/layouts/Base.astro`**

Before the closing `</body>` in `src/layouts/Base.astro`, add:
```astro
    <slot />
    <script>
      import { initReveal } from "../scripts/reveal.ts";
      initReveal();
    </script>
  </body>
```
(Replace the existing `<slot />` line with the block above.)

- [ ] **Step 4: Verify build + behavior**

Run:
```bash
npm run build
```
Expected: succeeds. `npm run dev` → scrolling down reveals each section's elements with a fade+rise. With OS "reduce motion" on, everything is immediately visible.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: gsap scroll-reveal animations with reduced-motion support"
```

---

## Task 9: Configure for GitHub Pages + deploy workflow

**Files:**
- Modify: `astro.config.mjs`
- Create: `.github/workflows/deploy.yml`, `public/.nojekyll`

- [ ] **Step 1: Set `site` and `base` in `astro.config.mjs`**

The repo is a project repo (`PaulWasabi/alessa.media`), so Pages serves it under `/alessa.media`. Edit `astro.config.mjs` so the config object includes:
```js
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://paulwasabi.github.io",
  base: "/alessa.media",
  vite: { plugins: [tailwindcss()] },
});
```
> If a custom domain `alessa.media` is set up later: change `site` to `"https://alessa.media"`, remove `base`, and add a `public/CNAME` file containing `alessa.media`. Internal `#anchor` links are unaffected by `base`.

- [ ] **Step 2: Create `public/.nojekyll`**

Empty file (prevents GitHub from running Jekyll on the output):
```
```

- [ ] **Step 3: Create `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: withastro/action@v3
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 4: Verify production build with base path**

Run:
```bash
npm run build
```
Expected: succeeds; `dist/` produced. (Astro emits asset URLs under `/alessa.media/`.)

- [ ] **Step 5: Commit and push**

```bash
git add -A
git commit -m "ci: github pages deploy workflow and base path config"
git push
```
Expected: push succeeds to `origin main` (PaulWasabi account, HTTPS).

- [ ] **Step 6: Enable Pages (manual, one-time)**

In the GitHub repo: **Settings → Pages → Build and deployment → Source = "GitHub Actions"**. Then re-run the workflow (or push again). After it succeeds, the site is live at `https://paulwasabi.github.io/alessa.media/`.

---

## Self-Review Notes

- **Spec coverage:** Nav (T4), Hero (T4), Work filterable carousel incl. audio waveform (T6/T7), Skills (T5), About (T5), Contact email+socials (T5), Footer (T5), Gradient Motion tokens (T2), scroll animations + reduced-motion (T8), data-driven projects with full client list (T3), GitHub Pages hosting (T9). All spec sections mapped.
- **Open items** from spec §9 (3rd podcast, embed URLs, real socials/email, about copy/photo, Impressum) are surfaced as inline notes at their components, not silently dropped.
- **Type consistency:** `Category` = `"social" | "film" | "audio"`; `filterProjects(projects, category)` signature used identically in test, lib, and carousel data attributes (`data-category`, `data-filter`).
- **No backend / forms / i18n / detail pages** — matches YAGNI scope (§8).
