(() => {
  // Client logos drift by on their own, and you can also swipe or drag them. They pause while you touch them.
  const slider = document.querySelector('.logo-slider');
  const track = slider?.querySelector('.logo-track');
  const group = track?.querySelector('.logo-group');
  if (!group) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  slider.classList.add('is-scrollable');
  const speed = 28; // pixels per second
  let groupWidth = group.getBoundingClientRect().width;
  let position = groupWidth;
  let pausedUntil = 0;
  let last = performance.now();
  const wrap = () => {
    if (slider.scrollLeft >= groupWidth * 1.5) slider.scrollLeft -= groupWidth;
    else if (slider.scrollLeft <= groupWidth * .25) slider.scrollLeft += groupWidth;
  };
  slider.scrollLeft = position;
  const pause = ms => { pausedUntil = performance.now() + ms; };
  ['pointerdown', 'touchstart', 'wheel'].forEach(type => slider.addEventListener(type, () => pause(2500), { passive: true }));
  slider.addEventListener('scroll', () => {
    if (Math.abs(slider.scrollLeft - position) > 2) { pause(2500); wrap(); position = slider.scrollLeft; }
  }, { passive: true });
  // Drag with a mouse on desktop.
  let dragX = null, dragStart = 0;
  slider.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse') return;
    dragX = event.clientX; dragStart = slider.scrollLeft; slider.classList.add('is-dragging');
  });
  addEventListener('pointermove', event => { if (dragX !== null) slider.scrollLeft = dragStart - (event.clientX - dragX); });
  addEventListener('pointerup', () => { dragX = null; slider.classList.remove('is-dragging'); });
  slider.addEventListener('click', event => { if (Math.abs(slider.scrollLeft - dragStart) > 6 && dragStart) event.preventDefault(); }, true);
  addEventListener('resize', () => { groupWidth = group.getBoundingClientRect().width; });
  const tick = now => {
    const dt = Math.min(64, now - last) / 1000;
    last = now;
    if (!reduce && now > pausedUntil && dragX === null) {
      position -= speed * dt;
      if (position <= groupWidth * .25) position += groupWidth;
      slider.scrollLeft = position;
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
})();
