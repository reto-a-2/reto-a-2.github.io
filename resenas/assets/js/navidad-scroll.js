(() => {
  const ornaments = [...document.querySelectorAll('[data-xmas-float]')];
  if (!ornaments.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let queued = false;
  const paint = () => {
    queued = false;
    const scrolled = Math.max(0, window.scrollY - 180);
    const track = window.innerHeight + 300;
    ornaments.forEach((ornament) => {
      const phase = (scrolled * Number(ornament.dataset.speed || .5) + Number(ornament.dataset.phase || 0)) % track;
      ornament.style.transform = `translate3d(0, ${-phase}px, 0)`;
      ornament.style.opacity = scrolled > 0 ? String(Math.min(1, scrolled / 320) * .92) : '0';
    });
  };
  const update = () => { if (!queued) { queued = true; requestAnimationFrame(paint); } };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  paint();
})();
