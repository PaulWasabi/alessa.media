export function initCarousel(): void {
  const track = document.getElementById("work-track");
  const filters = document.getElementById("work-filters");
  const prev = document.getElementById("work-prev");
  const next = document.getElementById("work-next");
  if (!track || !filters) return;

  const GAP = 20; // matches gap-5 on the track

  const cards = () => Array.from(track.querySelectorAll<HTMLElement>(".project-card"));

  // --- prev / next: advance by one card width ---
  const step = () => {
    const first = cards().find((c) => !c.hidden);
    return first ? first.offsetWidth + GAP : 300;
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
      card.hidden = !(filter === "all" || card.dataset.category === filter);
    });
    track.scrollTo({ left: 0, behavior: "smooth" });
  });
}
