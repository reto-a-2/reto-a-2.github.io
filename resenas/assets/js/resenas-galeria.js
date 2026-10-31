/* Galerías de fotografías de las reseñas. Funciona sin bibliotecas externas. */
(() => {
  'use strict';
  document.querySelectorAll('[data-article-gallery]').forEach(gallery => {
    const slides = Array.from(gallery.querySelectorAll('.article-gallery__slide'));
    if (slides.length < 2) return;
    const counter = gallery.querySelector('[data-gallery-count]');
    const previous = gallery.querySelector('[data-gallery-prev]');
    const next = gallery.querySelector('[data-gallery-next]');
    let current = 0;
    const show = index => {
      current = (index + slides.length) % slides.length;
      slides.forEach((image, i) => {image.hidden = i !== current;});
      if (counter) counter.textContent = `${current+1} de ${slides.length} fotografías`;
    };
    previous?.addEventListener('click', () => show(current-1));
    next?.addEventListener('click', () => show(current+1));
    gallery.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') {e.preventDefault();show(current-1);}
      if (e.key === 'ArrowRight') {e.preventDefault();show(current+1);}
    });
    show(0);
  });
})();
