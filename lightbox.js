(() => {
  // Click a photo to see it full size. Arrows (or swipe) move between photos, Esc or the × closes.
  const images = [...document.querySelectorAll('[data-lightbox] img')];
  if (!images.length || typeof HTMLDialogElement === 'undefined') return;
  const box = document.createElement('dialog');
  box.className = 'lightbox';
  box.setAttribute('aria-label', 'Photo viewer');
  box.innerHTML = '<button class="lightbox-close" type="button" aria-label="Close">&times;</button>'
    + '<button class="lightbox-prev" type="button" aria-label="Previous photo">&larr;</button>'
    + '<div class="lightbox-stage"><img alt=""></div>'
    + '<button class="lightbox-next" type="button" aria-label="Next photo">&rarr;</button>'
    + '<p class="lightbox-count" aria-live="polite"></p>';
  document.body.append(box);
  const stage = box.querySelector('.lightbox-stage');
  const view = stage.querySelector('img');
  const count = box.querySelector('.lightbox-count');
  let index = 0;
  const show = next => {
    index = (next + images.length) % images.length;
    const source = images[index];
    view.src = source.currentSrc || source.src;
    view.alt = source.alt;
    // Very tall images (like the full portrait series) open at full width so you can scroll through them.
    stage.classList.toggle('is-tall', source.naturalHeight / source.naturalWidth > 1.6);
    stage.scrollTop = 0;
    count.textContent = `${index + 1} / ${images.length}`;
  };
  const open = image => {
    show(images.indexOf(image));
    box.showModal();
    document.documentElement.classList.add('lightbox-open');
    window.siteLenis?.stop();
  };
  box.addEventListener('close', () => {
    document.documentElement.classList.remove('lightbox-open');
    window.siteLenis?.start();
  });
  images.forEach(image => {
    image.tabIndex = 0;
    image.setAttribute('role', 'button');
    image.setAttribute('aria-label', `View full size: ${image.alt}`);
    image.addEventListener('click', event => { event.stopPropagation(); open(image); });
    image.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(image); }
    });
  });
  // In a slide stack the stack itself takes the clicks: open the slide on top instead of flipping to the next one.
  document.querySelectorAll('.post-stack[data-lightbox]').forEach(stack => {
    stack.addEventListener('click', event => {
      const top = stack.querySelector('img.is-top') || stack.querySelector('img');
      event.stopImmediatePropagation();
      open(top);
    }, true);
  });
  box.querySelector('.lightbox-close').addEventListener('click', () => box.close());
  box.querySelector('.lightbox-prev').addEventListener('click', () => show(index - 1));
  box.querySelector('.lightbox-next').addEventListener('click', () => show(index + 1));
  box.addEventListener('click', event => { if (event.target === box) box.close(); });
  box.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight') show(index + 1);
    if (event.key === 'ArrowLeft') show(index - 1);
  });
  let startX = null;
  stage.addEventListener('pointerdown', event => { startX = event.clientX; });
  stage.addEventListener('pointerup', event => {
    if (startX === null) return;
    const moved = event.clientX - startX;
    startX = null;
    if (Math.abs(moved) > 50) show(index + (moved < 0 ? 1 : -1));
  });
})();
