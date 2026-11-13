(() => {
  // Always serve the site over a secure (https) connection.
  const host = location.hostname;
  if (location.protocol === 'http:' && host !== 'localhost' && !/^[\d.]+$/.test(host)) {
    location.replace('https://' + location.host + location.pathname + location.search + location.hash);
    return;
  }
  // Lock the screen height once, so a phone's toolbars sliding in and out while scrolling
  // don't keep resizing the page. Only a real width change (like turning the phone) updates it.
  const root = document.documentElement;
  let width = 0;
  const lock = () => {
    if (window.innerWidth === width) return;
    width = window.innerWidth;
    root.style.setProperty('--screen-h', `${window.innerHeight}px`);
  };
  lock();
  addEventListener('resize', lock);
  addEventListener('orientationchange', () => { width = 0; setTimeout(lock, 250); });
})();
