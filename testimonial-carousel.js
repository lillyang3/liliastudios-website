(() => {
  // Services page on phones: testimonials sit in a row you swipe through, one flower at a time, with arrows and a counter.
  const grid = document.querySelector('.services-page .testimonials-grid');
  if (!grid) return;
  const cards = [...grid.children];
  const controls = document.createElement('div');
  controls.className = 'post-controls testimonial-controls';
  controls.innerHTML = '<button class="post-prev" type="button" aria-label="Previous testimonial">&larr;</button><span class="post-count" aria-live="polite"></span><button class="post-next" type="button" aria-label="Next testimonial">&rarr;</button>';
  grid.after(controls);
  const count = controls.querySelector('.post-count');
  const step = () => (cards[1] && cards[1].offsetLeft - cards[0].offsetLeft) || grid.clientWidth || 1;
  const current = () => Math.max(0, Math.min(cards.length - 1, Math.round(grid.scrollLeft / step())));
  const show = () => { count.textContent = `${current() + 1} / ${cards.length}`; };
  const go = index => grid.scrollTo({ left: Math.max(0, Math.min(cards.length - 1, index)) * step(), behavior: 'smooth' });
  controls.querySelector('.post-prev').addEventListener('click', () => go(current() - 1));
  controls.querySelector('.post-next').addEventListener('click', () => go(current() + 1));
  let queued = false;
  grid.addEventListener('scroll', () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { show(); queued = false; });
  }, { passive: true });
  show();
})();
