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
      chip.setAttribute("aria-pressed", active ? "true" : "false");
    });

    cards().forEach((card) => {
      const show = filter === "all" || card.dataset.category === filter;
      card.hidden = !show;
      if (!show) {
        const inner = card.querySelector<HTMLElement>(":scope > div");
        if (inner) {
          inner.style.transform = "";
          inner.style.opacity = "";
        }
      }
    });
    track.scrollTo({ left: 0, behavior: "smooth" });
  });
}
