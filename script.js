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
    { name: "English",    text: "Hello",       font: "lang-pacifico"      },
    { name: "Hindi",      text: "हैलो",         font: "lang-kalam"         },
    { name: "Spanish",    text: "Hola",        font: "lang-pacifico"      },
    { name: "Arabic",     text: "مرحبًا",       font: "lang-baloo-bhaijaan", rtl: true },
    { name: "Kannada",    text: "ಹಲೋ",          font: "lang-baloo-tamma"   },
    { name: "Japanese",   text: "こんにちは",     font: "lang-yuji"          },
    { name: "Telugu",     text: "హలో",          font: "lang-baloo-tammudu" },
    { name: "Punjabi",    text: "ਹੈਲੋ",         font: "lang-baloo-paaji"   },
    { name: "Tamil",      text: "ஹலோ",          font: "lang-baloo-thambi"  },
    { name: "German",     text: "Hallo",       font: "lang-pacifico"      },
    { name: "Chinese",    text: "你好",          font: "lang-zcool"         },
    { name: "French",     text: "Salut",       font: "lang-pacifico"      },
    { name: "Korean",     text: "안녕하세요",     font: "lang-gamja"         },
    { name: "Italian",    text: "Ciao",        font: "lang-pacifico"      },
    { name: "Portuguese", text: "Olá",         font: "lang-pacifico"      },
    { name: "Russian",    text: "Привет",      font: "lang-pacifico"      },
    { name: "Turkish",    text: "Merhaba",     font: "lang-pacifico"      },
    { name: "Indonesian", text: "Halo",        font: "lang-pacifico"      }
  ];

  const ALL_LANG_FONT_CLASSES = [
    "lang-pacifico", "lang-kalam", "lang-baloo-bhaijaan", "lang-baloo-tamma",
    "lang-baloo-tammudu", "lang-baloo-paaji", "lang-baloo-thambi",
    "lang-zcool", "lang-yuji", "lang-gamja"
  ];

  const ASSETS = {
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
  let currentLangFrame = 0;

  const savedTheme = localStorage.getItem("uz-theme") || "light";

  themeBtn.addEventListener("click", () => {
    const next = html.dataset.theme === "light" ? "dark" : "light";
    applyTheme(next);
    localStorage.setItem("uz-theme", next);
  });

  function applyTheme(t) {
    const isInitialTheme = !html.dataset.theme;
    if (!isInitialTheme) {
      html.classList.add("theme-switching");
      if (bgRafId) {
        cancelAnimationFrame(bgRafId);
        bgRafId = null;
      }
    }

    html.dataset.theme = t;
    themeIcon.className = t === "dark" ? "fas fa-moon" : "fas fa-sun";
    // Swap UB ambient logo
    if (ubLogoBg) {
      ubLogoBg.src = t === "dark" ? ASSETS.ubDark : ASSETS.ubLight;
    }
    // Note: hero greeting text colour follows var(--accent) automatically
    // via CSS — no JS swap needed on theme change.
    // Bust colour cache so canvas picks up new theme colours
    invalidateColorCache();

    if (!isInitialTheme) {
      requestAnimationFrame(() => {
        html.classList.remove("theme-switching");
        if (!document.hidden && !prefersReducedMotion) {
          bgRafId = requestAnimationFrame(bgLoop);
        }
      });
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
    const count = prefersReducedMotion ? 0 : (window.innerWidth < 768 ? 10 : 20);
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
  // Cached — only recomputed on theme change
  let _cachedAccentRGB  = null;
  let _cachedGridColor  = null;

  function invalidateColorCache() {
    _cachedAccentRGB = null;
    _cachedGridColor = null;
  }

  function getAccentRGB() {
    if (_cachedAccentRGB) return _cachedAccentRGB;
    const style = getComputedStyle(html);
    const raw   = style.getPropertyValue("--color-micro-element").trim();
    // raw is like "rgba(37, 99, 235, 0.12)" — extract r,g,b
    const m = raw.match(/[\d.]+/g);
    _cachedAccentRGB = (m && m.length >= 3)
      ? { r: +m[0], g: +m[1], b: +m[2] }
      : { r: 37, g: 99, b: 235 };
    return _cachedAccentRGB;
  }
  function getGridColor() {
    if (_cachedGridColor) return _cachedGridColor;
    const style = getComputedStyle(html);
    _cachedGridColor = style.getPropertyValue("--color-grid").trim() ||
           "rgba(37,99,235,0.07)";
    return _cachedGridColor;
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
    scrollCurrent = lerp(scrollCurrent, scrollTarget, 0.18);

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
  const heroBox     = document.getElementById("hero-lang-box");
  const heroTxt     = document.getElementById("hero-lang-text");
  const heroIdent   = document.getElementById("hero-identity");
  const frameBadge  = document.getElementById("hero-frame-badge");

  const DWELL_FACTOR   = 0.33; // * 100vh per language frame
  const IDENTITY_START = 0.5; // show identity when progress >= this
  const FIT_MIN_PX     = 8;   // never shrink below this
  const FIT_STEP_PX    = 2;   // shrink step per fit iteration

  let identityShown  = false;
  let fitSizeCache    = {};   // idx -> computed font-size (px), reset on resize

  applyTheme(savedTheme);

  // Set driver height
  function setDriverHeight() {
    heroDrv.style.height = (LANGUAGES.length * DWELL_FACTOR * 100) + "vh";
  }
  setDriverHeight();
  window.addEventListener("resize", setDriverHeight);

  // Shrink the greeting's font-size until it fits inside the box on both
  // axes, so every script (Latin, CJK, Indic, Arabic...) occupies roughly
  // the same visual footprint. Cached per-frame so this only runs once
  // per language per box size (recomputed on resize).
  function fitLangText(idx) {
    if (fitSizeCache[idx] !== undefined) return fitSizeCache[idx];

    const boxRect = heroBox.getBoundingClientRect();
    const maxW = boxRect.width * 0.78;
    const maxH = boxRect.height * 0.6;

    const prevTransition = heroTxt.style.transition;
    heroTxt.style.transition = "none";

    let fontSize = maxH;
    heroTxt.style.fontSize = fontSize + "px";

    let iterations = 0;
    while (
      (heroTxt.scrollWidth > maxW || heroTxt.scrollHeight > maxH) &&
      fontSize > FIT_MIN_PX &&
      iterations < 200
    ) {
      fontSize -= FIT_STEP_PX;
      heroTxt.style.fontSize = fontSize + "px";
      iterations++;
    }

    heroTxt.style.transition = prevTransition;
    fitSizeCache[idx] = fontSize;
    return fontSize;
  }

  // Set the visible frame: swap text + font, refit, then a quick fade-in.
  // No clip-path / directional wipe — text stays perfectly centered and
  // never appears to slide left or right between languages, and the
  // fade is fast enough to keep up with rapid scrolling.
  function setHeroFrame(idx) {
    currentLangFrame = idx;
    const lang = LANGUAGES[idx];
    const dir  = lang.rtl ? "rtl" : "ltr";

    // Instantly hide (no transition) before content swap
    heroTxt.style.transition = "none";
    heroTxt.classList.remove("revealed");
    heroTxt.setAttribute("dir", dir);
    heroTxt.setAttribute("lang", lang.name === "English" ? "en" : "");
    heroTxt.classList.remove(...ALL_LANG_FONT_CLASSES);
    heroTxt.classList.add(lang.font);
    heroTxt.textContent = lang.text;
    heroTxt.setAttribute("aria-label", lang.text + " — " + lang.name);

    heroTxt.style.fontSize = fitLangText(idx) + "px";

    // Force reflow, then re-enable transition and fade in
    void heroTxt.offsetWidth;
    heroTxt.style.transition = "";
    requestAnimationFrame(() => {
      heroTxt.classList.add("revealed");
    });

    if (frameBadge) {
      frameBadge.textContent =
        String(idx + 1).padStart(2, "0") + " / " + LANGUAGES.length;
    }
  }

  /* ─────────────────────────────────────────────────
     LOADING SCREEN — preload fonts + pre-cache all
     greeting frame sizes before unlocking scroll.
  ───────────────────────────────────────────────── */
  const loaderEl   = document.getElementById("loader");
  const loaderBar  = document.getElementById("loader-bar-fill");
  const loaderLbl  = document.getElementById("loader-label");

  // Lock scroll while loading
  document.body.classList.add("is-loading");

  function setLoaderProgress(pct, label) {
    if (loaderBar) loaderBar.style.width = pct + "%";
    if (loaderLbl) loaderLbl.textContent = label;
  }

  function dismissLoader() {
    document.body.classList.remove("is-loading");
    if (loaderEl) {
      loaderEl.classList.add("loader-hidden");
      // Remove from DOM after fade so it doesn't block pointer events
      loaderEl.addEventListener("transitionend", () => loaderEl.remove(), { once: true });
    }
  }

  // Pre-cache font sizes for every language frame while fonts are loading.
  // We swap the text invisibly off-screen so there is no visual flash.
  function preCacheAllFrames() {
    const savedText       = heroTxt.textContent;
    const savedClasses    = [...heroTxt.classList];
    const savedDir        = heroTxt.getAttribute("dir");
    const savedLang       = heroTxt.getAttribute("lang");
    const savedVisibility = heroTxt.style.visibility;
    const savedTransition = heroTxt.style.transition;

    heroTxt.style.transition  = "none";
    heroTxt.style.visibility  = "hidden"; // measure but stay invisible

    LANGUAGES.forEach((lang, idx) => {
      if (fitSizeCache[idx] !== undefined) return; // already cached
      heroTxt.classList.remove(...ALL_LANG_FONT_CLASSES);
      heroTxt.classList.add(lang.font);
      heroTxt.textContent = lang.text;
      heroTxt.setAttribute("dir", lang.rtl ? "rtl" : "ltr");
      fitLangText(idx); // populates fitSizeCache[idx]
    });

    // Restore original state
    heroTxt.classList.remove(...ALL_LANG_FONT_CLASSES);
    savedClasses.forEach(c => heroTxt.classList.add(c));
    heroTxt.textContent = savedText;
    heroTxt.setAttribute("dir", savedDir || "ltr");
    heroTxt.setAttribute("lang", savedLang || "");
    heroTxt.style.visibility = savedVisibility;
    heroTxt.style.transition = savedTransition;
  }

  // Main loader flow
  (function initWithLoader() {
    if (prefersReducedMotion) {
      // Skip loader entirely for reduced-motion users
      setHeroFrame(0);
      dismissLoader();
      return;
    }

    setLoaderProgress(10, "Loading fonts…");

    const fontsReady = (document.fonts && document.fonts.ready)
      ? document.fonts.ready
      : Promise.resolve();

    // Fake minimum display time (400 ms) so the loader never flashes too fast
    const minDelay = new Promise(resolve => setTimeout(resolve, 400));

    // Animate the bar from 10 → 70 while fonts load
    let fakeProgress = 10;
    const fakeTimer = setInterval(() => {
      fakeProgress = Math.min(fakeProgress + 4, 70);
      setLoaderProgress(fakeProgress, "Loading fonts…");
    }, 80);

    Promise.all([fontsReady, minDelay]).then(() => {
      clearInterval(fakeTimer);
      setLoaderProgress(80, "Preparing animations…");

      // Pre-cache all frame sizes now that fonts are actually available
      requestAnimationFrame(() => {
        preCacheAllFrames();
        setLoaderProgress(100, "Ready");

        // Set the first frame (sizes already cached — instant)
        setHeroFrame(0);

        // Brief pause so "Ready" is readable, then fade out
        setTimeout(dismissLoader, 220);
      });
    });
  })();

  // Refit on resize (box size changes) — debounced, clears cache
  let resizeFitTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(resizeFitTimer);
    resizeFitTimer = setTimeout(() => {
      fitSizeCache = {};
      const size = fitLangText(currentLangFrame);
      heroTxt.style.transition = "none";
      heroTxt.style.fontSize = size + "px";
      void heroTxt.offsetWidth;
      heroTxt.style.transition = "";
    }, 150);
  });

  // Reduced motion: show identity immediately, skip sequence
  if (prefersReducedMotion) {
    heroIdent.classList.add("visible");
    identityShown = true;
    heroDrv.style.height = "100vh";
  }

  // Hero scroll handler with throttling and RAF for better performance
  let heroScrollTicking = false;
  let cachedDrvTop = null;
  let cachedDrvHeight = null;
  
  function cacheHeroMetrics() {
    cachedDrvTop = heroDrv.getBoundingClientRect().top + window.scrollY;
    cachedDrvHeight = heroDrv.offsetHeight - window.innerHeight;
  }
  cacheHeroMetrics();
  
  window.addEventListener("resize", () => {
    cachedDrvTop = null;
    cachedDrvHeight = null;
    setTimeout(cacheHeroMetrics, 100);
  });

  function onHeroScroll() {
    if (prefersReducedMotion) return;
    
    if (!heroScrollTicking) {
      requestAnimationFrame(() => {
        if (cachedDrvTop === null || cachedDrvHeight === null) {
          cacheHeroMetrics();
        }

        const drvTop    = cachedDrvTop;
        const drvHeight = cachedDrvHeight;
        const rawProg   = (window.scrollY - drvTop) / drvHeight;
        const progress  = Math.max(0, Math.min(1, rawProg));

        // Map progress to frame index
        const rawFrame = progress * LANGUAGES.length;
        const frameIdx = Math.min(Math.floor(rawFrame), LANGUAGES.length - 1);

        if (frameIdx !== currentLangFrame) {
          setHeroFrame(frameIdx);
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
        
        heroScrollTicking = false;
      });
      heroScrollTicking = true;
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
      const R   = 140;  // radius — updated for larger hub

      hub.nodes.forEach((name, i) => {
        const angle = (i / N) * 2 * Math.PI - Math.PI / 2;

        const spoke = document.createElement("div");
        spoke.className   = "spoke-node";
        // positions filled in after mount via layoutSpokes()
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

      // Layout spokes around actual hub centre after DOM is ready
      function layoutSpokes() {
        const wRect = wrap.getBoundingClientRect();
        const bRect = btn.getBoundingClientRect();
        const cx = bRect.left - wRect.left + bRect.width  / 2;
        const cy = bRect.top  - wRect.top  + bRect.height / 2;
        wrap.dataset.cx = cx;
        wrap.dataset.cy = cy;

        const spks = spokesDiv.querySelectorAll(".spoke-node");
        spks.forEach((spoke, i) => {
          const angle = (i / N) * 2 * Math.PI - Math.PI / 2;
          spoke.style.left = (cx + Math.cos(angle) * R) + "px";
          spoke.style.top  = (cy + Math.sin(angle) * R) + "px";
        });
      }

      // Run after paint so getBoundingClientRect is accurate
      requestAnimationFrame(layoutSpokes);
      window.addEventListener("resize", layoutSpokes, { passive: true });

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
