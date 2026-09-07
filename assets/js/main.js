(() => {
  const header = document.querySelector('[data-header]');
  const menuButton = document.querySelector('[data-menu-button]');
  const nav = document.querySelector('[data-nav]');
  const toast = document.querySelector('[data-toast]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let toastTimer;

  const consent = window.retoADosConsent;
  const cookieBanner = document.querySelector('[data-cookie-banner]');
  const cookieAccept = document.querySelector('[data-cookie-accept]');
  const cookieReject = document.querySelector('[data-cookie-reject]');
  const cookieSettings = document.querySelectorAll('[data-cookie-settings]');

  const showCookieBanner = () => {
    if (!cookieBanner) return;
    cookieBanner.hidden = false;
    window.setTimeout(() => cookieBanner.classList.add('is-visible'), 20);
    cookieReject?.focus({ preventScroll: true });
  };

  const hideCookieBanner = () => {
    if (!cookieBanner) return;
    cookieBanner.classList.remove('is-visible');
    window.setTimeout(() => { cookieBanner.hidden = true; }, 240);
  };

  const chooseCookies = (choice) => {
    const previousChoice = consent?.readChoice();
    consent?.saveChoice(choice);
    if (choice === 'accepted') {
      consent?.loadTagManager();
      hideCookieBanner();
      return;
    }
    consent?.clearAnalyticsCookies();
    hideCookieBanner();
    if (previousChoice === 'accepted') window.setTimeout(() => window.location.reload(), 260);
  };

  if (!consent?.readChoice()) showCookieBanner();
  cookieAccept?.addEventListener('click', () => chooseCookies('accepted'));
  cookieReject?.addEventListener('click', () => chooseCookies('rejected'));
  cookieSettings.forEach((button) => button.addEventListener('click', (event) => {
    event.preventDefault();
    showCookieBanner();
  }));

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

  const dialog = document.querySelector('[data-book-dialog]');
  const dialogCoverImage = document.querySelector('[data-dialog-cover-image]');
  const dialogCoverPlaceholder = document.querySelector('[data-dialog-cover-placeholder]');
  const dialogTitle = document.querySelector('[data-dialog-title]');
  const dialogShort = document.querySelector('[data-dialog-short]');
  const dialogSubtitle = document.querySelector('[data-dialog-subtitle]');
  const dialogDescription = document.querySelector('[data-dialog-description]');
  const dialogAudience = document.querySelector('[data-dialog-audience]');
  const dialogStatus = document.querySelector('[data-dialog-status]');
  const dialogAmazon = document.querySelector('[data-dialog-amazon]');
  const dialogClose = document.querySelector('[data-dialog-close]');
  const dialogGuide = document.querySelector('[data-dialog-guide]');

  const bookCards = document.querySelectorAll('[data-book-card]');

  bookCards.forEach((card) => {
    card.addEventListener('click', () => {
      if (!dialog || typeof dialog.showModal !== 'function') return;
      const title = card.dataset.title || '';
      const shortTitle = title.replace(/^Duelo de /, '').replace(/^Duelo /, '');
      dialog.dataset.theme = card.dataset.theme || 'cities';
      if (dialogTitle) dialogTitle.textContent = title;
      if (dialogShort) dialogShort.textContent = shortTitle;
      if (dialogSubtitle) dialogSubtitle.textContent = card.dataset.subtitle || '';
      if (dialogDescription) dialogDescription.textContent = card.dataset.description || '';
      if (dialogAudience) dialogAudience.textContent = card.dataset.audience || '';
      if (dialogStatus) dialogStatus.textContent = card.dataset.status || 'Amazon pendiente';
      if (dialogAmazon) {
        dialogAmazon.dataset.book = title;
        dialogAmazon.textContent = card.dataset.status === 'En preparación' ? 'Enlace de Amazon pendiente' : 'Próximamente en Amazon';
      }
      const cover = card.dataset.cover || '';
      if (dialogCoverImage) {
        dialogCoverImage.hidden = !cover;
        if (cover) {
          dialogCoverImage.src = cover;
          dialogCoverImage.alt = card.dataset.coverAlt || `Portada de ${title}`;
        }
      }
      if (dialogCoverPlaceholder) {
        dialogCoverPlaceholder.hidden = Boolean(cover);
        dialogCoverPlaceholder.className = `dialog-cover theme-${card.dataset.theme || 'cities'}`;
      }
      dialog.showModal();
    });
  });

  const supportsCardTilt = !reducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (supportsCardTilt) {
    bookCards.forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const bounds = card.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
        const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
        card.style.setProperty('--book-tilt-x', `${((.5 - y) * 5).toFixed(2)}deg`);
        card.style.setProperty('--book-tilt-y', `${((x - .5) * 6).toFixed(2)}deg`);
        card.style.setProperty('--book-glow-x', `${(x * 100).toFixed(1)}%`);
        card.style.setProperty('--book-glow-y', `${(y * 100).toFixed(1)}%`);
      });

      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--book-tilt-x', '0deg');
        card.style.setProperty('--book-tilt-y', '0deg');
        card.style.setProperty('--book-glow-x', '50%');
        card.style.setProperty('--book-glow-y', '38%');
      });
    });
  }

  dialogClose?.addEventListener('click', () => dialog?.close());
  dialogGuide?.addEventListener('click', () => dialog?.close());
  dialog?.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  document.querySelectorAll('[data-year]').forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  const revealItems = document.querySelectorAll('.reveal');
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
