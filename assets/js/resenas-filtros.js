/* Filtros y ordenación independientes de las reseñas de Nora Montalba. */
(() => {
  'use strict';
  const search = document.getElementById('review-search');
  const kind = document.getElementById('review-kind');
  const theme = document.getElementById('review-theme');
  const scoreHint = document.getElementById('review-score-hint');
  const score = document.getElementById('review-score');
  const sort = document.getElementById('review-sort');
  const clear = document.getElementById('review-reset');
  const count = document.getElementById('review-count');
  const empty = document.getElementById('review-empty');
  const list = document.getElementById('review-list');
  const showImages = document.getElementById('review-show-images');
  const columnButtons = [...document.querySelectorAll('[data-column-sort]')];
  if (!search || !kind || !theme || !score || !sort || !clear || !count || !empty || !list || !showImages) return;
  // Cada opción mantiene su tipo de publicación en data-kind. No mostramos
  // separadores ni encabezados: todos los temas forman una sola lista.
  // Una categoría compartida puede llevar data-kind="libros reflexion".
  const themeOptions = [...theme.querySelectorAll('option[data-kind]')]
    .map(option => option.cloneNode(true));
  const syncThemeOptions = (keepSelection = false) => {
    const previous = keepSelection ? theme.value : 'all';
    const label = kind.value === 'reflexion' ? 'Todos los temas' : 'Todos los géneros y temas';
    theme.replaceChildren(new Option(label, 'all'));
    const added = new Set();
    for (const option of themeOptions) {
      const types = (option.dataset.kind || '').split(/\s+/);
      if ((kind.value === 'all' || types.includes(kind.value)) && !added.has(option.value)) {
        theme.appendChild(option.cloneNode(true));
        added.add(option.value);
      }
    }
    theme.value = [...theme.options].some(option => option.value === previous) ? previous : 'all';
    const isReflection = kind.value === 'reflexion';
    if (isReflection) {
      score.value = 'all';
      // Ordenar las reflexiones por nota carece de sentido: usamos la fecha.
      if (sort.value.startsWith('rating-')) sort.value = 'date-desc';
    }
    score.disabled = isReflection;
    if (scoreHint) scoreHint.hidden = !isReflection;
  };
  // Mientras se muestra la selección editorial «¡Puajjjjj!», el campo de
  // valoración usa una opción inicial distinta de «Todas las valoraciones».
  // Así elegir «Todas las valoraciones» genera un cambio real, incluso si
  // antes de entrar en ¡Puaj! la nota no estaba filtrada. No necesitamos
  // detectar aperturas de un selector nativo ni borrar filtros al enfocarlo.
  const puajScorePromptValue = 'puaj-elegir-valoracion';
  // Duplicamos solo el texto visible de «Todas las valoraciones», no su
  // valor. La opción auxiliar permanece oculta en la lista: así el selector
  // parece normal, pero elegir «Todas las valoraciones» provoca un cambio
  // real y desactiva ¡Puajjjjj!.
  const puajScorePrompt = new Option('Todas las valoraciones', puajScorePromptValue);
  puajScorePrompt.hidden = true;
  const showPuajScorePrompt = () => {
    if (theme.value !== 'puaj' || score.disabled) return;
    if (!puajScorePrompt.isConnected) score.insertBefore(puajScorePrompt, score.firstChild);
    score.value = puajScorePromptValue;
  };
  const hidePuajScorePrompt = () => {
    if (score.value === puajScorePromptValue) score.value = 'all';
    puajScorePrompt.remove();
  };
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
  // Las reflexiones carecen de nota: data-sort-score fija su posición en la ordenación.
  const orderingRating = (card) => card.dataset.ratingState === 'reflection' ? Number(card.dataset.sortScore || 7) : rating(card);
  const matchesRating = (card, choice) => {
    if (choice === 'all' || choice === puajScorePromptValue) return true;
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
  const hasPuajAtRating = (choice) => choice !== 'all' && choice !== puajScorePromptValue &&
    cards.some(card => (card.dataset.themes || '').split(/\s+/).includes('puaj') && matchesRating(card, choice));
  const byDate = (a, b) => dateKey(b) - dateKey(a);
  const byTitle = (a, b) => collator.compare(a.dataset.sortTitle || '', b.dataset.sortTitle || '');
  const sorted = (a, b) => {
    const mode = sort.value;
    if (mode === 'author-asc' || mode === 'author-desc') {
      const direction = mode === 'author-asc' ? 1 : -1;
      return direction * collator.compare(a.dataset.sortAuthor || '', b.dataset.sortAuthor || '') || byDate(a, b) || byTitle(a, b);
    }
    if (mode === 'title-asc' || mode === 'title-desc') {
      return (mode === 'title-asc' ? 1 : -1) * byTitle(a, b) || byDate(a, b);
    }
    if (mode === 'rating-desc' || mode === 'rating-asc') {
      const ar = orderingRating(a), br = orderingRating(b);
      // Toda nota numérica, incluso 1/10, precede a 'No puntuable'.
      // Las fichas sin nota aún no asignada aparecen después.
      const rank = (card) => (card.dataset.ratingState === 'scored' || card.dataset.ratingState === 'reflection') ? 0 : card.dataset.ratingState === 'unfinished' ? 1 : 2;
      if (rank(a) !== rank(b)) return rank(a) - rank(b);
      if (ar !== null && br !== null && ar !== br) return mode === 'rating-desc' ? br - ar : ar - br;
      return byDate(a, b) || byTitle(a, b);
    }
    return (mode === 'date-asc' ? -1 : 1) * byDate(a, b) || byTitle(a, b);
  };
  const updateColumnArrows = () => {
    for (const button of columnButtons) {
      const active = button.dataset.columnSort === sort.value;
      button.setAttribute('aria-pressed', String(active));
      button.classList.toggle('is-active', active);
    }
  };

  // Todas las tarjetas reservan la misma altura para sus categorías.
  // Ajustamos una única fila de CSS Grid; los títulos permanecen alineados.
  let categoryFrame = 0;
  const measureCategories = () => {
    categoryFrame = 0;
    if (list.classList.contains('review-grid--list')) return;
    const visibleCards = cards.filter(card => !card.hidden && getComputedStyle(card).display !== 'none');
    if (!visibleCards.length) return;
    const contentHeight = Math.max(0, ...visibleCards.map(card => card.querySelector('.review-card__category')?.scrollHeight || 0));
    list.style.setProperty('--nora-category-height', Math.max(42, Math.ceil(contentHeight) + 5) + 'px');
  };
  const scheduleCategoryMeasure = () => {
    if (categoryFrame) cancelAnimationFrame(categoryFrame);
    categoryFrame = requestAnimationFrame(measureCategories);
  };

  const updateView = () => {
    const compact = !showImages.checked;
    list.classList.toggle('review-grid--list', compact);
    // La cabecera del listado es solo visual: los campos mantienen texto semántico.
    document.querySelector('.review-list-head')?.classList.toggle('review-list-head--visible', compact);
    scheduleCategoryMeasure();
  };
  const update = () => {
    updateColumnArrows();
    // Reordenar nodos reales conserva la navegación de teclado y lectura en orden.
    for (const card of [...cards].sort(sorted)) list.appendChild(card);
    let visible = 0;
    for (const card of cards) {
      const themes = (card.dataset.themes || '').split(/\s+/);
      const query = normalized(search.value);
      const show = (query === '' || indexedText.get(card).includes(query)) && (kind.value === 'all' || card.dataset.kind === kind.value) && (theme.value === 'all' || themes.includes(theme.value)) && matchesRating(card, score.value);
      card.hidden = !show;
      if (show) visible++;
    }
    count.textContent = visible === 1 ? '1 publicación' : `${visible} publicaciones`;
    empty.hidden = visible !== 0;
    scheduleCategoryMeasure();
  };
  // El navegador puede restaurar el checkbox al volver atrás sin restaurar
  // la clase visual. Guardamos explícitamente la elección en esta pestaña.
  const viewStorageKey = 'retoados.resenas.ver-fichas-completas';
  const restoreView = () => {
    try {
      const saved = window.sessionStorage.getItem(viewStorageKey);
      if (saved === 'true' || saved === 'false') showImages.checked = saved === 'true';
    } catch (_) {
      // La navegación sigue funcionando si el navegador bloquea el almacenamiento.
    }
    updateView();
  };
  const saveView = () => {
    try {
      window.sessionStorage.setItem(viewStorageKey, String(showImages.checked));
    } catch (_) {
      // El estado se mantiene al menos durante esta visita.
    }
    updateView();
  };
  showImages.addEventListener('change', saveView);
  // 'pageshow' se ejecuta también al regresar mediante Atrás (caché BFCache).
  window.addEventListener('pageshow', restoreView);
  search.addEventListener('input', update);
  kind.addEventListener('change', () => {
    syncThemeOptions(true);
    if (theme.value === 'puaj' && score.value === 'all' && !score.disabled) showPuajScorePrompt();
    else if (score.disabled || theme.value !== 'puaj') hidePuajScorePrompt();
    update();
  });
  // Los desplegables SUPERIORES se combinan entre sí, incluido «¡Puajjjjj!».
  // «Reseñas de libros» + «¡Puajjjjj!» => solo reseñas con esa etiqueta;
  // «Reflexiones» + «¡Puajjjjj!» => solo reflexiones con esa etiqueta.
  // El acceso desde una etiqueta AZUL de una ficha es deliberadamente distinto:
  // inicia una búsqueda global nueva (véase el delegado de eventos de list).
  theme.addEventListener('change', () => {
    // Solo crear el valor auxiliar si la puntuación ya estaba en "todas".
    // No eliminar las restricciones de tipo, búsqueda ni puntuación.
    if (theme.value === 'puaj' && score.value === 'all' && !score.disabled) {
      showPuajScorePrompt();
    } else {
      hidePuajScorePrompt();
    }
    update();
  });
  // Al elegir una valoración tras «¡Puajjjjj!»:
  // - «Todas las valoraciones» muestra el catálogo completo.
  // - Un rango con publicaciones ¡Puaj! conserva el filtro editorial.
  // - Un rango sin coincidencias ¡Puaj! se aplica a todo el catálogo.
  // El resto de temas continúan combinándose normalmente con la valoración.
  score.addEventListener('change', () => {
    if (theme.value === 'puaj' && !hasPuajAtRating(score.value)) {
      theme.value = 'all';
    }
    hidePuajScorePrompt();
    update();
  });
  sort.addEventListener('change', update);
  for (const button of columnButtons) {
    button.addEventListener('click', () => {
      sort.value = button.dataset.columnSort;
      update();
    });
  }
  clear.addEventListener('click', () => { search.value = ''; kind.value = 'all'; syncThemeOptions(); hidePuajScorePrompt(); score.value = 'all'; sort.value = 'rating-desc'; update(); });

  // Las etiquetas azules son accesos directos a filtros completos.
  // Al pulsar una se eliminan las restricciones previas (búsqueda, tipo,
  // nota y tema), sin interferir con la selección manual combinada de arriba.
  list.addEventListener('click', (event) => {
    const button = event.target.closest('button.review-category-action');
    if (!button || !list.contains(button)) return;
    if (!button.dataset.reviewKind && !button.dataset.reviewTheme) return;

    search.value = '';
    hidePuajScorePrompt();
    score.value = 'all';
    if (button.dataset.reviewKind) {
      kind.value = button.dataset.reviewKind;
      syncThemeOptions();
    } else {
      const chosen = button.dataset.reviewTheme;
      if (!themeOptions.some(option => option.value === chosen)) return;
      kind.value = 'all';
      syncThemeOptions();
      theme.value = chosen;
      if (chosen === 'puaj') showPuajScorePrompt();
    }
    update();
    list.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  window.addEventListener('load', scheduleCategoryMeasure);
  window.addEventListener('resize', scheduleCategoryMeasure);

  syncThemeOptions(true);
  if (theme.value === 'puaj' && score.value === 'all' && !score.disabled) showPuajScorePrompt();
  restoreView();
  update();
})();
