// SUMIBOX Reel "¡COTIZA HOY!" (1080x1920, 19 s) — timeline for compositions/reel.html.
//
// All ad pieces are crops of the untouched original (assets/sumibox-reel-original.png),
// mounted by SUMIBOX.mountSprites from src/sumibox.js.
//
// Voice cues (assets/sumibox-reel-voz.wav, phrase by phrase):
//   0.10 ¿Buscas todo lo que tu negocio necesita…   3.20 En SUMIBOX tenemos suministros eléctricos,
//   5.40 productos de limpieza,   6.62 desechables, gastables   7.88 y artículos de oficina.
//   9.40 Simplifica tus compras y cotiza hoy.   11.65 Escríbenos por WhatsApp al 809…  (number ~12.8)
//  15.85 SUMIBOX. Tu aliado en suministros empresariales.  (ends ~18.3)
// Cuts sit on a 120 BPM grid (0.5 s) so a music track can be dropped in later.
(function () {
  const W = 1080;

  // Horizontal slide between two full-frame layers, led by the orange separator bar.
  function slide(tl, out, inn, at) {
    if (out) {
      tl.to(out, { x: -W, duration: 0.5, ease: "power3.inOut" }, at);
      tl.set(out, { autoAlpha: 0 }, at + 0.5); // fully gone once off-screen (scaled layers can overhang)
    }
    tl.fromTo(inn, { x: W, autoAlpha: 1 }, { x: 0, duration: 0.5, ease: "power3.inOut" }, at);
    tl.fromTo("#sep", { x: W + 80 }, { x: -420, duration: 0.5, ease: "power3.inOut" }, at);
  }

  function build() {
    SUMIBOX.mountSprites(document.getElementById("ad").getAttribute("src"));
    const tl = gsap.timeline({ paused: true });

    gsap.set("#s2, #s4, #s5, .card", { autoAlpha: 0 });
    gsap.set("#sep", { x: W + 80 });
    gsap.set(".word", { yPercent: 105 });
    gsap.set("#w-l3", { autoAlpha: 0, scale: 1.35 });
    gsap.set("#hl-rule", { scaleX: 0 });
    gsap.set("#trace rect", { strokeDashoffset: 900 });
    gsap.set(".q-line", { yPercent: 110 });
    gsap.set("#cta-hoy", { autoAlpha: 0, scale: 1.4 });
    gsap.set("#burst", { scale: 0, autoAlpha: 0 });

    // ---- Scene 1 (0–2 s): white, orange flash, headline revealed through masks ----
    tl.fromTo("#flash", { autoAlpha: 0 }, { autoAlpha: 0.9, duration: 0.12, ease: "power1.out" }, 0);
    tl.to("#flash", { autoAlpha: 0, duration: 0.45, ease: "power2.out" }, 0.12);
    tl.fromTo("#hl", { scale: 1.08 }, { scale: 1, duration: 1.8, ease: "power2.out" }, 0.1);
    tl.to("#row1 .word", { yPercent: 0, duration: 0.42, ease: "power3.out", stagger: 0.09 }, 0.18);
    tl.to("#row2 .word", { yPercent: 0, duration: 0.42, ease: "power3.out", stagger: 0.1 }, 0.62);
    // "EN UN SOLO PROVEEDOR": the hit, on the 1.0 s beat
    tl.to("#w-l3", { autoAlpha: 1, scale: 1, duration: 0.32, ease: "power4.out" }, 1.0);
    tl.fromTo("#hl", { y: 0 }, { y: 10, duration: 0.07, ease: "power1.out", yoyo: true, repeat: 1 }, 1.08);
    tl.to("#hl-rule", { scaleX: 1, duration: 0.4, ease: "power3.out" }, 1.15);
    tl.fromTo(".g-line", { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: "power3.out", stagger: 0.08 }, 1.0);

    // ---- Scene 2 (2–4.5 s): products — progressive zoom, horizontal glide, light parallax ----
    tl.to("#hl", { y: -320, autoAlpha: 0, duration: 0.4, ease: "power3.in" }, 1.95);
    tl.fromTo("#s2", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, 2.0);
    tl.from("#prod-win", { y: 420, duration: 0.55, ease: "power3.out" }, 2.0);
    tl.from("#s2-sub", { y: 30, autoAlpha: 0, duration: 0.45, ease: "power3.out" }, 2.3);
    tl.fromTo("#prod", { x: 0 }, { x: -(1998 - W), duration: 2.5, ease: "sine.inOut" }, 2.0);
    tl.fromTo("#prod-win", { scale: 1 }, { scale: 1.1, duration: 2.5, ease: "power1.in" }, 2.0);
    tl.to("#geo-front", { x: -90, duration: 2.5, ease: "sine.inOut" }, 2.0); // nearer layer moves more
    tl.to("#geo-back", { x: -35, duration: 2.5, ease: "sine.inOut" }, 2.0);

    // ---- Scene 3 (4.5–9.5 s): the four categories, one slide each ----
    const cards = ["#c-elec", "#c-limp", "#c-dese", "#c-ofic"];
    const cuts = [4.5, 5.5, 6.5, 8.0];
    cards.forEach((card, i) => {
      const at = cuts[i];
      slide(tl, i === 0 ? "#s2" : cards[i - 1], card, at);
      tl.fromTo(`${card} .cat-prod`, { scale: 1 }, { scale: 1.08, duration: (cuts[i + 1] || 9.5) - at, ease: "none" }, at);
      tl.fromTo(`${card} .cat-rule`, { scaleX: 0 }, { scaleX: 1, duration: 0.4, ease: "power3.out" }, at + 0.3);
      tl.from(`${card} .cat-tile`, { y: 40, autoAlpha: 0, duration: 0.4, ease: "power3.out" }, at + 0.35);
    });
    tl.to("#geo-front", { x: -160, duration: 5, ease: "none" }, 4.5);

    // ---- Scene 4 (9.5–12.5 s): pull back to the full ad, then the logo takes the stage ----
    tl.to("#c-ofic", { scale: 0.92, autoAlpha: 0, duration: 0.4, ease: "power2.in" }, 9.5);
    tl.fromTo("#s4", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 9.6);
    tl.fromTo("#adwrap", { scale: 1.5 }, { scale: 1, duration: 0.85, ease: "power3.out" }, 9.6);
    tl.to("#adwrap", { scale: 1.24, duration: 2.1, ease: "sine.inOut" }, 10.45);
    tl.to("#trace rect", { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut" }, 10.5);
    tl.fromTo("#trace", { autoAlpha: 0.6 }, { autoAlpha: 1, duration: 0.4, ease: "sine.inOut", yoyo: true, repeat: 3 }, 11.0);
    tl.fromTo("#shine", { x: -260 }, { x: 260, duration: 0.7, ease: "power2.inOut" }, 11.2);

    // ---- Scene 5 (12.5–19 s): navy hook — question, ¡COTIZA HOY!, contact ----
    slide(tl, "#s4", "#s5", 12.4);
    tl.from(".geo5", { autoAlpha: 0, scale: 0.6, duration: 0.5, ease: "power3.out", stagger: 0.06 }, 12.6);
    tl.to(".q-line", { yPercent: 0, duration: 0.4, ease: "power3.out", stagger: 0.12 }, 12.6);
    tl.to("#cta-hoy", { autoAlpha: 1, scale: 1, duration: 0.35, ease: "power4.out" }, 13.0);
    tl.to("#burst", { scale: 2.6, autoAlpha: 1, duration: 0.12, ease: "power1.out" }, 13.0);
    tl.to("#burst", { autoAlpha: 0, duration: 0.45, ease: "power2.out" }, 13.12);
    tl.from("#logo-card", { y: 60, autoAlpha: 0, duration: 0.5, ease: "power3.out" }, 13.6);
    tl.from("#srl", { y: 20, autoAlpha: 0, duration: 0.4, ease: "power3.out" }, 13.8);
    tl.from("#wa", { scale: 0.6, autoAlpha: 0, duration: 0.5, ease: "back.out(1.6)" }, 14.0);
    tl.from("#wa-link", { autoAlpha: 0, duration: 0.4 }, 14.4);
    tl.to("#wa", { scale: 1.035, duration: 0.5, ease: "sine.inOut", yoyo: true, repeat: 7 }, 15.0);
    tl.fromTo("#wa-shine", { x: -400 }, { x: 1000, duration: 0.8, ease: "power2.inOut" }, 15.3);
    tl.fromTo("#wa-shine", { x: -400 }, { x: 1000, duration: 0.8, ease: "power2.inOut", immediateRender: false }, 17.3);
    tl.to("#s5", { x: 0, duration: 0.01 }, 18.99); // hold to the end

    return tl;
  }

  window.SUMIBOX_REEL = { build };
})();
