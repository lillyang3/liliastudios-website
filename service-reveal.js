(() => {
  const journey = document.querySelector('.service-journey');
  const path = journey?.querySelector('.service-thread path');
  if (!path || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const items = [...journey.querySelectorAll('.offer-list li')];
  const length = path.getTotalLength();
  path.style.strokeDasharray = `${length} ${length}`;
  path.style.strokeDashoffset = length;
  let thresholds = [];
  const measure = () => {
    const svg = path.ownerSVGElement;
    const matrix = svg.getScreenCTM();
    if (!matrix) return;
    thresholds = items.map(item => {
      const box = item.querySelector('img').getBoundingClientRect();
      const x = box.left + box.width / 2;
      const y = box.top + box.height / 2;
      let best = Infinity, position = 0;
      for (let i = 0; i <= 800; i++) {
        const point = path.getPointAtLength(length * i / 800);
        const screen = new DOMPoint(point.x, point.y).matrixTransform(matrix);
        const distance = (screen.x - x) ** 2 + (screen.y - y) ** 2;
        if (distance < best) { best = distance; position = i / 800; }
      }
      return position;
    });
  };
  const update = () => {
    const rect = journey.getBoundingClientRect();
    // Map scroll distance to marker positions, rather than uneven path length.
    const viewport = document.documentElement.clientHeight;
    const distance = Math.max(0, Math.min(1, (viewport * .66 - rect.top) / rect.height));
    const stops = [{ y: 0, value: 0 }, ...items.map((item, index) => ({
      y: item.offsetTop / rect.height,
      value: thresholds[index] ?? index / items.length
    })), { y: 1, value: 1 }];
    let progress = 1;
    for (let i = 1; i < stops.length; i++) {
      if (distance <= stops[i].y) {
        const a = stops[i - 1], b = stops[i];
        const fraction = Math.max(0, Math.min(1, (distance - a.y) / (b.y - a.y || 1)));
        progress = a.value + fraction * (b.value - a.value);
        break;
      }
    }
    path.style.strokeDashoffset = length * (1 - progress);
    items.forEach((item, index) => {
      const threshold = thresholds[index] ?? index / items.length;
      item.classList.toggle('flower-revealed', progress > 0 && progress >= threshold);
      item.classList.toggle('text-revealed', progress > 0 && progress >= Math.min(1, threshold + .015));
    });
  };
  journey.classList.add('scroll-journey');
  let queued = false;
  const schedule = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { update(); queued = false; });
  };
  const refresh = () => { measure(); update(); };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', refresh);
  new ResizeObserver(refresh).observe(journey);
  document.fonts.ready.then(refresh);
  refresh();
})();