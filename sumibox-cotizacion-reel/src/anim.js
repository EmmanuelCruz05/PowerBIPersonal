// SUMIBOX — "Deja de buscar proveedor por proveedor" — 1080x1920, 33.5 s, no voice.
//
// Real material only (assets/): the official logo, and the three product photos supplied
// for this campaign. Product photos are shown through crops/cards, never redrawn; the
// electrical photo is only used in its product band (y 255–465), away from the third-party
// texts and logo printed above and below it. Categories without a photo get a typographic
// card with a generic line icon. Soundtrack: assets/audio (tools/synth_audio.py), cut to
// the same 120 BPM grid as the scene changes.
(function () {
  const IMG = {
    logo: { w: 1536, h: 1024 },
    elec: { w: 399, h: 501 },
    paper: { w: 575, h: 533 },
    tork: { w: 92, h: 92 },
  };
  const W = 1080;

  function mountSprites() {
    const src = {};
    Object.keys(IMG).forEach((k) => (src[k] = document.getElementById(k === "logo" ? "logo-full" : `src-${k}`).getAttribute("src")));
    document.querySelectorAll("[data-crop]").forEach((el) => {
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

  // Orange diagonal wipe; the scenes swap while it covers the frame.
  function wipe(tl, at, out, inn) {
    tl.set("#wipe", { autoAlpha: 1 }, at);
    tl.fromTo("#wipe", { x: 1150 }, { x: -2300, duration: 0.6, ease: "power2.inOut", immediateRender: false }, at);
    tl.set("#wipe", { autoAlpha: 0 }, at + 0.61); // fully gone between transitions
    tl.set(out, { autoAlpha: 0 }, at + 0.27);
    tl.set(inn, { autoAlpha: 1 }, at + 0.27);
  }

  function build() {
    mountSprites();
    const tl = gsap.timeline({ paused: true });

    // ---------- initial states ----------
    gsap.set("#s2, #s3, #s4, #s5, #s6", { autoAlpha: 0 });
    gsap.set("#wipe", { x: 1150, autoAlpha: 0 });
    gsap.set(".strike", { scaleX: 0 });
    gsap.set(".chip", { autoAlpha: 0, scale: 0.7 });
    gsap.set(".ml", { yPercent: 110, autoAlpha: 0 });
    gsap.set(".row", { autoAlpha: 0, x: 60 });
    gsap.set("#s2-badge", { autoAlpha: 0, scale: 0.6 });
    gsap.set("#s2-check", { autoAlpha: 0, scale: 0 });
    gsap.set("#trail path", { autoAlpha: 0 });
    gsap.set("#s3-hero, #s3-d1, #s3-d2", { autoAlpha: 0 });
    gsap.set(".kcard", { autoAlpha: 0, x: 1100, rotation: 6 });
    gsap.set("#s5-mini", { autoAlpha: 0 });
    gsap.set(".link:not(.link-base)", { scaleX: 0 });
    gsap.set(".slabel", { autoAlpha: 0, y: 16 });
    gsap.set("#s5-done", { autoAlpha: 0, scale: 0 });
    gsap.set("#logo-full", { autoAlpha: 0, scale: 0.92 });
    gsap.set("#srl, #s6-sub, #cta, #wa", { autoAlpha: 0, y: 26 });
    gsap.set("#cta-shine", { x: -300 });

    // ---------- Scene 1 (0–4 s): the problem — readable on the very first frame ----------
    tl.fromTo("#s1-title", { scale: 1.04 }, { scale: 1, duration: 0.8, ease: "power3.out" }, 0);
    tl.to("#s1-title .hl", { backgroundSize: "100% 0.24em", duration: 0.45, ease: "power2.out", stagger: 0.2 }, 0.3);
    tl.fromTo("#s1-comp", { scale: 1, y: 0 }, { scale: 1.05, y: -24, duration: 4, ease: "sine.inOut" }, 0);
    tl.fromTo("#s1-elec", { y: 0, rotation: 4 }, { y: -18, rotation: 2, duration: 4, ease: "sine.inOut" }, 0);
    tl.fromTo("#s1-paper", { y: 0, rotation: -3 }, { y: 14, rotation: -5, duration: 4, ease: "sine.inOut" }, 0);
    tl.fromTo("#s1-tork", { y: 0, rotation: 6 }, { y: -12, rotation: 3, duration: 4, ease: "sine.inOut" }, 0);
    tl.to(".chip", { autoAlpha: 1, scale: 1, duration: 0.35, ease: "back.out(2)", stagger: 0.3 }, 1.2);
    tl.to(".strike", { scaleX: 1, duration: 0.18, ease: "power2.out", stagger: 0.15 }, 3.2);
    tl.to(".chip", { autoAlpha: 0.55, duration: 0.2, stagger: 0.15 }, 3.25);

    // ---------- Scene 2 (4–9 s): send your list to Sumibox ----------
    wipe(tl, 3.86, "#s1", "#s2");
    tl.to("#s2 .ml", { yPercent: 0, autoAlpha: 1, duration: 0.4, ease: "power3.out", stagger: 0.1 }, 4.15);
    tl.from("#s2-list", { y: 80, autoAlpha: 0, duration: 0.45, ease: "power3.out" }, 4.3);
    tl.to(".row", { autoAlpha: 1, x: 0, duration: 0.3, ease: "power3.out", stagger: 0.25 }, 4.6);
    tl.to("#s2-list", { scale: 0.5, y: -30, duration: 0.4, ease: "power2.inOut" }, 6.7);
    tl.to("#s2-badge", { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)" }, 6.9);
    tl.to("#trail path", { autoAlpha: 1, duration: 0.2 }, 7.1);
    tl.fromTo("#trail path", { strokeDashoffset: 0 }, { strokeDashoffset: -120, duration: 0.8, ease: "none" }, 7.1);
    tl.to("#s2-list", { x: 0, y: 470, scale: 0.08, rotation: 10, autoAlpha: 0, duration: 0.65, ease: "power2.in" }, 7.15);
    tl.to("#trail path", { autoAlpha: 0, duration: 0.25 }, 7.8);
    tl.to("#s2-badge", { scale: 1.06, duration: 0.15, ease: "power2.out", yoyo: true, repeat: 1 }, 7.82);
    tl.to("#s2-check", { autoAlpha: 1, scale: 1, duration: 0.35, ease: "back.out(2.5)" }, 7.9);

    // ---------- Scene 3 (9–14 s): electrical materials ----------
    wipe(tl, 8.86, "#s2", "#s3");
    tl.to("#s3 .ml", { yPercent: 0, autoAlpha: 1, duration: 0.4, ease: "power3.out", stagger: 0.1 }, 9.15);
    tl.fromTo("#s3-hero", { autoAlpha: 0, y: 90 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out" }, 9.3);
    tl.fromTo("#s3-hero .sp", { scale: 1 }, { scale: 1.08, duration: 1.8, ease: "none" }, 9.3);
    tl.to("#s3-hero", { x: -W, duration: 0.5, ease: "power3.inOut" }, 10.9);
    tl.fromTo("#s3-d1", { autoAlpha: 1, x: W }, { x: 0, duration: 0.5, ease: "power3.inOut" }, 10.9);
    tl.fromTo("#s3-d2", { autoAlpha: 1, x: W }, { x: 0, duration: 0.5, ease: "power3.inOut" }, 11.05);
    tl.fromTo("#s3-d1 .sp", { scale: 1.08 }, { scale: 1, duration: 2.5, ease: "none" }, 10.9);
    tl.fromTo("#s3-d2 .sp", { scale: 1 }, { scale: 1.08, duration: 2.5, ease: "none" }, 11.05);
    tl.to("#s3-d1", { y: -20, duration: 2.3, ease: "sine.inOut" }, 11.5);
    tl.to("#s3-d2", { y: 20, duration: 2.3, ease: "sine.inOut" }, 11.5);

    // ---------- Scene 4 (14–22 s): one category card at a time ----------
    wipe(tl, 13.86, "#s3", "#s4");
    tl.to("#s4 .ml", { yPercent: 0, autoAlpha: 1, duration: 0.4, ease: "power3.out", stagger: 0.1 }, 14.15);
    const cards = ["#k1", "#k2", "#k3", "#k4", "#k5"];
    const at = [14.4, 16.0, 17.6, 19.2, 20.8];
    cards.forEach((c, i) => {
      if (i > 0) tl.to(cards[i - 1], { x: -1100, rotation: -6, duration: 0.55, ease: "power3.inOut" }, at[i]);
      tl.to(c, { autoAlpha: 1, x: 0, rotation: 0, duration: 0.55, ease: "power3.inOut" }, at[i]);
      tl.to("#dot-on", { x: i * 36, duration: 0.4, ease: "power3.inOut" }, at[i] + 0.1);
      tl.fromTo(`${c} .kin`, { scale: 1 }, { scale: 1.06, duration: 1.6, ease: "none" }, at[i] + 0.3);
    });

    // ---------- Scene 5 (22–28 s): list → review → quote ----------
    wipe(tl, 21.86, "#s4", "#s5");
    tl.to("#s5 .ml", { yPercent: 0, autoAlpha: 1, duration: 0.4, ease: "power3.out", stagger: 0.1 }, 22.15);
    tl.fromTo("#s5-mini", { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power3.out" }, 22.35);
    tl.to("#s5-mini", { x: 200 - 540, y: -420, scale: 0.25, autoAlpha: 0, duration: 0.5, ease: "power2.in" }, 23.35);
    tl.from(".step", { scale: 0.6, autoAlpha: 0, duration: 0.4, ease: "back.out(1.8)", stagger: 0.12 }, 22.6);
    const glow = { boxShadow: "0 0 0 10px rgba(230,93,38,0.9), 0 0 40px rgba(230,93,38,0.6)", duration: 0.3 };
    tl.to("#st1", glow, 23.7);
    tl.to("#sl1", { autoAlpha: 1, y: 0, duration: 0.3 }, 23.7);
    tl.to("#lk1", { scaleX: 1, duration: 0.5, ease: "power2.inOut" }, 24.1);
    tl.to("#st2", glow, 24.7);
    tl.to("#sl2", { autoAlpha: 1, y: 0, duration: 0.3 }, 24.7);
    tl.to("#lk2", { scaleX: 1, duration: 0.5, ease: "power2.inOut" }, 25.1);
    tl.to("#st3", glow, 25.8);
    tl.to("#sl3", { autoAlpha: 1, y: 0, duration: 0.3 }, 25.8);
    tl.to("#s5-done", { autoAlpha: 1, scale: 1, duration: 0.35, ease: "back.out(2.5)" }, 26.1);

    // ---------- Scene 6 (28–33.5 s): brand close + call to action (on screen ≥ 3.9 s) ----------
    wipe(tl, 27.86, "#s5", "#s6");
    tl.to("#logo-full", { autoAlpha: 1, scale: 1, duration: 0.7, ease: "power3.out" }, 28.3);
    tl.to("#logo-full", { scale: 1.03, duration: 4.4, ease: "none" }, 29.0);
    tl.to("#srl", { autoAlpha: 1, y: 0, duration: 0.4, ease: "power3.out" }, 28.8);
    tl.to("#s6-sub", { autoAlpha: 1, y: 0, duration: 0.4, ease: "power3.out" }, 29.0);
    tl.to("#cta", { autoAlpha: 1, y: 0, duration: 0.45, ease: "back.out(1.7)" }, 29.3);
    tl.to("#wa", { autoAlpha: 1, y: 0, duration: 0.4, ease: "power3.out" }, 29.6);
    tl.to("#cta-shine", { x: 1100, duration: 0.9, ease: "power2.inOut" }, 30.3);
    tl.to("#cta", { scale: 1.04, duration: 0.45, ease: "sine.inOut", yoyo: true, repeat: 3 }, 31.2);
    tl.to("#s6", { autoAlpha: 1, duration: 0.01 }, 33.49); // hold to the end

    return tl;
  }

  window.SUMIBOX_COTIZA = { build };
})();
