/* Lectura de las reseñas de Nora con la voz del navegador. Sin servicios externos. */
(() => {
  'use strict';

  const article = document.querySelector('.article-body .article-content');
  const metadata = document.querySelector('.article-body .article-meta');
  if (!article || !metadata || document.querySelector('[data-r2d-reader]')) return;
  // El minirreproductor acompaña la misma columna fija que la fotografía.
  document.body.classList.add('review-article--sticky');
  metadata.classList.add('r2d-reader-meta');

  const synth = window.speechSynthesis;
  const supported = !!synth && typeof window.SpeechSynthesisUtterance === 'function';
  const sidebar = document.querySelector('.article-sidebar');
  const photograph = sidebar?.querySelector('.article-photo');
  const desktop = window.matchMedia('(min-width: 691px)');
  const language = document.documentElement.lang || 'es-ES';
  const rates = [0.8, 1, 1.2, 1.5, 2];
  const icons = {
    play: '<path d="m9 5 10 7-10 7Z" fill="currentColor" stroke="none"/>',
    pause: '<path d="M8 5v14M16 5v14" stroke-width="4"/>',
    previous: '<path d="M6 5v14m13-14L9 12l10 7Z"/>',
    next: '<path d="M18 5v14M5 5l10 7-10 7Z"/>',
    stop: '<rect x="6" y="6" width="12" height="12" rx="1" fill="currentColor" stroke="none"/>'
  };
  const svg = name => '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + icons[name] + '</svg>';

  // Un bloque semántico se lee una sola vez, aunque contenga otros párrafos o listas.
  const selector = 'h2, h3, h4, p, li, blockquote';
  const excluded = '[hidden], [aria-hidden="true"], .article-instagram, .article-end, .article-pager, .r2d-share-quick, .article-bibliography, figure, script, style';
  let section = '';
  const blocks = Array.from(article.querySelectorAll(selector)).filter(element => {
    if (element.closest(excluded)) return false;
    const parentBlock = element.parentElement?.closest(selector);
    return !parentBlock || !article.contains(parentBlock);
  }).map(element => {
    const text = (element.innerText || element.textContent || '').replace(/\s+/g, ' ').trim()
      .replace(/(\d+(?:[.,]\d+)?)\s*\/\s*10\b/g, '$1 sobre 10');
    const heading = /^H[2-4]$/.test(element.tagName);
    if (heading) section = text;
    return { element, text, heading, section };
  }).filter(block => block.text);
  const headings = blocks.map((block, index) => block.heading ? index : -1).filter(index => index >= 0);

  const state = { phase: 'idle', index: 0, offset: 0, cursor: 0, rate: 1, started: false };
  try {
    const saved = Number(localStorage.getItem('r2d-reader-rate'));
    if (rates.includes(saved)) state.rate = saved;
  } catch (_) { /* La lectura funciona también sin almacenamiento local. */ }

  function makePlayer(compact) {
    const player = document.createElement('section');
    const id = compact ? 'r2d-reader-compact' : 'r2d-reader-main';
    player.className = 'r2d-reader' + (compact ? ' r2d-reader--compact' : '');
    player.dataset.r2dReader = compact ? 'compact' : 'main';
    player.setAttribute('aria-label', compact ? 'Controles de lectura de la reseña' : 'Escuchar esta reseña');
    const options = rates.map(rate => '<option value="' + rate + '">' + String(rate).replace('.', ',') + '×</option>').join('');
    player.innerHTML = '<div class="r2d-reader__head">' +
      '<button type="button" class="r2d-reader__toggle" data-reader-action="toggle" aria-expanded="false" aria-controls="' + id + '-track ' + id + '-speed"><span class="r2d-reader__play-icon">' + svg('play') + '</span><span data-reader-label>Escuchar con el navegador</span></button>' +
      '<label class="r2d-reader__speed" id="' + id + '-speed" hidden><span class="r2d-reader__sr">Velocidad de lectura</span><select aria-label="Velocidad de lectura">' + options + '</select></label></div>' +
      '<div class="r2d-reader__track" id="' + id + '-track" hidden>' +
      '<button type="button" class="r2d-reader__icon" data-reader-action="previous">' + svg('previous') + '</button>' +
      '<input class="r2d-reader__progress" type="range" min="0" step="1" value="0" aria-label="Punto de lectura"/>' +
      '<button type="button" class="r2d-reader__icon" data-reader-action="next">' + svg('next') + '</button>' +
      '<button type="button" class="r2d-reader__icon" data-reader-action="stop" aria-label="Detener lectura" title="Detener lectura">' + svg('stop') + '</button></div>' +
      '<p class="r2d-reader__status" hidden' + (compact ? '' : ' role="status" aria-live="polite" aria-atomic="true"') + '></p>';
    return player;
  }

  const main = makePlayer(false);
  const mini = makePlayer(true);
  mini.hidden = true;
  metadata.insertAdjacentElement('afterend', main);
  (sidebar || document.body).appendChild(mini);
  const players = [main, mini].map(element => ({
    element,
    toggle: element.querySelector('[data-reader-action="toggle"]'),
    label: element.querySelector('[data-reader-label]'),
    icon: element.querySelector('.r2d-reader__play-icon'),
    previous: element.querySelector('[data-reader-action="previous"]'),
    next: element.querySelector('[data-reader-action="next"]'),
    stop: element.querySelector('[data-reader-action="stop"]'),
    progress: element.querySelector('input'),
    speed: element.querySelector('select'),
    speedContainer: element.querySelector('.r2d-reader__speed'),
    track: element.querySelector('.r2d-reader__track'),
    status: element.querySelector('.r2d-reader__status')
  }));

  let generation = 0;
  let utterance = null;
  let pending = null;
  let highlighted = null;
  let layoutFrame = null;
  let manualPoint = false;
  let pageLeaving = false;
  let viewportStartAvailable = true;

  function navigationBottom() {
    const header = document.querySelector('.site-header');
    if (!header) return 0;
    const anchoredHeader = /fixed|sticky/.test(getComputedStyle(header).position);
    let bottom = 0;
    [header, ...header.querySelectorAll('.main-nav')].forEach(element => {
      const style = getComputedStyle(element);
      if (!anchoredHeader && !/fixed|sticky/.test(style.position)) return;
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return;
      const rect = element.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < window.innerHeight) bottom = Math.max(bottom, rect.bottom);
    });
    return Math.min(window.innerHeight, bottom);
  }

  function startBelowNavigationIndex() {
    const top = navigationBottom();
    for (let index = 0; index < blocks.length; index++) {
      const rect = blocks[index].element.getBoundingClientRect();
      // Un párrafo empezado por encima del menú se salta, aunque su final sea visible.
      if (rect.height > 0 && rect.top >= top - .5) return index;
    }
    return null;
  }

  function revealReadingStart() {
    const element = blocks[state.index]?.element;
    if (!element) return;
    const top = navigationBottom();
    const bottom = window.innerHeight - (!mini.hidden && mini.classList.contains('r2d-reader--floating') ? mini.getBoundingClientRect().height + 28 : 20);
    const rect = element.getBoundingClientRect();
    if (rect.top < top - .5 || rect.top >= bottom - 20) {
      window.scrollBy({top: rect.top - top - 12, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
    }
  }

  function sectionStart(index) {
    return headings.filter(value => value <= index).pop() ?? 0;
  }
  function previousIndex() {
    if (!headings.length) return Math.max(0, state.index - 1);
    const current = sectionStart(state.index);
    return state.index > current ? current : (headings.filter(value => value < current).pop() ?? 0);
  }
  function nextIndex() {
    return headings.length ? (headings.find(value => value > state.index) ?? -1) : (state.index < blocks.length - 1 ? state.index + 1 : -1);
  }

  function highlight(element) {
    if (highlighted === element) return;
    highlighted?.classList.remove('r2d-reader-highlight');
    highlighted = element;
    highlighted?.classList.add('r2d-reader-highlight');
  }

  function update() {
    const playing = state.phase === 'playing';
    const finished = state.phase === 'ended';
    let status = blocks.length + (headings.length ? ' bloques' : ' párrafos') + ' · Voz del navegador';
    if (state.started || state.index) status = (playing ? 'Leyendo' : state.phase === 'paused' ? 'En pausa' : 'Escuchar desde aquí') + ' · ' + (state.index + 1) + ' de ' + blocks.length;
    if (finished) status = 'Lectura terminada';
    if (state.phase === 'error') status = 'No se ha podido continuar. Puedes reintentar la lectura.';
    const noNewParagraph = state.phase === 'idle' && !manualPoint && !viewportStartAvailable;
    if (noNewParagraph) status = 'No quedan nuevos párrafos debajo del menú.';
    if (!supported) status = 'La lectura en voz alta no está disponible en este navegador.';
    if (!blocks.length) status = 'No hay texto disponible para leer.';
    players.forEach((player, index) => {
      const expanded = state.started;
      const restoreFocus = !expanded && player.element.contains(document.activeElement) && document.activeElement !== player.toggle;
      player.element.classList.toggle('r2d-reader--collapsed', !expanded);
      player.toggle.setAttribute('aria-expanded', String(expanded));
      player.speedContainer.hidden = !expanded;
      player.track.hidden = !expanded;
      player.status.hidden = !expanded;
      if (restoreFocus) player.toggle.focus({ preventScroll: true });
      const label = !supported ? 'Lectura no disponible' : !blocks.length ? 'Sin texto para escuchar' : noNewParagraph ? 'Fin de la reseña' : playing ? 'Pausar lectura' : state.phase === 'paused' ? 'Reanudar lectura' : finished ? 'Volver a escuchar' : state.phase === 'error' ? 'Reintentar lectura' : index ? 'Escuchar desde aquí' : 'Escuchar con el navegador';
      player.label.textContent = index && playing ? 'Pausar' : index && state.phase === 'paused' ? 'Reanudar' : label;
      player.toggle.setAttribute('aria-label', label);
      player.toggle.title = label;
      player.toggle.disabled = !supported || !blocks.length || noNewParagraph;
      player.icon.innerHTML = svg(playing ? 'pause' : 'play');
      player.element.dataset.readerState = state.phase;
      const unit = headings.length ? 'apartado' : 'párrafo';
      player.previous.setAttribute('aria-label', (headings.length ? 'Volver al inicio o al apartado anterior' : 'Párrafo anterior'));
      player.previous.title = headings.length ? 'Inicio del apartado o apartado anterior' : 'Párrafo anterior';
      player.next.setAttribute('aria-label', 'Siguiente ' + unit);
      player.next.title = 'Siguiente ' + unit;
      player.previous.disabled = !supported || state.index === 0;
      player.next.disabled = !supported || nextIndex() < 0;
      player.stop.disabled = !supported || (!state.started && state.index === 0);
      player.progress.max = String(Math.max(0, blocks.length - 1));
      player.progress.value = String(state.index);
      player.progress.disabled = !supported || blocks.length < 2;
      player.progress.setAttribute('aria-valuetext', 'Punto de lectura ' + (state.index + 1) + ' de ' + blocks.length);
      const percent = finished ? 100 : blocks.length > 1 ? state.index / (blocks.length - 1) * 100 : 0;
      player.progress.style.setProperty('--r2d-reader-progress', percent.toFixed(2) + '%');
      player.speed.value = String(state.rate);
      player.speed.disabled = !supported || !blocks.length;
      if (player.status.textContent !== status) player.status.textContent = status;
    });
    requestLayout();
  }

  function cancel() {
    generation++;
    window.clearTimeout(pending);
    pending = null;
    utterance = null;
    if (supported) synth.cancel();
  }

  function bestVoice() {
    const voices = synth.getVoices();
    const prefix = language.slice(0, 2).toLowerCase();
    const relevant = voices.filter(voice => voice.lang?.toLowerCase().startsWith(prefix));
    return relevant.find(voice => /Elvira|Helena|Mónica|Monica/.test(voice.name)) ||
      relevant.find(voice => /^es[-_]ES$/i.test(voice.lang)) || relevant.find(voice => voice.default) || relevant[0] || null;
  }

  // Las intervenciones cortas evitan cortes de las voces del navegador en párrafos largos.
  function segmentEnd(text, start) {
    const limit = Math.min(start + 240, text.length);
    if (limit === text.length) return limit;
    const fragment = text.slice(start, limit);
    const sentences = Array.from(fragment.matchAll(/[.!?;:](?=\s)/g));
    const boundary = sentences.pop();
    if (boundary && boundary.index >= 80) return start + boundary.index + 1;
    const space = fragment.lastIndexOf(' ');
    return space > 0 ? start + space : limit;
  }

  function speak() {
    if (state.phase !== 'playing' || !blocks.length) return;
    const block = blocks[state.index];
    while (/\s/.test(block.text.charAt(state.offset)) && state.offset < block.text.length) state.offset++;
    if (state.offset >= block.text.length) {
      if (state.index === blocks.length - 1) {
        state.phase = 'ended';
        highlight(null);
        update();
        return;
      }
      state.index++;
      state.offset = state.cursor = 0;
      speak();
      return;
    }
    const start = state.offset;
    const end = segmentEnd(block.text, start);
    const speech = new SpeechSynthesisUtterance(block.text.slice(start, end));
    const token = generation;
    utterance = speech;
    state.cursor = start;
    speech.lang = /^es$/i.test(language) ? 'es-ES' : language;
    speech.rate = state.rate;
    const voice = bestVoice();
    if (voice) speech.voice = voice;
    const current = () => token === generation && utterance === speech;
    speech.onstart = () => {
      if (!current()) return;
      highlight(block.element);
      update();
    };
    speech.onboundary = event => {
      if (current() && Number.isFinite(event.charIndex)) state.cursor = Math.min(end, start + event.charIndex);
    };
    speech.onend = () => {
      if (!current()) return;
      utterance = null;
      state.offset = end;
      state.cursor = end;
      if (end >= block.text.length) {
        if (state.index === blocks.length - 1) {
          state.phase = 'ended';
          highlight(null);
          update();
          return;
        }
        state.index++;
        state.offset = state.cursor = 0;
      }
      update();
      if (state.phase === 'playing') pending = window.setTimeout(() => { pending = null; speak(); }, 0);
    };
    speech.onerror = () => {
      if (!current()) return;
      utterance = null;
      state.phase = 'error';
      highlight(null);
      update();
    };
    try { synth.speak(speech); } catch (_) { speech.onerror(); }
  }

  function muteOtherMedia() {
    document.querySelectorAll('audio,video').forEach(media => {
      if (!media.paused && !media.muted && media.volume > 0) media.pause();
    });
  }

  function play() {
    if (!supported || !blocks.length) return;
    const fromViewport = state.phase === 'idle' && !manualPoint;
    if (fromViewport) {
      const visible = startBelowNavigationIndex();
      if (visible === null && main.getBoundingClientRect().bottom <= navigationBottom() + 8) {
        viewportStartAvailable = false;
        update();
        return;
      }
      viewportStartAvailable = true;
      state.index = visible ?? 0;
      state.offset = state.cursor = 0;
    }
    muteOtherMedia();
    if (state.phase === 'paused' && utterance) {
      state.phase = 'playing';
      try {
        synth.resume();
        update();
        return;
      } catch (_) { state.offset = state.cursor; }
    }
    if (state.phase === 'ended') { state.index = 0; state.offset = state.cursor = 0; }
    if (state.phase === 'error') state.offset = state.cursor;
    cancel();
    // cancel() no borra el estado de pausa de todos los motores de voz.
    if (synth.paused) synth.resume();
    state.started = true;
    state.phase = 'playing';
    highlight(blocks[state.index].element);
    update();
    if (fromViewport) revealReadingStart();
    speak();
  }

  function pause() {
    if (state.phase !== 'playing') return;
    state.phase = 'paused';
    window.clearTimeout(pending);
    pending = null;
    if (utterance) {
      try { synth.pause(); } catch (_) { state.offset = state.cursor; cancel(); }
    }
    update();
  }

  function stop() {
    cancel();
    manualPoint = false;
    viewportStartAvailable = true;
    state.phase = 'idle';
    state.started = false;
    state.index = state.offset = state.cursor = 0;
    highlight(null);
    update();
  }

  function follow() {
    blocks[state.index]?.element.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
  }

  function seek(index, scroll, defer) {
    if (!supported || !blocks.length) return;
    manualPoint = true;
    viewportStartAvailable = true;
    const playing = state.phase === 'playing';
    cancel();
    state.index = Math.max(0, Math.min(Number(index) || 0, blocks.length - 1));
    state.offset = state.cursor = 0;
    if (state.phase === 'ended' || state.phase === 'error') state.phase = 'paused';
    if (state.started) highlight(blocks[state.index].element);
    update();
    if (scroll) follow();
    if (playing) {
      if (defer) pending = window.setTimeout(() => { pending = null; speak(); }, 120);
      else speak();
    }
  }

  players.forEach(player => {
    player.element.addEventListener('click', event => {
      const action = event.target.closest('[data-reader-action]')?.dataset.readerAction;
      if (action === 'toggle') state.phase === 'playing' ? pause() : play();
      if (action === 'stop') stop();
      if (action === 'previous') seek(previousIndex(), true, false);
      if (action === 'next' && nextIndex() >= 0) seek(nextIndex(), true, false);
    });
    player.progress.addEventListener('input', () => seek(player.progress.value, false, true));
    player.progress.addEventListener('change', () => {
      if (state.started) follow();
      if (pending && state.phase === 'playing') {
        window.clearTimeout(pending);
        pending = null;
        speak();
      }
    });
    player.speed.addEventListener('change', () => {
      const rate = Number(player.speed.value);
      if (!rates.includes(rate)) return;
      state.rate = rate;
      try { localStorage.setItem('r2d-reader-rate', String(rate)); } catch (_) {}
      if (utterance) { state.offset = state.cursor; cancel(); }
      update();
      if (state.phase === 'playing') {
        window.clearTimeout(pending);
        pending = null;
        speak();
      }
    });
  });

  function hideMini() {
    if (mini.contains(document.activeElement)) players[0].toggle.focus({ preventScroll: true });
    mini.hidden = true;
    sidebar?.classList.remove('r2d-reader-has-dock');
    sidebar?.style.removeProperty('--r2d-reader-image-limit');
    document.body.classList.remove('r2d-reader-float-active');
  }

  function syncLayout() {
    layoutFrame = null;
    if (pageLeaving || !supported || !blocks.length) { hideMini(); return; }
    const safeTop = navigationBottom();
    const rect = main.getBoundingClientRect();
    const outside = rect.bottom <= safeTop + 8 || rect.top >= window.innerHeight - 8;
    if (!outside) {
      if (!state.started && !viewportStartAvailable) { viewportStartAvailable = true; update(); }
      hideMini();
      return;
    }
    if (!state.started) {
      const text = article.getBoundingClientRect();
      const readingText = text.height > 0 && text.bottom > safeTop + 12 && text.top < window.innerHeight - 20;
      // El lector en reposo aparece al llegar al texto, sin arrancar ninguna voz.
      if (rect.bottom > safeTop + 8 || !readingText) { hideMini(); return; }
      if (!manualPoint) {
        const visible = startBelowNavigationIndex();
        const available = visible !== null;
        if (available !== viewportStartAvailable || (visible !== null && visible !== state.index)) {
          viewportStartAvailable = available;
          if (visible !== null) { state.index = visible; state.offset = state.cursor = 0; }
          update();
        }
      }
    }
    mini.hidden = false;
    const docked = desktop.matches && sidebar && photograph && window.innerHeight >= 550;
    mini.classList.toggle('r2d-reader--floating', !docked);
    if (docked) {
      if (mini.parentElement !== sidebar) sidebar.appendChild(mini);
      document.body.classList.remove('r2d-reader-float-active');
      const photoRect = photograph.getBoundingClientRect();
      const image = Array.from(photograph.querySelectorAll('img')).find(img => !img.hidden && img.getBoundingClientRect().height > 0);
      if (image) {
        const imageHeight = image.getBoundingClientRect().height;
        const frameHeight = photoRect.height - imageHeight;
        const abovePhoto = photoRect.top - sidebar.getBoundingClientRect().top;
        const top = parseFloat(getComputedStyle(sidebar).top) || safeTop + 12;
        const available = window.innerHeight - top - abovePhoto - frameHeight - mini.getBoundingClientRect().height - 32;
        const value = Math.max(90, Math.floor(available)) + 'px';
        if (sidebar.style.getPropertyValue('--r2d-reader-image-limit') !== value) sidebar.style.setProperty('--r2d-reader-image-limit', value);
        sidebar.classList.add('r2d-reader-has-dock');
      }
    } else {
      if (mini.parentElement !== document.body) document.body.appendChild(mini);
      sidebar?.classList.remove('r2d-reader-has-dock');
      sidebar?.style.removeProperty('--r2d-reader-image-limit');
      const banner = document.querySelector('[data-cookie-banner]');
      const bannerRect = banner && !banner.hidden ? banner.getBoundingClientRect() : null;
      const bottom = bannerRect && bannerRect.top < window.innerHeight && bannerRect.bottom > 0 ? window.innerHeight - bannerRect.top + 12 : 14;
      mini.style.setProperty('--r2d-reader-bottom', bottom + 'px');
      document.body.style.setProperty('--r2d-reader-float-height', (mini.getBoundingClientRect().height + 30) + 'px');
      document.body.classList.add('r2d-reader-float-active');
    }
  }

  function requestLayout() {
    if (layoutFrame === null) layoutFrame = window.requestAnimationFrame(syncLayout);
  }
  window.addEventListener('scroll', requestLayout, { passive: true });
  window.addEventListener('resize', requestLayout, { passive: true });
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(requestLayout);
    observer.observe(main);
    observer.observe(mini);
    if (photograph) observer.observe(photograph);
    const banner = document.querySelector('[data-cookie-banner]');
    if (banner) observer.observe(banner);
  }
  document.addEventListener('play', event => {
    if (event.target instanceof HTMLMediaElement && !event.target.muted && event.target.volume > 0) pause();
  }, true);
  window.addEventListener('pagehide', () => { pageLeaving = true; stop(); hideMini(); });
  window.addEventListener('pageshow', () => { pageLeaving = false; requestLayout(); });
  update();
})();
