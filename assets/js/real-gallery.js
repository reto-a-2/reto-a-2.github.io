/* Visor accesible de fotografías reales: teclado, miniaturas y gesto táctil. */
(() => {
  const dialog = document.querySelector('[data-real-gallery]');
  const trigger = document.querySelector('[data-open-real-gallery]');
  if (!dialog || !trigger) return;
  const photos = [{"src":"assets/images/real/foto-real-01.webp","thumb":"assets/images/real/miniaturas/foto-real-01.webp","caption":"Portada real de Duelo de Animales sobre la mesa","width":2000,"height":1126},{"src":"assets/images/real/foto-real-02.webp","thumb":"assets/images/real/miniaturas/foto-real-02.webp","caption":"Portada de Duelo de Animales vista desde arriba","width":1126,"height":2000},{"src":"assets/images/real/foto-real-03.webp","thumb":"assets/images/real/miniaturas/foto-real-03.webp","caption":"Libro abierto con la barrera central y las partidas marcadas","width":1126,"height":2000},{"src":"assets/images/real/foto-real-04.webp","thumb":"assets/images/real/miniaturas/foto-real-04.webp","caption":"Dos tableros enfrentados y marcados con rotuladores","width":2000,"height":1126},{"src":"assets/images/real/foto-real-05.webp","thumb":"assets/images/real/miniaturas/foto-real-05.webp","caption":"Vista lateral de los tableros separados por la barrera","width":2000,"height":1126},{"src":"assets/images/real/foto-real-06.webp","thumb":"assets/images/real/miniaturas/foto-real-06.webp","caption":"Detalle real de las páginas y las palabras resaltadas","width":1126,"height":2000},{"src":"assets/images/real/foto-real-07.webp","thumb":"assets/images/real/miniaturas/foto-real-07.webp","caption":"El reto de Animales de Oceanía con la barrera levantada","width":1126,"height":2000},{"src":"assets/images/real/foto-real-08.webp","thumb":"assets/images/real/miniaturas/foto-real-08.webp","caption":"La barrera central vista desde un lado del libro","width":1126,"height":2000},{"src":"assets/images/real/foto-real-09.webp","thumb":"assets/images/real/miniaturas/foto-real-09.webp","caption":"Portada real de Duelo de Animales y dos subrayadores","width":1126,"height":2000},{"src":"assets/images/real/foto-real-10.webp","thumb":"assets/images/real/miniaturas/foto-real-10.webp","caption":"Detalle del juego en un libro abierto","width":1126,"height":2000},{"src":"assets/images/real/foto-real-11.webp","thumb":"assets/images/real/miniaturas/foto-real-11.webp","caption":"Partida marcada en la sopa de letras de Animales de América","width":1126,"height":2000},{"src":"assets/images/real/foto-real-12.webp","thumb":"assets/images/real/miniaturas/foto-real-12.webp","caption":"Tableros y rotulador junto a la barrera central","width":1126,"height":2000},{"src":"assets/images/real/foto-real-13.webp","thumb":"assets/images/real/miniaturas/foto-real-13.webp","caption":"El libro real visto desde el extremo de la mesa","width":1126,"height":2000},{"src":"assets/images/real/foto-real-14.webp","thumb":"assets/images/real/miniaturas/foto-real-14.webp","caption":"Interior del libro y reto de Animales de América","width":1126,"height":2000},{"src":"assets/images/real/foto-real-15.webp","thumb":"assets/images/real/miniaturas/foto-real-15.webp","caption":"Partida real con palabras subrayadas en dos colores","width":1126,"height":2000}];
  const full = dialog.querySelector('[data-real-gallery-image]');
  const caption = dialog.querySelector('[data-real-gallery-caption]');
  const counter = dialog.querySelector('[data-real-gallery-counter]');
  const thumbnails = dialog.querySelector('[data-real-gallery-thumbs]');
  const close = dialog.querySelector('[data-real-gallery-close]');
  const assetPrefix = dialog.getAttribute('data-real-gallery-prefix') || '';
  let returnScrollX = 0;
  let returnScrollY = 0;
  const previous = dialog.querySelector('[data-real-gallery-prev]');
  const next = dialog.querySelector('[data-real-gallery-next]');
  let current = 0;
  let touchStartX = 0;
  const buttons = photos.map((photo, index) => {
    const button = document.createElement('button');
    button.className = 'real-gallery-thumb';
    button.type = 'button';
    button.setAttribute('aria-label', `Ver foto ${index + 1}: ${photo.caption}`);
    button.setAttribute('aria-pressed', 'false');
    const image = document.createElement('img');
    image.src = assetPrefix + photo.thumb;
    image.alt = '';
    image.loading = 'lazy';
    button.append(image);
    button.addEventListener('click', () => selectPhoto(index));
    thumbnails.append(button);
    return button;
  });
  const selectPhoto = (index) => {
    current = (index + photos.length) % photos.length;
    const photo = photos[current];
    full.src = assetPrefix + photo.src;
    full.width = photo.width;
    full.height = photo.height;
    full.alt = photo.caption;
    caption.textContent = photo.caption;
    counter.textContent = `${current + 1} de ${photos.length}`;
    buttons.forEach((btn, i) => btn.setAttribute('aria-pressed', String(i === current)));
    buttons[current].scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
  };
  trigger.addEventListener('click', () => {
    returnScrollX = window.scrollX;
    returnScrollY = window.scrollY;
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
      selectPhoto(0);
      close.focus({ preventScroll: true });
    } else {
      // Navegadores antiguos: mostrar el visor sin abandonar la ficha.
      dialog.setAttribute('open', '');
      selectPhoto(0);
      close.focus({ preventScroll: true });
    }
  });
  close.addEventListener('click', () => { if (typeof dialog.close === 'function') dialog.close(); else { dialog.removeAttribute('open'); trigger.focus({ preventScroll: true }); } });
  // Al cerrar, conservar la ficha, el punto de lectura y el foco en el botón de origen.
  dialog.addEventListener('close', () => {
    trigger.focus({ preventScroll: true });
    if (Math.abs(window.scrollY - returnScrollY) > 1 || Math.abs(window.scrollX - returnScrollX) > 1) {
      window.scrollTo(returnScrollX, returnScrollY);
    }
  });
  previous.addEventListener('click', () => selectPhoto(current - 1));
  next.addEventListener('click', () => selectPhoto(current + 1));
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); selectPhoto(current - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); selectPhoto(current + 1); }
  });
  full.addEventListener('touchstart', (event) => { touchStartX = event.changedTouches[0]?.screenX || 0; }, {passive:true});
  full.addEventListener('touchend', (event) => {
    const diff = (event.changedTouches[0]?.screenX || 0) - touchStartX;
    if (Math.abs(diff) > 55) selectPhoto(current + (diff < 0 ? 1 : -1));
  }, {passive:true});
})();
