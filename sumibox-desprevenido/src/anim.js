// SUMIBOX Reel "Que no te agarre desprevenido" — 1080x1920, 18 s.
//
// The approved ad (assets/sumibox-desprevenido-original.jpg, 1179x1465) is moved as one
// piece by a camera; highlights are overlays placed in the ad's own pixel space, so the
// artwork, logo and texts are never redrawn. The end-card logo is a crop of the same file.
//
// Voice cues (assets/sumibox-desprevenido-voz.wav):
//   0.15 ¿Otra vez te quedaste sin suministros…   2.35 No esperes al último momento.
//   3.95 En SUMIBOX encuentras materiales eléctricos,  5.62 productos de limpieza,
//   6.55 desechables, gastables   7.62 y artículos de oficina.
//   9.10 Planifica tus compras…   12.00 ¡Cotiza hoy por WhatsApp al 809… (number ~13.1–15.8)
//  16.10 SUMIBOX, tu aliado en suministros empresariales.  (ends 17.66)
// Cuts sit on a 120 BPM grid where the voice allows, ready for a music track.
(function () {
  const IW = 1179;
  const IH = 1465;
  const FW = 1080;
  const FH = 1920;
  const FIT = FW / IW;

  // Centre ad point (cx, cy) at scale s. Horizontally the ad always covers the frame;
  // vertically the navy backdrop may show (the ad is 4:5, the frame 9:16).
  function cam(s, cx, cy) {
    let x = FW / 2 - s * cx;
    const y = FH / 2 - s * cy;
    if (s * IW >= FW) x = Math.min(0, Math.max(FW - s * IW, x));
    return { scale: s, x, y };
  }
  const FULL = cam(FIT, IW / 2, IH / 2);

  function mountSprites(src) {
    document.querySelectorAll("[data-crop]").forEach((el) => {
      const [x, y, w, h] = el.dataset.crop.split(",").map(Number);
      const s = Number(el.dataset.scale || 1);
      el.style.width = w * s + "px";
      el.style.height = h * s + "px";
      el.style.overflow = "hidden";
      el.setAttribute("data-layout-allow-overflow", "");
      const img = document.createElement("img");
      img.src = src;
      img.alt = "";
      img.setAttribute("data-layout-allow-overflow", "");
      img.style.cssText =
        "position:absolute;display:block;max-width:none;" +
        `width:${IW * s}px;height:${IH * s}px;left:${-x * s}px;top:${-y * s}px;`;
      el.appendChild(img);
    });
  }

  function build() {
    mountSprites(document.getElementById("ad").getAttribute("src"));
    const tl = gsap.timeline({ paused: true });
    const go = (state, at, duration, ease) => tl.to("#world", { ...state, duration, ease }, at);

    gsap.set("#world", cam(FIT * 1.1, IW / 2, IH / 2));
    gsap.set("#window", { clipPath: "inset(50% 0% 50% 0%)" });
    gsap.set(".hk", { yPercent: 110 });
    gsap.set("#hook-bar", { scaleX: 0 });
    gsap.set(".hl-box, #cat-bar, #accent-glow, #logo-focus, #logo-flash", { autoAlpha: 0 });
    gsap.set("#block-line", { scaleX: 0 });
    gsap.set("#logo-trace rect", { strokeDashoffset: 1000 });
    gsap.set("#end", { x: FW });
    gsap.set("#sep", { x: FW + 80 });
    gsap.set(".e-line", { yPercent: 110 });
    gsap.set("#cta-hoy", { autoAlpha: 0, scale: 1.4 });
    gsap.set("#burst", { autoAlpha: 0, scale: 0 });

    // ---- Scene 1 (0–2 s): hook on navy, then the ad opens up ----
    tl.fromTo("#hook", { scale: 1.12 }, { scale: 1, duration: 1.5, ease: "power3.out" }, 0);
    tl.to("#hk1", { yPercent: 0, duration: 0.4, ease: "power4.out" }, 0.1);
    tl.to("#hk2", { yPercent: 0, duration: 0.4, ease: "power4.out" }, 0.3);
    tl.to("#hk3", { yPercent: 0, duration: 0.38, ease: "power4.out" }, 0.82);
    tl.to("#hk4", { yPercent: 0, duration: 0.38, ease: "power4.out" }, 0.94);
    tl.to("#hook-bar", { scaleX: 1, duration: 0.35, ease: "power3.out" }, 1.0); // orange accent on the beat
    tl.fromTo("#hook", { y: 0 }, { y: 9, duration: 0.07, ease: "power1.out", yoyo: true, repeat: 1 }, 1.0);
    tl.to("#hook", { y: -150, autoAlpha: 0, duration: 0.4, ease: "power3.in" }, 1.6);
    tl.to("#window", { clipPath: "inset(0% 0% 0% 0%)", duration: 0.55, ease: "power3.inOut" }, 1.7);
    go(FULL, 1.7, 0.7, "power2.out");

    // ---- Scene 2 (2–5 s): the problem — diagonal push, pause, highlight the three pains ----
    go(cam(1.8, 840, 560), 2.4, 1.1, "power2.inOut");
    go(cam(1.83, 840, 560), 3.5, 0.35, "none"); // breath
    go(cam(1.8, 290, 715), 3.85, 0.45, "power3.inOut");
    ["#hb1", "#hb2", "#hb3"].forEach((b, i) => {
      tl.fromTo(b, { autoAlpha: 0, scale: 0.92 }, { autoAlpha: 1, scale: 1, duration: 0.25, ease: "back.out(2)" }, 4.1 + i * 0.25);
    });
    tl.to(".hl-box", { autoAlpha: 0, duration: 0.2 }, 4.9);

    // ---- Scene 3 (5–9 s): the four categories, cut to the voice ----
    const cats = [
      // [centre x, cut, scale]
      [92, 5.0, 2.0],
      [250, 5.62, 2.0],
      [412, 6.55, 2.25],
      [572, 7.62, 2.0],
    ];
    cats.forEach(([cx, at, s], i) => {
      go(cam(s, cx, 1150), at, i === 0 ? 0.45 : 0.35, "power3.inOut"); // strip lands low in the safe zone
      if (i === 0) {
        tl.set("#cat-bar", { x: cx }, at);
        tl.fromTo("#cat-bar", { autoAlpha: 0, scaleX: 0 }, { autoAlpha: 1, scaleX: 1, duration: 0.3, ease: "power3.out" }, at + 0.3);
      } else {
        tl.to("#cat-bar", { x: cx, duration: 0.35, ease: "power3.inOut" }, at);
      }
    });
    go(cam(2.1, 572, 1150), 8.0, 1.0, "none");
    tl.to("#cat-bar", { autoAlpha: 0, duration: 0.2 }, 8.85);

    // ---- Scene 4 (9–12 s): "Que no te agarre desprevenido." — hold to read ----
    go(cam(1.85, 312, 1030), 9.0, 0.6, "power3.inOut");
    go(cam(1.92, 312, 1030), 9.6, 2.3, "none");
    tl.to("#block-line", { scaleX: 1, duration: 0.7, ease: "power2.inOut" }, 9.75);
    tl.to("#accent-glow", { autoAlpha: 0.9, duration: 0.3, ease: "sine.out" }, 10.4);
    tl.to("#accent-glow", { autoAlpha: 0.35, duration: 0.8, ease: "sine.inOut" }, 10.7);
    tl.to("#block-line, #accent-glow", { autoAlpha: 0, duration: 0.3 }, 11.9);

    // ---- Scene 5 (12–14 s): full composition, then the original logo takes the stage ----
    go(FULL, 11.9, 0.65, "power3.inOut");
    go(cam(1.55, 308, 100), 12.55, 1.4, "power2.inOut");
    tl.to("#logo-focus", { autoAlpha: 1, duration: 0.4, ease: "sine.out" }, 12.7);
    tl.to("#logo-trace rect", { strokeDashoffset: 0, duration: 0.8, ease: "power2.inOut" }, 12.85);
    tl.to("#logo-flash", { autoAlpha: 1, duration: 0.12, ease: "power1.out" }, 13.0);
    tl.to("#logo-flash", { autoAlpha: 0, duration: 0.5, ease: "power2.out" }, 13.12);

    // ---- Scene 6 (14–18 s): navy end card — the number is on screen from 15.0 s ----
    tl.to("#window", { x: -FW, duration: 0.45, ease: "power3.inOut" }, 14.0);
    tl.to("#end", { x: 0, duration: 0.45, ease: "power3.inOut" }, 14.0);
    tl.to("#sep", { x: -420, duration: 0.45, ease: "power3.inOut" }, 14.0);
    tl.from(".geo-end", { autoAlpha: 0, scale: 0.6, duration: 0.45, ease: "power3.out", stagger: 0.05 }, 14.2);
    tl.to(".e-line", { yPercent: 0, duration: 0.35, ease: "power3.out", stagger: 0.1 }, 14.15);
    tl.to("#cta-hoy", { autoAlpha: 1, scale: 1, duration: 0.3, ease: "power4.out" }, 14.5);
    tl.to("#burst", { autoAlpha: 1, scale: 2.4, duration: 0.12, ease: "power1.out" }, 14.5);
    tl.to("#burst", { autoAlpha: 0, duration: 0.45, ease: "power2.out" }, 14.62);
    tl.from("#logo-card", { y: 40, autoAlpha: 0, duration: 0.35, ease: "power3.out" }, 14.72);
    tl.from("#srl", { y: 16, autoAlpha: 0, duration: 0.3, ease: "power3.out" }, 14.85);
    tl.from("#wa", { scale: 0.7, autoAlpha: 0, duration: 0.4, ease: "back.out(1.5)" }, 15.0);
    tl.fromTo(".wa-num", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.45, ease: "power2.out" }, 15.05);
    tl.to("#wa", { scale: 1.035, duration: 0.5, ease: "sine.inOut", yoyo: true, repeat: 3 }, 15.9);
    tl.fromTo("#wa-shine", { x: -400 }, { x: 1000, duration: 0.8, ease: "power2.inOut" }, 16.0);
    tl.fromTo("#wa-shine", { x: -400 }, { x: 1000, duration: 0.8, ease: "power2.inOut", immediateRender: false }, 17.1);
    tl.to("#end", { x: 0, duration: 0.01 }, 17.99); // hold to the end

    return tl;
  }

  window.SUMIBOX_DESPREVENIDO = { build };
})();
