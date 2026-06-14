/* ============================================================
   CAVEBEAT GROUP — interactions
   ============================================================ */
(function () {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- nav scroll state ---------- */
  const nav = document.getElementById("nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- mobile menu ---------- */
  const mm = document.getElementById("mobileMenu");
  const open = () => mm.classList.add("open");
  const close = () => mm.classList.remove("open");
  document.getElementById("menuBtn").addEventListener("click", open);
  document.getElementById("menuClose").addEventListener("click", close);
  mm.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));

  /* ---------- scroll reveal (viewport-based; robust across iframes) ---------- */
  const revealEls = Array.from(document.querySelectorAll(".reveal"));
  const model = document.getElementById("model-diagram");
  const revealTargets = model ? revealEls.concat([model]) : revealEls;

  function revealInView() {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    for (let i = revealTargets.length - 1; i >= 0; i--) {
      const el = revealTargets[i];
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.9 && r.bottom > 0) {
        el.classList.add("in");
        revealTargets.splice(i, 1);
      }
    }
    if (!revealTargets.length) window.removeEventListener("scroll", revealInView);
  }
  // Reveal in-view elements SYNCHRONOUSLY before first paint: adding `.in`
  // before the base (hidden) state is ever painted means no transition is
  // triggered, so they render at the visible end-state even if the animation
  // timeline is frozen. Off-screen elements animate normally on scroll.
  revealInView();
  window.addEventListener("scroll", revealInView, { passive: true });
  window.addEventListener("resize", revealInView, { passive: true });
  setTimeout(revealInView, 600);
  setTimeout(revealInView, 1600);
  // re-enable entrance transitions for subsequent on-scroll reveals
  setTimeout(function () { document.documentElement.classList.remove("cb-preload"); }, 80);

  /* ---------- constellation canvas ---------- */
  const canvas = document.getElementById("constellation");
  if (canvas && !reduce) {
    const ctx = canvas.getContext("2d");
    let w, h, dpr, nodes, raf;
    const mouse = { x: -9999, y: -9999 };

    function accentRGB() {
      const c = getComputedStyle(document.documentElement).getPropertyValue("--brand").trim() || "#5b5bf5";
      const el = document.createElement("div");
      el.style.color = c;
      document.body.appendChild(el);
      const m = getComputedStyle(el).color.match(/\d+/g);
      document.body.removeChild(el);
      return m ? `${m[0]},${m[1]},${m[2]}` : "161,161,170";
    }
    let rgb = accentRGB();

    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = Math.round((w * h) / 19000);
      const count = Math.max(26, Math.min(78, target));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.5 + 0.6,
      }));
    }

    function step() {
      ctx.clearRect(0, 0, w, h);
      const LINK = 132;
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx; n.y += n.vy;
        if (n.x < -20) n.x = w + 20; if (n.x > w + 20) n.x = -20;
        if (n.y < -20) n.y = h + 20; if (n.y > h + 20) n.y = -20;

        // mouse parallax pull
        const mdx = mouse.x - n.x, mdy = mouse.y - n.y;
        const md = Math.hypot(mdx, mdy);
        if (md < 150) { n.x += (mdx / md) * 0.3; n.y += (mdy / md) * 0.3; }

        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j];
          const dx = n.x - m.x, dy = n.y - m.y;
          const d = Math.hypot(dx, dy);
          if (d < LINK) {
            const a = (1 - d / LINK) * 0.22;
            ctx.strokeStyle = `rgba(${rgb},${a})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y); ctx.stroke();
          }
        }
        ctx.fillStyle = `rgba(${rgb},0.5)`;
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
      }
      raf = requestAnimationFrame(step);
    }

    window.addEventListener("resize", size, { passive: true });
    window.addEventListener("mousemove", (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    });
    window.addEventListener("mouseleave", () => { mouse.x = -9999; mouse.y = -9999; });
    // expose accent refresh for tweaks
    window.__cbRefreshAccent = () => { rgb = accentRGB(); };
    size(); step();
  }

  /* ============================================================
     CONTACT FORM MODAL
     ============================================================ */
  const modal = document.getElementById("contactModal");
  if (modal) {
    const openBtn = document.getElementById("openContact");
    const formView = document.getElementById("cmForm");
    const thanksView = document.getElementById("cmThanks");
    const form = document.getElementById("contactForm");
    let lastFocus = null;

    const openModal = () => {
      lastFocus = document.activeElement;
      // always reset to the form view on open
      formView.hidden = false;
      thanksView.hidden = true;
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      const first = form.querySelector("input,select,textarea");
      if (first) setTimeout(() => first.focus(), 60);
    };
    const closeModal = () => {
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };

    if (openBtn) openBtn.addEventListener("click", openModal);
    document.getElementById("closeContact").addEventListener("click", closeModal);
    document.getElementById("thanksClose").addEventListener("click", closeModal);
    modal.querySelectorAll("[data-close]").forEach((el) => el.addEventListener("click", closeModal));
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;

      const submitBtn = form.querySelector('button[type="submit"]');
      const endpoint = form.dataset.endpoint || form.getAttribute("action");

      // If you've wired a backend (data-endpoint or action), POST the fields.
      // Otherwise we just show the confirmation — your backend can be added later.
      if (endpoint) {
        const original = submitBtn ? submitBtn.innerHTML : "";
        if (submitBtn) { submitBtn.disabled = true; submitBtn.innerHTML = "Sending…"; }
        try {
          const res = await fetch(endpoint, {
            method: (form.getAttribute("method") || "POST").toUpperCase(),
            headers: { "Accept": "application/json" },
            body: new FormData(form),
          });
          if (!res.ok) throw new Error("Request failed: " + res.status);
        } catch (err) {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = original; }
          alert("Sorry — something went wrong sending your message. Please try again or email hello@cavebeat.com.");
          return;
        }
        if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = original; }
      }

      // swap to the thank-you state
      formView.hidden = true;
      thanksView.hidden = false;
      form.reset();
      modal.querySelector(".modal-card").scrollTop = 0;
      const btn = document.getElementById("thanksClose");
      if (btn) setTimeout(() => btn.focus(), 60);
    });
  }
})();
