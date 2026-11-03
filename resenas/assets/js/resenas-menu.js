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
