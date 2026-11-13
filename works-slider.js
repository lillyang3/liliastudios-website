(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const pixelsPerSecond = 30;
  document.querySelectorAll('.works-slider').forEach(slider => {
    const track = slider.querySelector('.works-track');
    const group = track.firstElementChild;
    const groupWidth = group.getBoundingClientRect().width;
    // The track holds two identical sets, each wider than the screen, so sliding by half loops seamlessly.
    const groupsPerSet = Math.ceil(Math.max(screen.width, window.innerWidth) / groupWidth) + 1;
    for (let i = 1; i < groupsPerSet * 2; i++) {
      const copy = group.cloneNode(true);
      copy.setAttribute('aria-hidden', 'true');
      copy.querySelectorAll('a').forEach(link => { link.tabIndex = -1; });
      track.append(copy);
    }
    track.style.setProperty('--works-duration', `${groupWidth * groupsPerSet / pixelsPerSecond}s`);
    slider.classList.add('is-moving');
  });
})();
