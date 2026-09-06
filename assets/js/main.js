(() => {
  const header = document.querySelector('[data-header]');
  const menuButton = document.querySelector('[data-menu-button]');
  const nav = document.querySelector('[data-nav]');
  const toast = document.querySelector('[data-toast]');
  let toastTimer;

  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 30);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
    });
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
      menuButton.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
    }));
  }

  const showAmazonNotice = (title = '') => {
    if (!toast) return;
    toast.textContent = title
      ? `El enlace de ${title} se añadirá cuando esté publicado en Amazon.`
      : 'Los enlaces de Amazon se añadirán cuando los libros estén publicados.';
    clearTimeout(toastTimer);
    toast.classList.add('is-visible');
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 3800);
  };

  document.querySelectorAll('[data-amazon-link]').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (link.getAttribute('href') !== '#amazon-pendiente') return;
      event.preventDefault();
      showAmazonNotice(link.dataset.book || '');
    });
  });

  document.querySelectorAll('[data-contact-link]').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (link.getAttribute('href') !== '#contacto-pendiente') return;
      event.preventDefault();
      if (!toast) return;
      toast.textContent = 'El correo de contacto de Nora Montalba se añadirá aquí.';
      clearTimeout(toastTimer);
      toast.classList.add('is-visible');
      toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 3800);
    });
  });

  const dialog = document.querySelector('[data-book-dialog]');
  const dialogCover = document.querySelector('[data-dialog-cover]');
  const dialogTitle = document.querySelector('[data-dialog-title]');
  const dialogShort = document.querySelector('[data-dialog-short]');
  const dialogSubtitle = document.querySelector('[data-dialog-subtitle]');
  const dialogDescription = document.querySelector('[data-dialog-description]');
  const dialogAmazon = document.querySelector('[data-dialog-amazon]');
  const dialogClose = document.querySelector('[data-dialog-close]');

  document.querySelectorAll('[data-book-card]').forEach((card) => {
    card.addEventListener('click', () => {
      if (!dialog || typeof dialog.showModal !== 'function') return;
      const title = card.dataset.title || '';
      const shortTitle = title.replace(/^Duelo de /, '').replace(/^Duelo /, '');
      if (dialogTitle) dialogTitle.textContent = title;
      if (dialogShort) dialogShort.textContent = shortTitle;
      if (dialogSubtitle) dialogSubtitle.textContent = card.dataset.subtitle || '';
      if (dialogDescription) dialogDescription.textContent = card.dataset.description || '';
      if (dialogAmazon) dialogAmazon.dataset.book = title;
      if (dialogCover) dialogCover.className = `dialog-cover theme-${card.dataset.theme || 'cities'}`;
      dialog.showModal();
    });
  });

  dialogClose?.addEventListener('click', () => dialog?.close());
  dialog?.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  document.querySelectorAll('[data-year]').forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  const revealItems = document.querySelectorAll('.reveal');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: .12, rootMargin: '0px 0px -35px' });
    revealItems.forEach((item) => observer.observe(item));
  }
})();
