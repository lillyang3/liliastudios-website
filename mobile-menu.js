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
  // Numbered list; the page you're on gets a small flower.
  [...links.querySelectorAll('a')].forEach((link, index) => {
    const number = document.createElement('span');
    number.className = 'mobile-menu-num';
    number.setAttribute('aria-hidden', 'true');
    number.textContent = String(index + 1).padStart(2, '0');
    link.prepend(number);
  });
  [...links.children].forEach((item, index) => item.style.setProperty('--i', index));
  const logo = document.createElement('a');
  logo.className = 'mobile-menu-logo';
  logo.href = 'index.html';
  logo.setAttribute('aria-label', 'Lilia home');
  logo.innerHTML = '<img src="assets/logo.svg" alt="">';
  const foot = document.createElement('div');
  foot.className = 'mobile-menu-foot';
  foot.innerHTML = '<a class="mobile-menu-call" href="https://tidycal.com/liliastudios/15-minute-meeting" target="_blank" rel="noopener">Book a free 15&#8209;minute call</a>'
    + '<p><a href="mailto:hello@liliastudios.com">hello@liliastudios.com</a>'
    + '<span><a href="https://www.instagram.com/liliyayayaya23/" target="_blank" rel="noreferrer">Instagram</a> · '
    + '<a href="https://www.linkedin.com/in/lilia-angelicheva-b48373205/" target="_blank" rel="noreferrer">LinkedIn</a></span></p>';
  foot.style.setProperty('--i', links.children.length);
  dialog.append(logo, close, links, foot);
  close.autofocus = true;
  // Keep the menu's logo exactly where (and as big as) the header logo is, so nothing jumps.
  const headerLogo = header.querySelector('.brand img');
  const placeLogo = () => {
    if (!headerLogo) return;
    const box = headerLogo.getBoundingClientRect();
    logo.style.left = `${box.left}px`;
    logo.style.top = `${box.top}px`;
    logo.firstChild.style.width = `${box.width}px`;
    logo.firstChild.style.height = `${box.height}px`;
  };
  document.body.append(dialog);
  header.append(toggle);
  header.classList.add('mobile-menu-enabled');
  let previousOverflow;
  let closing = null;
  const open = () => {
    clearTimeout(closing);
    closing = null;
    previousOverflow = document.body.style.overflow;
    placeLogo();
    if (!dialog.open) dialog.showModal();
    close.focus({ preventScroll: true });
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
