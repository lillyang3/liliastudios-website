(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const receipts = [...document.querySelectorAll('.paper-receipt')];
  receipts.forEach(receipt => {
    const area = document.createElement('div');
    area.className = 'receipt-hover-area';
    receipt.before(area);
    area.append(receipt);
    receipt.classList.add('receipt-folded');
    receipt.style.transition = 'none';
  });
  const update = () => {
    const height = document.documentElement.clientHeight;
    receipts.forEach(receipt => {
      const top = receipt.parentElement.getBoundingClientRect().top;
      const progress = Math.max(0, Math.min(1, (height * .55 - top) / (height * .48)));
      const paperHeight = receipt.getBoundingClientRect().height;
      const folded = Math.max(0, paperHeight - 96);
      receipt.style.clipPath = `inset(0px 0px ${folded * (1 - progress) - 12 * progress}px 0px)`;
      receipt.style.setProperty('--receipt-curl-top', `${68 + progress * Math.max(0, paperHeight - 88)}px`);
      receipt.style.setProperty('--receipt-progress', progress);
    });
  };
  let queued = false;
  window.addEventListener('scroll', () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { update(); queued = false; });
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
})();