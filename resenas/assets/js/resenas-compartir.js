/* Reto a Dos — compartir reseñas y reflexiones.
   Un solo componente para artículos (inicio y final) y todas las tarjetas del índice.
   Estilos centralizados en assets/css/resenas.css. */
(() => {
  'use strict';

  const svg = {
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.1 11.6a8.1 8.1 0 0 1-11.9 7.1L4 20l1.3-4.1A8.1 8.1 0 1 1 20.1 11.6Z"/><path d="M9 8.6c-.4.1-.6.7-.4 1.5.4 1.7 2.1 3.6 3.8 4.2.8.3 1.5.2 1.8-.3l.5-1-2-1.1-.8.7a5.7 5.7 0 0 1-2-2.2l.6-.7-1-1.5Z"/></svg>',
    x: '<span aria-hidden="true">𝕏</span>',
    fb: '<span aria-hidden="true">f</span>',
    tg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 3 3 10.3l6.9 2.4L18.5 6l-6.6 9.6L16 19l5-16Z"/><path d="m9.9 12.7 2 2.9"/></svg>',
    li: '<span aria-hidden="true">in</span>',
    down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>'
  };

  const social = [
    {id:'wa', name:'WhatsApp'},
    {id:'x', name:'X'},
    {id:'fb', name:'Facebook'},
    {id:'tg', name:'Telegram'},
    {id:'li', name:'LinkedIn'}
  ];
  const menus = [];
  const enc = encodeURIComponent;

  // Si una ficha antigua conserva un canonical obsoleto, compartir la URL
  // real de la página visitada. /carpeta/ y /carpeta/index.html equivalen.
  function articlePublicUrl() {
    const declared = document.querySelector('link[rel="canonical"]')?.href || window.location.href;
    try {
      const canonical = new URL(declared);
      const current = new URL(window.location.href);
      const normalized = pathname => pathname.replace(/\/index\.html$/i,'/').replace(/\/?$/,'/');
      if (/^https?:$/.test(current.protocol) && /(^|\.)retoados\.com$/i.test(current.hostname)
          && normalized(current.pathname) !== normalized(canonical.pathname)) {
        return new URL(current.pathname,canonical.origin).href;
      }
    } catch (_) { /* Mantener canonical si no puede compararse. */ }
    return declared;
  }

  function destinations(url, title) {
    return {
      wa: 'https://api.whatsapp.com/send?text=' + enc(title + '\n' + url),
      x: 'https://twitter.com/intent/tweet?text=' + enc(title) + '&url=' + enc(url),
      fb: 'https://www.facebook.com/sharer/sharer.php?u=' + enc(url),
      tg: 'https://t.me/share/url?url=' + enc(url) + '&text=' + enc(title),
      li: 'https://www.linkedin.com/sharing/share-offsite/?url=' + enc(url),
      mail: 'mailto:?subject=' + enc(title) + '&body=' + enc(title + '\n' + url)
    };
  }

  function copyFallback(value) {
    const textarea = document.createElement('textarea');
    textarea.value = value;
    textarea.readOnly = true;
    textarea.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0;';
    document.body.appendChild(textarea);
    textarea.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (_) { /* Portapapeles bloqueado. */ }
    textarea.remove();
    return ok;
  }
  async function copyUrl(value) {
    if (navigator.clipboard && window.isSecureContext) {
      try { await navigator.clipboard.writeText(value); return true; }
      catch (_) { /* Usar alternativa. */ }
    }
    return copyFallback(value);
  }

  function copyButton(url) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'r2d-share-quick__copy';
    button.setAttribute('aria-label', 'Copiar enlace de esta publicación');
    button.title = 'Copiar enlace';
    button.dataset.r2dCopyUrl = url;
    button.innerHTML = svg.copy + '<span class="r2d-share-copy-label">Copiar enlace</span>';
    return button;
  }

  function panelEntry(symbol, name, note) {
    const chip = document.createElement('span');
    chip.className = 'r2d-share-panel__symbol';
    chip.textContent = symbol;
    const label = document.createElement('span');
    label.className = 'r2d-share-panel__name';
    label.textContent = name;
    if (note) {
      const small = document.createElement('small');
      small.textContent = note;
      label.appendChild(small);
    }
    return [chip, label];
  }

  function menu(url, title, placement) {
    const details = document.createElement('details');
    details.className = 'r2d-share-menu r2d-share-menu--' + placement;
    const summary = document.createElement('summary');
    summary.className = 'r2d-share-trigger';
    summary.setAttribute('aria-label','Más opciones para compartir');
    summary.innerHTML = '<span>Más</span>' + svg.down;
    const panel = document.createElement('div');
    panel.className = 'r2d-share-panel';
    panel.setAttribute('aria-label', 'Más opciones para compartir');
    const heading = document.createElement('p');
    heading.className = 'r2d-share-panel__heading';
    heading.textContent = 'Más opciones';
    const grid = document.createElement('div');
    grid.className = 'r2d-share-panel__grid';
    const email = document.createElement('a');
    email.className = 'r2d-share-panel__item r2d-share-panel__item--email';
    email.href = destinations(url, title).mail;
    email.append(...panelEntry('✉', 'Correo electrónico'));
    const ig = document.createElement('button');
    ig.type = 'button';
    ig.className = 'r2d-share-panel__item r2d-share-panel__item--ig';
    ig.setAttribute('aria-label', 'Copiar enlace para compartir en Instagram');
    ig.append(...panelEntry('◎', 'Instagram', 'Copiar enlace'));
    grid.append(email, ig);
    const native = document.createElement('button');
    native.type = 'button';
    native.className = 'r2d-share-panel__item r2d-share-panel__item--wide';
    native.append(...panelEntry('↥', 'Más aplicaciones', 'Compartir desde este dispositivo'));
    native.hidden = typeof navigator.share !== 'function';
    grid.appendChild(native);
    const notice = document.createElement('p');
    notice.className = 'r2d-share-panel__notice';
    notice.setAttribute('role','status');
    notice.setAttribute('aria-live','polite');
    panel.append(heading,grid,notice);
    details.append(summary,panel);
    menus.push(details);
    details.addEventListener('toggle', () => {
      const card = details.closest('.review-card');
      if (card) card.classList.toggle('r2d-share-open', details.open);
      if (details.open) menus.forEach(other => { if (other !== details) other.open = false; });
    });
    ig.addEventListener('click', async () => {
      const copied = await copyUrl(url);
      if (!copied) window.prompt('Copia este enlace para pegarlo en Instagram:',url);
      notice.textContent = copied
        ? 'Enlace copiado. Puedes pegarlo en Instagram.'
        : 'Instagram no admite compartir directamente enlaces web desde este botón.';
    });
    native.addEventListener('click', async () => {
      if (typeof navigator.share !== 'function') return;
      try {
        await navigator.share({title:title, text:'Una publicación de Nora Montalba', url:url});
        details.open = false;
      } catch (error) {
        if (error.name !== 'AbortError') notice.textContent = 'No se pudo abrir el menú de compartir.';
      }
    });
    return details;
  }

  function shareBar(url, title, placement='top', card=false) {
    const bar = document.createElement('div');
    bar.className = 'r2d-share-quick' + (card ? ' r2d-share-quick--card' : '');
    bar.setAttribute('role','group');
    bar.setAttribute('aria-label','Compartir esta publicación');
    const label = document.createElement('span');
    label.className = 'r2d-share-quick__label';
    label.textContent = 'Compartir por:';
    const actions = document.createElement('div');
    actions.className = 'r2d-share-quick__actions';
    const links = destinations(url,title);
    social.forEach(target => {
      const a = document.createElement('a');
      a.className = 'r2d-share-quick__link r2d-share-quick__link--' + target.id;
      a.href = links[target.id];
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.setAttribute('aria-label', 'Compartir en ' + target.name);
      a.title = 'Compartir en ' + target.name;
      a.innerHTML = svg[target.id];
      actions.appendChild(a);
    });
    actions.appendChild(copyButton(url));
    actions.appendChild(menu(url,title,placement));
    bar.append(label,actions);
    return bar;
  }

  // Fichas: una barra bajo los metadatos y otra al terminar la lectura.
  const top = document.querySelector('.article-body .article-meta');
  const end = document.querySelector('.article-body .article-end');
  if (top || end) {
    const canonical = articlePublicUrl();
    const title = (document.querySelector('.article-heading h1')?.textContent || document.title || 'Reseña').trim() + ' — Nora Montalba';
    if (top && !top.querySelector('.r2d-share-quick')) {
      top.querySelectorAll('.copy-link-btn--top').forEach(button => button.remove());
      top.appendChild(shareBar(canonical,title,'top'));
    }
    if (end && !end.querySelector('.r2d-share-quick')) {
      end.querySelectorAll('.copy-link-btn--bottom').forEach(button => button.remove());
      end.appendChild(shareBar(canonical,title,'bottom'));
    }
  }

  // Índice: las tarjetas comparten el enlace de SU ficha, no el del catálogo.
  const catalog = document.querySelector('#review-list');
  if (catalog) {
    const canonical = document.querySelector('link[rel="canonical"]')?.href || window.location.href;
    const base = canonical.endsWith('/') ? canonical : new URL('.',canonical).href;
    catalog.querySelectorAll('.review-card').forEach(card => {
      const footer = card.querySelector('.review-card__foot');
      const link = footer?.querySelector('a[href]');
      const body = card.querySelector('.review-card__body');
      if (!footer || !link || !body || body.querySelector('.r2d-share-card-slot')) return;
      footer.querySelectorAll('.copy-link-btn--card').forEach(button => button.remove());
      const url = new URL(link.getAttribute('href'),base).href;
      const title = (card.querySelector('h3 a')?.textContent || 'Publicación').trim() + ' — Nora Montalba';
      const slot = document.createElement('div');
      slot.className = 'r2d-share-card-slot';
      slot.appendChild(shareBar(url,title,'card',true));
      body.appendChild(slot);
    });
  }

  // Acciones de copiar: el mismo comportamiento para todas las barras.
  document.addEventListener('click', async event => {
    const button = event.target.closest('.r2d-share-quick__copy[data-r2d-copy-url]');
    if (!button || button.disabled) return;
    event.preventDefault();
    button.disabled = true;
    const success = await copyUrl(button.dataset.r2dCopyUrl);
    if (!success) window.prompt('Copia este enlace:',button.dataset.r2dCopyUrl);
    button.classList.toggle('is-copied',success);
    button.classList.toggle('is-error',!success);
    const span = button.querySelector('.r2d-share-copy-label');
    if (span) span.textContent = success ? '¡Copiado!' : 'Copiar enlace';
    window.setTimeout(() => {
      if (span) span.textContent = 'Copiar enlace';
      button.classList.remove('is-copied','is-error');
      button.disabled = false;
    },1900);
  });
  document.addEventListener('click', event => {
    if (event.target.closest('.r2d-share-menu')) return;
    menus.forEach(m => { if (m.open) m.open = false; });
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const open = menus.filter(m => m.open);
    open.forEach(m => { m.open=false; m.querySelector('summary')?.focus(); });
  });
})();
