import gsap from "gsap";
import { currentStatValue, STAT_ANCHOR_MS, type StatDef } from "../lib/stats";

/**
 * Animates each `.stat-value` element from 0 up to its current value on load.
 * The target grows over real time (see currentStatValue). Respects
 * prefers-reduced-motion by jumping straight to the final value.
 */
export function initCounters(): void {
  const els = Array.from(document.querySelectorAll<HTMLElement>(".stat-value"));
  if (els.length === 0) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fmt = new Intl.NumberFormat("de-DE");

  els.forEach((el) => {
    const stat: StatDef = {
      label: "",
      base: Number(el.dataset.base ?? 0),
      perWeek: Number(el.dataset.perweek ?? 0),
    };
    const target = currentStatValue(stat, Date.now(), STAT_ANCHOR_MS);

    if (reduce) {
      el.textContent = fmt.format(target);
      return;
    }

    const counter = { value: 0 };
    gsap.to(counter, {
      value: target,
      duration: 1.6,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = fmt.format(Math.round(counter.value));
      },
    });
  });
}
