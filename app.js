/* ============================================================
   alessa media — SITE LOGIC
   Work carousel (featured), category filters, project modal,
   scroll-reveal, and the hero aurora canvas. Vanilla, no deps.
   ============================================================ */
(function () {
  "use strict";

  var REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Data ---------------------------------------------------- */
  var PROJECTS = [
    { id:"stilberater", client:"Stilberater", title:"Social Media Videoproduktion", category:"social", services:["Videoedit","Animation","Sounddesign"], thumbnail:"assets/stilberater.png", description:"Laufende Social-Media-Betreuung: Konzeption und Schnitt von Shorts und YouTube-Videos, inkl. Animation und Sounddesign." },
    { id:"tech-ki-schmetterlinge", client:"Sascha Lobo", title:"Tech, KI & Schmetterlinge", category:"audio", services:["Audioschnitt","Sounddesign"], thumbnail:"assets/tech-ki-schmetterlinge.png", url:"https://open.spotify.com/show/5KlYjpj6RhYTP8L8k4bzi4", description:"Audioschnitt und Sounddesign für den Podcast „Tech, KI & Schmetterlinge“ von Sascha Lobo in Zusammenarbeit mit Schwarz Digits." },
    { id:"plasmazentrum", client:"Plasmazentrum Würzburg", title:"Aufmerksamkeitskampagne", category:"social", services:["Konzeption","Kameraführung","Bildbearbeitung","Videoedit"], thumbnail:"assets/plasmazentrum-wuerzburg.png", description:"Kampagne von der Konzeption über die Kameraführung bis zur Bildbearbeitung und zum finalen Schnitt." },
    { id:"arrow", client:"Arrow", title:"Arrowsphere Teaser Video", category:"film", services:["Videoedit","Animation","Sounddesign","Voiceover"], thumbnail:"assets/arrow.png", description:"Teaser-Video für Arrowsphere: Schnitt, Animation, Sounddesign und Voiceover zu einem prägnanten Produkt-Teaser kombiniert." },
    { id:"deloitte", client:"Deloitte Deutschland", title:"Videoreihe „Hidden Movers Award“", category:"film", services:["Videoedit"], thumbnail:"assets/deloitte.png", description:"Schnitt einer mehrteiligen Videoreihe rund um den Hidden Movers Award." },
    { id:"giz", client:"Giz", title:"„My Region is the Lab“", category:"film", services:["Videoedit"], thumbnail:"assets/giz.png", description:"Schnitt einer Kurzdokumentation über regionale Innovationsprojekte." },
    { id:"rkw", client:"RKW", title:"Social Entrepreneurship — Behind the Scenes", category:"film", services:["Videoedit"], thumbnail:"assets/rkw.jpg", description:"Behind-the-Scenes-Videoreihe zum Thema Social Entrepreneurship." },
    { id:"techfounders", client:"Techfounders", title:"Demo Day Teaser", category:"film", services:["Videoedit"], thumbnail:"assets/techfounders.jpg", description:"Energiegeladener Teaser zum Demo Day mit pointiertem Schnitt." },
    { id:"munich", client:"Munich Business", title:"Social Innovation Strategy", category:"film", services:["Videoedit"], description:"Videoproduktion zur Social Innovation Strategy." },
    { id:"prismasuite", client:"Prismasuite", title:"VLC Produktion", category:"film", services:["Videoedit","Animation","Sounddesign"], thumbnail:"assets/prismasuite.png", description:"Produktion inkl. Schnitt, Animation und Sounddesign für Prismasuite." },
    { id:"forstory", client:"forstory", title:"Impact Film Production", category:"film", services:["Videoedit"], thumbnail:"assets/forstory.png", description:"Schnitt einer Impact-orientierten Filmproduktion." },
    { id:"bundespolizei", client:"Bundespolizei", title:"„Gefahren am Bahnsteig“", category:"film", services:["Konzeption","Videoedit"], description:"Konzeption und Schnitt einer Aufklärungskampagne zu Gefahren am Bahnsteig." },
    { id:"cisco", client:"Cisco", title:"Podcast „Zukunft Verstehen“", category:"audio", services:["Texten","Einsprechen"], thumbnail:"assets/cisco-zukunft-verstehen.png", url:"https://www.cisco.com/c/de_de/solutions/executive-perspectives/podcasts.html", description:"Mitarbeit am Podcast „Zukunft Verstehen“: Texten und Einsprechen von Beiträgen." },
    { id:"sascha-lobo", client:"Sascha Lobo", title:"Audioschnittprojekte", category:"audio", services:["Audioschnitt"], thumbnail:"assets/sascha-lobo-pov.png", description:"Audiobearbeitung und Schnitt verschiedener Projekte für Sascha Lobo." }
  ];

  var FILTERS = [
    { key:"all",    label:"Alle" },
    { key:"social", label:"Social Media" },
    { key:"film",   label:"Film & Werbung" },
    { key:"audio",  label:"Audio & Podcast" }
  ];
  var CTA_LABEL = { audio:"Jetzt anhören", film:"Video ansehen", social:"Zum Kanal" };
  var WAVE_BARS = [40,70,100,60,85,45,75,55,90,35,65,50,80,42,68,58,88,46];

  var state = { filter: "all", nearest: 0 };

  /* ---- Helpers ------------------------------------------------- */
  function el(tag, cls, attrs) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (attrs) for (var k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  }
  function svgPlay() {
    return '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg>';
  }
  function externalIcon() {
    return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"></path><path d="M10 14 21 3"></path><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path></svg>';
  }

  /* ---- Card rendering ----------------------------------------- */
  var track = document.getElementById("work-track");

  function buildCard(p) {
    var card = el("div", "am-card");
    var article = el("article", "project-card", { role: "button", tabindex: "0" });

    var visual = el("div", "pc-visual");
    if (p.thumbnail) visual.style.backgroundImage = "url(" + p.thumbnail + ")";

    if (p.category === "audio") {
      var wfWrap = el("div", "pc-waveform");
      var wf = el("div", "waveform");
      for (var i = 0; i < WAVE_BARS.length; i++) {
        var bar = document.createElement("span");
        bar.style.height = WAVE_BARS[i] + "%";
        bar.style.backgroundPosition = ((i / (WAVE_BARS.length - 1)) * 100) + "% 0";
        bar.style.animationDelay = ((i % 6) * 0.12) + "s";
        wf.appendChild(bar);
      }
      wfWrap.appendChild(wf);
      visual.appendChild(wfWrap);
    } else {
      var playWrap = el("div", "pc-play-wrap");
      var play = el("span", "pc-play", { "aria-hidden": "true" });
      play.innerHTML = svgPlay();
      playWrap.appendChild(play);
      visual.appendChild(playWrap);
    }

    var plate = el("div", "pc-plate");
    var pClient = el("p", "pc-plate__client"); pClient.textContent = p.client;
    var pTitle = el("h3", "pc-plate__title"); pTitle.textContent = p.title;
    plate.appendChild(pClient); plate.appendChild(pTitle);
    visual.appendChild(plate);

    var tags = el("div", "pc-tags");
    p.services.forEach(function (s) {
      var t = el("span", "tag"); t.textContent = s; tags.appendChild(t);
    });

    article.appendChild(visual);
    article.appendChild(tags);
    article.addEventListener("click", function () { openModal(p); });
    article.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openModal(p); }
    });

    card.appendChild(article);
    return card;
  }

  function renderCards() {
    var shown = state.filter === "all"
      ? PROJECTS
      : PROJECTS.filter(function (p) { return p.category === state.filter; });
    track.innerHTML = "";
    shown.forEach(function (p) { track.appendChild(buildCard(p)); });
    track.scrollLeft = 0;
    requestAnimationFrame(updateCarousel);
  }

  /* ---- Filter chips ------------------------------------------- */
  function renderChips() {
    var wrap = document.getElementById("work-chips");
    FILTERS.forEach(function (f) {
      var c = el("button", "chip" + (state.filter === f.key ? " is-active" : ""), { type: "button" });
      c.textContent = f.label;
      c.setAttribute("aria-pressed", state.filter === f.key);
      c.addEventListener("click", function () {
        state.filter = f.key;
        wrap.querySelectorAll(".chip").forEach(function (n) { n.classList.remove("is-active"); n.setAttribute("aria-pressed", "false"); });
        c.classList.add("is-active"); c.setAttribute("aria-pressed", "true");
        renderCards();
      });
      wrap.appendChild(c);
    });
  }

  /* ---- Featured carousel -------------------------------------- */
  function updateCarousel() {
    var cards = track.querySelectorAll(".am-card");
    if (!cards.length) return;
    var tc = track.getBoundingClientRect();
    var center = tc.left + tc.width / 2;
    var nearest = 0, nd = Infinity;
    cards.forEach(function (card, i) {
      var r = card.getBoundingClientRect();
      var cc = r.left + r.width / 2;
      var d = (cc - center) / (r.width || 320);
      var ad = Math.abs(d);
      if (ad < nd) { nd = ad; nearest = i; }
      var cad = Math.min(ad, 3);
      var scale = Math.max(0.84, 1 - cad * 0.12);
      var op = Math.max(0.42, 1 - cad * 0.42);
      card.style.transform = "scale(" + scale + ")";
      card.style.opacity = op;
      card.style.zIndex = String(100 - Math.round(cad * 10));
    });
    state.nearest = nearest;
  }

  function navCarousel(dir) {
    var cards = track.querySelectorAll(".am-card");
    if (!cards.length) return;
    updateCarousel();
    var i = Math.max(0, Math.min(cards.length - 1, (state.nearest || 0) + dir));
    var card = cards[i];
    var cardR = card.getBoundingClientRect();
    var trackR = track.getBoundingClientRect();
    var delta = (cardR.left + cardR.width / 2) - (trackR.left + trackR.width / 2);
    track.scrollTo({ left: track.scrollLeft + delta, behavior: REDUCED ? "auto" : "smooth" });
  }

  /* ---- Modal --------------------------------------------------- */
  var modal = document.getElementById("project-modal");
  function openModal(p) {
    document.getElementById("modal-client").textContent = p.client;
    document.getElementById("modal-title").textContent = p.title;
    document.getElementById("modal-desc").textContent = p.description;
    var tagsBox = document.getElementById("modal-tags");
    tagsBox.innerHTML = "";
    p.services.forEach(function (s) {
      var t = el("span", "tag"); t.textContent = s; tagsBox.appendChild(t);
    });
    var ctaBox = document.getElementById("modal-cta");
    ctaBox.innerHTML = "";
    if (p.url) {
      var label = p.cta || CTA_LABEL[p.category] || "Projekt ansehen";
      var a = el("a", "btn btn--primary", { href: p.url, target: "_blank", rel: "noopener noreferrer" });
      a.innerHTML = label + externalIcon();
      ctaBox.appendChild(a);
    }
    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }
  function closeModal() {
    modal.classList.remove("is-open");
    document.body.style.overflow = "";
  }
  modal.querySelectorAll("[data-close]").forEach(function (n) { n.addEventListener("click", closeModal); });
  window.addEventListener("keydown", function (e) { if (e.key === "Escape") closeModal(); });

  /* ---- Scroll reveal ------------------------------------------ */
  function initReveal() {
    var items = document.querySelectorAll("[data-reveal]");
    if (REDUCED || !("IntersectionObserver" in window)) {
      items.forEach(function (n) { n.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.1 });
    items.forEach(function (n) { io.observe(n); });
  }

  /* ---- Hero aurora canvas ------------------------------------- */
  function initAurora() {
    var c = document.getElementById("hero-canvas");
    if (!c) return;
    var ctx = c.getContext("2d");
    var raf, rcount = 0;
    var blobs = [
      { c:"#7c3aed", x:0.30, y:0.32, r:0.46, ax:0.10, ay:0.08, s:0.7, p:0 },
      { c:"#ec4899", x:0.64, y:0.42, r:0.42, ax:0.12, ay:0.10, s:0.9, p:1.7 },
      { c:"#f59e0b", x:0.50, y:0.70, r:0.40, ax:0.14, ay:0.07, s:0.6, p:3.1 },
      { c:"#8b5cf6", x:0.80, y:0.22, r:0.34, ax:0.09, ay:0.09, s:1.1, p:4.5 }
    ];
    function hexA(hex, a) {
      var n = parseInt(hex.slice(1), 16);
      return "rgba(" + ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")";
    }
    function draw(ts) {
      var rect = c.getBoundingClientRect();
      var w = Math.max(1, Math.round(rect.width));
      var h = Math.max(1, Math.round(rect.height));
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (c.width !== w * dpr || c.height !== h * dpr) { c.width = w * dpr; c.height = h * dpr; }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      c.style.filter = "blur(42px)";
      var t = ts * 0.0001;
      var m = Math.min(w, h);
      blobs.forEach(function (b) {
        var cx = (b.x + Math.sin(t * b.s + b.p) * b.ax) * w;
        var cy = (b.y + Math.cos(t * b.s * 0.9 + b.p) * b.ay) * h;
        var rad = b.r * m * 1.25;
        var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
        g.addColorStop(0, hexA(b.c, 0.5));
        g.addColorStop(1, hexA(b.c, 0));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, rad, 0, Math.PI * 2);
        ctx.fill();
      });
    }
    function loop(ts) {
      draw(REDUCED ? 1600 : ts);
      if (REDUCED) { if (rcount++ < 8) raf = requestAnimationFrame(loop); }
      else { raf = requestAnimationFrame(loop); }
    }
    raf = requestAnimationFrame(loop);
  }

  /* ---- Init ---------------------------------------------------- */
  function queueCarousel() {
    if (queueCarousel._q) return;
    queueCarousel._q = true;
    requestAnimationFrame(function () { queueCarousel._q = false; updateCarousel(); });
  }

  document.getElementById("year").textContent = new Date().getFullYear();
  renderChips();
  renderCards();
  initReveal();
  initAurora();

  document.getElementById("work-prev").addEventListener("click", function () { navCarousel(-1); });
  document.getElementById("work-next").addEventListener("click", function () { navCarousel(1); });
  track.addEventListener("scroll", queueCarousel, { passive: true });
  window.addEventListener("resize", queueCarousel);
  [80, 250, 500, 900].forEach(function (d) { setTimeout(updateCarousel, d); });

  /* ---- Full-page section navigation (desktop) ------------------
     Any scroll intent — even a tiny one — jumps to the adjacent
     section. Locked during the animation, and held until trackpad
     momentum stops, so one gesture moves exactly one section. */
  (function initSectionNav() {
    var mq = window.matchMedia("(min-width: 900px)");
    var sections = ["top", "work", "skills", "about", "contact"]
      .map(function (id) { return document.getElementById(id); });
    var navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--nav-h"), 10) || 71;
    var locked = false;
    var lastWheel = 0;

    function currentIndex() {
      var best = 0, bd = Infinity;
      sections.forEach(function (s, i) {
        var d = Math.abs(s.getBoundingClientRect().top - navH);
        if (d < bd) { bd = d; best = i; }
      });
      return best;
    }
    function scheduleUnlock() {
      var since = Date.now() - lastWheel;
      if (since < 120) { setTimeout(scheduleUnlock, 120 - since); }
      else { locked = false; }
    }
    function goTo(i) {
      i = Math.max(0, Math.min(sections.length - 1, i));
      locked = true;
      window.scrollTo({ top: sections[i].offsetTop - navH, behavior: REDUCED ? "auto" : "smooth" });
      setTimeout(scheduleUnlock, REDUCED ? 60 : 600);
    }
    function modalOpen() { return modal.classList.contains("is-open"); }

    window.addEventListener("wheel", function (e) {
      if (!mq.matches || modalOpen()) return;
      var dir = e.deltaY > 0 ? 1 : (e.deltaY < 0 ? -1 : 0);
      if (!dir) return;          // let horizontal scrolling (carousel) pass through
      e.preventDefault();        // take over vertical scrolling
      lastWheel = Date.now();
      if (locked) return;
      goTo(currentIndex() + dir);
    }, { passive: false });

    window.addEventListener("keydown", function (e) {
      if (!mq.matches || modalOpen()) return;
      var tag = (e.target && e.target.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key === "Home") { e.preventDefault(); goTo(0); return; }
      if (e.key === "End") { e.preventDefault(); goTo(sections.length - 1); return; }
      var down = e.key === "ArrowDown" || e.key === "PageDown";
      var up = e.key === "ArrowUp" || e.key === "PageUp";
      if (!down && !up) return;
      e.preventDefault();
      if (locked) return;
      goTo(currentIndex() + (down ? 1 : -1));
    });
  })();
})();
