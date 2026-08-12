(() => {
  'use strict';

  const doc = document;
  const root = doc.documentElement;
  const body = doc.body;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isCoarse = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  root.classList.remove('no-js');
  root.classList.add('js');

  const q = (selector, context = doc) => context.querySelector(selector);
  const qa = (selector, context = doc) => Array.from(context.querySelectorAll(selector));
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  /* ---------- loader ---------- */
  const loader = q('.page-loader');
  const hideLoader = () => {
    if (!loader) return;
    loader.classList.add('is-hidden');
    window.setTimeout(() => loader.remove(), 1050);
  };
  window.addEventListener('load', hideLoader, { once: true });
  window.setTimeout(hideLoader, 1700);

  /* ---------- scroll progress + header tone ---------- */
  const progressBar = q('.scroll-progress span');
  const header = q('[data-header]');
  const toneSections = qa('[data-header-tone]');
  let lastY = window.scrollY;
  let ticking = false;

  const updateGlobalScroll = () => {
    const y = window.scrollY;
    const max = Math.max(doc.documentElement.scrollHeight - window.innerHeight, 1);
    if (progressBar) progressBar.style.transform = `scaleX(${clamp(y / max, 0, 1)})`;

    if (header) {
      header.classList.toggle('is-scrolled', y > 28);
      if (y > 360 && y > lastY + 8 && !body.classList.contains('is-lock')) {
        header.classList.add('is-hidden');
      } else if (y < lastY - 6 || y < 360) {
        header.classList.remove('is-hidden');
      }

      const sampleY = y + Math.min(window.innerHeight * 0.24, 220);
      let activeTone = 'dark';
      for (const section of toneSections) {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        if (sampleY >= top && sampleY < bottom) {
          activeTone = section.dataset.headerTone || 'dark';
          break;
        }
      }
      header.classList.toggle('is-light', activeTone === 'light');
    }

    qa('[data-parallax]').forEach((el) => {
      if (reducedMotion || window.innerWidth < 768) return;
      const rect = el.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const ratio = Number(el.dataset.parallax || 0.08);
      const shift = (window.innerHeight * 0.5 - (rect.top + rect.height * 0.5)) * ratio;
      el.style.transform = `translate3d(0, ${shift}px, 0) scale(1.08)`;
    });

    lastY = y;
    ticking = false;
  };

  const requestGlobalScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateGlobalScroll);
      ticking = true;
    }
  };
  window.addEventListener('scroll', requestGlobalScroll, { passive: true });
  window.addEventListener('resize', requestGlobalScroll);
  updateGlobalScroll();

  /* ---------- menus ---------- */
  const language = q('.language-select');
  const languageCurrent = q('.language-current');
  if (language && languageCurrent) {
    languageCurrent.addEventListener('click', (event) => {
      event.stopPropagation();
      const open = language.classList.toggle('is-open');
      languageCurrent.setAttribute('aria-expanded', String(open));
    });
    doc.addEventListener('click', (event) => {
      if (!language.contains(event.target)) {
        language.classList.remove('is-open');
        languageCurrent.setAttribute('aria-expanded', 'false');
      }
    });
  }

  const allMenu = q('.all-menu-panel');
  const allMenuOpen = q('.grid-menu');
  const allMenuClose = q('.all-menu-close');
  const setAllMenu = (open) => {
    if (!allMenu) return;
    allMenu.classList.toggle('is-open', open);
    allMenu.setAttribute('aria-hidden', String(!open));
    body.classList.toggle('is-lock', open);
    if (open) allMenuClose?.focus();
  };
  allMenuOpen?.addEventListener('click', () => setAllMenu(true));
  allMenuClose?.addEventListener('click', () => setAllMenu(false));
  qa('.all-menu-panel a').forEach((link) => link.addEventListener('click', () => setAllMenu(false)));

  const mobileToggle = q('.mobile-toggle');
  const gnb = q('.gnb');
  mobileToggle?.addEventListener('click', () => {
    const open = gnb?.classList.toggle('is-open') || false;
    mobileToggle.setAttribute('aria-expanded', String(open));
    body.classList.toggle('is-lock', open);
  });
  qa('.gnb a').forEach((link) => link.addEventListener('click', () => {
    gnb?.classList.remove('is-open');
    mobileToggle?.setAttribute('aria-expanded', 'false');
    body.classList.remove('is-lock');
  }));

  doc.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    setAllMenu(false);
    language?.classList.remove('is-open');
    languageCurrent?.setAttribute('aria-expanded', 'false');
    gnb?.classList.remove('is-open');
    mobileToggle?.setAttribute('aria-expanded', 'false');
    body.classList.remove('is-lock');
  });

  /* ---------- active navigation ---------- */
  const currentFile = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  qa('.gnb a').forEach((link) => {
    const href = link.getAttribute('href') || '';
    const targetFile = (href.split('#')[0] || 'index.html').split('/').pop().toLowerCase();
    let active = false;
    if (currentFile === 'data-moat.html') active = targetFile === 'data-moat.html';
    else if (currentFile === 'technology.html') active = targetFile === 'technology.html';
    else if (currentFile === 'learning-experience.html') active = targetFile === 'learning-experience.html';
    else active = href.includes('#main-visual') || href === 'index.html';
    link.classList.toggle('is-active', active);
  });

  /* ---------- split-line fallback ---------- */
  qa('.split-lines').forEach((el) => {
    if (el.dataset.splitReady === 'true') return;
    el.dataset.splitReady = 'true';
    if (window.SplitType && !reducedMotion) {
      try {
        const split = new window.SplitType(el, { types: 'lines', lineClass: 'line' });
        split.lines.forEach((line) => {
          const inner = doc.createElement('span');
          inner.className = 'line-inner';
          while (line.firstChild) inner.appendChild(line.firstChild);
          line.appendChild(inner);
        });
        return;
      } catch (_) { /* use fallback */ }
    }
    const original = el.innerHTML;
    el.innerHTML = `<span class="line"><span class="line-inner">${original}</span></span>`;
  });

  /* ---------- reveal observer ---------- */
  const revealTargets = qa('.reveal-up, .reveal-scale, .image-reveal, .split-lines');
  const revealNow = (el) => el.classList.add('is-inview');
  if ('IntersectionObserver' in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const delay = Number(entry.target.dataset.delay || 0);
        window.setTimeout(() => revealNow(entry.target), delay);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.13, rootMargin: '0px 0px -8% 0px' });
    revealTargets.forEach((el) => revealObserver.observe(el));
  } else {
    revealTargets.forEach(revealNow);
  }

  /* ---------- count up ---------- */
  qa('[data-count]').forEach((el) => {
    let played = false;
    const run = () => {
      if (played) return;
      played = true;
      const target = Number(el.dataset.count || 0);
      if (reducedMotion) {
        el.textContent = target.toLocaleString('ko-KR');
        return;
      }
      const start = performance.now();
      const duration = 1300;
      const frame = (now) => {
        const t = clamp((now - start) / duration, 0, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(target * eased).toLocaleString('ko-KR');
        if (t < 1) window.requestAnimationFrame(frame);
      };
      window.requestAnimationFrame(frame);
    };
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          run();
          observer.disconnect();
        }
      }, { threshold: 0.45 });
      observer.observe(el);
    } else run();
  });

  /* ---------- reusable active switcher ---------- */
  const bindSwitcher = (scope, buttonSelector, imageSelector, indexReader) => {
    if (!scope) return;
    const buttons = qa(buttonSelector, scope);
    const images = qa(imageSelector, scope);
    const ringArrow = q('.agentic-arrow-wrap', scope);
    let currentIndex = 0;
    let currentRotation = 0;
    let timer;

    const activate = (index) => {
      if (index < 0 || index >= buttons.length) return;
      
      // Arrow rotation logic
      if (ringArrow) {
          if (index === 0 && currentIndex === buttons.length - 1) {
              currentRotation += 72;
          } else if (index === currentIndex + 1) {
              currentRotation += 72;
          } else {
              currentRotation = Math.floor(currentRotation / 360) * 360 + (index * 72);
          }
          ringArrow.style.transform = `rotate(${currentRotation}deg)`;
      }
      
      currentIndex = index;
      buttons.forEach((button, i) => {
        const active = i === index;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
      });
      images.forEach((image, i) => image.classList.toggle('is-active', i === index));
    };

    const startTimer = () => {
      clearInterval(timer);
      if (!reducedMotion && buttons.length > 1) {
        timer = setInterval(() => activate((currentIndex + 1) % buttons.length), 3000);
      }
    };

    buttons.forEach((button, i) => {
      const index = indexReader ? indexReader(button, i) : i;
      ['click'].forEach((type) => button.addEventListener(type, () => {
        activate(index);
        startTimer();
      }));
    });

    activate(Math.max(buttons.findIndex((button) => button.classList.contains('is-active')), 0));
    startTimer();
  };

  qa('[data-service-section]').forEach((scope) => bindSwitcher(
    scope,
    '[data-service]',
    '.service-backgrounds img',
    (button) => Number(button.dataset.service)
  ));

  qa('[data-merit]').forEach((scope) => bindSwitcher(
    scope,
    '[data-merit-index]',
    '.merit-images img',
    (button) => Number(button.dataset.meritIndex)
  ));

  
  qa('[data-agentic-section]').forEach((scope) => bindSwitcher(
    scope,
    '.agentic-node',
    '.agentic-desc-item',
    (button, i) => i
  ));

  qa('[data-interaction]').forEach((scope) => bindSwitcher(
    scope,
    '[data-interaction-index]',
    '.interaction-backgrounds img',
    (button) => Number(button.dataset.interactionIndex)
  ));

  qa('[data-language-list]').forEach((scope) => {
    const rows = qa('.language-row', scope);
    const activate = (index) => rows.forEach((row, i) => row.classList.toggle('is-active', i === index));
    rows.forEach((row, i) => {
      ['mouseenter', 'focus', 'click'].forEach((type) => row.addEventListener(type, () => activate(i)));
    });
  });

  /* ---------- tabs ---------- */
  qa('[data-tabs]').forEach((tabs) => {
    const buttons = qa('.tab-buttons button', tabs);
    const panels = qa('.tab-panel', tabs);
    let currentIndex = 0;
    let timer;
    const activate = (index) => {
      currentIndex = index;
      buttons.forEach((button, i) => {
        button.classList.toggle('is-active', i === index);
        button.setAttribute('aria-selected', String(i === index));
      });
      panels.forEach((panel, i) => panel.classList.toggle('is-active', i === index));
    };
    const startTimer = () => {
      clearInterval(timer);
      if(!reducedMotion) {
        timer = setInterval(() => {
          activate((currentIndex + 1) % buttons.length);
        }, 3000);
      }
    };
    buttons.forEach((button, i) => button.addEventListener('click', () => {
      activate(i);
      startTimer();
    }));
    
    
    activate(Math.max(buttons.findIndex((button) => button.classList.contains('is-active')), 0));
    startTimer();
  });

  /* ---------- learning flow ---------- */
  qa('[data-learning-flow]').forEach((scope) => {
    const steps = qa('.flow-steps li', scope);
    const images = qa('.flow-image img', scope);
    const activate = (index) => {
      steps.forEach((step, i) => step.classList.toggle('is-active', i === index));
      images.forEach((image, i) => image.classList.toggle('is-active', i === index));
    };
    steps.forEach((step, i) => {
      step.tabIndex = 0;
      step.addEventListener('click', () => activate(i));
      step.addEventListener('focus', () => activate(i));
    });
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = steps.indexOf(entry.target);
          if (index >= 0) activate(index);
        });
      }, { threshold: 0.58, rootMargin: '-20% 0px -20% 0px' });
      steps.forEach((step) => observer.observe(step));
    }
  });

  /* ---------- pointer tilt ---------- */
  if (!isCoarse && !reducedMotion) {
    qa('.tilt').forEach((card) => {
      card.addEventListener('mousemove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(1100px) rotateX(${-y * 4}deg) rotateY(${x * 5}deg) translateY(-5px)`;
        const image = q('img', card);
        if (image) image.style.transform = `scale(1.055) translate(${x * -10}px, ${y * -8}px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        const image = q('img', card);
        if (image) image.style.transform = '';
      });
    });

    qa('.magnetic').forEach((el) => {
      el.addEventListener('mousemove', (event) => {
        const rect = el.getBoundingClientRect();
        const x = event.clientX - (rect.left + rect.width / 2);
        const y = event.clientY - (rect.top + rect.height / 2);
        el.style.transform = `translate(${x * 0.12}px, ${y * 0.14}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- GSAP / Lenis progressive enhancement ---------- */
  if (!reducedMotion && window.gsap && window.ScrollTrigger) {
    const gsap = window.gsap;
    gsap.registerPlugin(window.ScrollTrigger);

    if (window.Lenis) {
      try {
        const lenis = new window.Lenis({ duration: 1.05, smoothWheel: true, wheelMultiplier: 0.9, touchMultiplier: 1.05 });
        lenis.on('scroll', window.ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
      } catch (_) { /* native scroll remains */ }
    }

    qa('.business-item').forEach((item, index) => {
      gsap.fromTo(item,
        { xPercent: index % 2 === 0 ? -7 : 7, opacity: 0.35 },
        { xPercent: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: item, start: 'top 88%', end: 'top 35%', scrub: 0.8 } }
      );
    });

    
    qa('.impact-card, .core-grid article, .assessment-pair article, .report-grid article').forEach((item, index) => {
      gsap.from(item, {
        y: 55,
        opacity: 0,
        duration: 0.9,
        delay: (index % 4) * 0.06,
        ease: 'power3.out',
        scrollTrigger: { trigger: item, start: 'top 88%', once: true }
      });
    });

    qa('[data-loop]').forEach((loop) => {
      gsap.to(loop, { rotation: 45, ease: 'none', scrollTrigger: { trigger: loop, start: 'top bottom', end: 'bottom top', scrub: 1 } });
      qa('.loop-node', loop).forEach((node) => gsap.to(node, { rotation: -45, ease: 'none', scrollTrigger: { trigger: loop, start: 'top bottom', end: 'bottom top', scrub: 1 } }));
    });



    qa('.hero-media img, .sub-hero-media img, .contact-media img').forEach((image) => {
      gsap.fromTo(image, { scale: 1.08 }, { scale: 1.18, ease: 'none', scrollTrigger: { trigger: image.parentElement, start: 'top top', end: 'bottom top', scrub: true } });
    });
  }

  /* ---------- iframe responsive + accessible title ---------- */
  qa('.youtube-shell iframe').forEach((iframe) => {
    iframe.removeAttribute('width');
    iframe.removeAttribute('height');
    iframe.setAttribute('loading', 'lazy');
  });

  /* ---------- smooth in-page anchors fallback ---------- */
  qa('a[href*="#"]').forEach((anchor) => {
    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;
    const [path, hash] = href.split('#');
    const samePage = !path || path === currentFile || (path === 'index.html' && currentFile === 'index.html');
    if (!samePage || !hash) return;
    anchor.addEventListener('click', (event) => {
      const target = doc.getElementById(hash);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
      history.replaceState(null, '', `#${hash}`);
    });
  });
})();

/* ELEA 260805 rebuilt interactions */
(() => {
  const q=(s,c=document)=>c.querySelector(s), qa=(s,c=document)=>[...c.querySelectorAll(s)];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;

  qa('[data-learning-flow]').forEach(scope=>{
    const buttons=qa('[data-flow-index]',scope), images=qa('.flow-image img',scope), indicator=q('.flow-indicator',scope), current=q('.flow-current',scope), next=q('.flow-next',scope);
    const data=[
      ['01','Textbook Input','교재·레벨·학습 목표 입력'],['02','Lesson Understanding','수업 흐름과 학습 목표 이해'],['03','AI Interaction','ELEA와 1:1 대화 및 발화 훈련'],['04','Speaking & Writing Assessment','말하기·쓰기 결과 분석'],['05','Feedback & Learning Report','학습자 피드백과 학습 리포트 제공']
    ];
    let index=0;
    const activate=(i)=>{index=(i+buttons.length)%buttons.length;buttons.forEach((b,n)=>b.classList.toggle('is-active',n===index));images.forEach((im,n)=>im.classList.toggle('is-active',n===index));if(indicator) indicator.style.transform=`translateX(${index*100}%)`;if(current){current.animate?.([{opacity:.25,transform:'translateY(8px)'},{opacity:1,transform:'none'}],{duration:420,easing:'cubic-bezier(.22,1,.36,1)'});current.innerHTML=`<span class="flow-current-number">${data[index][0]}</span><div><h3>${data[index][1]}</h3><p>${data[index][2]}</p></div>`;}};
    buttons.forEach((b,i)=>b.addEventListener('click',()=>activate(i)));next?.addEventListener('click',()=>activate(index+1));activate(0);
  });

  qa('[data-language-carousel]').forEach(scope=>{
    const slides=qa('[data-language-slide]',scope), dots=qa('[data-language-index]',scope), num=q('.language-counter b',scope), bar=q('.language-progress span',scope);
    let index=0,timer;
    const start=()=>{clearInterval(timer);if(reduced)return;timer=setInterval(()=>activate(index+1),3000)};
    const progress=()=>{if(!bar)return;bar.getAnimations().forEach(a=>a.cancel());bar.style.transform='scaleX(0)';if(!reduced)bar.animate([{transform:'scaleX(0)'},{transform:'scaleX(1)'}],{duration:3000,easing:'linear',fill:'forwards'});else bar.style.transform='scaleX(1)'};
    const activate=(i)=>{index=(i+slides.length)%slides.length;slides.forEach((s,n)=>s.classList.toggle('is-active',n===index));dots.forEach((d,n)=>d.classList.toggle('is-active',n===index));if(num)num.textContent=String(index+1).padStart(2,'0');progress();start()};
    dots.forEach((d,i)=>d.addEventListener('click',()=>activate(i)));activate(0);
  });
})();

/* =========================================================
   260810 FIGMA MOTION PASS
   ========================================================= */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s,c=document) => c.querySelector(s);
  const $$ = (s,c=document) => [...c.querySelectorAll(s)];

  // Hide broken image glyphs while keeping the exact Figma frame ratio.
  $$('img').forEach(img => {
    const mark = () => img.dataset.loadError = 'true';
    img.addEventListener('error', mark, { once:true });
    if (img.complete && img.naturalWidth === 0) mark();
  });

  // Stagger copy without changing any text or markup hierarchy.
  $$('.business-caption,.service-stats,.merit-list,.product-grid,.impact-grid').forEach(group => {
    group.setAttribute('data-motion-group','');
  });

  if (reduced || !window.gsap || !window.ScrollTrigger) return;
  const gsap = window.gsap;
  const ST = window.ScrollTrigger;
  gsap.registerPlugin(ST);

  // Hero entrance: reference-like restrained sequence.
  const hero = $('.hero');
  if (hero) {
    const tl = gsap.timeline({defaults:{ease:'power3.out'}});
    tl.from('.hero .kicker',{y:18,opacity:0,duration:.7})
      .from('.hero .hero-title',{y:34,opacity:0,duration:1},'-=.42')
      .from('.hero .hero-sub,.hero .hero-sub-eng',{y:20,opacity:0,duration:.75,stagger:.1},'-=.55')
      .from('.hero .scroll-cue',{opacity:0,duration:.6},'-=.25');
  }

  // Image sections reveal with clip rather than exaggerated scale.
  $$('.media-card,.data-moat-image,.merit-images,.product-card figure,.youtube-shell').forEach((el) => {
    gsap.fromTo(el,
      {clipPath:'inset(0 0 18% 0 round 20px)', y:26},
      {clipPath:'inset(0 0 0% 0 round 20px)', y:0, duration:1.05, ease:'power3.out',
       scrollTrigger:{trigger:el,start:'top 86%',once:true}}
    );
  });

  // Caption/list stagger mirrors the visual reading order.
  $$('.business-caption').forEach((cap) => {
    gsap.from($$(':scope > *',cap),{
      y:18,opacity:0,duration:.65,stagger:.08,ease:'power3.out',
      scrollTrigger:{trigger:cap,start:'top 90%',once:true}
    });
  });
  $$('.merit-row').forEach((row,i) => {
    gsap.from(row,{x:28,opacity:0,duration:.72,delay:(i%3)*.07,ease:'power3.out',scrollTrigger:{trigger:row,start:'top 90%',once:true}});
  });

  // Subtle scroll parallax only on major editorial images.
  $$('.business-item .media-card img,.data-moat-image img').forEach(img => {
    gsap.fromTo(img,{yPercent:-3,scale:1.04},{yPercent:3,scale:1.04,ease:'none',scrollTrigger:{trigger:img.parentElement,start:'top bottom',end:'bottom top',scrub:.8}});
  });

  // Horizontal line draw for section labels, non-destructive pseudo accent.
  $$('.section-label').forEach(label => {
    if(label.querySelector('.figma-label-line')) return;
    const line=document.createElement('span');
    line.className='figma-label-line';
    line.setAttribute('aria-hidden','true');
    label.appendChild(line);
    gsap.fromTo(line,{scaleX:0},{scaleX:1,duration:.9,ease:'power3.out',scrollTrigger:{trigger:label,start:'top 90%',once:true}});
  });
})();
