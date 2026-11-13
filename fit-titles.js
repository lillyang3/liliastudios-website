(() => {
  // Keep the "what I do" titles on one line: if any would run past the section edge,
  // shrink all of them to the size the longest needs, so they stay matching.
  const journey = document.querySelector('.service-journey');
  if (!journey) return;
  const titles = [...journey.querySelectorAll('.offer-list h3')];
  const fit = () => {
    titles.forEach(title => { title.style.fontSize = ''; });
    const right = journey.getBoundingClientRect().right;
    const sizes = titles.map(title => {
      const available = right - title.getBoundingClientRect().left - 4;
      const size = parseFloat(getComputedStyle(title).fontSize);
      return title.scrollWidth > available ? size * available / title.scrollWidth : size;
    });
    const smallest = Math.floor(Math.min(...sizes) * 10) / 10;
    if (titles.some(title => parseFloat(getComputedStyle(title).fontSize) > smallest)) {
      titles.forEach(title => { title.style.fontSize = `${smallest}px`; });
    }
  };
  window.addEventListener('resize', fit);
  document.fonts.ready.then(fit);
  fit();
})();
