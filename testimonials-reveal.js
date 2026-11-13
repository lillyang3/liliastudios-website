(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  const cards = [...document.querySelectorAll('.testimonial')];
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const card = entry.target;
      card.classList.add('has-bloomed');
      setTimeout(() => card.classList.add('bloom-finished'), 850);
      observer.unobserve(card);
    });
  }, { threshold: .25 });
  cards.forEach(card => {
    card.classList.add('bloom-ready');
    // Let the initial small flower render before observing its entrance.
    requestAnimationFrame(() => requestAnimationFrame(() => observer.observe(card)));
  });
})();