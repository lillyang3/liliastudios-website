(() => {
  // Testimonial logos come in different shapes. Give each the same visual size:
  // wide logos sit a little shorter, squarer ones a little taller, all scaled to their flower.
  const logos = [...document.querySelectorAll('.testimonial-logos img')];
  if (!logos.length) return;
  const size = img => {
    if (!img.naturalWidth || !img.naturalHeight) return;
    const aspect = img.naturalWidth / img.naturalHeight;
    const base = img.closest('.testimonial').clientWidth * .1;
    const height = Math.min(base * Math.sqrt(2.2 / aspect), base * 1.55);
    img.style.height = `${height.toFixed(1)}px`;
    img.style.width = 'auto';
    img.style.maxWidth = 'none';
  };
  logos.forEach(img => (img.complete ? size(img) : img.addEventListener('load', () => size(img), { once: true })));
  let width = innerWidth;
  addEventListener('resize', () => {
    if (innerWidth === width) return;
    width = innerWidth;
    logos.forEach(size);
  });
})();
