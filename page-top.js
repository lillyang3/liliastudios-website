(() => {
  // Every page opens at its top (e.g. after "Next project" on a phone), unless the link points to a spot on the page (#...).
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (location.hash) {
    // A link to a spot on the page (like about.html#contacts): go to that spot once the page has laid out.
    const goToSpot = () => {
      const spot = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (spot) spot.scrollIntoView({ block: 'start', behavior: 'instant' });
    };
    if (document.readyState === 'complete') goToSpot(); else addEventListener('load', goToSpot);
    return;
  }
  const toTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    // When the site is shown inside another page (like the preview link), bring the top of the site into view there too.
    try { document.body.scrollIntoView({ block: 'start', behavior: 'instant' }); } catch (error) { /* older browsers */ }
  };
  toTop();
  addEventListener('pageshow', toTop);
})();
