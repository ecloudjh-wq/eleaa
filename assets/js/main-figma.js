(() => {
  const items=[...document.querySelectorAll('.reveal')];
  if('IntersectionObserver' in window){
    const io=new IntersectionObserver((entries)=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -7%'});
    items.forEach(el=>io.observe(el));
  } else items.forEach(el=>el.classList.add('in'));
  document.querySelector('.to-top')?.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
})();


(() => {
  const modal = document.getElementById('meetVideoModal');
  const player = document.getElementById('meetVideoPlayer');
  const triggers = [...document.querySelectorAll('.meet-video-trigger')];
  if (!modal || !player || !triggers.length) return;

  let lastTrigger = null;
  const openModal = (trigger) => {
    lastTrigger = trigger || document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('video-modal-open');
    try { player.currentTime = 0; } catch (_) {}
    const playPromise = player.play();
    if (playPromise && typeof playPromise.catch === 'function') playPromise.catch(() => {});
    modal.querySelector('.video-modal-close')?.focus({preventScroll:true});
  };

  const closeModal = () => {
    if (!modal.classList.contains('is-open')) return;
    player.pause();
    try { player.currentTime = 0; } catch (_) {}
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('video-modal-open');
    lastTrigger?.focus?.({preventScroll:true});
  };

  triggers.forEach(trigger => trigger.addEventListener('click', () => openModal(trigger)));
  modal.querySelectorAll('[data-video-close]').forEach(el => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });
})();


/* === Data Moat number count-up === */
(() => {
  const counters = [...document.querySelectorAll('.stats .count-up')];
  if (!counters.length) return;

  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const duration = 1800;
  const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

  const finalText = (el) => {
    const end = Number(el.dataset.countupValue || 0);
    if (el.classList.contains('count-up-range')) {
      const start = Number(el.dataset.countupFrom || 0);
      return `${start}-${end} years`;
    }
    return `${end}${el.dataset.countupUnit || ''}`;
  };

  const animateCounter = (el) => {
    if (el.dataset.countupPlayed === 'true') return;
    el.dataset.countupPlayed = 'true';

    if (reduced) {
      el.textContent = finalText(el);
      return;
    }

    const end = Number(el.dataset.countupValue || 0);
    const rangeStart = Number(el.dataset.countupFrom || 0);
    const unit = el.dataset.countupUnit || '';
    const delay = Number(el.dataset.countupDelay || 0);

    window.setTimeout(() => {
      const started = performance.now();
      const frame = (now) => {
        const progress = Math.min(1, (now - started) / duration);
        const eased = easeOutCubic(progress);

        if (el.classList.contains('count-up-range')) {
          const currentStart = Math.round(rangeStart * eased);
          const currentEnd = Math.round(end * eased);
          el.textContent = `${currentStart}-${currentEnd} years`;
        } else {
          const current = Math.round(end * eased);
          el.textContent = `${current}${unit}`;
        }

        if (progress < 1) requestAnimationFrame(frame);
        else el.textContent = finalText(el);
      };
      requestAnimationFrame(frame);
    }, delay);
  };

  const stats = document.querySelector('.data-moat .stats');
  if (!stats || !('IntersectionObserver' in window)) {
    counters.forEach(animateCounter);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      counters.forEach(animateCounter);
      observer.disconnect();
    });
  }, { threshold: 0.35 });

  observer.observe(stats);
})();
