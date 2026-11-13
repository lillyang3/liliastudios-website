(() => {
  const header = document.querySelector('.site-header');
  const navigation = header?.querySelector('nav');
  if (!navigation || typeof HTMLDialogElement === 'undefined') return;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'mobile-menu-toggle';
  toggle.textContent = '☰';
  toggle.setAttribute('aria-label', 'Open menu');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', 'mobile-navigation');
  toggle.setAttribute('aria-haspopup', 'dialog');
  const dialog = document.createElement('dialog');
  dialog.id = 'mobile-navigation';
  dialog.className = 'mobile-navigation';
  dialog.setAttribute('aria-label', 'Navigation');
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'mobile-menu-close';
  close.textContent = 'close ×';
  const links = navigation.cloneNode(true);
  links.setAttribute('aria-label', 'Mobile navigation');
  // A small flower between each link.
  [...links.querySelectorAll('a')].slice(1).forEach(link => {
    const flower = document.createElement('img');
    flower.src = 'assets/flower.svg';
    flower.alt = '';
    flower.className = 'mobile-menu-flower';
    link.before(flower);
  });
  // Links and flowers float in one after another.
  [...links.children].forEach((item, index) => item.style.setProperty('--i', index));
  dialog.append(close, links);
  document.body.append(dialog);
  header.append(toggle);
  header.classList.add('mobile-menu-enabled');
  let previousOverflow;
  let closing = null;
  const open = () => {
    clearTimeout(closing);
    closing = null;
    previousOverflow = document.body.style.overflow;
    if (!dialog.open) dialog.showModal();
    document.body.style.overflow = 'hidden';
    toggle.setAttribute('aria-expanded', 'true');
    requestAnimationFrame(() => requestAnimationFrame(() => dialog.classList.add('is-open')));
  };
  // Fade the menu out first, then close it.
  const shut = () => {
    if (!dialog.open || closing) return;
    dialog.classList.remove('is-open');
    closing = setTimeout(() => { closing = null; dialog.close(); }, reduceMotion.matches ? 0 : 280);
  };
  toggle.addEventListener('click', open);
  close.addEventListener('click', shut);
  dialog.addEventListener('cancel', event => { event.preventDefault(); shut(); });
  links.addEventListener('click', event => {
    if (event.target.closest('a')) dialog.close();
  });
  dialog.addEventListener('close', () => {
    dialog.classList.remove('is-open');
    document.body.style.overflow = previousOverflow || '';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.focus({ preventScroll: true });
  });
  matchMedia('(max-width: 760px)').addEventListener('change', event => {
    if (!event.matches && dialog.open) dialog.close();
  });
})();
