// Shared SUMIBOX ad motion for the feed (index.html) and stories compositions.
//
// Every animated piece is a crop of the untouched original ad: an element with
// data-crop="x,y,w,h" (in the 1080x1080 ad space) gets the full image placed
// behind an overflow:hidden window, so nothing is redrawn or regenerated.
//
// Voice cues (seconds, from assets/sumibox-voz.wav, built phrase by phrase):
//   0.30 ¿Buscas un proveedor…   3.00 En SUMIBOX encuentras…
//   6.15 materiales eléctricos   7.55 productos de limpieza
//   8.90 desechables y gastables 10.40 y artículos de oficina
//  12.00 Simplifica tus compras… 16.35 SUMIBOX SRL.
//  17.75 Todo lo que tu negocio necesita, en un solo proveedor.  (ends ~20.5)
(function () {
  const S = 1080; // ad size inside the world layer
  const ZOOM = 1.75; // category close-up scale (top edge lands just below the headline)

  function mountSprites(src) {
    document.querySelectorAll("[data-crop]").forEach((el) => {
      const [x, y, w, h] = el.dataset.crop.split(",").map(Number);
      const s = Number(el.dataset.scale || 1);
      el.style.width = w * s + "px";
      el.style.height = h * s + "px";
      el.style.overflow = "hidden";
      el.setAttribute("data-layout-allow-overflow", ""); // crop window: overflow is the point
      if (el.classList.contains("in-world")) {
        el.style.left = x + "px";
        el.style.top = y + "px";
      }
      const img = document.createElement("img");
      img.src = src;
      img.alt = "";
      img.setAttribute("data-layout-allow-overflow", "");
      img.style.cssText =
        "position:absolute;display:block;max-width:none;" +
        `width:${S * s}px;height:${S * s}px;left:${-x * s}px;top:${-y * s}px;`;
      el.appendChild(img);
    });
  }

  // Camera framing: centre (cx, cy) at scale s, clamped so the ad always covers the window.
  function cam(s, cx, cy) {
    const clamp = (v) => Math.min(0, Math.max(S - s * S, v));
    return { scale: s, x: clamp(S / 2 - s * cx), y: clamp(S / 2 - s * cy) };
  }

  function build() {
    mountSprites(document.getElementById("base").getAttribute("src"));
    const tl = gsap.timeline({ paused: true });

    // ---- 0–3.7 s: the ad assembles itself from its own pieces ----
    gsap.set("#world", { transformOrigin: "0 0", ...cam(1, 540, 540) });
    gsap.set("#base", { opacity: 0 });
    gsap.set("#s-l1, #s-l2, #s-l3, #s-sub, #s-prod, .tile, #s-logo, #s-word", { opacity: 0 });
    gsap.set("#s-rule", { scaleX: 0, transformOrigin: "50% 50%" });
    gsap.set("#s-sub", { clipPath: "inset(0 100% 0 0)" });
    gsap.set(".ring", { opacity: 0, scale: 0.6 });
    gsap.set("#end", { clipPath: "circle(0% at 50% 50%)" });

    tl.from("#s-l1", { y: 34, duration: 0.6, ease: "power3.out" }, 0.25);
    tl.to("#s-l1", { opacity: 1, duration: 0.4, ease: "sine.out" }, 0.25);
    tl.from("#s-l2", { y: 34, duration: 0.6, ease: "power3.out" }, 0.6);
    tl.to("#s-l2", { opacity: 1, duration: 0.4, ease: "sine.out" }, 0.6);
    tl.from("#s-l3", { scale: 0.82, duration: 0.7, ease: "back.out(1.8)" }, 1.0);
    tl.to("#s-l3", { opacity: 1, duration: 0.35, ease: "sine.out" }, 1.0);
    tl.to("#s-rule", { scaleX: 1, duration: 0.5, ease: "power2.out" }, 1.5);
    tl.to("#s-sub", { opacity: 1, duration: 0.2 }, 1.7);
    tl.to("#s-sub", { clipPath: "inset(0 0% 0 0)", duration: 0.7, ease: "power2.out" }, 1.7);
    tl.from("#s-prod", { y: 70, duration: 0.9, ease: "power3.out" }, 2.0);
    tl.to("#s-prod", { opacity: 1, duration: 0.6, ease: "sine.out" }, 2.0);
    tl.from(".tile", { y: 34, scale: 0.88, duration: 0.55, ease: "back.out(1.7)", stagger: 0.12 }, 2.3);
    tl.to(".tile", { opacity: 1, duration: 0.35, ease: "sine.out", stagger: 0.12 }, 2.3);
    tl.from("#s-logo", { y: -50, duration: 0.7, ease: "back.out(1.6)" }, 2.5);
    tl.to("#s-logo", { opacity: 1, duration: 0.4 }, 2.5);
    tl.to("#s-word", { opacity: 1, duration: 0.5, ease: "sine.out" }, 2.75);
    // decorations and every remaining pixel of the original arrive last
    tl.to("#base", { opacity: 1, duration: 0.6, ease: "sine.inOut" }, 3.1);
    // "En SUMIBOX…": small nod of the logo
    tl.to("#s-logo", { scale: 1.12, duration: 0.25, ease: "power2.out", yoyo: true, repeat: 1 }, 3.05);

    // ---- 3.7–12.5 s: one close-up per category, in sync with the voice ----
    tl.to("#world", { ...cam(1.04, 540, 560), duration: 1.6, ease: "sine.inOut" }, 3.7);
    const stops = [
      // [ring id, camera centre x, move start, ring in]
      ["#r-elec", 175, 5.3, 6.1],
      ["#r-limp", 480, 7.05, 7.55],
      ["#r-dese", 690, 8.4, 8.9],
      ["#r-ofic", 907, 9.9, 10.4],
    ];
    stops.forEach(([ring, cx, move, ringIn], i) => {
      const first = i === 0;
      tl.to("#world", { ...cam(ZOOM, cx, 770), duration: first ? 0.8 : 0.5, ease: "power2.inOut" }, move);
      if (!first) tl.to(stops[i - 1][0], { opacity: 0, scale: 0.8, duration: 0.3, ease: "sine.in" }, move);
      tl.to(ring, { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(2.2)" }, ringIn);
      tl.to(ring, { scale: 1.08, duration: 0.35, ease: "sine.inOut", yoyo: true, repeat: 1 }, ringIn + 0.45);
    });
    tl.to("#r-ofic", { opacity: 0, scale: 0.8, duration: 0.3, ease: "sine.in" }, 11.4);
    tl.to("#world", { ...cam(1, 540, 540), duration: 1.1, ease: "power2.inOut" }, 11.4);

    // ---- 12.5–15.7 s: full ad, slow push while "Simplifica tus compras…" ----
    tl.to("#world", { ...cam(1.05, 540, 600), duration: 3.2, ease: "sine.inOut" }, 12.5);

    // ---- 15.7–23 s: end card — logo spin, SUMIBOX letter by letter, tagline, WhatsApp ----
    tl.to("#end", { clipPath: "circle(80% at 50% 50%)", duration: 0.7, ease: "power2.inOut" }, 15.7);
    tl.fromTo(
      "#e-logo",
      { rotationY: -360, scale: 0.3, opacity: 0, transformPerspective: 900 },
      { rotationY: 0, scale: 1, opacity: 1, duration: 1.1, ease: "power3.out" },
      15.9,
    );
    tl.from(".e-letter", { y: 28, opacity: 0, duration: 0.35, ease: "back.out(2)", stagger: 0.075 }, 16.4);
    tl.from("#e-rule", { scaleX: 0, duration: 0.45, ease: "power2.out" }, 17.0);
    tl.from("#e-l1", { y: 22, opacity: 0, duration: 0.45, ease: "power3.out" }, 17.75);
    tl.from("#e-l2", { y: 22, opacity: 0, duration: 0.45, ease: "power3.out" }, 18.25);
    tl.from("#e-l3", { scale: 0.85, opacity: 0, duration: 0.55, ease: "back.out(1.8)" }, 19.45);
    tl.from("#cta", { scale: 0.6, opacity: 0, duration: 0.6, ease: "back.out(1.8)" }, 19.95);
    tl.to("#cta", { scale: 1.04, duration: 0.45, ease: "sine.inOut", yoyo: true, repeat: 4 }, 20.7);
    tl.to("#end", { opacity: 1, duration: 0.01 }, 22.99); // hold to the end

    return tl;
  }

  window.SUMIBOX = { build, mountSprites, cam };
})();
