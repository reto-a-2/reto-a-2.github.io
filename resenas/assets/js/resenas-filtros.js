/* Filtros y ordenación independientes de las reseñas de Nora Montalba. */
(() => {
  'use strict';
  const search = document.getElementById('review-search');
  const theme = document.getElementById('review-theme');
  const score = document.getElementById('review-score');
  const sort = document.getElementById('review-sort');
  const clear = document.getElementById('review-reset');
  const count = document.getElementById('review-count');
  const empty = document.getElementById('review-empty');
  const list = document.getElementById('review-list');
  const showImages = document.getElementById('review-show-images');
  if (!search || !theme || !score || !sort || !clear || !count || !empty || !list || !showImages) return;
  const cards = Array.from(list.querySelectorAll('.review-card'));
  const collator = new Intl.Collator('es', { sensitivity: 'base', ignorePunctuation: true });
  const normalized = (value) => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es').trim();
  const indexedText = new Map(cards.map(card => [card, normalized([card.querySelector('h3')?.textContent, card.querySelector('.review-card__author')?.textContent, card.querySelector('.review-card__category')?.textContent].join(' '))]));

  // Conservamos la precisión original. Una fecha «2026-10» representa solo
  // octubre y se coloca después de los días conocidos de ese mismo mes.
  const dateKey = (card) => {
    const value = card.dataset.date || '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return Number(value.replace(/-/g, ''));
    if (/^\d{4}-\d{2}$/.test(value)) return Number(value.replace(/-/g, '') + '00');
    return 0; // Fecha todavía desconocida, al final.
  };
  const rating = (card) => {
    if (card.dataset.ratingState !== 'scored') return null;
    const value = Number(card.dataset.score);
    return Number.isFinite(value) ? value : null;
  };
  const matchesRating = (card, choice) => {
    if (choice === 'all') return true;
    const state = card.dataset.ratingState;
    if (choice === 'unfinished' || choice === 'unrated') return state === choice;
    const value = rating(card);
    if (value === null) return false;
    if (choice === '9plus') return value >= 9;
    if (choice === '7to8') return value >= 7 && value < 9;
    if (choice === '4to6') return value >= 4 && value < 7;
    if (choice === '0to3') return value >= 0 && value < 4;
    return true;
  };
  const byDate = (a, b) => dateKey(b) - dateKey(a);
  const byTitle = (a, b) => collator.compare(a.dataset.sortTitle || '', b.dataset.sortTitle || '');
  const sorted = (a, b) => {
    const mode = sort.value;
    if (mode === 'author-asc') {
      return collator.compare(a.dataset.sortAuthor || '', b.dataset.sortAuthor || '') || byDate(a, b) || byTitle(a, b);
    }
    if (mode === 'title-asc') {
      return byTitle(a, b) || byDate(a, b);
    }
    if (mode === 'rating-desc' || mode === 'rating-asc') {
      const ar = rating(a), br = rating(b);
      // Toda nota numérica, incluso 1/10, precede a 'No puntuable'.
      // Las fichas sin nota aún no asignada aparecen después.
      const rank = (card) => card.dataset.ratingState === 'scored' ? 0 : card.dataset.ratingState === 'unfinished' ? 1 : 2;
      if (rank(a) !== rank(b)) return rank(a) - rank(b);
      if (ar !== null && br !== null && ar !== br) return mode === 'rating-desc' ? br - ar : ar - br;
      return byDate(a, b) || byTitle(a, b);
    }
    return byDate(a, b) || byTitle(a, b);
  };
  const updateView = () => {
    const compact = !showImages.checked;
    list.classList.toggle('review-grid--list', compact);
    // La cabecera del listado es solo visual: los campos mantienen texto semántico.
    document.querySelector('.review-list-head')?.classList.toggle('review-list-head--visible', compact);
  };
  const update = () => {
    // Reordenar nodos reales conserva la navegación de teclado y lectura en orden.
    for (const card of [...cards].sort(sorted)) list.appendChild(card);
    let visible = 0;
    for (const card of cards) {
      const themes = (card.dataset.themes || '').split(/\s+/);
      const query = normalized(search.value);
      const show = (query === '' || indexedText.get(card).includes(query)) && (theme.value === 'all' || themes.includes(theme.value)) && matchesRating(card, score.value);
      card.hidden = !show;
      if (show) visible++;
    }
    count.textContent = visible === 1 ? '1 libro' : `${visible} libros`;
    empty.hidden = visible !== 0;
  };
  showImages.addEventListener('change', updateView);
  search.addEventListener('input', update);
  theme.addEventListener('change', update);
  score.addEventListener('change', update);
  sort.addEventListener('change', update);
  clear.addEventListener('click', () => { search.value = ''; theme.value = 'all'; score.value = 'all'; sort.value = 'rating-desc'; update(); });
  updateView();
  update();
})();
