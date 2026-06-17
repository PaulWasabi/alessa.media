/**
 * Highlights the nav link(s) for the section currently in view. Observes the
 * snap panels and marks every nav link whose target lives in the active panel
 * (so Skills + Über mich, which share a panel, both light up there).
 */
export function initScrollSpy(): void {
  const links = Array.from(
    document.querySelectorAll<HTMLAnchorElement>('#nav-links a[href^="#"]'),
  );
  const panels = Array.from(document.querySelectorAll<HTMLElement>(".snap-panel"));
  if (links.length === 0 || panels.length === 0) return;

  // Map each panel to the nav links whose target section sits inside it.
  const linksByPanel = new Map<HTMLElement, HTMLAnchorElement[]>();
  for (const link of links) {
    const id = link.getAttribute("href")!.slice(1);
    const target = document.getElementById(id);
    const panel = target ? panels.find((p) => p.contains(target)) : undefined;
    if (!panel) continue;
    const list = linksByPanel.get(panel) ?? [];
    list.push(link);
    linksByPanel.set(panel, list);
  }

  const setActive = (panel: HTMLElement | null): void => {
    for (const link of links) link.classList.remove("is-active");
    if (!panel) return;
    for (const link of linksByPanel.get(panel) ?? []) link.classList.add("is-active");
  };

  const ratios = new Map<HTMLElement, number>();
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) ratios.set(e.target as HTMLElement, e.intersectionRatio);
      let best: HTMLElement | null = null;
      let bestRatio = 0;
      for (const [panel, ratio] of ratios) {
        if (ratio > bestRatio) {
          bestRatio = ratio;
          best = panel;
        }
      }
      // Only switch once a panel is meaningfully in view.
      if (bestRatio >= 0.5) setActive(best);
    },
    { threshold: [0.25, 0.5, 0.75] },
  );

  panels.forEach((p) => io.observe(p));
}
