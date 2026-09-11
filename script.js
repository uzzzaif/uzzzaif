/* ============================================================
   UZAIF PORTFOLIO — script.js
   Systems: theme, background (3-layer canvas), hero language
   sequence, navbar, scroll reveal, hub-spoke tech, project
   expand, about panels, build-flow, contact email CTA.
   ============================================================ */

(function () {
  "use strict";

  /* ─────────────────────────────────────────────────
     CENTRALISED DATA
  ───────────────────────────────────────────────── */

  const LANGUAGES = [
    { name: "English",    label: "01_English.png"    },
    { name: "Hindi",      label: "02_Hindi.png"      },
    { name: "Spanish",    label: "03_Spanish.png"    },
    { name: "Arabic",     label: "04_Arabic.png"     },
    { name: "Kannada",    label: "05_Kannada.png"    },
    { name: "Japanese",   label: "06_Japanese.png"   },
    { name: "Telugu",     label: "07_Telugu.png"     },
    { name: "Punjabi",    label: "08_Punjabi.png"    },
    { name: "Tamil",      label: "09_Tamil.png"      },
    { name: "German",     label: "10_German.png"     },
    { name: "Chinese",    label: "11_Chinese.png"    },
    { name: "French",     label: "12_French.png"     },
    { name: "Korean",     label: "13_Korean.png"     },
    { name: "Italian",    label: "14_Italian.png"    },
    { name: "Portuguese", label: "15_Portuguese.png" },
    { name: "Russian",    label: "16_Russian.png"    },
    { name: "Turkish",    label: "17_Turkish.png"    },
    { name: "Indonesian", label: "18_Indonesian.png" }
  ];

  const ASSETS = {
    lightDir: "assets/light_languages/",
    darkDir:  "assets/dark_languages/",
    ubLight:  "assets/UB_light_trans_SVG.svg",
    ubDark:   "assets/UB_dark_trans_SVG.svg"
  };

  const TECH_HUBS = [
    {
      id: "aiml",
      label: "AI / ML",
      icon: "fas fa-brain",
      nodes: [
        "Machine Learning","Deep Learning","Computer Vision","YOLOv8",
        "RAG","Agentic AI","AI Agents","AI Chatbots",
        "LLM Applications","Prompt Engineering","AI Automation"
      ]
    },
    {
      id: "development",
      label: "DEVELOPMENT",
      icon: "fas fa-code",
      nodes: ["Python","Java","C++","JavaScript","HTML","CSS","Node.js"]
    },
    {
      id: "data",
      label: "DATA",
      icon: "fas fa-database",
      nodes: ["MySQL","PostgreSQL","SQLite","SQL","Pandas","NumPy"]
    },
    {
      id: "infrastructure",
      label: "INFRASTRUCTURE",
      icon: "fas fa-cloud",
      nodes: [
        "Linux","AWS","EC2","S3","RDS",
        "IAM","VPC","Lambda","Git","GitHub","Hosting","Deployment","DNS"
      ]
    },
    {
      id: "automation",
      label: "AUTOMATION",
      icon: "fas fa-cogs",
      nodes: ["n8n","APIs","Webhooks","Workflow Automation","WhatsApp Automation"]
    },
    {
      id: "aitools",
      label: "AI TOOLS",
      icon: "fas fa-wand-magic-sparkles",
      nodes: [
        "AI Tooling","Modern AI Workflows",
        "Prompt Engineering","AI Tool Ecosystem","Rapid Adaptation"
      ]
    }
  ];

  const ABOUT_AI_CHIPS = [
    "Machine Learning","Deep Learning","Computer Vision","RAG",
    "Agentic AI","LLM Applications","AI Automation","Prompt Engineering",
    "AI Agents","AI Chatbots","OpenCV","YOLOv8","Model Evaluation"
  ];

  const TB_NODES = [
    "Software Dev","AI / ML","Databases",
    "Cloud Infra","Automation","Web Dev"
  ];

  /* ─────────────────────────────────────────────────
     REDUCED MOTION CHECK
  ───────────────────────────────────────────────── */
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ─────────────────────────────────────────────────
     THEME TOGGLE
  ───────────────────────────────────────────────── */
  const html      = document.documentElement;
  const themeBtn  = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");
  const ubLogoBg  = document.getElementById("ub-logo-bg");

  const savedTheme = localStorage.getItem("uz-theme") || "light";
  applyTheme(savedTheme);

  themeBtn.addEventListener("click", () => {
    const next = html.dataset.theme === "light" ? "dark" : "light";
    applyTheme(next);
    localStorage.setItem("uz-theme", next);
  });

  function applyTheme(t) {
    html.dataset.theme = t;
    themeIcon.className = t === "dark" ? "fas fa-moon" : "fas fa-sun";
    // Swap UB ambient logo
    if (ubLogoBg) {
      ubLogoBg.src = t === "dark" ? ASSETS.ubDark : ASSETS.ubLight;
    }
    // Update hero image for new theme
    if (currentLangFrame !== undefined) {
      setHeroFrame(currentLangFrame, false);
    }
  }

  /* ─────────────────────────────────────────────────
     MOBILE NAV
  ───────────────────────────────────────────────── */
  const hamburger = document.getElementById("hamburger");
  const navLinks  = document.getElementById("nav-links");

  hamburger.addEventListener("click", () => {
    const isOpen = hamburger.classList.toggle("open");
    navLinks.classList.toggle("open", isOpen);
    hamburger.setAttribute("aria-expanded", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  navLinks.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", closeNav);
  });

  function closeNav() {
    hamburger.classList.remove("open");
    navLinks.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  /* ─────────────────────────────────────────────────
     NAVBAR — SCROLL STATE + ACTIVE LINK
  ───────────────────────────────────────────────── */
  const navbar    = document.getElementById("navbar");
  const navLinkEls = document.querySelectorAll(".nav-link");
  const sections  = document.querySelectorAll("section[id]");

  function onNavScroll() {
    // Scrolled compact state
    if (window.scrollY > 80) {
      navbar.classList.add("navbar--scrolled");
    } else {
      navbar.classList.remove("navbar--scrolled");
    }

    // Active section highlighting
    let current = "";
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) {
        current = sec.id;
      }
    });
    navLinkEls.forEach(link => {
      const href = link.getAttribute("href").replace("#", "");
      if (href === current) {
        link.classList.add("nav-link--active");
      } else {
        link.classList.remove("nav-link--active");
      }
    });
  }

  window.addEventListener("scroll", onNavScroll, { passive: true });

  /* ─────────────────────────────────────────────────
     SCROLL PROGRESS BAR
  ───────────────────────────────────────────────── */
  const scrollBar = document.getElementById("scroll-bar");

  function updateScrollBar() {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct   = total > 0 ? (window.scrollY / total) * 100 : 0;
    scrollBar.style.width = pct + "%";
  }
  window.addEventListener("scroll", updateScrollBar, { passive: true });

  /* ─────────────────────────────────────────────────
     BACKGROUND SYSTEM — 3-LAYER CANVAS
  ───────────────────────────────────────────────── */
  const canvas = document.getElementById("bg-canvas");
  const ctx    = canvas.getContext("2d");

  let W, H;
  let microElements = [];
  let scrollCurrent  = 0;
  let scrollTarget   = 0;
  let bgRafId        = null;
  let lastVisible    = true;

  // Grid config
  const GRID_COLS  = 12;
  const GRID_SPEED = 0.18; // parallax factor for grid

  // Micro-element types
  const SHAPES = ["circle","circle","triangle","square","ring","star","triangle"];

  function initMicro() {
    const count = prefersReducedMotion ? 0 : (window.innerWidth < 768 ? 15 : 28);
    microElements = Array.from({ length: count }, () => ({
      x:     Math.random() * W,
      baseY: Math.random() * H,
      size:  Math.random() * 9 + 4,
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      depth: Math.random() * 1.2 + 0.2,  // parallax coefficient
      filled: Math.random() > 0.5,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.004,
      opacity:  Math.random() * 0.18 + 0.05
    }));
  }

  function resizeBg() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    initMicro();
  }

  // Throttled resize
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resizeBg, 120);
  });
  resizeBg();

  // Scroll feeds scroll target
  window.addEventListener("scroll", () => {
    scrollTarget = window.scrollY;
    // Update CSS variable for atmosphere blobs (CSS animation supplement)
    document.documentElement.style.setProperty(
      "--scroll-offset", window.scrollY + "px"
    );
  }, { passive: true });

  // Get accent colour from computed CSS (theme-aware, no hardcoded hex)
  function getAccentRGB() {
    const style = getComputedStyle(html);
    const raw   = style.getPropertyValue("--color-micro-element").trim();
    // raw is like "rgba(37, 99, 235, 0.12)" — extract r,g,b
    const m = raw.match(/[\d.]+/g);
    if (m && m.length >= 3) return { r: +m[0], g: +m[1], b: +m[2] };
    return { r: 37, g: 99, b: 235 };
  }
  function getGridColor() {
    const style = getComputedStyle(html);
    return style.getPropertyValue("--color-grid").trim() ||
           "rgba(37,99,235,0.07)";
  }

  function lerp(a, b, t) { return a + (b - a) * t; }

  function drawGrid(offset) {
    const cellW = W / GRID_COLS;
    const cellH = cellW;
    const cols  = GRID_COLS + 1;
    const rows  = Math.ceil(H / cellH) + 2;
    const yOff  = ((-offset * GRID_SPEED) % cellH + cellH) % cellH;

    ctx.strokeStyle = getGridColor();
    ctx.lineWidth   = 0.5;
    ctx.beginPath();

    // Vertical lines
    for (let c = 0; c <= cols; c++) {
      const x = c * cellW;
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
    }
    // Horizontal lines (offset by scroll)
    for (let r = -1; r <= rows; r++) {
      const y = r * cellH + yOff;
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
    }
    ctx.stroke();
  }

  function drawShape(el, scrollOff) {
    const y = el.baseY - scrollOff * el.depth;
    // Wrap vertically
    const yWrapped = ((y % (H + 60)) + H + 60) % (H + 60) - 30;

    const { r, g, b } = getAccentRGB();
    const alpha = el.opacity;

    ctx.save();
    ctx.translate(el.x, yWrapped);
    ctx.rotate(el.rotation);

    ctx.strokeStyle = `rgba(${r},${g},${b},${alpha * 1.6})`;
    ctx.fillStyle   = `rgba(${r},${g},${b},${alpha})`;
    ctx.lineWidth   = 1;

    const s = el.size;

    switch (el.shape) {
      case "circle":
        ctx.beginPath();
        ctx.arc(0, 0, s, 0, Math.PI * 2);
        if (el.filled) ctx.fill(); else ctx.stroke();
        break;
      case "ring":
        ctx.beginPath();
        ctx.arc(0, 0, s, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, s * 0.55, 0, Math.PI * 2);
        ctx.stroke();
        break;
      case "triangle":
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.lineTo(s * 0.87, s * 0.5);
        ctx.lineTo(-s * 0.87, s * 0.5);
        ctx.closePath();
        if (el.filled) ctx.fill(); else ctx.stroke();
        break;
      case "square":
        ctx.beginPath();
        ctx.rect(-s * 0.7, -s * 0.7, s * 1.4, s * 1.4);
        if (el.filled) ctx.fill(); else ctx.stroke();
        break;
      case "star":
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const ang  = (i * 4 * Math.PI) / 5 - Math.PI / 2;
          const angI = (i * 4 * Math.PI) / 5 - Math.PI / 2 + (2 * Math.PI) / 10;
          if (i === 0) ctx.moveTo(Math.cos(ang) * s, Math.sin(ang) * s);
          else         ctx.lineTo(Math.cos(ang) * s, Math.sin(ang) * s);
          ctx.lineTo(Math.cos(angI) * s * 0.42, Math.sin(angI) * s * 0.42);
        }
        ctx.closePath();
        if (el.filled) ctx.fill(); else ctx.stroke();
        break;
    }
    ctx.restore();

    // Slowly rotate
    if (!prefersReducedMotion) el.rotation += el.rotSpeed;
  }

  function bgLoop() {
    if (document.hidden) { bgRafId = null; return; }

    // Lerp scroll
    scrollCurrent = lerp(scrollCurrent, scrollTarget, 0.08);

    ctx.clearRect(0, 0, W, H);

    // Layer 1: grid
    drawGrid(scrollCurrent);

    // Layer 3: micro-elements
    microElements.forEach(el => drawShape(el, scrollCurrent));

    bgRafId = requestAnimationFrame(bgLoop);
  }

  // Pause/resume on visibility
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      if (bgRafId) { cancelAnimationFrame(bgRafId); bgRafId = null; }
    } else {
      if (!bgRafId) bgRafId = requestAnimationFrame(bgLoop);
    }
  });

  if (!prefersReducedMotion) {
    bgRafId = requestAnimationFrame(bgLoop);
  } else {
    // Draw one static frame
    drawGrid(0);
  }

  /* ─────────────────────────────────────────────────
     HERO — LANGUAGE SCROLL SEQUENCE
  ───────────────────────────────────────────────── */
  const heroDrv     = document.getElementById("hero-driver");
  const heroImg     = document.getElementById("hero-lang-img");
  const heroIdent   = document.getElementById("hero-identity");
  const frameBadge  = document.getElementById("hero-frame-badge");
  const scrollCue   = document.querySelector(".hero-scroll-cue");

  const DWELL_FACTOR   = 1.8; // * 100vh per language frame
  const IDENTITY_START = 0.85; // show identity when progress >= this

  let currentLangFrame  = 0;
  let identityShown     = false;
  let preloadedImages   = {};  // cache of loaded Image objects
  let preloadQueue      = [];
  let isPreloading      = false;

  // Set driver height
  function setDriverHeight() {
    heroDrv.style.height = (LANGUAGES.length * DWELL_FACTOR * 100) + "vh";
  }
  setDriverHeight();
  window.addEventListener("resize", setDriverHeight);

  function langDir() {
    return html.dataset.theme === "dark" ? ASSETS.darkDir : ASSETS.lightDir;
  }

  function frameSrc(idx) {
    return langDir() + LANGUAGES[idx].label;
  }

  // Preload image by index, call cb when done (or immediately if cached)
  function preloadFrame(idx, cb) {
    if (idx < 0 || idx >= LANGUAGES.length) return;
    const src = frameSrc(idx);
    if (preloadedImages[src]) { if (cb) cb(); return; }

    const img = new Image();
    img.onload = img.onerror = () => {
      preloadedImages[src] = img;
      if (cb) cb();
      drainQueue();
    };
    img.src = src;
  }

  function drainQueue() {
    if (isPreloading || preloadQueue.length === 0) return;
    isPreloading = true;
    const next = preloadQueue.shift();
    preloadFrame(next, () => { isPreloading = false; drainQueue(); });
  }

  function queueFrames(from, to) {
    for (let i = from; i <= Math.min(to, LANGUAGES.length - 1); i++) {
      const src = frameSrc(i);
      if (!preloadedImages[src] && !preloadQueue.includes(i)) {
        preloadQueue.push(i);
      }
    }
    drainQueue();
  }

  // Set the visible frame
  function setHeroFrame(idx, animate) {
    if (idx === currentLangFrame && !animate && html.dataset.theme) {
      // force update on theme switch
    }
    currentLangFrame = idx;
    const src = frameSrc(idx);

    if (animate !== false) {
      heroImg.style.opacity = "0";
      setTimeout(() => {
        heroImg.src = src;
        heroImg.alt = LANGUAGES[idx].name;
        heroImg.style.opacity = "1";
      }, 140);
    } else {
      heroImg.src = src;
      heroImg.alt = LANGUAGES[idx].name;
      heroImg.style.opacity = "1";
    }

    if (frameBadge) {
      frameBadge.textContent =
        String(idx + 1).padStart(2, "0") + " / " + LANGUAGES.length;
    }
    // Live region for screen readers
    heroImg.setAttribute("aria-label", LANGUAGES[idx].name + " greeting");

    // Queue ahead
    queueFrames(idx + 1, idx + 4);
  }

  // Initial frame (frame 0) — already in HTML src, just cache it
  (function initFirstFrame() {
    const src = frameSrc(0);
    const cached = new Image();
    cached.onload = () => { preloadedImages[src] = cached; };
    cached.src    = src;
    heroImg.src   = src;
    queueFrames(1, 5);
  })();

  // Reduced motion: show identity immediately, skip sequence
  if (prefersReducedMotion) {
    heroIdent.classList.add("visible");
    identityShown = true;
    if (scrollCue)  scrollCue.style.display = "none";
    heroDrv.style.height = "100vh";
  }

  // Hero scroll handler
  function onHeroScroll() {
    if (prefersReducedMotion) return;

    const drvTop    = heroDrv.getBoundingClientRect().top + window.scrollY;
    const drvHeight = heroDrv.offsetHeight - window.innerHeight;
    const rawProg   = (window.scrollY - drvTop) / drvHeight;
    const progress  = Math.max(0, Math.min(1, rawProg));

    // Map progress to frame index
    const rawFrame = progress * LANGUAGES.length;
    const frameIdx = Math.min(Math.floor(rawFrame), LANGUAGES.length - 1);

    if (frameIdx !== currentLangFrame) {
      setHeroFrame(frameIdx, true);
    }

    // Scroll cue: fade out once scrolled
    if (scrollCue) {
      scrollCue.style.opacity = progress > 0.04 ? "0" : "1";
    }

    // Identity overlay
    if (progress >= IDENTITY_START && !identityShown) {
      identityShown = true;
      heroIdent.classList.add("visible");
      heroIdent.removeAttribute("aria-hidden");
    }
    if (progress < IDENTITY_START - 0.05 && identityShown) {
      identityShown = false;
      heroIdent.classList.remove("visible");
      heroIdent.setAttribute("aria-hidden", "true");
    }
  }

  window.addEventListener("scroll", onHeroScroll, { passive: true });

  /* ─────────────────────────────────────────────────
     SCROLL REVEAL — EXTENDED
  ───────────────────────────────────────────────── */
  const revealEls = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");

  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

  if (!prefersReducedMotion) {
    revealEls.forEach(el => revealObs.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add("visible"));
  }

  // Timeline spine animation
  const timelineWrapper = document.getElementById("timeline-wrapper");
  if (timelineWrapper) {
    const tlObs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        timelineWrapper.classList.add("visible");
        tlObs.disconnect();
      }
    }, { threshold: 0.15 });
    if (!prefersReducedMotion) tlObs.observe(timelineWrapper);
    else timelineWrapper.classList.add("visible");
  }

  // Build-flow line animation
  const buildFlowWrap = document.getElementById("build-flow-wrap");
  if (buildFlowWrap) {
    const bfObs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        buildFlowWrap.classList.add("visible");
        bfObs.disconnect();
      }
    }, { threshold: 0.15 });
    if (!prefersReducedMotion) bfObs.observe(buildFlowWrap);
    else buildFlowWrap.classList.add("visible");
  }

  /* ─────────────────────────────────────────────────
     ABOUT — PANEL ANIMATIONS
  ───────────────────────────────────────────────── */

  // Technical Breadth radial nodes
  (function initTbNodes() {
    const visual = document.getElementById("tb-visual");
    if (!visual) return;

    const R   = 100; // radius in px
    const cx  = 130; // centre of 260px container
    const cy  = 130;

    TB_NODES.forEach((name, i) => {
      const angle = (i / TB_NODES.length) * 2 * Math.PI - Math.PI / 2;
      const x     = cx + Math.cos(angle) * R;
      const y     = cy + Math.sin(angle) * R;

      const node  = document.createElement("div");
      node.className   = "tb-node";
      node.textContent = name;
      node.style.left  = x + "px";
      node.style.top   = y + "px";
      visual.appendChild(node);
    });
  })();

  // AI Tool Fluency chips with stagger
  (function initAfChips() {
    const visual = document.getElementById("af-visual");
    if (!visual) return;

    ABOUT_AI_CHIPS.forEach((name, i) => {
      const chip = document.createElement("span");
      chip.className    = "af-chip";
      chip.textContent  = name;
      chip.style.transitionDelay = (i * 0.06) + "s";
      visual.appendChild(chip);
    });
  })();

  // Observe about panels for triggered animations
  const aboutPanels = document.querySelectorAll(".about-panel");
  const panelObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        panelObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  if (!prefersReducedMotion) {
    aboutPanels.forEach(p => panelObs.observe(p));
  } else {
    aboutPanels.forEach(p => p.classList.add("visible"));
  }

  /* ─────────────────────────────────────────────────
     TECH — HUB AND SPOKE
  ───────────────────────────────────────────────── */
  const hubStage = document.getElementById("hub-stage");

  let activeHubId = null;

  function buildHubs() {
    if (!hubStage) return;
    hubStage.innerHTML = "";

    TECH_HUBS.forEach(hub => {
      // Wrapper
      const wrap = document.createElement("div");
      wrap.className = "hub-wrap reveal";
      wrap.dataset.hubId = hub.id;

      // SVG for connector lines
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.classList.add("hub-svg");
      svg.setAttribute("aria-hidden", "true");
      wrap.appendChild(svg);

      // Centre button
      const btn = document.createElement("button");
      btn.className    = "hub-center";
      btn.setAttribute("aria-expanded", "false");
      btn.setAttribute("aria-controls", "spoke-" + hub.id);
      btn.setAttribute("aria-label", hub.label + " — click to expand technologies");

      const iconEl = document.createElement("i");
      iconEl.className = hub.icon + " hub-icon";
      iconEl.setAttribute("aria-hidden", "true");

      const labelEl = document.createElement("span");
      labelEl.className   = "hub-label";
      labelEl.textContent = hub.label;

      btn.appendChild(iconEl);
      btn.appendChild(labelEl);
      wrap.appendChild(btn);

      // Spokes container
      const spokesDiv = document.createElement("div");
      spokesDiv.className = "hub-spokes";
      spokesDiv.id        = "spoke-" + hub.id;
      spokesDiv.setAttribute("role", "list");
      spokesDiv.setAttribute("aria-label", hub.label + " technologies");
      wrap.appendChild(spokesDiv);

      // Position spokes radially
      const N   = hub.nodes.length;
      const R   = 120;  // radius — compact for grid layout
      const wrapW = 280;  // assumed wrap width (set by CSS min-height)
      const cx  = wrapW / 2;
      const cy  = 160; // vertical centre offset in 320px tall cell

      hub.nodes.forEach((name, i) => {
        const angle = (i / N) * 2 * Math.PI - Math.PI / 2;
        const x     = cx + Math.cos(angle) * R;
        const y     = cy + Math.sin(angle) * R;

        const spoke = document.createElement("div");
        spoke.className   = "spoke-node";
        spoke.style.left  = x + "px";
        spoke.style.top   = y + "px";
        spoke.style.transitionDelay = (i * 0.04) + "s";
        spoke.setAttribute("role", "listitem");
        spoke.setAttribute("tabindex", "-1");

        const lbl = document.createElement("span");
        lbl.className   = "spoke-label";
        lbl.textContent = name;
        spoke.appendChild(lbl);
        spokesDiv.appendChild(spoke);

        // SVG line placeholder — drawn on open
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.dataset.idx = i;
        svg.appendChild(line);
      });

      // Draw SVG lines after mount
      wrap.dataset.cx = cx;
      wrap.dataset.cy = cy;

      // Events
      btn.addEventListener("click",      () => toggleHub(hub.id, wrap));
      btn.addEventListener("mouseenter", () => {
        if (window.innerWidth > 768) openHub(hub.id, wrap);
      });
      wrap.addEventListener("mouseleave", () => {
        if (window.innerWidth > 768) closeHub(hub.id, wrap);
      });
      btn.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleHub(hub.id, wrap);
        }
      });

      hubStage.appendChild(wrap);
    });

    // Register reveal for newly added hub-wraps
    if (!prefersReducedMotion) {
      hubStage.querySelectorAll(".hub-wrap.reveal").forEach(el => {
        if (!el.classList.contains("visible")) revealObs.observe(el);
      });
    } else {
      hubStage.querySelectorAll(".hub-wrap.reveal").forEach(el =>
        el.classList.add("visible")
      );
    }
  }

  function updateSvgLines(wrap) {
    const svg   = wrap.querySelector(".hub-svg");
    const spokes = wrap.querySelectorAll(".spoke-node");
    const lines  = svg.querySelectorAll("line");
    const rect   = wrap.getBoundingClientRect();
    const cx     = parseFloat(wrap.dataset.cx);
    const cy     = parseFloat(wrap.dataset.cy);

    spokes.forEach((spoke, i) => {
      if (!lines[i]) return;
      const sr   = spoke.getBoundingClientRect();
      const wr   = wrap.getBoundingClientRect();
      // Positions relative to wrap
      const sx   = (sr.left - wr.left) + sr.width  / 2;
      const sy   = (sr.top  - wr.top)  + sr.height / 2;
      lines[i].setAttribute("x1", cx);
      lines[i].setAttribute("y1", cy);
      lines[i].setAttribute("x2", sx);
      lines[i].setAttribute("y2", sy);
    });
  }

  function openHub(id, wrap) {
    wrap.classList.add("hub-active");
    wrap.querySelector(".hub-center").setAttribute("aria-expanded", "true");
    requestAnimationFrame(() => updateSvgLines(wrap));
    // Make spokes focusable
    wrap.querySelectorAll(".spoke-node").forEach(s => s.setAttribute("tabindex", "0"));
  }

  function closeHub(id, wrap) {
    wrap.classList.remove("hub-active");
    wrap.querySelector(".hub-center").setAttribute("aria-expanded", "false");
    wrap.querySelectorAll(".spoke-node").forEach(s => s.setAttribute("tabindex", "-1"));
  }

  function toggleHub(id, wrap) {
    const isOpen = wrap.classList.contains("hub-active");
    // Close all
    document.querySelectorAll(".hub-wrap.hub-active").forEach(w => {
      if (w !== wrap) closeHub(w.dataset.hubId, w);
    });
    if (isOpen) {
      closeHub(id, wrap);
      activeHubId = null;
    } else {
      openHub(id, wrap);
      activeHubId = id;
    }
  }

  buildHubs();

  /* ─────────────────────────────────────────────────
     PROJECTS — EXPAND/COLLAPSE
  ───────────────────────────────────────────────── */
  const projPanels = document.querySelectorAll(".proj-panel");

  projPanels.forEach(panel => {
    const expanded = panel.querySelector(".proj-expanded");
    const closeBtn = panel.querySelector(".proj-close-btn");

    function openPanel() {
      panel.classList.add("proj-open");
      panel.setAttribute("aria-expanded", "true");
      if (expanded) expanded.removeAttribute("aria-hidden");
    }

    function closePanel(e) {
      if (e) e.stopPropagation();
      panel.classList.remove("proj-open");
      panel.setAttribute("aria-expanded", "false");
      if (expanded) expanded.setAttribute("aria-hidden", "true");
    }

    panel.addEventListener("click", (e) => {
      if (closeBtn && e.target === closeBtn) return; // handled below
      if (panel.classList.contains("proj-open")) {
        closePanel();
      } else {
        openPanel();
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", closePanel);
    }

    panel.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (panel.classList.contains("proj-open")) closePanel();
        else openPanel();
      }
      if (e.key === "Escape") closePanel();
    });
  });

  /* ─────────────────────────────────────────────────
     CONTACT — EMAIL CTA SUBJECT SELECTOR
  ───────────────────────────────────────────────── */
  const subjectBtns = document.querySelectorAll(".subject-btn");
  const emailCta    = document.getElementById("email-cta");
  const EMAIL       = "mirzauzaif07@gmail.com";
  let   activeSubject = "Job Opportunity";

  function updateEmailLink() {
    if (!emailCta) return;
    emailCta.href = "mailto:" + EMAIL + "?subject=" +
      encodeURIComponent(activeSubject);
  }
  updateEmailLink();

  subjectBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      subjectBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeSubject = btn.dataset.subject;
      updateEmailLink();
    });
  });

  /* ─────────────────────────────────────────────────
     HERO SCROLL CUE — also hide once scroll begins
  ───────────────────────────────────────────────── */
  // Already handled in onHeroScroll above

})(); // end IIFE
