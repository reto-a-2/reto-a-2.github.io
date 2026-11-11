/* Aviso de cookies para /resenas/: utiliza el consentimiento global de Reto a Dos. */
(() => {
  'use strict';
  const consent = window.retoADosConsent;
  const banner = document.querySelector('[data-cookie-banner]');
  const acceptButton = document.querySelector('[data-cookie-accept]');
  const rejectButton = document.querySelector('[data-cookie-reject]');
  const settingsButtons = document.querySelectorAll('[data-cookie-settings]');
  if (!consent || !banner || !acceptButton || !rejectButton) return;

  let hideTimer;
  const showBanner = () => {
    window.clearTimeout(hideTimer);
    banner.hidden = false;
    window.requestAnimationFrame(() => banner.classList.add('is-visible'));
    rejectButton.focus({ preventScroll: true });
  };
  const hideBanner = () => {
    banner.classList.remove('is-visible');
    hideTimer = window.setTimeout(() => { banner.hidden = true; }, 240);
  };
  const choose = (choice) => {
    const previous = consent.readChoice();
    consent.saveChoice(choice);
    if (choice === 'accepted') {
      consent.loadTagManager();
      hideBanner();
      return;
    }
    consent.clearAnalyticsCookies();
    hideBanner();
    // GTM ya cargado no puede descargarse de una página abierta: reiniciamos.
    if (previous === 'accepted') {
      window.setTimeout(() => window.location.reload(), 260);
    }
  };

  if (!consent.readChoice()) showBanner();
  acceptButton.addEventListener('click', () => choose('accepted'));
  rejectButton.addEventListener('click', () => choose('rejected'));
  settingsButtons.forEach((button) => button.addEventListener('click', (event) => {
    event.preventDefault();
    showBanner();
  }));
})();
