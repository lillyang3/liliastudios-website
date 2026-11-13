(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  const parts = [...document.querySelectorAll('.project-subtitle, .project-collage, .project-result, .project-quote')];
  // The strip is fully clipped while hidden, which reads as "not visible", so watch its parent instead.
  const watched = new Map(parts.map(part => [part.matches('.project-subtitle') ? part.parentElement : part, part]));
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      watched.get(entry.target).classList.add('is-revealed');
      observer.unobserve(entry.target);
    });
  }, { threshold: .2 });
  parts.forEach(part => part.classList.add('reveal-ready'));
  // Let the hidden starting state render before observing its entrance.
  requestAnimationFrame(() => requestAnimationFrame(() => watched.forEach((part, target) => observer.observe(target))));
})();
