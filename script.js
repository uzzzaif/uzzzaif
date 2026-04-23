/* ============================================================
   UZAIF PORTFOLIO - script.js
   Features: theme toggle, canvas BG, scroll reveal,
             scroll progress, mobile nav, email CTA
   ============================================================ */

(function () {
  "use strict";

  /* ── THEME TOGGLE ── */
  const html = document.documentElement;
  const themeBtn = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");

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
  }

  /* ── MOBILE NAV ── */
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    navLinks.classList.toggle("open");
    document.body.style.overflow = navLinks.classList.contains("open")
      ? "hidden"
      : "";
  });

  // Close nav when a link is clicked
  navLinks.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("open");
      navLinks.classList.remove("open");
      document.body.style.overflow = "";
    });
  });

  /* ── SCROLL PROGRESS BAR ── */
  const scrollBar = document.getElementById("scroll-bar");

  function updateScrollBar() {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
    scrollBar.style.width = pct + "%";
  }
  window.addEventListener("scroll", updateScrollBar, { passive: true });

  /* ── NAVBAR SHADOW ON SCROLL ── */
  const navbar = document.getElementById("navbar");
  window.addEventListener(
    "scroll",
    () => {
      navbar.style.boxShadow =
        window.scrollY > 10 ? "0 2px 20px rgba(0,0,0,0.10)" : "none";
    },
    { passive: true },
  );

  /* ── SCROLL REVEAL ── */
  const revealEls = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          // Stagger children if needed
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );

  revealEls.forEach((el) => observer.observe(el));

  /* ── CONTACT: Subject Email CTA ── */
  const subjectBtns = document.querySelectorAll(".subject-btn");
  const emailCta = document.getElementById("email-cta");
  const EMAIL = "mirzauzaif07@gmail.com";
  let activeSubject = "Job Opportunity";

  function updateEmailLink() {
    const encoded = encodeURIComponent(activeSubject);
    emailCta.href = `mailto:${EMAIL}?subject=${encoded}`;
  }
  updateEmailLink();

  subjectBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      subjectBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeSubject = btn.dataset.subject;
      updateEmailLink();
    });
  });

  /* ── CANVAS BACKGROUND (particle network) ── */
  const canvas = document.getElementById("bg-canvas");
  const ctx = canvas.getContext("2d");

  let W,
    H,
    particles,
    mouse = { x: -9999, y: -9999 };

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    if (!particles) initParticles();
  }

  window.addEventListener("resize", resize);
  resize();

  window.addEventListener(
    "mousemove",
    (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    },
    { passive: true },
  );

  function getAccentColor() {
    return html.dataset.theme === "dark" ? "192,57,43" : "37,99,235";
  }

  function initParticles() {
    const count = Math.min(Math.floor((W * H) / 14000), 90);
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 2 + 1.5,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    const accent = getAccentColor();
    const CONNECT = 130;
    const MOUSE_R = 160;

    // Update & draw particles
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      // Mouse repulsion
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOUSE_R) {
        const force = ((MOUSE_R - dist) / MOUSE_R) * 0.6;
        p.vx += (dx / dist) * force * 0.08;
        p.vy += (dy / dist) * force * 0.08;
        // Clamp speed
        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (spd > 1.5) {
          p.vx /= spd / 1.5;
          p.vy /= spd / 1.5;
        }
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${accent},0.55)`;
      ctx.fill();
    });

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT) {
          const alpha = (1 - dist / CONNECT) * 0.28;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${accent},${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  initParticles();
  draw();

  /* ── ACTIVE NAV LINK ON SCROLL ── */
  const sections = document.querySelectorAll("section[id]");
  const navLinkEls = document.querySelectorAll(".nav-link");

  function setActiveNav() {
    let current = "";
    sections.forEach((sec) => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) current = sec.id;
    });
    navLinkEls.forEach((link) => {
      link.style.color =
        link.getAttribute("href") === "#" + current ? "var(--accent)" : "";
    });
  }
  window.addEventListener("scroll", setActiveNav, { passive: true });
})();
