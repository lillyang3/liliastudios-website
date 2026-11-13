(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Mouse and trackpad: soft, gliding scroll (Lenis). Phones keep their own native scrolling, which is already smooth.
  if (!reduce && window.Lenis && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    window.siteLenis = new Lenis({ lerp: 0.12, anchors: true, autoRaf: true });
  }
  // Everywhere: headings and blocks drift up softly as they come into view.
  if (reduce || !('IntersectionObserver' in window)) return;
  const selectors = [
    '#audience-title', '#services-heading', '#receipts-title', '#testimonials-title',
    '.closing-section > *', '.logo-section',
    '.services-content .section-title', '.services-text > p', '.services-steps li', '.services-four-section .four-side-hint',
    '.project-copy h2', '.project-rows li',
    '.footer-col'
  ];
  const items = [];
  document.querySelectorAll(selectors.join(',')).forEach(element => {
    if (element.closest('.about-main, .mobile-navigation')) return;
    // Siblings in the same group follow each other by a beat.
    const index = [...element.parentElement.children].filter(child => child.matches(selectors.join(','))).indexOf(element);
    element.style.setProperty('--sr-delay', `${Math.min(index, 6) * 70}ms`);
    element.classList.add('sr');
    items.push(element);
  });
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('sr-in');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: .12 });
  requestAnimationFrame(() => items.forEach(item => observer.observe(item)));
})();
