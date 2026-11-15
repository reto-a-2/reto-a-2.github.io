/* Enlaces de categorías: utiliza los filtros existentes del índice.
   No redefine la búsqueda, ordenación ni las combinaciones de filtros. */
(function () {
  'use strict';
  const cards = Array.from(document.querySelectorAll('#review-list .review-card'));
  const kindSelect = document.getElementById('review-kind');
  const topicSelect = document.getElementById('review-theme');
  const grid = document.getElementById('review-list');
  if (!cards.length || !kindSelect || !topicSelect || !grid) return;

  function notifyChange(element) {
    element.dispatchEvent(new Event('change', { bubbles: true }));
  }

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a.review-category-link[data-review-filter]');
    if (!link) return;
    event.preventDefault();
    const type = link.dataset.reviewFilter;
    const value = link.dataset.reviewValue;
    if (type === 'tipo') {
      if (Array.from(kindSelect.options).some(o => o.value === value)) {
        kindSelect.value = value;
        notifyChange(kindSelect);
      }
    } else if (type === 'tema') {
      const option = Array.from(topicSelect.options).find(o => o.value === value);
      if (!option) return;
      // Un clic aplica exactamente el mismo tema que el desplegable.
      // Si hay un tipo de publicación incompatible, pasar a «Todas».
      const accepted = (option.dataset.kind || '').trim().split(/\s+/).filter(Boolean);
      if (kindSelect.value !== 'all' && accepted.length && !accepted.includes(kindSelect.value)) {
        kindSelect.value = 'all';
        notifyChange(kindSelect);
      }
      topicSelect.value = value;
      notifyChange(topicSelect);
    }
    document.getElementById('filtros-resenas')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    queueAlign();
  });

  // Todas las fichas comparten una zona de categorías de igual altura;
  // no se reduce el tamaño de letra ni se cambian anchuras de columnas.
  let frame = 0;
  function equalizeCategorySpace() {
    frame = 0;
    const fields = cards.map(card => ({ card, label: card.querySelector('.review-card__category') }))
      .filter(item => item.label);
    fields.forEach(({ label }) => { label.style.minHeight = ''; });
    const visible = fields.filter(({ card }) => card.getClientRects().length && getComputedStyle(card).display !== 'none');
    if (!visible.length) return;
    const lineHeight = parseFloat(getComputedStyle(visible[0].label).lineHeight) || 17;
    const maxHeight = Math.max(lineHeight * 2, ...visible.map(({label}) => label.getBoundingClientRect().height));
    visible.forEach(({ label }) => { label.style.minHeight = Math.ceil(maxHeight) + 'px'; });
  }
  function queueAlign() {
    if (frame) cancelAnimationFrame(frame);
    frame = requestAnimationFrame(equalizeCategorySpace);
  }
  window.addEventListener('load', queueAlign);
  window.addEventListener('resize', queueAlign);
  document.addEventListener('change', (e) => {
    if (e.target.closest('#filtros-resenas')) requestAnimationFrame(queueAlign);
  });
  document.addEventListener('input', (e) => {
    if (e.target.id === 'review-search') requestAnimationFrame(queueAlign);
  });
  document.querySelectorAll('[data-column-sort], #review-sort, #review-reset, #review-show-images')
    .forEach(el => el.addEventListener('click', () => requestAnimationFrame(queueAlign)));
  const observer = new MutationObserver(() => queueAlign());
  cards.forEach(card => observer.observe(card, { attributes: true, attributeFilter: ['hidden','style','class'] }));
  queueAlign();
})();
