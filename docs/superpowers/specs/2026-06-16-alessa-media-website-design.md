# Design-Spec: alessa media — Portfolio-Website

**Datum:** 2026-06-16
**Status:** Genehmigt (Design-Phase)
**Typ:** One-Pager Portfolio für eine freelancende Cutterin (Video- & Audio-Editorin)

---

## 1. Ziel & Zielgruppe

Eine Portfolio-Website, die Alessas Projekte und Skills zeigt und zu Aufträgen führt.

- **Primäre Zielgruppe:** Creator / Influencer / Social-Media-Verantwortliche, die laufende Video-Betreuung suchen.
- **Sekundäre Zielgruppe:** Agenturen für kleinere Auftragsarbeiten.
- **Ton:** modern, nahbar, schnell erfassbar — aber professionell genug für Agentur-Augen.

**Marke:** *alessa media*

---

## 2. Design-Richtung

**„Gradient Motion" — hell, simpel, verspielt & energetisch.**

- **Hintergrund:** Reines Weiß / sehr helles Lavendel-Weiß (`#FBFAFE`) für abgesetzte Sektionen.
- **Akzent:** Lebendiger Verlauf Violett → Pink → Orange (`#7C3AED → #EC4899 → #F59E0B`).
- **Typo:** Große, fette, eng laufende Sans-Serif; Hero-Headline mit Verlaufs-Füllung.
- **Formen:** Runde Ecken, Pill-Buttons, weiche Schatten.
- **Textfarben:** Dunkles Violett-Schwarz (`#15103a`), Sekundärtext (`#6b6790`), Labels (`#a5a1c0`).

**Bewegung (Kernanforderung):**
- Gestaffeltes Rein-Faden/-Gleiten der Elemente beim Scrollen (scroll-reveal).
- Wandernde / animierte Verläufe.
- Karussell mit Skalier- & Gleit-Übergang zwischen Karten.
- Hover-Effekte auf Karten und Buttons.
- Animationen respektieren `prefers-reduced-motion`.

---

## 3. Struktur (One-Pager)

Reihenfolge von oben nach unten:

1. **Nav (sticky)** — Logo „alessa media" + Sprungmarken (Work · Skills · Über mich · Kontakt).
2. **Hero** — Label „Freelance Video & Audio Editor", Headline „Ideen in Bewegung" (Verlaufs-Typo), kurzer Untertitel, zwei CTAs (▶ Showreel / Projekte ansehen).
3. **Work** — **Filterbares, animiertes Karussell** (Kern der Seite, siehe §4).
4. **Skills** — Tag-Wolke der Fähigkeiten.
5. **Über mich** — kurzer Text + Bild/Avatar.
6. **Kontakt** — auffälliger Verlaufs-Block, E-Mail-Button + Social-Links.
7. **Footer** — klein, © + ggf. Impressum-Link.

---

## 4. Work-Sektion (Filterbares Karussell)

- **Filter-Chips** über dem Karussell: `Alle` · `Social Media` · `Film & Werbung` · `Audio & Podcast`.
  - Klick auf Chip filtert die Projekte im Karussell (animierter Übergang).
- **Karussell:** Aktive Karte zentriert & vergrößert, Nachbarn lugen verblasst hervor; Pfeile, Dot-Indikator, Wischgesten (Touch).
- **Karten:**
  - Mit verfügbarem Material → öffnen eingebettetes Video (YouTube/Vimeo) bzw. Audio.
  - Ohne Material → stilvolle Karte mit Kunde, Projekttitel & Tags (Material später ergänzbar).
  - **Audio-/Podcast-Karten:** animierte Waveform statt Play-Overlay.
- **Datengetrieben:** Projekte aus einer Daten-Quelle (Liste/JSON), damit Alessa später leicht ergänzen kann.

### Projektliste (Stand 2026-06-16)

