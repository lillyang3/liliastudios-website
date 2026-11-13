(() => {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const cursor = document.createElement('img');
  cursor.src = 'assets/flower.svg';
  cursor.className = 'flower-cursor';
  cursor.alt = '';
  cursor.setAttribute('aria-hidden', 'true');
  document.body.append(cursor);
  document.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch') return;
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
    cursor.classList.add('is-visible');
    document.documentElement.classList.add('has-flower-cursor');
  }, { passive: true });
  const hide = () => {
    cursor.classList.remove('is-visible');
    document.documentElement.classList.remove('has-flower-cursor');
  };
  document.documentElement.addEventListener('pointerleave', hide);
  window.addEventListener('blur', hide);
})();