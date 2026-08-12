(() => {
  const triggers = document.querySelectorAll('.footer .family, .site-footer .family-site');
  if (!triggers.length) return;

  const closeAll = (except = null) => {
    document.querySelectorAll('.family-menu.is-open').forEach(menu => {
      if (menu === except) return;
      menu.classList.remove('is-open');
      menu.setAttribute('aria-hidden', 'true');
    });
    triggers.forEach(trigger => {
      const scope = trigger.closest('.footer-main, .footer-middle, .footer-mid');
      const menu = scope && scope.querySelector('.family-menu');
      if (menu !== except) trigger.setAttribute('aria-expanded', 'false');
    });
  };

  triggers.forEach(trigger => {
    const scope = trigger.closest('.footer-main, .footer-middle, .footer-mid');
    const menu = scope && scope.querySelector('.family-menu');
    if (!menu) return;
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-haspopup', 'true');

    const toggle = (event) => {
      event.preventDefault();
      event.stopPropagation();
      const nextOpen = !menu.classList.contains('is-open');
      closeAll(menu);
      menu.classList.toggle('is-open', nextOpen);
      menu.setAttribute('aria-hidden', nextOpen ? 'false' : 'true');
      trigger.setAttribute('aria-expanded', nextOpen ? 'true' : 'false');
    };

    trigger.addEventListener('click', toggle);
    trigger.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') toggle(event);
    });
  });

  document.addEventListener('click', () => closeAll());
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeAll();
  });
})();
