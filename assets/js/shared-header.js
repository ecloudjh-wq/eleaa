(() => {
  'use strict';
  const doc=document, body=doc.body;
  const q=(s,c=doc)=>c.querySelector(s), qa=(s,c=doc)=>Array.from(c.querySelectorAll(s));
  const header=q('[data-header]'), progress=q('.scroll-progress span'), toneSections=qa('[data-header-tone]');
  const mobile=q('.mobile-toggle'), gnb=q('.gnb');
  const isKo=(doc.documentElement.lang||'en').toLowerCase().startsWith('ko');
  let lastY=scrollY,ticking=false;

  const menuOpen=()=>Boolean(gnb?.classList.contains('is-open'));
  const setMobileMenu=(open)=>{
    if(!gnb||!mobile||!header)return;
    gnb.classList.toggle('is-open',open);
    header.classList.toggle('menu-open',open);
    mobile.setAttribute('aria-expanded',String(open));
    mobile.setAttribute('aria-label',open?(isKo?'메뉴 닫기':'Close menu'):(isKo?'메뉴 열기':'Open menu'));
    body.classList.toggle('is-lock',open);
  };

  const update=()=>{
    const y=scrollY,max=Math.max(doc.documentElement.scrollHeight-innerHeight,1);
    if(progress)progress.style.transform=`scaleX(${Math.min(Math.max(y/max,0),1)})`;
    if(header){
      header.classList.toggle('is-scrolled',y>28);
      if(innerWidth<=760){ header.classList.remove('is-hidden'); }
      else if(!menuOpen()){
        if(y>360&&y>lastY+8)header.classList.add('is-hidden');
        else if(y<lastY-6||y<360)header.classList.remove('is-hidden');
      }else header.classList.remove('is-hidden');
      const sample=y+Math.min(innerHeight*.24,220);
      let tone=toneSections.length?'dark':'light';
      for(const s of toneSections){ if(sample>=s.offsetTop&&sample<s.offsetTop+s.offsetHeight){tone=s.dataset.headerTone||'dark';break} }
      header.classList.toggle('is-light',tone==='light');
    }
    lastY=y;ticking=false;
  };
  const req=()=>{if(!ticking){requestAnimationFrame(update);ticking=true}};
  addEventListener('scroll',req,{passive:true});
  addEventListener('resize',()=>{if(innerWidth>760)setMobileMenu(false);req()});
  update();

  mobile?.addEventListener('click',()=>setMobileMenu(!menuOpen()));
  qa('.gnb a').forEach(a=>a.addEventListener('click',()=>setMobileMenu(false)));

  const file=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  const normalize=f=>f.replace('-ko.html','.html');
  qa('.gnb a').forEach(a=>{
    const target=((a.getAttribute('href')||'').split('#')[0]||'index.html').split('/').pop().toLowerCase();
    a.classList.toggle('is-active',normalize(file)===normalize(target));
  });

  // KOR | ENG: English is the default. Korean pages use the -ko.html counterparts.
  const langSwitch=q('.language-switch');
  if(langSwitch){
    const base=normalize(file);
    const koFile=base.replace('.html','-ko.html');
    const enFile=base;
    langSwitch.setAttribute('aria-label',isKo?'언어 선택':'Language selection');
    langSwitch.innerHTML=`<a class="lang-option ${isKo?'is-active':''}" href="${koFile}" ${isKo?'aria-current="true"':''}>KOR</a><span class="lang-separator">|</span><a class="lang-option ${!isKo?'is-active':''}" href="${enFile}" ${!isKo?'aria-current="true"':''}>ENG</a>`;
  }

  doc.addEventListener('keydown',e=>{if(e.key==='Escape')setMobileMenu(false)});
})();
