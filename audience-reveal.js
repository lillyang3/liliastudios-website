(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  const cards = [...document.querySelectorAll('.audience-card')];
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-revealed');
      observer.unobserve(entry.target);
    });
  }, { threshold: .2 });
  // Watch the card, not its tile: the tile is fully clipped while hidden, which reads as "not visible".
  cards.forEach(card => card.classList.add('reveal-ready'));
  requestAnimationFrame(() => requestAnimationFrame(() => cards.forEach(card => observer.observe(card))));
})();
