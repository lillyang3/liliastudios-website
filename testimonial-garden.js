(() => {
  // Services testimonials: four flowers float on a blue field, each carrying a client's logo.
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
  const homes = [[16, 30], [84, 28], [20, 74], [80, 72]];
  const garden = document.createElement('div');
  garden.className = 'garden';
  garden.innerHTML = `
    <div class="garden-field">
      <div class="garden-dock" aria-hidden="true"><span>Drag a flower here</span></div>
      ${Array.from({ length: 12 }, (_, i) => `<span class="garden-petal" style="--x:${[6,24,31,40,58,66,74,93,47,36,63,96][i]}%;--y:${[50,10,88,18,86,12,90,50,8,60,58,12][i]}%;--s:${[.5,.35,.45,.3,.4,.3,.5,.45,.25,.3,.28,.32][i]};--d:${i * -1.3}s"></span>`).join('')}
      ${items.map((item, index) => `
        <button class="garden-flower" type="button" style="--x:${homes[index][0]}%;--y:${homes[index][1]}%;--d:${index * -1.7}s"
          aria-label="Read what ${item.name} said">
          <span class="garden-bloom"><img src="${item.logo?.getAttribute('src') || ''}" alt=""></span>
        </button>`).join('')}
    </div>
    <div class="garden-note" aria-live="polite"></div>
    <p class="garden-hint">Drag another flower into the middle, or tap one, to read the next review.</p>`;
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
      <p class="garden-who"><strong>${item.name}</strong>${item.linkedin ? ` <a href="${item.linkedin}" target="_blank" rel="noreferrer">LinkedIn &#8599;</a>` : ''}<br><span>${item.role}</span></p>`;
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

  flowers.forEach((flower, index) => {
    let start = null;
    flower.addEventListener('pointerdown', event => {
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
      flower.style.translate = '';
      if (!moved) { dock(index); return; }
      const box = field.getBoundingClientRect();
      const near = Math.hypot(event.clientX - (box.left + box.width / 2), event.clientY - (box.top + box.height / 2)) < Math.min(box.width, box.height) * .32;
      if (near) dock(index);
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
