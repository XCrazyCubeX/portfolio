// scripts/scroll.js
document.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.error("GSAP or ScrollTrigger missing");
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  const container = document.querySelector(".persona-container");
  const p = container?.querySelector("p.reveal-text");
  if (!container || !p) return;

  // Wrap only non-space chars
  const raw = p.textContent;
  p.textContent = "";
  const spans = [];
  for (const ch of raw) {
    if (ch === " ") {
      p.appendChild(document.createTextNode(" "));
    } else {
      const s = document.createElement("span");
      s.className = "char";
      s.textContent = ch;
      p.appendChild(s);
      spans.push(s);
    }
  }

  // Ensure starting opacity
  gsap.set(spans, { opacity: 0.1 });

  // Scrub-driven staggered fade over a big scroll window
  gsap.to(spans, {
    opacity: 1,
    ease: "none",
    stagger: 0.03,      // smaller gaps for smoother build
    scrollTrigger: {
      trigger: container,
      start: "top 85%",    // start when top of container is 85% down viewport
      end: "bottom 15%",   // finish when BOTTOM of container is 15% down
      scrub: 0.5,          // add a slight delay/smoothing to the scrub
      // markers: true,     // uncomment to debug positions
    }
  });
});
