(() => {
  // Works page: the All / Stays / Events / NGOs buttons show only matching project cards,
  // and cards rise into view as you scroll.
  const buttons = [...document.querySelectorAll('.works-filter')];
  const cards = [...document.querySelectorAll('.works-card')];
  if (!cards.length) return;

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      buttons.forEach(other => other.setAttribute('aria-pressed', String(other === button)));
      cards.forEach(card => {
        card.hidden = filter !== 'all' && card.dataset.category !== filter;
      });
    });
  });

  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-revealed');
      observer.unobserve(entry.target);
    });
  }, { threshold: .15 });
  cards.forEach((card, index) => {
    card.style.setProperty('--reveal-delay', (index % 3) * 90 + 'ms');
    card.classList.add('reveal-ready');
  });
  requestAnimationFrame(() => requestAnimationFrame(() => cards.forEach(card => observer.observe(card))));
})();
