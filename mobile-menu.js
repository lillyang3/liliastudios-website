(() => {
  const header = document.querySelector('.site-header');
  const navigation = header?.querySelector('nav');
  if (!navigation || typeof HTMLDialogElement === 'undefined') return;
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
  dialog.append(close, links);
  document.body.append(dialog);
  header.append(toggle);
  header.classList.add('mobile-menu-enabled');
  let previousOverflow;
  toggle.addEventListener('click', () => {
    previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    toggle.setAttribute('aria-expanded', 'true');
  });
  close.addEventListener('click', () => dialog.close());
  links.addEventListener('click', event => {
    if (event.target.closest('a')) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.style.overflow = previousOverflow || '';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.focus();
  });
  matchMedia('(max-width: 760px)').addEventListener('change', event => {
    if (!event.matches && dialog.open) dialog.close();
  });
})();