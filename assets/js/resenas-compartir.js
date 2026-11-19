/* Reto a Dos: compartir reseñas y reflexiones copiando sus enlaces públicos. */
(() => {
  'use strict';
  const canonical = document.querySelector('link[rel="canonical"]')?.href || window.location.href;
  const icon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></svg>';
  function shareButton(url, label, className) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'copy-link-btn ' + className;
    button.setAttribute('aria-label', 'Copiar enlace para compartir esta publicación');
    button.title = 'Copia el enlace para enviarlo por WhatsApp, correo u otra aplicación';
    button.dataset.copyUrl = url;
    button.innerHTML = icon + '<span class="copy-link-btn__label"></span>';
    button.querySelector('span').textContent = label;
    button.dataset.originalLabel = label;
    return button;
  }
  function copyFallback(value) {
    const textArea = document.createElement('textarea');
    textArea.value = value;
    textArea.setAttribute('readonly', '');
    textArea.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0;';
    document.body.appendChild(textArea);
    textArea.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (_) { /* no disponible */ }
    textArea.remove();
    return ok;
  }
  async function copyUrl(value) {
    if (navigator.clipboard && window.isSecureContext) {
      try { await navigator.clipboard.writeText(value); return true; }
      catch (_) { /* Intentar alternativa en navegadores restrictivos. */ }
    }
    return copyFallback(value);
  }
  const catalog = document.querySelector('#review-list');
  if (catalog) {
    const base = canonical.endsWith('/') ? canonical : new URL('.', canonical).href;
    catalog.querySelectorAll('.review-card__foot').forEach(footer => {
      const read = footer.querySelector('a[href]');
      if (!read || footer.querySelector('.copy-link-btn')) return;
      const publicUrl = new URL(read.getAttribute('href'), base).href;
      footer.appendChild(shareButton(publicUrl, 'Copiar enlace', 'copy-link-btn--card'));
    });
  }
  const articleMeta = document.querySelector('.article-body .article-meta');
  if (articleMeta && !articleMeta.querySelector('.copy-link-btn')) {
    articleMeta.appendChild(shareButton(canonical, 'Compartir', 'copy-link-btn--top'));
  }
  const articleEnd = document.querySelector('.article-body .article-end');
  if (articleEnd && !articleEnd.querySelector('.copy-link-btn')) {
    articleEnd.appendChild(shareButton(canonical, 'Compartir', 'copy-link-btn--bottom'));
  }
  document.addEventListener('click', async event => {
    const button = event.target.closest('.copy-link-btn[data-copy-url]');
    if (!button) return;
    event.preventDefault();
    if (button.disabled) return;
    button.disabled = true;
    const success = await copyUrl(button.dataset.copyUrl);
    button.classList.toggle('is-copied', success);
    button.classList.toggle('is-error', !success);
    button.querySelector('.copy-link-btn__label').textContent = success ? '¡Enlace copiado!' : 'Copiar manualmente';
    if (!success) {
      // Si el navegador bloquea el portapapeles, permitir copiar la URL.
      window.prompt('Copia este enlace:', button.dataset.copyUrl);
    }
    window.setTimeout(() => {
      button.querySelector('.copy-link-btn__label').textContent = button.dataset.originalLabel;
      button.classList.remove('is-copied', 'is-error');
      button.disabled = false;
    }, 1900);
  });
})();
