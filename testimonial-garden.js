(() => {
  // Services testimonials: one flower per client float on a blue field, each carrying a client's logo.
  // Drag one into the middle (or just tap it) and it blooms open to show what that client said.
  const section = document.querySelector('.services-page .testimonials-section');
  const grid = section?.querySelector('.testimonials-grid');
  if (!grid) return;
  const items = [...grid.querySelectorAll('.testimonial')].map(card => {
    const strong = card.querySelector('figcaption strong');
    const link = strong?.querySelector('a');
    return {
      quote: card.querySelector('blockquote p')?.textContent.trim() || '',
      name: strong ? [...strong.childNodes].filter(node => node.nodeType === 3).map(node => node.textContent).join('').trim() : '',
      role: card.querySelector('figcaption span')?.textContent.trim() || '',
      linkedin: link?.href || '',
      logo: card.querySelector('.testimonial-logos img')
    };
  });
  const homes = [[14, 26], [86, 24], [14, 76], [86, 74], [36, 82]];
  const garden = document.createElement('div');
  garden.className = 'garden';
  garden.innerHTML = `
    <p class="garden-hint garden-hint--top"><span aria-hidden="true">&#10047;</span> Play with the flowers: drag them anywhere, drop one in the middle to read the review.</p>
    <div class="garden-field">
      <span class="garden-demo" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V10m0-1.5a1.5 1.5 0 0 1 3 0V11m0-1a1.5 1.5 0 0 1 3 0v4.5c0 3.6-2.4 6.5-6 6.5-2.6 0-4.1-1.3-5.3-3.4L4.5 14a1.4 1.4 0 0 1 2.3-1.6L9 15" fill="#fff" stroke="#111" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round"/></svg><span>drag me</span></span>
      <div class="garden-dock" aria-hidden="true"><span>Drag a flower here</span></div>
      ${Array.from({ length: 12 }, (_, i) => `<span class="garden-petal" style="--x:${[6,24,31,40,58,66,74,93,47,36,63,96][i]}%;--y:${[50,10,88,18,86,12,90,50,8,60,58,12][i]}%;--s:${[.5,.35,.45,.3,.4,.3,.5,.45,.25,.3,.28,.32][i]};--d:${i * -1.3}s"></span>`).join('')}
      ${items.map((item, index) => `
        <button class="garden-flower" type="button" style="--x:${homes[index][0]}%;--y:${homes[index][1]}%;--d:${index * -1.7}s"
          aria-label="Read what ${item.name} said">
          <span class="garden-bloom"><img src="${item.logo?.getAttribute('src') || ''}" alt="" draggable="false"></span>
        </button>`).join('')}
    </div>
    <div class="garden-note" aria-live="polite"></div>
`;
  grid.after(garden);
  section.classList.add('has-garden');
  const field = garden.querySelector('.garden-field');
  const note = garden.querySelector('.garden-note');
  const flowers = [...garden.querySelectorAll('.garden-flower')];
  let docked = -1;

  const showQuote = index => {
    const item = items[index];
    note.innerHTML = `
      <p class="garden-label">What ${item.name.split(' ')[0]} says</p>
      <blockquote class="garden-quote"><p>${item.quote}</p></blockquote>
      <p class="garden-who"><strong>${item.name}</strong>${item.linkedin ? ` <a href="${item.linkedin}" target="_blank" rel="noreferrer">${item.linkedin.includes('instagram.com') ? 'Instagram' : 'LinkedIn'} &#8599;</a>` : ''}<br><span>${item.role}</span></p>`;
    note.classList.remove('is-fresh');
    void note.offsetWidth;
    note.classList.add('is-fresh');
  };
  const dock = index => {
    flowers.forEach((flower, i) => {
      flower.classList.toggle('is-docked', i === index);
      flower.setAttribute('aria-pressed', String(i === index));
    });
    docked = index;
    garden.classList.add('has-docked');
    showQuote(index);
  };

  // Until someone touches the garden, one flower shows how it works.
  const demoFlower = flowers[4] || flowers[1];
  const demo = garden.querySelector('.garden-demo');
  if (demoFlower && demo) {
    demo.style.left = demoFlower.style.getPropertyValue('--x');
    demo.style.top = demoFlower.style.getPropertyValue('--y');
    demoFlower.classList.add('is-demo');
    garden.classList.add('show-demo');
  }
  const stopDemo = () => {
    garden.classList.remove('show-demo');
    demoFlower?.classList.remove('is-demo');
  };
  field.addEventListener('pointerdown', stopDemo, { once: true });
  field.addEventListener('keydown', stopDemo, { once: true });

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  flowers.forEach((flower, index) => {
    let start = null;
    flower.addEventListener('dragstart', event => event.preventDefault());
    flower.addEventListener('pointerdown', event => {
      event.preventDefault();
      start = { x: event.clientX, y: event.clientY, moved: false };
      flower.setPointerCapture(event.pointerId);
      flower.classList.add('is-dragging');
    });
    flower.addEventListener('pointermove', event => {
      if (!start) return;
      const dx = event.clientX - start.x, dy = event.clientY - start.y;
      if (Math.hypot(dx, dy) > 6) start.moved = true;
      flower.style.translate = `${dx}px ${dy}px`;
    });
    const release = event => {
      if (!start) return;
      const moved = start.moved;
      start = null;
      flower.classList.remove('is-dragging');
      if (!moved) { flower.style.translate = ''; dock(index); return; }
      const box = field.getBoundingClientRect();
      const near = Math.hypot(event.clientX - (box.left + box.width / 2), event.clientY - (box.top + box.height / 2)) < Math.min(box.width, box.height) * .28;
      if (near) { flower.style.translate = ''; dock(index); return; }
      // Leave it where it was dropped.
      const x = clamp((event.clientX - box.left) / box.width * 100, 7, 93);
      const y = clamp((event.clientY - box.top) / box.height * 100, 12, 88);
      flower.classList.add('is-placing');
      flower.style.setProperty('--x', `${x}%`);
      flower.style.setProperty('--y', `${y}%`);
      if (flower.classList.contains('is-docked')) {
        flower.classList.remove('is-docked');
        flower.setAttribute('aria-pressed', 'false');
        docked = -1;
        garden.classList.remove('has-docked');
      }
      flower.style.translate = '';
      requestAnimationFrame(() => requestAnimationFrame(() => flower.classList.remove('is-placing')));
    };
    flower.addEventListener('pointerup', release);
    flower.addEventListener('pointercancel', () => { start = null; flower.classList.remove('is-dragging'); flower.style.translate = ''; });
    flower.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); dock(index); }
    });
  });
  // Open with the first review already in the middle, so it's clear where the words appear.
  dock(0);
})();
