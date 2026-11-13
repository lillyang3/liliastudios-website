(() => {
  // Show a service's text while its circle on the big 4 is hovered or focused; screens without hover tap to open and close.
  const services = [...document.querySelectorAll('.four-service')];
  if (!services.length) return;
  const canHover = matchMedia('(min-width: 761px) and (hover: hover)');
  const stage = services[0].parentElement;
  // The text list beside the 4 (wide screens): each item lights up with its circle, and hovering an item lights its circle.
  const items = [...document.querySelectorAll('.four-item')];
  const serviceFor = item => services.find(service => service.classList.contains('four-service--' + item.dataset.service));
  const show = service => {
    services.forEach(item => item.classList.toggle('is-active', item === service));
    items.forEach(item => item.classList.toggle('is-active', serviceFor(item) === service));
  };
  items.forEach(item => {
    item.addEventListener('mouseenter', () => showOnHover(serviceFor(item)));
    item.addEventListener('mouseleave', () => showOnHover(null));
  });
  const showOnHover = service => {
    if (!canHover.matches) return;
    stage.classList.add('has-interacted');
    show(service);
  };
  services.forEach(service => {
    const dot = service.querySelector('.four-dot');
    ['mouseenter', 'focus'].forEach(type => dot.addEventListener(type, () => showOnHover(service)));
    ['mouseleave', 'blur'].forEach(type => dot.addEventListener(type, () => showOnHover(null)));
    dot.addEventListener('click', () => {
      if (canHover.matches) return;
      stage.classList.add('has-interacted');
      show(service.classList.contains('is-active') ? null : service);
    });
  });
  // Tapping anywhere else closes the open circle.
  document.addEventListener('click', event => {
    if (!canHover.matches && !event.target.closest('.four-dot')) show(null);
  });
})();