| Kunde | Projekt | Leistungen | Kategorie |
|---|---|---|---|
| Stilberater | Social Media Videoproduktion | Videoedit, Animation, Sounddesign | Social Media |
| Cisco | Podcast „Zukunft Verstehen" | Texten, Einsprechen | Audio & Podcast |
| Sascha Lobo | Audioschnittprojekte | Audiobearbeitung & -schnitt | Audio & Podcast |
| Arrow | Arrowsphere Teaser Video | Videoedit, Animation, Sounddesign, Voiceover | Film & Werbung |
| Media Monks | Research Project Metaverse | Forschung | Film & Werbung |
| forstory | Impact Film Production | Videoedit | Film & Werbung |
| Prismasuite | VLC Produktion | Videoedit, Animation, Sounddesign | Film & Werbung |
| Deloitte Deutschland | Videoreihe „Hidden Movers Award" | Videoedit | Film & Werbung |
| Techfounders | Demo Day Teaser | Videoedit | Film & Werbung |
| Munich Business | Videos zu „Social Innovation Strategy" | Videoedit | Film & Werbung |
| Giz | Kurzdokumentation „My Region is the Lab" | Videoedit | Film & Werbung |
| RKW | Videoreihe „Social Entrepreneurship – Behind the Scenes" | Videoedit | Film & Werbung |
| Plasmazentrum Würzburg | Social Media Aufmerksamkeitskampagne | Konzeption, Kameraführung, Bildbearbeitung, Videoedit | Social Media |
| Bundespolizei | Aufmerksamkeitskampagne „Gefahren am Bahnsteig" | Konzeption, Videoedit | Film & Werbung |

Plus **3 Podcast-Projekte** (Audio & Podcast) — Details/Titel von Alessa nachzutragen. Cisco & Sascha Lobo zählen bereits dazu; weitere ergänzen.

> Hinweis: Kategorie-Zuordnung ist ein erster Vorschlag und vor dem Bau mit Alessa abzustimmen. Genaue Zahl abspielbarer Medien noch offen — Karten ohne Medium fallen elegant auf „Titel + Tags" zurück.

---

## 5. Skills-Sektion

Tag-Wolke (Pills) abgeleitet aus den Leistungen, u. a.:
Video Editing · Short-Form / Reels · Animation · Sounddesign · Audioschnitt · Color Grading · Voiceover / Einsprechen · Konzeption · Storytelling · Untertitel/Motion.

---

## 6. Über mich

Kurzer, persönlicher Text (1–3 Sätze) + Bild oder farbiger Avatar-Block. Inhalt von Alessa.

---

## 7. Kontakt

- Verlaufs-Block mit Call-to-Action („Lust auf Zusammenarbeit?").
- **E-Mail-Button** (mailto) — keine Backend-/Formular-Technik im ersten Schritt.
- **Social-Links:** Instagram, TikTok, YouTube, LinkedIn (konkrete URLs von Alessa).
- Kontaktformular ist eine mögliche spätere Erweiterung.

---

## 8. Nicht im Umfang (YAGNI)

- Kein CMS / Login / Backend.
- Kein Kontaktformular-Backend (Phase 1).
- Keine Mehrsprachigkeit (nur Deutsch).
- Keine separaten Projekt-Detailseiten (alles im Karussell/Overlay).

---

## 9. Offene Punkte (vor/while Bau zu klären)

- Genaue Liste & Titel der 3 Podcasts.
- Welche Projekte haben abspielbares Video/Audio + die jeweiligen Embed-URLs.
- Social-Media-URLs + Kontakt-E-Mail.
- Über-mich-Text & Bild.
- Impressum/Datenschutz (rechtlich in DE i. d. R. nötig).

---

## 10. Technischer Stack (entschieden 2026-06-16)

- **Astro** — statische, schnelle Ausgabe; Projekte als Datendatei (leicht pflegbar).
- **Tailwind CSS** — helles, rundes Design-System.
- **GSAP + ScrollTrigger** — Scroll-Animationen & filterbares Karussell; respektiert `prefers-reduced-motion`.
- **Hosting:** GitHub Pages aus dem Repo `PaulWasabi/alessa.media`.
- Kein Backend (siehe §8).

## 11. Nächste Schritte

1. **Implementierungsplan** (writing-plans).
2. **Bau** der Seite.
