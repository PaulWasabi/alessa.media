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
