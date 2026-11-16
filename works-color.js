(() => {
  // Works: photos start black and white and bloom into colour while they cross the middle band of the screen.
  const photos = [...document.querySelectorAll('.works-card-photo')];
  if (!photos.length) return;
  document.documentElement.classList.add('works-color-scroll');
  let queued = false;
  const update = () => {
    queued = false;
    const height = window.innerHeight;
    photos.forEach(photo => {
      const box = photo.getBoundingClientRect();
      photo.classList.toggle('in-color', box.top < height * .62 && box.bottom > height * .38);
    });
  };
  const schedule = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  document.addEventListener('click', () => setTimeout(schedule, 50));
  update();
})();
