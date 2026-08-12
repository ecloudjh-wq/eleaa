(() => {
  const footer = document.getElementById('sharedFooter');
  if (!footer) return;
  const isKo=(document.documentElement.lang||'en').toLowerCase().startsWith('ko');
  const suffix=isKo?'-ko':'';
  const page=(name)=>`./${name}${suffix}.html`;
  const FOOTER_ADDRESSES = {
    ko: '서울특별시 금천구 가산디지털1로 225, 에이스 가산 포휴 8층 (08501)',
    en: '8F, Ace Gasan Forhu, 225 Gasan digital 1-ro, Geumcheon-gu, Seoul, Republic of Korea<br>(08501) 225, Gasan digital 1-ro, Geumcheon-gu, Seoul, Republic of Korea'
  };
  const text=isKo?{
    home:'E-Cloud AI 메인으로 이동',nav:'하단 메뉴',privacy:'개인정보처리방침',children:'아동 개인정보처리방침',top:'맨 위로 이동',
    ten:'10분국어',eleaEnglish:'엘리아영어'
  }:{
    home:'E-Cloud AI home',nav:'Footer navigation',privacy:'Privacy Policy',children:"Children’s Privacy Policy",top:'Back to top',
    ten:'10-Minute Korean',eleaEnglish:'ELEA English'
  };

  footer.className='footer elea-shared-footer';
  footer.innerHTML=`
    <div class="elea-footer-shell footer-top">
      <a class="company-logo" href="${page('index')}" aria-label="${text.home}"><img src="assets/images/ecloud_logo_crop.jpg" alt="E-Cloud AI"></a>
      <nav aria-label="${text.nav}">
        <a href="${page('index')}">Main</a><a href="${page('data-moat')}">Data Moat</a><a href="${page('digital-human')}">Digital Human</a><a href="${page('learning-experience')}">Learning Experience</a>
      </nav>
    </div>
    <div class="elea-footer-shell footer-main">
      <div class="addr">${isKo?FOOTER_ADDRESSES.ko:FOOTER_ADDRESSES.en}</div>
      <div class="policies"><a href="#privacy-policy" data-policy-open="privacy">${text.privacy}</a><a href="#children-privacy-policy" data-policy-open="children">${text.children}</a></div>
      <div class="elea-family-wrap">
        <button type="button" class="elea-family-toggle" aria-expanded="false" aria-haspopup="true">Family Site <img class="chev" src="assets/images/footer-chevron.png" alt="" aria-hidden="true"></button>
        <div class="elea-family-menu" aria-hidden="true">
          <a href="https://operations-hub.e-cloud.ai" target="_blank" rel="noopener noreferrer">Operations Hub</a>
          <a href="https://tenminutes.e-cloud.ai" target="_blank" rel="noopener noreferrer">${text.ten}</a>
          <a href="https://e-cloud.ai/" target="_blank" rel="noopener noreferrer">E-Cloud AI</a>
          <a href="https://eleaenglish.com/" target="_blank" rel="noopener noreferrer">${text.eleaEnglish}</a>
        </div>
      </div>
    </div>
    <div class="elea-footer-shell footer-bottom">Some content on this website was created with the assistance of AI technology.<br>COPYRIGHT © E-CLOUD AI. ALL RIGHTS RESERVED.</div>`;

  let topButton=document.querySelector('.to-top');
  if(!topButton){topButton=document.createElement('button');topButton.type='button';topButton.className='to-top';document.body.appendChild(topButton);}
  topButton.setAttribute('aria-label',text.top); topButton.classList.add('elea-shared-to-top');
  topButton.innerHTML='<img src="assets/images/footer-chevron.png" alt="" aria-hidden="true">';
  topButton.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
  const updateTopButton=()=>{const threshold=Math.max(360,window.innerHeight*.45);topButton.classList.toggle('is-visible',window.scrollY>threshold)};
  window.addEventListener('scroll',updateTopButton,{passive:true});window.addEventListener('resize',updateTopButton);updateTopButton();

  const trigger=footer.querySelector('.elea-family-toggle'),menu=footer.querySelector('.elea-family-menu');
  if(!trigger||!menu)return;
  const setOpen=open=>{menu.classList.toggle('is-open',open);menu.setAttribute('aria-hidden',open?'false':'true');trigger.setAttribute('aria-expanded',open?'true':'false')};
  trigger.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();setOpen(!menu.classList.contains('is-open'))});
  document.addEventListener('click',event=>{if(!footer.contains(event.target))setOpen(false)});
  document.addEventListener('keydown',event=>{if(event.key==='Escape')setOpen(false)});
})();
