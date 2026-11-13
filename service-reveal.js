(() => {
  // "What I do": one continuous line winds from flower to flower through the empty space beside each service,
  // so it never runs under the text. It is drawn from the real layout, and draws itself in as you scroll.
  const journey = document.querySelector('.service-journey');
  const svg = journey?.querySelector('.service-thread');
  const path = svg?.querySelector('path');
  if (!path) return;
  const items = [...journey.querySelectorAll('.offer-list li')];
  const animate = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  let length = 0;
  let thresholds = [];
  let stops = [];

  // Smooth curve through a list of points (centripetal Catmull-Rom, so it never loops or kinks), as SVG cubic curves.
  const curve = points => {
    const gap = (a, b) => Math.sqrt(Math.hypot(b.x - a.x, b.y - a.y));
    let d = `M${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i - 1] || points[i], p1 = points[i], p2 = points[i + 1], p3 = points[i + 2] || p2;
      const d1 = gap(p0, p1), d2 = gap(p1, p2), d3 = gap(p2, p3);
      const c1 = d1 < 1e-6 ? p1 : {
        x: (d1 * d1 * p2.x - d2 * d2 * p0.x + (2 * d1 * d1 + 3 * d1 * d2 + d2 * d2) * p1.x) / (3 * d1 * (d1 + d2)),
        y: (d1 * d1 * p2.y - d2 * d2 * p0.y + (2 * d1 * d1 + 3 * d1 * d2 + d2 * d2) * p1.y) / (3 * d1 * (d1 + d2))
      };
      const c2 = d3 < 1e-6 ? p2 : {
        x: (d3 * d3 * p1.x - d2 * d2 * p3.x + (2 * d3 * d3 + 3 * d3 * d2 + d2 * d2) * p2.x) / (3 * d3 * (d3 + d2)),
        y: (d3 * d3 * p1.y - d2 * d2 * p3.y + (2 * d3 * d3 + 3 * d3 * d2 + d2 * d2) * p2.y) / (3 * d3 * (d3 + d2))
      };
      d += ` C${c1.x.toFixed(1)} ${c1.y.toFixed(1)} ${c2.x.toFixed(1)} ${c2.y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    return d;
  };

  const build = () => {
    const box = journey.getBoundingClientRect();
    const width = box.width, height = box.height;
    if (!width || !height) return;
    // Centre each flower on its title (both lines, when a title wraps).
    items.forEach(item => {
      const title = item.querySelector('h3');
      item.style.setProperty('--flower-y', `${(title.offsetTop + title.offsetHeight / 2).toFixed(1)}px`);
    });
    const parts = items.map((item, index) => {
      const flower = item.querySelector('img').getBoundingClientRect();
      const row = item.getBoundingClientRect();
      const x = flower.left + flower.width / 2 - box.left;
      // Odd items have their text on the right, so the line roams the left side (and the other way round).
      const side = index % 2 === 0 ? 0 : width;
      return {
        flower: { x, y: flower.top + flower.height / 2 - box.top },
        top: row.top - box.top,
        bottom: row.bottom - box.top,
        // How far the line swings out: rounder loops on wide screens, never past the edge on phones.
        out: t => x + Math.sign(side - x) * Math.min(Math.abs(side - x) * t, 300 * t)
      };
    });
    const first = parts[0], last = parts[parts.length - 1];
    // Drift in from above the first flower.
    const points = [{ x: first.out(.25), y: 0 }, { x: first.out(.05), y: first.flower.y * .55 }];
    const flowerIndex = [];
    parts.forEach((part, index) => {
      flowerIndex.push(points.length);
      points.push(part.flower);
      const height = part.bottom - part.top;
      // A soft S through the empty side, beside the description.
      points.push({ x: part.out(.62), y: part.top + height * .55 });
      points.push({ x: part.out(.4), y: part.bottom + 6 });
      const next = parts[index + 1];
      // Cross over in the gap between two services, where there's no text.
      if (next) points.push({ x: (part.flower.x + next.flower.x) / 2, y: (part.bottom + next.top) / 2 + 4 });
    });
    // Glide out towards the button below, fading away.
    points.push({ x: width / 2, y: height - 6 });
    svg.setAttribute('viewBox', `0 0 ${width.toFixed(1)} ${height.toFixed(1)}`);
    // Measure how far along the line each flower sits.
    thresholds = flowerIndex.map(index => {
      if (index === 0) return 0;
      path.setAttribute('d', curve(points.slice(0, index + 1)));
      return path.getTotalLength();
    });
    path.setAttribute('d', curve(points));
    length = path.getTotalLength();
    // Fade the line in at the top and out at the very end, so it has no hard start or stop.
    const ns = 'http://www.w3.org/2000/svg';
    let fade = svg.querySelector('#thread-fade');
    if (!fade) {
      const defs = document.createElementNS(ns, 'defs');
      fade = document.createElementNS(ns, 'linearGradient');
      fade.id = 'thread-fade';
      fade.setAttribute('gradientUnits', 'userSpaceOnUse');
      defs.append(fade);
      svg.prepend(defs);
    }
    fade.setAttribute('x1', 0); fade.setAttribute('x2', 0);
    fade.setAttribute('y1', 0); fade.setAttribute('y2', height);
    const stop = (offset, opacity) => `<stop offset="${Math.max(0, Math.min(1, offset)).toFixed(4)}" stop-color="currentColor" stop-opacity="${opacity}"/>`;
    fade.innerHTML = stop(0, 0) + stop(first.flower.y * .7 / height, 1) + stop((last.bottom + 6) / height, 1) + stop(1, 0);
    path.style.stroke = 'url(#thread-fade)';
    thresholds = thresholds.map(value => value / length);
    stops = [{ y: 0, value: 0 }, ...parts.map((part, index) => ({ y: part.flower.y / height, value: thresholds[index] })), { y: 1, value: 1 }];
    if (animate) path.style.strokeDasharray = `${length} ${length}`;
  };

  const update = () => {
    if (!animate || !length) return;
    const rect = journey.getBoundingClientRect();
    const viewport = document.documentElement.clientHeight;
    const distance = Math.max(0, Math.min(1, (viewport * .66 - rect.top) / rect.height));
    let progress = 1;
    for (let i = 1; i < stops.length; i++) {
      if (distance <= stops[i].y) {
        const a = stops[i - 1], b = stops[i];
        progress = a.value + Math.max(0, Math.min(1, (distance - a.y) / (b.y - a.y || 1))) * (b.value - a.value);
        break;
      }
    }
    path.style.strokeDashoffset = length * (1 - progress);
    items.forEach((item, index) => {
      const threshold = thresholds[index] ?? index / items.length;
      item.classList.toggle('flower-revealed', distance > 0 && progress >= threshold - .002);
      item.classList.toggle('text-revealed', distance > 0 && progress >= Math.min(1, threshold + .015));
    });
  };

  if (animate) journey.classList.add('scroll-journey');
  let queued = false;
  const schedule = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { update(); queued = false; });
  };
  // Rebuild only when the width really changes (not when a phone's toolbar slides in or out).
  let lastWidth = 0;
  const refresh = force => {
    const width = journey.getBoundingClientRect().width;
    if (!force && Math.abs(width - lastWidth) < 1) return;
    lastWidth = width;
    build();
    update();
  };
  window.addEventListener('scroll', schedule, { passive: true });
  new ResizeObserver(() => refresh(false)).observe(journey);
  document.fonts.ready.then(() => refresh(true));
  refresh(true);
})();
