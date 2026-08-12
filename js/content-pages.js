const observer=new IntersectionObserver((entries)=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('show')}),{threshold:.12});
document.querySelectorAll('.fade').forEach(el=>observer.observe(el));


// Source-built ELM visual: assemble once when it enters the viewport.
(() => {
  const visual = document.querySelector('.elm-source-visual');
  if (!visual) return;
  const activate = () => visual.classList.add('is-active');
  if (!('IntersectionObserver' in window)) { activate(); return; }
  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      activate();
      observer.unobserve(entry.target);
    });
  }, { threshold: .28 });
  io.observe(visual);
})();

// HUMAN-LIKE INTERACTION: 3-second auto rotation + manual tab selection.
(() => {
  const root = document.querySelector('[data-interaction-tabs]');
  if (!root) return;

  const tabs = [...root.querySelectorAll('[data-interaction-tab]')];
  const copy = root.querySelector('.interaction-copy');
  const standard = root.querySelector('.interaction-standard-copy');
  const environment = root.querySelector('.interaction-environment');
  const image = root.querySelector('.interaction-img img');
  if (!tabs.length || !copy || !standard || !environment) return;

  const isKo = (document.documentElement.lang || 'en').toLowerCase().startsWith('ko');
  const content = {
    voice: { title: 'Voice Interaction', description: isKo ? '학습자의 음성을 이해하고 대화와 발화 훈련으로 연결' : 'Understands learner speech and connects it to dialogue and speaking practice', alt: 'Voice Interaction' },
    face: { title: 'Facial Expression', description: isKo ? '학습 흐름과 응답에 맞는 표정과 반응 제공' : 'Provides facial expressions and responses aligned with the learning flow', alt: 'Facial Expression' },
    lip: { title: 'Lip Sync', description: isKo ? '음성과 입 모양을 동기화한 자연스러운 발화 표현' : 'Synchronizes voice and mouth movements for natural speech expression', alt: 'Lip Sync' },
    gesture: { title: 'Gesture', description: isKo ? '학습 내용과 반응에 맞는 동작과 제스처' : 'Uses movements and gestures aligned with learning content and responses', alt: 'Gesture' },
    environment: { title: isKo ? '운영 환경' : 'Operating Environment', alt: isKo ? '운영 환경' : 'Operating Environment' }
  };

  let index = 0;
  let timer = null;
  let switchTimer = null;
  const interval = 3000;

  const apply = (nextIndex, animate = true) => {
    index = (nextIndex + tabs.length) % tabs.length;
    const tab = tabs[index];
    const key = tab.dataset.interactionTab;
    const data = content[key];

    tabs.forEach((item, i) => {
      const active = i === index;
      item.classList.toggle('active', active);
      item.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    const render = () => {
      if (key === 'environment') {
        standard.hidden = true;
        environment.hidden = false;
      } else {
        environment.hidden = true;
        standard.hidden = false;
        standard.querySelector('h3').textContent = data.title;
        standard.querySelector('p').textContent = data.description;
      }
      if (image) image.alt = data.alt;
      copy.classList.remove('is-switching');
    };

    clearTimeout(switchTimer);
    if (!animate) return render();
    copy.classList.add('is-switching');
    switchTimer = setTimeout(render, 170);
  };

  const restart = () => {
    clearInterval(timer);
    timer = setInterval(() => apply(index + 1), interval);
  };

  tabs.forEach((tab, tabIndex) => {
    tab.addEventListener('click', () => {
      apply(tabIndex);
      restart();
    });
  });

  // Keep the 3-second cadence when the section is visible; avoid changing tabs off-screen.
  const sectionObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) restart();
        else clearInterval(timer);
      }, { threshold: .2 })
    : null;

  apply(0, false);
  if (sectionObserver) sectionObserver.observe(root);
  else restart();
})();


// ELEA LEARNING FLOW: five linked tabs/images, auto-advancing every 3 seconds.
(() => {
  const root = document.querySelector('[data-learning-flow-tabs]');
  const section = root?.closest('.flow-section');
  const caption = section?.querySelector('.flow-caption');
  const imageRoot = section?.querySelector('[data-flow-images]');
  if (!root || !section || !caption || !imageRoot) return;

  const tabs = [...root.querySelectorAll('.flow-tab')];
  const slides = [...imageRoot.querySelectorAll('[data-flow-image]')];
  const number = caption.querySelector('.n');
  const title = caption.querySelector('h3');
  const description = caption.querySelector('p');
  if (!tabs.length || slides.length !== tabs.length || !number || !title || !description) return;

  const isKo = (document.documentElement.lang || 'en').toLowerCase().startsWith('ko');
  const steps = [
    { number: '01', title: 'Textbook Input', description: isKo ? '교재·레벨·학습 목표 입력' : 'Input textbook, level, and learning objectives' },
    { number: '02', title: 'Lesson Understanding', description: isKo ? '수업 흐름과 학습 목표 이해' : 'Understand lesson flow and learning objectives' },
    { number: '03', title: 'AI Interaction', description: isKo ? 'ELEA와 1:1 대화 및 발화 훈련' : '1:1 dialogue and speaking practice with ELEA' },
    { number: '04', title: 'Speaking & Writing Assessment', description: isKo ? '말하기·쓰기 결과 분석' : 'Analyze speaking and writing outcomes' },
    { number: '05', title: 'Feedback & Learning Report', description: isKo ? '학습자 피드백과 학습 리포트 제공. 하나의 교재가 상호작용하고 평가하는 AI 학습 경험이 됩니다.' : 'Deliver learner feedback and learning reports, turning one textbook into an interactive, assessable AI learning experience.' }
  ];

  let index = 0;
  let timer = null;
  let captionTimer = null;
  const interval = 3000;

  const apply = (nextIndex, animate = true) => {
    index = (nextIndex + tabs.length) % tabs.length;
    const data = steps[index];

    tabs.forEach((tab, i) => {
      const active = i === index;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    slides.forEach((slide, i) => {
      const active = i === index;
      slide.classList.toggle('active', active);
      slide.setAttribute('aria-hidden', active ? 'false' : 'true');
    });

    clearTimeout(captionTimer);
    const renderCaption = () => {
      number.textContent = data.number;
      title.textContent = data.title;
      description.textContent = data.description;
      caption.classList.remove('is-switching');
    };
    if (!animate) return renderCaption();
    caption.classList.add('is-switching');
    captionTimer = window.setTimeout(renderCaption, 140);
  };

  const stop = () => {
    clearInterval(timer);
    timer = null;
  };
  const restart = () => {
    stop();
    timer = window.setInterval(() => apply(index + 1), interval);
  };

  tabs.forEach((tab, tabIndex) => {
    tab.addEventListener('click', () => {
      apply(tabIndex);
      restart();
    });
  });

  // Pause while off-screen, resume the 3-second sequence when visible again.
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) restart();
      else stop();
    }, { threshold: .2 });
    observer.observe(section);
  } else {
    restart();
  }

  apply(0, false);
})();

