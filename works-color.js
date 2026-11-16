(() => {
  // Works: photos start black and white and bloom into colour as they scroll into the middle of the screen.
  const photos = [...document.querySelectorAll('.works-card-photo')];
  if (!photos.length || !('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('works-color-scroll');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.target.classList.toggle('in-color', entry.isIntersecting));
  }, { rootMargin: '-28% 0px -28% 0px', threshold: 0 });
  photos.forEach(photo => observer.observe(photo));
})();
