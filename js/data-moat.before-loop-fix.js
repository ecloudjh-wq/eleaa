(() => {
  const header = document.querySelector('.site-header');
  const menu = document.querySelector('.menu-toggle');
  menu?.addEventListener('click', () => {
    const open = header.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Why Child Data Matters: 3초 간격 자동 탭 전환
  document.querySelectorAll('[data-autoplay-tabs]').forEach((group) => {
    const tabs = [...group.querySelectorAll('.why-tab')];
    if (!tabs.length) return;

    let current = Math.max(0, tabs.findIndex(tab => tab.classList.contains('active')));
    const interval = Number(group.dataset.interval || 3000);
    let timer;

    const activate = (idx) => {
      current = idx;
      tabs.forEach((tab, i) => {
        const active = i === idx;
        tab.classList.toggle('active', active);
        tab.setAttribute('aria-selected', String(active));
      });
    };

    const restart = () => {
      window.clearInterval(timer);
      timer = window.setInterval(() => activate((current + 1) % tabs.length), interval);
    };

    tabs.forEach((tab, idx) => {
      tab.addEventListener('click', () => {
        activate(idx);
        restart();
      });
    });

    activate(current);
    restart();
  });

  document.querySelectorAll('[data-accordion]').forEach((accordion) => {
    const items = [...accordion.querySelectorAll('.accordion-item')];
    if (!items.length) return;
    let current = Math.max(0, items.findIndex(item => item.classList.contains('active')));
    let timer;

    const activate = (idx) => {
      current = idx;
      items.forEach((item, i) => item.classList.toggle('active', i === idx));
    };
    const restart = () => {
      window.clearInterval(timer);
      timer = window.setInterval(() => activate((current + 1) % items.length), 3000);
    };

    items.forEach((item, idx) => {
      item.querySelector('button')?.addEventListener('click', () => {
        activate(idx);
        restart();
      });
    });
    restart();
  });

  const nodes = [...document.querySelectorAll('.loop-node')];
  let current = 0;
  const activate = (idx) => {
    current = idx;
    nodes.forEach((n, i) => n.classList.toggle('active', i === idx));
  };
  nodes.forEach((n, idx) => n.addEventListener('click', () => activate(idx)));
  setInterval(() => activate((current + 1) % nodes.length), 3000);
})();
