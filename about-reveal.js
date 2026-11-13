(() => {
  // About page entrances, in the spirit of the home page: the flower blooms, blue blocks wipe in, text rises into place.
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  const groups = [
    ['.about-tag, .about-hero h1, .about-lead', 'rise'],
    ['.about-flower', 'bloom'],
    ['.about-photo', 'wipe'],
    ['.about-story-text p', 'rise'],
    ['.about-stack', 'rise'],
    ['.about-cards-intro .section-title', 'rise'],
    ['.about-card', 'rise'],
    ['.about-card-photo', 'wipe'],
    ['.about-contact h2, .about-contact > p', 'rise'],
    ['.about-contact-list li', 'pop'],
    ['.about-contact .call-button', 'rise']
  ];
  const items = [];
  groups.forEach(([selector, kind]) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      element.classList.add('about-reveal', 'about-reveal--' + kind);
      element.style.setProperty('--reveal-delay', index * 110 + 'ms');
      items.push(element);
    });
  });
  // A wiped block is fully clipped at the start, so watch its parent box instead of the block itself.
  const watched = new Map();
  items.forEach(item => {
    const target = item.classList.contains('about-reveal--wipe') ? item.parentElement : item;
    if (!watched.has(target)) watched.set(target, []);
    watched.get(target).push(item);
  });
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      watched.get(entry.target).forEach(item => item.classList.add('is-revealed'));
      observer.unobserve(entry.target);
    });
  }, { threshold: .15 });
  // Let the hidden starting state render before watching for entrances.
  requestAnimationFrame(() => requestAnimationFrame(() => watched.forEach((_, target) => observer.observe(target))));
})();
