(() => {
  const stack = document.querySelector('.results-stack');
  if (!stack) return;
  const cards = [...stack.querySelectorAll('.result-card')];
  const status = document.querySelector('.results-status');
  let current = 0;
  let busy = false;
  const arrange = () => {
    cards.forEach((card, index) => {
      card.hidden = false;
      const depth = (current - index + cards.length) % cards.length;
      card.style.zIndex = String(cards.length - depth);
      card.setAttribute('aria-hidden', String(index !== current));
    });
  };
  arrange();
  const advance = async () => {
    if (busy) return;
    busy = true;
    const nextIndex = (current + 1) % cards.length;
    const next = cards[nextIndex];
    const tilt = getComputedStyle(next).getPropertyValue('--card-angle').trim() || '11deg';
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const animation = next.animate([
        { transform: `translateY(0) rotate(${tilt})`, offset: 0, zIndex: '1' },
        { transform: `translateY(70%) rotate(${tilt})`, offset: .45, zIndex: '1' },
        { transform: `translateY(70%) rotate(${tilt})`, offset: .46, zIndex: '4' },
        { transform: `translateY(0) rotate(${tilt})`, offset: 1, zIndex: '4' }
      ], { duration: 850, easing: 'ease-in-out', fill: 'forwards' });
      await animation.finished;
      current = nextIndex;
      arrange();
      animation.cancel();
    } else {
      current = nextIndex;
      arrange();
    }
    status.textContent = `${current + 1} / ${cards.length} — click to see the next project`;
    busy = false;
  };
  let timer = setInterval(advance, 2000);
  stack.addEventListener('click', () => {
    clearInterval(timer);
    advance();
    timer = setInterval(advance, 2000);
  });
})();