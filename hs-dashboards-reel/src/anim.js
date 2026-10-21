// HS Hernández Solutions — Dashboards Reel (1080x1920, 23 s, no voice).
//
// Real material only:
//  - assets/dashboard-operativo-30fps.mp4: CFR copy of the original screen recording
//    (assets/originals/…mov), 3358x1666. Shown 7–17.2 s, media 0.3–10.5 s — before the macOS
//    capture bar appears at the bottom of the recording, and always framed above y=1500.
//  - assets/dashboard-pei-dgii-p1.png / dashboard-poa-2020-p2.png: real Power BI pages, cut into
//    the scattered "data chaos" cards of scene 2.
//  - assets/hs-logo-original.png: the original logo, only masked to a circle (its own white rim).
// Sound (assets/hs-reel-audio.wav, tools/synth_audio.py) is cut to the same timeline.
(function () {
  const IMG = {
    p1: { w: 1543, h: 869 },
    p2: { w: 1537, h: 865 },
    logo: { w: 1050, h: 600 },
  };
  const VID = { w: 3358, h: 1666 };

  // Scene 2 cards: [id, image, crop x,y,w,h, display width, scattered centre x,y, rotation, depth]
  const CARDS = [
    ["c-kpi", "p1", [15, 188, 298, 102], 330, 250, 700, -8, 0.6],
    ["c-gauge", "p1", [978, 190, 265, 248], 300, 820, 650, 7, 1.0],
    ["c-month", "p1", [1258, 190, 282, 248], 330, 300, 1000, 5, 0.8],
    ["c-years", "p1", [978, 462, 560, 400], 520, 760, 1060, -5, 1.2],
    ["c-table", "p1", [18, 305, 645, 300], 560, 420, 1320, -3, 0.7],
    ["c-area", "p2", [25, 568, 1062, 297], 600, 640, 840, 4, 0.5],
    ["c-bars", "p2", [1105, 480, 425, 385], 330, 860, 1380, 9, 1.1],
    ["c-kpi2", "p2", [25, 160, 335, 130], 320, 230, 1480, -10, 0.9],
  ];
  // the same cards, organised in a 2-column grid (scene 2 → 3)
  const GRID = [
    [290, 700], [790, 700], [290, 925], [790, 925],
    [290, 1150], [790, 1150], [290, 1375], [790, 1375],
  ];
  const FRAME_C = { x: 540, y: 922 }; // centre of #dwin in scene 3

  // Deterministic pseudo-random (no Math.random in compositions)
  let seed = 11;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

  function mountSprites(root = document) {
    const src = {
      p1: document.getElementById("src-p1").getAttribute("src"),
      p2: document.getElementById("src-p2").getAttribute("src"),
      logo: document.getElementById("src-logo").getAttribute("src"),
    };
    root.querySelectorAll("[data-crop]").forEach((el) => {
      const key = el.dataset.img;
      const [x, y, w, h] = el.dataset.crop.split(",").map(Number);
      const s = Number(el.dataset.scale || 1);
      el.style.width = w * s + "px";
      el.style.height = h * s + "px";
      el.style.overflow = "hidden";
      el.setAttribute("data-layout-allow-overflow", "");
      const img = document.createElement("img");
      img.src = src[key];
      img.alt = "";
      img.setAttribute("data-layout-allow-overflow", "");
      img.style.cssText =
        "position:absolute;display:block;max-width:none;" +
        `width:${IMG[key].w * s}px;height:${IMG[key].h * s}px;left:${-x * s}px;top:${-y * s}px;`;
      el.appendChild(img);
    });
  }

  function buildCards() {
    const host = document.getElementById("cards");
    const links = document.getElementById("links");
    CARDS.forEach(([id, img, crop, dw, cx, cy, rot], i) => {
      const s = dw / crop[2];
      const dh = crop[3] * s;
      const card = document.createElement("div");
      card.id = id;
      card.className = "card";
      card.dataset.img = img;
      card.dataset.crop = crop.join(",");
      card.dataset.scale = String(s);
      card.style.left = cx - dw / 2 + "px";
      card.style.top = cy - dh / 2 + "px";
      host.appendChild(card);
      const [gx, gy] = GRID[i];
      const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
      const mx = (gx + FRAME_C.x) / 2 + (i % 2 ? 90 : -90);
      p.setAttribute("d", `M${gx},${gy} Q${mx},${(gy + FRAME_C.y) / 2} ${FRAME_C.x},${FRAME_C.y}`);
      p.setAttribute("pathLength", "1000");
      links.appendChild(p);
    });
  }

  function buildAmbience() {
    const dots = document.getElementById("dots");
    for (let i = 0; i < 26; i++) {
      const d = document.createElement("div");
      d.className = "dot";
      d.style.left = Math.round(40 + rnd() * 1000) + "px";
      d.style.top = Math.round(120 + rnd() * 1680) + "px";
      d.style.opacity = (0.15 + rnd() * 0.4).toFixed(2);
      dots.appendChild(d);
    }
    const streaks = document.getElementById("streaks");
    for (let i = 0; i < 7; i++) {
      const s = document.createElement("div");
      s.className = "streak";
      s.style.top = Math.round(260 + rnd() * 1400) + "px";
      s.style.width = Math.round(220 + rnd() * 380) + "px";
      s.style.left = "-700px";
      streaks.appendChild(s);
    }
  }

  // Camera for the recording inside the frame window (W x H); never shows outside the video
  // and never below y=1500 (the bottom toolbar / capture-bar zone).
  function vcam(s, cx, cy, W, H) {
    let x = W / 2 - s * cx;
    let y = H / 2 - s * cy;
    x = Math.min(0, Math.max(W - s * VID.w, x));
    y = Math.min(0, Math.max(H - s * 1500, y));
    return { scale: s, x, y };
  }

  function build() {
    buildCards();
    buildAmbience();
    mountSprites();
    const tl = gsap.timeline({ paused: true });
    const W = 1000;
    const H3 = 525;
    const H4 = 820;

    // ---------- initial states ----------
    gsap.set(".hk", { yPercent: 110, autoAlpha: 0 });
    gsap.set("#hk-clar", { autoAlpha: 0 });
    gsap.set("#flash", { x: -900, autoAlpha: 0 }); // parked off-screen between sweeps
    gsap.set(".streak", { x: 0 });
    gsap.set(".s2l, .s3l, .e-title", { yPercent: 110, autoAlpha: 0 });
    gsap.set(".card", { autoAlpha: 0 });
    gsap.set("#links path", { strokeDashoffset: 1000, autoAlpha: 1 });
    gsap.set("#dwin", { autoAlpha: 0, scale: 0.7 });
    gsap.set("#vworld", vcam(0.35, 1929, 750, W, H3));
    gsap.set(".hole", { attr: { height: 0 } });
    document.querySelectorAll(".hole").forEach((r) => {
      gsap.set(r, { attr: { y: Number(r.dataset.y) + Number(r.dataset.h) } });
    });
    gsap.set(".hbox", { autoAlpha: 0 });
    gsap.set("#dsweep", { x: -300 });
    gsap.set(".w", { autoAlpha: 0 });
    gsap.set("#w-line", { scaleX: 0 });
    gsap.set("#dark", { autoAlpha: 0 });
    gsap.set("#badge", { clipPath: "circle(0% at 50% 50%)", scale: 0.85 });
    gsap.set("#halo", { autoAlpha: 0, scale: 0.6 });
    gsap.set("#brand, #slogan, .e-q, #cta", { autoAlpha: 0, y: 24 });
    gsap.set("#e-rule", { scaleX: 0 });
    gsap.set("#cta-shine", { x: -300 });

    // ambience: slow grid drift + dots float for the whole piece
    tl.fromTo("#grid", { x: 0, y: 0 }, { x: -60, y: -120, duration: 23, ease: "none" }, 0);
    tl.fromTo("#dots", { y: 0 }, { y: -140, duration: 23, ease: "none" }, 0);

    // ---------- Scene 1 (0–3 s): hook ----------
    tl.to("#hk1", { yPercent: 0, autoAlpha: 1, duration: 0.38, ease: "power4.out" }, 0.08);
    tl.to("#hk2", { yPercent: 0, autoAlpha: 1, duration: 0.42, ease: "power4.out" }, 0.24);
    tl.to("#hk3", { yPercent: 0, autoAlpha: 1, duration: 0.3, ease: "power3.out" }, 0.72);
    tl.fromTo(
      "#hk-clar",
      { autoAlpha: 0, scale: 2.6, filter: "blur(16px)" },
      { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 0.45, ease: "power4.out" },
      0.9,
    );
    tl.fromTo("#hook", { x: 0 }, { x: 7, duration: 0.05, yoyo: true, repeat: 3, ease: "none" }, 1.35);
    tl.set("#flash", { autoAlpha: 1 }, 1.0);
    tl.to("#flash", { x: 1800, duration: 0.55, ease: "power2.inOut" }, 1.0);
    tl.set("#flash", { autoAlpha: 0, x: -900 }, 1.56);
    tl.to(".streak", { x: 1900, duration: 0.9, ease: "power2.in", stagger: 0.07 }, 0.15);
    tl.to("#hook", { scale: 0.9, autoAlpha: 0, filter: "blur(10px)", duration: 0.3, ease: "power2.in" }, 2.7);

    // ---------- Scene 2 (3–7 s): data everywhere ----------
    CARDS.forEach(([id, , , , , , rot, depth], i) => {
      const fromX = i % 2 ? 760 : -760;
      tl.fromTo(
        `#${id}`,
        { autoAlpha: 0, x: fromX, y: 120 - i * 20, rotation: rot + (i % 2 ? 22 : -22), filter: "blur(12px)" },
        { autoAlpha: 1, x: 0, y: 0, rotation: rot, filter: "blur(0px)", duration: 0.6, ease: "power3.out" },
        3.0 + i * 0.07,
      );
      // virtual camera drift: nearer cards (higher depth) move more → parallax
      tl.to(`#${id}`, { x: -70 * depth, y: -26 * depth, duration: 2.6, ease: "sine.inOut" }, 3.6 + i * 0.07);
    });
    tl.to("#s2l1", { yPercent: 0, autoAlpha: 1, duration: 0.4, ease: "power3.out" }, 3.3);
    tl.to("#s2l2", { yPercent: 0, autoAlpha: 1, duration: 0.4, ease: "power3.out" }, 4.1);
    tl.to("#s2l3", { yPercent: 0, autoAlpha: 1, duration: 0.4, ease: "power3.out" }, 4.9);
    // disorder → order: cards straighten into a grid
    CARDS.forEach(([id, , crop, dw, cx, cy], i) => {
      const dh = (crop[3] * dw) / crop[2];
      const fit = Math.min(460 / dw, 200 / dh);
      const [gx, gy] = GRID[i];
      tl.to(`#${id}`, { x: gx - cx, y: gy - cy, rotation: 0, scale: fit, duration: 0.65, ease: "power3.inOut" }, 6.2 + i * 0.03);
    });
    tl.to(".s2l", { yPercent: -110, duration: 0.35, ease: "power3.in", stagger: 0.05 }, 6.5);
    tl.set(".s2l", { autoAlpha: 0 }, 6.95);

    // ---------- Scene 3 (7–12 s): everything converges into the real dashboard ----------
    tl.to("#links path", { strokeDashoffset: 0, duration: 0.4, ease: "power2.out", stagger: 0.02 }, 6.85);
    CARDS.forEach(([id, , , , cx, cy], i) => {
      tl.to(
        `#${id}`,
        { x: FRAME_C.x - cx, y: FRAME_C.y - cy, scale: 0.18, autoAlpha: 0, filter: "blur(6px)", duration: 0.55, ease: "power3.in" },
        7.05 + i * 0.03,
      );
    });
    tl.to("#links path", { autoAlpha: 0, duration: 0.4 }, 7.9);
    tl.to("#dwin", { autoAlpha: 1, scale: 1, duration: 0.65, ease: "power3.out" }, 7.3);
    // panels light up and "grow" bottom-up out of the dimmed recording
    document.querySelectorAll(".hole").forEach((r, i) => {
      tl.to(r, { attr: { y: Number(r.dataset.y), height: Number(r.dataset.h) }, duration: 0.45, ease: "power3.out" }, 7.6 + i * 0.13);
    });
    tl.to("#vveil", { autoAlpha: 0, duration: 0.6, ease: "sine.inOut" }, 9.6);
    tl.to("#vworld", { ...vcam(0.385, 1929, 750, W, H3), duration: 4.4, ease: "sine.inOut" }, 7.6);
    tl.to("#dsweep", { x: 1300, duration: 0.8, ease: "power2.inOut" }, 9.5);
    tl.set("#flash", { autoAlpha: 1 }, 9.5);
    tl.to("#flash", { x: 1800, duration: 0.7, ease: "power2.inOut" }, 9.5);
    tl.set("#flash", { autoAlpha: 0, x: -900 }, 10.21);
    tl.to("#s3l1", { yPercent: 0, autoAlpha: 1, duration: 0.45, ease: "power3.out" }, 8.6);
    tl.to("#s3l2", { yPercent: 0, autoAlpha: 1, duration: 0.45, ease: "power3.out" }, 8.8);
    tl.to(".s3l", { yPercent: -110, duration: 0.35, ease: "power3.in", stagger: 0.05 }, 11.6);
    tl.set(".s3l", { autoAlpha: 0 }, 12.05);

    // ---------- Scene 4 (12–17 s): the dashboard as the hero — VISUALIZA / ANALIZA / DECIDE ----------
    tl.to("#dwin", { top: 600, height: H4, duration: 0.6, ease: "power3.inOut" }, 12.0);
    const stops = [
      // [word, camera, highlight, at]
      ["#w1", vcam(0.66, 1240, 600, W, H4), "#h-kpi", 12.0],
      ["#w2", vcam(0.85, 1650, 1000, W, H4), "#h-zona", 13.6],
      ["#w3", vcam(0.95, 2850, 950, W, H4), "#h-zonas", 15.2],
    ];
    stops.forEach(([w, cam, hb, at], i) => {
      tl.to("#vworld", { ...cam, duration: 0.6, ease: "power3.inOut" }, at);
      tl.fromTo(hb, { autoAlpha: 0, scale: 1.06 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: "power2.out" }, at + 0.45);
      tl.to(hb, { autoAlpha: 0, duration: 0.2 }, at + 1.45);
      tl.to(w, { autoAlpha: 0, duration: 0.2 }, at + 1.4);
      if (i === 0) {
        // VISUALIZA: mask wipe
        tl.fromTo(w, { autoAlpha: 1, clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.45, ease: "power3.out" }, at + 0.15);
      } else if (i === 1) {
        // ANALIZA: focus pull
        tl.fromTo(w, { autoAlpha: 0, scale: 1.5, filter: "blur(14px)" }, { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 0.45, ease: "power3.out" }, at + 0.15);
      } else {
        // DECIDE: letters rise + cyan underline
        tl.set(w, { autoAlpha: 1 }, at + 0.15);
        tl.from(`${w} span`, { yPercent: 80, autoAlpha: 0, duration: 0.35, ease: "back.out(2)", stagger: 0.05 }, at + 0.15);
        tl.to("#w-line", { scaleX: 1, duration: 0.4, ease: "power3.out" }, at + 0.5);
        tl.to("#w-line", { autoAlpha: 0, duration: 0.2 }, at + 1.75);
      }
    });
    tl.to("#w3", { autoAlpha: 0, duration: 0.25 }, 16.95);
    tl.to("#vworld", { ...vcam(0.9, 2850, 950, W, H4), duration: 0.6, ease: "none" }, 15.8);

    // ---------- Scene 5 (17–23 s): brand close + call to action ----------
    tl.to("#dark", { autoAlpha: 1, duration: 0.7, ease: "power2.inOut" }, 16.9); // opaque before the clip ends (17.7 s)
    tl.to("#dwin", { scale: 0.9, duration: 0.7, ease: "power2.inOut" }, 16.9);
    tl.to("#halo", { autoAlpha: 1, scale: 1.1, duration: 0.6, ease: "power2.out" }, 17.3);
    tl.to("#halo", { scale: 1, autoAlpha: 0.75, duration: 0.8, ease: "sine.inOut" }, 17.9);
    tl.to("#badge", { clipPath: "circle(50% at 50% 50%)", scale: 1, duration: 0.75, ease: "power3.out" }, 17.3);
    tl.to("#brand", { autoAlpha: 1, y: 0, duration: 0.45, ease: "power3.out" }, 17.85);
    tl.to(".e-title", { yPercent: 0, autoAlpha: 1, duration: 0.45, ease: "power3.out", stagger: 0.12 }, 18.35);
    tl.to("#slogan", { autoAlpha: 1, y: 0, duration: 0.45, ease: "power3.out" }, 19.1);
    tl.to("#e-rule", { scaleX: 1, duration: 0.45, ease: "power3.out" }, 19.4);
    tl.to(".e-q", { autoAlpha: 1, y: 0, duration: 0.45, ease: "power3.out", stagger: 0.1 }, 19.8);
    tl.to("#cta", { autoAlpha: 1, y: 0, duration: 0.5, ease: "back.out(1.6)" }, 20.5);
    tl.to("#cta-shine", { x: 1000, duration: 0.9, ease: "power2.inOut" }, 21.2);
    tl.to("#cta", { scale: 1.03, duration: 0.5, ease: "sine.inOut", yoyo: true, repeat: 1 }, 21.9);
    tl.to("#dark", { autoAlpha: 1, duration: 0.01 }, 22.99); // hold to the end

    return tl;
  }

  window.HS_REEL = { build };
})();
