# alessa media

Portfolio one-pager for **Alessa** — freelance video & audio editor ("Cutterin") from Munich.
Built as a dependency-free static site from the Claude Design handoff and the alessa-media design system.

## Stack

Plain HTML / CSS / JS — no build step, no framework, no dependencies.

| File | Purpose |
|---|---|
| `index.html` | Page markup (Nav · Hero · Work · Skills · Über mich · Kontakt) |
| `tokens.css` | Design-system tokens — colors, type, spacing, radii, shadows, motion |
| `styles.css` | Components (Button, Chip, Tag, IconButton, ProjectCard) + section layout |
| `app.js` | Project data, work carousel, category filters, project modal, scroll-reveal, hero aurora canvas |
| `favicon.svg` | Gradient "a" brand mark |
| `assets/` | Project thumbnails + portrait |

## Run locally

Any static server works. For example:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploy

It's fully static — drag the folder onto **Netlify**, push to **Vercel**, or commit to **GitHub Pages**. No configuration needed.

## Editing content

- **Projects** live in the `PROJECTS` array at the top of `app.js` (client, title, category, services, thumbnail, optional `url`, description). Cards and the category filters render from this array.
- **Hero stats / copy / about text** are plain markup in `index.html`.
- **Colors, fonts, spacing** are tokens in `tokens.css` — change once, applied everywhere.

## Notes

- German-language throughout; speaks *du* to the reader.
- Respects `prefers-reduced-motion` (disables the aurora loop, marquee, shimmer, and reveal animations).
- Contact email and social links are placeholders to confirm — socials currently point to `#`.
