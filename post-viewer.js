(() => {
  // F Tourists carousels: "Post 1 / 2 / 3" buttons switch posts; each post is a stack of its slides,
  // the current slide on top and the next few peeking out behind. Click, the arrows, keys or a swipe move through it.
  const viewer = document.querySelector('.post-viewer');
  if (!viewer) return;
  const tabs = [...viewer.querySelectorAll('.post-tab')];
  const decks = [...viewer.querySelectorAll('.post-deck')];

  decks.forEach(deck => {
    const stack = deck.querySelector('.post-stack');
    if (!stack) return; // e.g. a deck holding an embedded video instead of slides
    const slides = [...stack.querySelectorAll('img')];
    const count = deck.querySelector('.post-count');
    let current = 0;
    const show = index => {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        const offset = (i - current + slides.length) % slides.length;
        // Slides further back than the peeking ones wait, hidden, just behind them (so they never stick out of the page).
        slide.style.setProperty('--offset', Math.min(offset, 4));
        slide.classList.toggle('is-top', offset === 0);
        slide.classList.toggle('is-peeking', offset > 0 && offset <= 3);
        if (offset <= 1) slide.loading = 'eager';
      });
      count.textContent = `${current + 1} / ${slides.length}`;
    };
    deck.querySelector('.post-next').addEventListener('click', () => show(current + 1));
    deck.querySelector('.post-prev').addEventListener('click', () => show(current - 1));
    stack.addEventListener('click', () => show(current + 1));
    stack.tabIndex = 0;
    stack.setAttribute('aria-label', 'Slides: click or use the arrow keys to go through them');
    stack.addEventListener('keydown', event => {
      if (event.key === 'ArrowRight') { event.preventDefault(); show(current + 1); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); show(current - 1); }
    });
    // Swipe on touch screens.
    let startX = null;
    stack.addEventListener('pointerdown', event => { startX = event.clientX; });
    stack.addEventListener('pointerup', event => {
      if (startX === null) return;
      const moved = event.clientX - startX;
      startX = null;
      if (Math.abs(moved) > 40) { show(current + (moved < 0 ? 1 : -1)); stack.dataset.swiped = '1'; }
    });
    stack.addEventListener('click', event => {
      if (stack.dataset.swiped) { delete stack.dataset.swiped; event.stopImmediatePropagation(); }
    }, true);
    show(0);
  });

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      tabs.forEach((other, i) => other.setAttribute('aria-selected', String(i === index)));
      decks.forEach((deck, i) => { deck.hidden = i !== index; });
    });
  });
})();
