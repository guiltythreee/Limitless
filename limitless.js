// Small, low-cost gold particles. Respect reduced-motion preferences.
const particleLayer = document.getElementById("particles");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduceMotion && particleLayer) {
  const count = window.innerWidth < 600 ? 32 : 70;

  for (let i = 0; i < count; i++) {
    const particle = document.createElement("span");
    particle.className = "particle";
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.setProperty("--duration", `${14 + Math.random() * 20}s`);
    particle.style.setProperty("--delay", `${-Math.random() * 30}s`);
    particle.style.setProperty("--drift", `${-45 + Math.random() * 90}px`);
    particle.style.setProperty("--opacity", `${0.2 + Math.random() * 0.55}`);
    particle.style.width = particle.style.height = `${1 + Math.random() * 2}px`;
    particleLayer.appendChild(particle);
  }
}
