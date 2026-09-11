(() => {
  const storageKey = 'retoados_cookie_consent';
  const consentLifetime = 365 * 24 * 60 * 60 * 1000;
  const containerId = 'GTM-TZGV3L59';

  const readChoice = () => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (!stored) return null;
      if (stored === 'accepted' || stored === 'rejected') return stored;
      const record = JSON.parse(stored);
      if (!record?.choice || !record?.date || Date.now() - record.date > consentLifetime) {
        window.localStorage.removeItem(storageKey);
        return null;
      }
      return record.choice;
    } catch {
      return null;
    }
  };

  const saveChoice = (choice) => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify({ choice, date: Date.now() }));
    } catch {
      // La navegación sigue funcionando aunque el almacenamiento esté bloqueado.
    }
  };

  const loadTagManager = () => {
    if (document.querySelector('[data-retoados-gtm]')) return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    const firstScript = document.getElementsByTagName('script')[0];
    const tagManager = document.createElement('script');
    tagManager.async = true;
    tagManager.src = `https://www.googletagmanager.com/gtm.js?id=${containerId}`;
    tagManager.dataset.retoadosGtm = containerId;
    firstScript.parentNode.insertBefore(tagManager, firstScript);
  };

  const clearAnalyticsCookies = () => {
    const cookieNames = document.cookie
      .split(';')
      .map((cookie) => cookie.split('=')[0].trim())
      .filter((name) => name === '_ga' || name.startsWith('_ga_'));
    cookieNames.forEach((name) => {
      document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
      document.cookie = `${name}=; Max-Age=0; path=/; domain=.retoados.com; SameSite=Lax`;
    });
  };

  window.retoADosConsent = {
    readChoice,
    saveChoice,
    loadTagManager,
    clearAnalyticsCookies
  };

  if (readChoice() === 'accepted') loadTagManager();
})();
