// SUMIBOX Reel "Nuestros clientes creen en nosotros" — 1080x1920, 18 s.
//
// The approved collage (assets/sumibox-clientes-collage.png, 1122x1402) is moved as one piece
// by a camera; highlights are overlays in its own pixel space. The headline in scene 1 and
// the logos are crops of the original files (collage / assets/sumibox-logo-original.png),
// never redrawn.
//
// Voice cues (assets/sumibox-clientes-voz.wav):
//   2.15 Cada empresa tiene necesidades diferentes.   4.55 En SUMIBOX trabajamos para ayudarte con
//   6.85 suministros de oficina,  8.15 limpieza,  8.78 desechables  9.52 y materiales eléctricos.
//  10.85 Gracias a las empresas que confían en nosotros.
//  14.50 ¿Necesitas abastecer tu negocio?  16.45 ¡Cotiza hoy por WhatsApp!  (ends 17.95)
(function () {
  const FW = 1080;
  const FH = 1920;
  const IMG = {
    collage: { w: 1122, h: 1402 },
    logo: { w: 1536, h: 1024 },
  };
  const FIT = FW / IMG.collage.w;

  // Centre collage point (cx, cy) at scale s; by default the collage always covers the
  // frame horizontally (vertically the navy backdrop may show: the collage is 4:5).
  function cam(s, cx, cy, clamp = true) {
    let x = FW / 2 - s * cx;
    const y = FH / 2 - s * cy;
    if (clamp && s * IMG.collage.w >= FW) x = Math.min(0, Math.max(FW - s * IMG.collage.w, x));
    return { scale: s, x, y };
  }
  const FULL = cam(FIT, IMG.collage.w / 2, IMG.collage.h / 2);
  const CARD = cam(2, 237.5, 362.5, false); // headline region framed exactly like #hcard

  function mountSprites() {
    const src = {
      collage: document.getElementById("collage").getAttribute("src"),
      logo: document.getElementById("logo-full").getAttribute("src"),
    };
    document.querySelectorAll("[data-crop]").forEach((el) => {
      const key = el.dataset.img || "collage";
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

  function sweep(tl, at) {
    tl.fromTo("#sep", { x: FW + 80 }, { x: -420, duration: 0.45, ease: "power3.inOut", immediateRender: false }, at);
  }

  function build() {
    mountSprites();
    const tl = gsap.timeline({ paused: true });
    const go = (state, at, duration, ease) => tl.to("#world", { ...state, duration, ease }, at);

    gsap.set("#world", CARD);
    gsap.set("#window", { autoAlpha: 0, clipPath: "circle(75% at 50% 50%)" });
    gsap.set("#hook-accent", { scaleX: 0 });
    gsap.set(".hl", { yPercent: 105 });
    gsap.set("#h-rule", { scaleX: 0, transformOrigin: "0 50%" });
    gsap.set(".uline", { scaleX: 0 });
    gsap.set(".cat-ring, #spot", { autoAlpha: 0 });
    gsap.set("#ident", { clipPath: "circle(0% at 50% 47%)" });
    gsap.set("#logo-full", { autoAlpha: 0, scale: 0.94 });
    gsap.set("#id-ring", { autoAlpha: 0, scale: 0.6 });
    gsap.set(".id-line", { scaleX: 0 });
    gsap.set("#end", { x: FW });
    gsap.set("#sep", { x: FW + 80 });
    gsap.set(".e-line", { yPercent: 110 });
    gsap.set(".cta-line", { autoAlpha: 0, scale: 1.35 });
    gsap.set("#burst, .pulse", { autoAlpha: 0, scale: 0.6 });

    // ---- Scene 1 (0–2 s): navy hook, the original headline revealed through masks ----
    tl.to("#hook-accent", { scaleX: 1, duration: 0.3, ease: "power3.out" }, 0);
    tl.from("#hcard", { y: 60, autoAlpha: 0, duration: 0.35, ease: "power3.out" }, 0.05);
    tl.to("#hl1", { yPercent: 0, duration: 0.35, ease: "power4.out" }, 0.2);
    tl.to("#hl2", { yPercent: 0, duration: 0.35, ease: "power4.out" }, 0.38);
    tl.to("#hl3", { yPercent: 0, duration: 0.35, ease: "power4.out" }, 0.62);
    tl.to("#hl4", { yPercent: 0, duration: 0.35, ease: "power4.out" }, 0.8);
    tl.to("#h-rule", { scaleX: 1, duration: 0.3, ease: "power3.out" }, 1.0); // accent on the beat
    tl.fromTo("#hcard", { scale: 1 }, { scale: 1.02, duration: 0.08, ease: "power1.out", yoyo: true, repeat: 1 }, 1.0);
    // the collage takes over at the very same framing, then pulls back
    tl.to("#window", { autoAlpha: 1, duration: 0.01 }, 1.35);
    tl.to("#hcard, #hook-accent", { autoAlpha: 0, duration: 0.25, ease: "sine.out" }, 1.36);
    go(FULL, 1.5, 0.8, "power2.inOut");

    // ---- Scene 2 (2–6 s): real delivery photo, lateral drift, the trust message ----
    go(cam(1.6, 760, 330), 2.3, 1.0, "power2.inOut");
    go(cam(1.66, 700, 370), 3.3, 1.0, "none");
    go(cam(2.0, 235, 600), 4.3, 0.5, "power3.inOut");
    tl.to("#u-trust", { scaleX: 1, duration: 0.5, ease: "power2.inOut" }, 4.75);
    go(cam(2.05, 235, 600), 4.8, 1.05, "none");
    tl.to("#u-trust", { autoAlpha: 0, duration: 0.15 }, 5.85);

    // ---- Scene 3 (6–10.5 s): rhythm through photos and categories, cut to the voice ----
    tl.to("#window", { clipPath: "circle(0% at 50% 50%)", duration: 0.15, ease: "power2.in" }, 5.85); // mask out
    tl.set("#world", cam(1.9, 545, 905), 6.0);
    tl.to("#window", { clipPath: "circle(75% at 50% 50%)", duration: 0.35, ease: "power3.out" }, 6.0); // mask in
    go(cam(1.95, 545, 905), 6.35, 0.45, "none");
    sweep(tl, 6.8);
    go(cam(2.3, 180, 800), 6.8, 0.45, "power3.inOut");
    const rings = [
      ["#r-ofic", 6.95, 0],
      ["#r-limp", 8.15, 870],
      ["#r-dese", 8.78, 945],
    ];
    rings.forEach(([ring, at, cy], i) => {
      if (i > 0) {
        go(cam(2.3, 180, cy), at - 0.05, 0.3, "power2.inOut");
        tl.to(rings[i - 1][0], { autoAlpha: 0, duration: 0.15 }, at - 0.05);
      }
      tl.fromTo(ring, { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 1, scale: 1, duration: 0.3, ease: "back.out(2)" }, at);
    });
    tl.to("#r-dese", { autoAlpha: 0, duration: 0.15 }, 9.4);
    // "materiales eléctricos": zoom-out / zoom-in punch onto the Leviton delivery
    go(cam(1.5, 945, 640), 9.4, 0.22, "power2.in");
    go(cam(1.75, 945, 640), 9.62, 0.3, "power2.out");
    tl.to("#u-elec", { scaleX: 1, duration: 0.45, ease: "power2.inOut" }, 9.85);
    go(cam(1.7, 945, 640), 9.92, 0.63, "none");
    tl.to("#u-elec", { autoAlpha: 0, duration: 0.15 }, 10.5);

    // ---- Scene 4 (10.5–13 s): the thank-you block — soft entry with a small scale move ----
    sweep(tl, 10.55);
    go(cam(1.85, 905, 1015), 10.55, 0.45, "power3.inOut");
    tl.to("#spot", { autoAlpha: 1, duration: 0.5, ease: "sine.out" }, 10.8);
    go(cam(1.95, 905, 1015), 11.0, 0.6, "power2.out");
    go(cam(2.0, 905, 1015), 11.6, 1.4, "none");

    // ---- Scene 5 (13–14.4 s): identity — the original logo file as one unit ----
    tl.to("#ident", { clipPath: "circle(80% at 50% 47%)", duration: 0.5, ease: "power2.inOut" }, 13.0);
    tl.to("#logo-full", { autoAlpha: 1, scale: 1, duration: 0.6, ease: "power2.out" }, 13.15);
    tl.to("#logo-full", { scale: 1.035, duration: 0.65, ease: "none" }, 13.75);
    tl.to("#id-ring", { autoAlpha: 1, scale: 1.2, duration: 0.15, ease: "power1.out" }, 13.5);
    tl.to("#id-ring", { autoAlpha: 0, scale: 1.4, duration: 0.5, ease: "power2.out" }, 13.65);
    tl.to(".id-line", { scaleX: 1, duration: 0.45, ease: "power3.out", stagger: 0.08 }, 13.6);

    // ---- Scene 6 (14.4–18 s): navy end card; the number is on screen from 15.35 s ----
    sweep(tl, 14.4);
    tl.to("#ident", { x: -FW, duration: 0.45, ease: "power3.inOut" }, 14.4);
    tl.to("#end", { x: 0, duration: 0.45, ease: "power3.inOut" }, 14.4);
    tl.from(".geo-end", { autoAlpha: 0, scale: 0.6, duration: 0.45, ease: "power3.out", stagger: 0.05 }, 14.6);
    tl.from("#logo-card", { y: 30, autoAlpha: 0, duration: 0.4, ease: "power3.out" }, 14.55);
    tl.to(".e-line", { yPercent: 0, duration: 0.35, ease: "power3.out", stagger: 0.1 }, 14.65);
    tl.to(".cta-line", { autoAlpha: 1, scale: 1, duration: 0.3, ease: "power4.out", stagger: 0.12 }, 14.95);
    tl.to("#burst", { autoAlpha: 1, scale: 2.4, duration: 0.12, ease: "power1.out" }, 14.95);
    tl.to("#burst", { autoAlpha: 0, duration: 0.45, ease: "power2.out" }, 15.07);
    tl.from("#wa-wrap", { scale: 0.7, autoAlpha: 0, duration: 0.4, ease: "back.out(1.5)" }, 15.35);
    tl.fromTo(".wa-num", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.45, ease: "power2.out" }, 15.4);
    [16.0, 16.9].forEach((at) => {
      tl.fromTo(".pulse", { autoAlpha: 0.9, scale: 1 }, { autoAlpha: 0, scale: 1.18, duration: 0.8, ease: "power2.out", immediateRender: false }, at);
    });
    tl.fromTo("#wa-shine", { x: -400 }, { x: 1000, duration: 0.8, ease: "power2.inOut" }, 16.4);
    tl.fromTo("#wa-shine", { x: -400 }, { x: 1000, duration: 0.8, ease: "power2.inOut", immediateRender: false }, 17.15);
    tl.to("#end", { x: 0, duration: 0.01 }, 17.99); // hold to the end

    return tl;
  }

  window.SUMIBOX_CLIENTES = { build };
})();
