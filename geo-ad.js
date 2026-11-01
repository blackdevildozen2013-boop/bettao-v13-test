/* BETÃO v13 — fullscreen interstitial, test mode and optional Brazil targeting. */
(()=>{'use strict';
  const cfg=window.BETTAO_GEO_AD||{};
  const modal=document.getElementById('bta-geo-ad');
  if(!modal||cfg.enabled!==true)return;
  const testMode=cfg.testMode===true;
  const validUrl=value=>{try{const u=new URL(String(value||'').trim());return u.protocol==='https:'&&u.hostname?u.href:null}catch(_){return null}};
  const destination=validUrl(cfg.destinationUrl);
  // Production mode: do not show an unconfigured ad.
  if(!testMode&&!destination)return;
  const close=modal.querySelector('[data-bta-close]');
  const link=modal.querySelector('[data-bta-link]');
  const video=modal.querySelector('video');
  const source=modal.querySelector('video source');
  const fallback=modal.querySelector('.bta-ad__fallback');
  if(!close||!link||!video||!source||!fallback)return;
  const safeAsset=(v,fallbackName)=>{
    const s=String(v||'').trim();
    return (/^(?!\/)(?!.*\.\.)(?!.*:)[a-zA-Z0-9_./-]+$/.test(s)||/^https:\/\//i.test(s))?s:fallbackName;
  };
  fallback.src=safeAsset(cfg.mobileBannerImage,'betao-premium-ad-poster.webp');
  video.poster=fallback.src;
  source.src=safeAsset(cfg.videoFile,'betao-premium-ad.mp4');
  video.load();
  if(destination){
    link.href=destination;
    link.target=cfg.openInNewTab?'_blank':'_self';
    link.rel='sponsored noopener noreferrer';
    link.removeAttribute('aria-disabled');
    link.removeAttribute('tabindex');
  }else{
    link.removeAttribute('href');
    link.removeAttribute('target');
    link.setAttribute('aria-disabled','true');
    link.setAttribute('tabindex','-1');
    link.title='Добавьте destinationUrl в geo-ad-config.js, чтобы включить переход';
  }
  if(testMode){
    const label=modal.querySelector('.bta-ad__label');
    if(label)label.textContent='◉ Publicidade · 18+ · TESTE';
  }
  let previousFocus=null,visible=false,wasShown=false;
  const reducedMotion=()=>window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dismiss=()=>{
    if(!visible)return;
    visible=false;video.pause();modal.hidden=true;
    document.body.classList.remove('bta-ad--locked');
    document.removeEventListener('keydown',onKey);
    if(previousFocus&&previousFocus.isConnected&&previousFocus.focus){
      try{previousFocus.focus({preventScroll:true})}catch(_){previousFocus.focus()}
    }
  };
  function onKey(e){
    if(e.key==='Escape'){e.preventDefault();dismiss();return}
    if(e.key!=='Tab')return;
    const first=close,last=destination?link:close;
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
  }
  close.addEventListener('click',dismiss);
  // Navigation stays inside the user's tap/click gesture (important for iOS WebView).
  // This does not override navigation restrictions imposed by the native iOS app.
  link.addEventListener('pointerdown',()=>link.classList.add('is-pressing'));
  for(const name of ['pointerup','pointercancel','pointerleave']){
    link.addEventListener(name,()=>link.classList.remove('is-pressing'));
  }
  link.addEventListener('click',(event)=>{
    if(!destination){event.preventDefault();return}
    event.preventDefault();
    if(cfg.openInNewTab){
      const opened=window.open(destination,'_blank','noopener,noreferrer');
      if(!opened)window.location.assign(destination);
      else dismiss();
    }else{
      window.location.assign(destination);
    }
  });
  const show=()=>{
    if(wasShown||document.hidden)return;
    wasShown=true;previousFocus=document.activeElement;visible=true;
    modal.hidden=false;
    document.body.classList.add('bta-ad--locked');
    document.addEventListener('keydown',onKey);
    try{close.focus({preventScroll:true})}catch(_){close.focus()}
    if(!reducedMotion())video.play().catch(()=>{});
  };
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){if(visible)video.pause();return}
    if(!wasShown&&testMode){show();return}
    if(visible&&!reducedMotion())video.play().catch(()=>{});
  });
  const begin=()=>setTimeout(show,Math.max(0,Math.min(3000,Number(cfg.showDelayMs)||0)));
  if(testMode){begin();return}
  // Production mode: show only when Brazil IP is confirmed; unknown = do not show.
  if(String(cfg.targetCountry||'').toUpperCase()!=='BR')return;
  const lookup=async()=>{
    const providers=[
      {url:'https://get.geojs.io/v1/ip/geo.json',parse:async r=>(await r.json()).country_code},
      {url:'https://ipapi.co/country/',parse:async r=>(await r.text()).trim()}
    ];
    for(const p of providers){
      const ctrl=new AbortController();const timer=setTimeout(()=>ctrl.abort(),2600);
      try{
        const r=await fetch(p.url,{mode:'cors',cache:'no-store',credentials:'omit',signal:ctrl.signal});
        if(!r.ok)continue;
        const c=String(await p.parse(r)||'').trim().toUpperCase();
        if(/^[A-Z]{2}$/.test(c))return c;
      }catch(_){/* try next provider */}finally{clearTimeout(timer)}
    }
    return null;
  };
  lookup().then(country=>{if(country==='BR')begin()}).catch(()=>{});
})();
