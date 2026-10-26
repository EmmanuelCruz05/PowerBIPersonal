// SUMIBOX — "Mucho más que un proveedor" — Instagram feed video (1080x1350, 21.5 s).
//
// assets/sumibox-mucho-mas-diseno.png is the approved design (the 1080x1080 artwork area of
// assets/sumibox-mucho-mas-original.webp, whose bottom 270 px were empty white). A camera
// moves the design as one piece; highlights are overlays in its own pixel space, so nothing
// in the artwork is redrawn. The band under the square carries the call to action.
// Music: assets/sumibox-mucho-mas-musica.wav (tools/synth_audio.py), cut to the same timeline.
(function () {
  const FW = 1080;
  const FH = 1350;
  const S = 1080; // design size

  // Centre design point (cx, cy) at scale s; zoomed views always cover the whole frame.
  function cam(s, cx, cy) {
    let x = FW / 2 - s * cx;
    let y = FH / 2 - s * cy;
    x = Math.min(0, Math.max(FW - s * S, x));
    y = s * S >= FH ? Math.min(0, Math.max(FH - s * S, y)) : 0;
    return { scale: s, x, y };
  }
  const FULL = cam(1, 540, 540);

  function build() {
    const tl = gsap.timeline({ paused: true });
    const go = (state, at, duration, ease) => tl.to("#world", { ...state, duration, ease }, at);

    gsap.set("#world", cam(1.36, 420, 200)); // whole headline readable from frame one
    gsap.set("#ul", { scaleX: 0 });
    gsap.set(".ring, #box-hl, #logo-glow", { autoAlpha: 0 });
    gsap.set("#slogan-ul", { scaleX: 0 });
    gsap.set("#band", { yPercent: 100, autoAlpha: 0 });
    gsap.set("#cta-shine", { x: -260 });

    // 0–3.4 s: the headline, then the "¿En qué puedo ayudarte hoy?" bubble
    go(cam(1.42, 420, 200), 0, 2.1, "sine.inOut");
    tl.to("#ul", { scaleX: 1, duration: 0.5, ease: "power3.out" }, 0.6);
    go(cam(1.95, 930, 210), 2.15, 0.6, "power3.inOut");
    go(cam(2.0, 930, 205), 2.75, 0.6, "none");

    // 3.4–4.4 s: pull back to the whole design; the call-to-action band rises underneath
    go(FULL, 3.35, 0.85, "power3.inOut");
    tl.set("#band", { autoAlpha: 1 }, 3.75);
    tl.to("#band", { yPercent: 0, duration: 0.55, ease: "power3.out" }, 3.75);
    tl.set("#band", { autoAlpha: 0, yPercent: 100 }, 4.75); // covered by the zoomed design from here

    // 4.4–12.4 s: the five categories, travelling round the circle that surrounds the logo
    const stops = [
      ["#r-ofic", 228, 480],
      ["#r-limp", 805, 415],
      ["#r-dese", 915, 690],
      ["#r-ferr", 480, 845],
      ["#r-elec", 190, 735],
    ];
    stops.forEach(([ring, cx, cy], i) => {
      const at = 4.4 + i * 1.6;
      go(cam(1.85, cx, cy), at, 0.55, "power3.inOut");
      go(cam(1.92, cx, cy), at + 0.55, 1.05, "none");
      tl.fromTo(ring, { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: "back.out(2.2)" }, at + 0.4);
      tl.to(ring, { scale: 1.1, duration: 0.3, ease: "sine.inOut", yoyo: true, repeat: 1 }, at + 0.8);
      tl.to(ring, { autoAlpha: 0, duration: 0.2 }, at + 1.5);
    });

    // 12.4–14.2 s: the logo — soft glow behind it, a line drawn under its slogan
    go(cam(1.6, 542, 560), 12.4, 0.6, "power3.inOut");
    go(cam(1.68, 542, 560), 13.0, 1.15, "none");
    tl.to("#slogan-ul", { scaleX: 1, duration: 0.7, ease: "power2.inOut" }, 12.75);
    tl.to("#logo-glow", { autoAlpha: 0.9, duration: 0.25, ease: "sine.out" }, 12.6);
    tl.to("#logo-glow", { autoAlpha: 0, duration: 0.9, ease: "sine.inOut" }, 12.85);
    tl.to("#slogan-ul", { autoAlpha: 0, duration: 0.3 }, 14.0);

    // 14.2–15.8 s: "Un solo proveedor · Todas las soluciones para tu empresa."
    go(cam(1.95, 858, 880), 14.15, 0.55, "power3.inOut");
    tl.fromTo("#box-hl", { autoAlpha: 0, scale: 1.06 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: "power2.out" }, 14.55);
    tl.to("#box-hl", { autoAlpha: 0, duration: 0.2 }, 15.6);

    // 15.8–18 s: glide along the benefits bar
    go(cam(1.85, 290, 1005), 15.75, 0.5, "power3.inOut");
    go(cam(1.85, 790, 1005), 16.3, 1.6, "sine.inOut");

    // 18–21.5 s: full design + call to action held to the end
    go(FULL, 17.95, 0.8, "power3.inOut");
    tl.set("#band", { autoAlpha: 1 }, 18.25);
    tl.to("#band", { yPercent: 0, duration: 0.5, ease: "power3.out" }, 18.25);
    tl.fromTo("#cta", { scale: 1 }, { scale: 1.06, duration: 0.3, ease: "power2.out", yoyo: true, repeat: 1 }, 18.8);
    tl.to("#cta-shine", { x: 700, duration: 0.8, ease: "power2.inOut" }, 19.3);
    tl.to("#cta", { scale: 1.04, duration: 0.45, ease: "sine.inOut", yoyo: true, repeat: 1 }, 20.3);
    tl.to("#world", { scale: 1, duration: 0.01 }, 21.49); // hold to the end

    return tl;
  }

  window.SUMIBOX_MUCHO_MAS = { build };
})();
