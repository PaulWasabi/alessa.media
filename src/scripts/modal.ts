import gsap from "gsap";

/**
 * Project detail modal. Opens when a `.project-card` is clicked (or activated via
 * keyboard) and "grows" out of the clicked card using a FLIP transition.
 * Closes via the X button, the ESC key, or a click on the backdrop.
 */
export function initProjectModal(): void {
  const modal = document.getElementById("project-modal");
  const track = document.getElementById("work-track");
  if (!modal || !track) return;

  const backdrop = modal.querySelector<HTMLElement>(".modal-backdrop");
  const panel = modal.querySelector<HTMLElement>(".modal-panel");
  const closeBtn = modal.querySelector<HTMLElement>(".modal-close");
  const elClient = modal.querySelector<HTMLElement>('[data-field="client"]');
  const elTitle = modal.querySelector<HTMLElement>('[data-field="title"]');
  const elTags = modal.querySelector<HTMLElement>('[data-field="tags"]');
  const elDesc = modal.querySelector<HTMLElement>('[data-field="description"]');
  const elLink = modal.querySelector<HTMLAnchorElement>('[data-field="link"]');
  if (!backdrop || !panel || !closeBtn || !elClient || !elTitle || !elTags || !elDesc || !elLink) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let lastFocused: HTMLElement | null = null;
  let originVisual: HTMLElement | null = null;
  let isOpen = false;

  function fill(card: HTMLElement): void {
    elClient!.textContent = card.dataset.client ?? "";
    elTitle!.textContent = card.dataset.title ?? "";
    elDesc!.textContent = card.dataset.description ?? "";

    elTags!.innerHTML = "";
    (card.dataset.services ?? "")
      .split("|")
      .filter(Boolean)
      .forEach((service) => {
        const tag = document.createElement("span");
        tag.className = "rounded-full bg-surface px-3 py-1 text-xs font-medium text-muted";
        tag.textContent = service;
        elTags!.appendChild(tag);
      });

    const url = card.dataset.linkUrl;
    if (url) {
      elLink!.href = url;
      elLink!.textContent = card.dataset.linkLabel || "Projekt ansehen";
      elLink!.style.display = "";
    } else {
      elLink!.style.display = "none";
    }
  }

  function open(card: HTMLElement): void {
    if (isOpen) return;
    isOpen = true;
    lastFocused = document.activeElement as HTMLElement;
    originVisual = card.querySelector<HTMLElement>(".card-visual") ?? card;

    fill(card);
    modal!.classList.remove("hidden");
    modal!.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    if (reduce) {
      gsap.set(backdrop!, { autoAlpha: 1 });
      gsap.set(panel!, { autoAlpha: 1, clearProps: "transform" });
    } else {
      // FLIP: animate the panel from the clicked card's position/size to its final layout.
      gsap.set(panel!, { clearProps: "transform", autoAlpha: 0 });
      const first = originVisual.getBoundingClientRect();
      const last = panel!.getBoundingClientRect();
      gsap.fromTo(backdrop!, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, ease: "power1.out" });
      gsap.fromTo(
        panel!,
        {
          autoAlpha: 1,
          x: first.left - last.left,
          y: first.top - last.top,
          scaleX: first.width / last.width,
          scaleY: first.height / last.height,
          transformOrigin: "top left",
        },
        { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: 0.5, ease: "power3.out" },
      );
    }

    closeBtn!.focus();
  }

  function finishClose(): void {
    modal!.classList.add("hidden");
    modal!.setAttribute("aria-hidden", "true");
    gsap.set(panel!, { clearProps: "all" });
    document.body.style.overflow = "";
    isOpen = false;
    lastFocused?.focus();
  }

  function close(): void {
    if (!isOpen) return;

    const visible = originVisual && originVisual.offsetParent !== null;
    if (reduce || !visible) {
      gsap.to(backdrop!, { autoAlpha: 0, duration: reduce ? 0 : 0.2 });
      gsap.to(panel!, { autoAlpha: 0, scale: 0.92, duration: reduce ? 0 : 0.2, onComplete: finishClose });
      return;
    }

    // Reverse FLIP back into the (still visible) card.
    const target = originVisual!.getBoundingClientRect();
    const last = panel!.getBoundingClientRect();
    gsap.to(backdrop!, { autoAlpha: 0, duration: 0.3, ease: "power1.in" });
    gsap.to(panel!, {
      x: target.left - last.left,
      y: target.top - last.top,
      scaleX: target.width / last.width,
      scaleY: target.height / last.height,
      transformOrigin: "top left",
      autoAlpha: 0,
      duration: 0.4,
      ease: "power3.in",
      onComplete: finishClose,
    });
  }

  // Focus trap: keep Tab within the panel while open.
  function trapFocus(e: KeyboardEvent): void {
    if (e.key !== "Tab") return;
    const focusable = panel!.querySelectorAll<HTMLElement>(
      'a[href]:not([style*="display: none"]), button:not([disabled])',
    );
    const list = Array.from(focusable).filter((el) => el.offsetParent !== null);
    if (list.length === 0) return;
    const firstEl = list[0];
    const lastEl = list[list.length - 1];
    if (e.shiftKey && document.activeElement === firstEl) {
      e.preventDefault();
      lastEl.focus();
    } else if (!e.shiftKey && document.activeElement === lastEl) {
      e.preventDefault();
      firstEl.focus();
    }
  }

  // --- wiring ---
  track!.addEventListener("click", (e) => {
    const card = (e.target as HTMLElement).closest<HTMLElement>(".project-card");
    if (card) open(card);
  });
  track!.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const card = (e.target as HTMLElement).closest<HTMLElement>(".project-card");
    if (card) {
      e.preventDefault();
      open(card);
    }
  });

  closeBtn!.addEventListener("click", close);
  backdrop!.addEventListener("click", close);
  document.addEventListener("keydown", (e) => {
    if (!isOpen) return;
    if (e.key === "Escape") close();
    else trapFocus(e);
  });
}
