/* Reto a Dos - navegacion de la seccion de resenas.
   El diseño y los puntos de ruptura se leen del CSS principal. */
(() => {
  'use strict';
  const header = document.querySelector('[data-header]');
  const menuButton = document.querySelector('[data-menu-button]');
  const nav = document.querySelector('[data-nav]');
  if (!header || !menuButton || !nav) return;
  // En las reseñas, la cabecera principal permanece siempre oscura sobre el papel.
  header.classList.add('is-scrolled');
  const close = () => {
    menuButton.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
  };
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('is-open', !open);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', close));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') close();
  });
  document.addEventListener('click', event => {
    if (!header.contains(event.target)) close();
  });
})();


/* Mientras la galería permanece fija, repetir de forma discreta la nota y
   el nombre que ya aparecen en el encabezado. Sin duplicarlos al entrar. */
(() => {
  'use strict';
  const photo = document.querySelector('.article-photo');
  const heading = document.querySelector('.article-heading');
  const author = heading?.querySelector('.article-heading__by');
  const rating = heading?.querySelector('.article-title-rating');
  const siteHeader = document.querySelector('.site-header');
  if (!photo || !author || !rating || !siteHeader) return;
  photo.dataset.stickyRating = rating.textContent.trim();
  photo.dataset.stickyAuthor = author.textContent.trim().replace(/\s+/g, ' ');
  let scheduled = false;
  const update = () => {
    scheduled = false;
    const desktop = window.matchMedia('(min-width: 691px) and (min-height: 791px)').matches;
    if (!desktop) {
      photo.classList.remove('article-photo--sticky-labelled');
      return;
    }
    const top = parseFloat(getComputedStyle(photo).top);
    const photoRect = photo.getBoundingClientRect();
    const authorRect = author.getBoundingClientRect();
    const headerRect = siteHeader.getBoundingClientRect();
    // Mostrar solo cuando la autoría original se ha escondido tras el menú
    // y la fotografía está retenida por su posición sticky.
    const isSticky = Number.isFinite(top) && Math.abs(photoRect.top - top) < 3;
    const textHasScrolled = authorRect.bottom <= headerRect.bottom;
    const roomForLabel = top >= 10.75 * 16;
    photo.classList.toggle('article-photo--sticky-labelled',
      isSticky && textHasScrolled && roomForLabel);
  };
  const schedule = () => {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(update);
    }
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  schedule();
})();
