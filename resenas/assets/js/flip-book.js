/* Reto a Dos · efecto de pasar hojas adaptado del lector Eidos.
   Portada -> portadilla -> índice, con vuelta a la ficha previa. */
(() => {
  'use strict';
  const dialog = document.querySelector('[data-inside-dialog]');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = window.matchMedia('(max-width: 700px)');
  const labels = ['Portada','Portadilla','Índice de los 40 retos'];
  let sources = [], page = 0, busy = false, motion = null, originX = null, token = 0;
  const $ = selector => dialog?.querySelector(selector);
  const left = $('[data-r2-left]'), right = $('[data-r2-right]');
  const leaf = $('[data-r2-leaf]'), leafFront = $('[data-r2-leaf-front]'), leafBack = $('[data-r2-leaf-back]');
  const next = $('[data-r2-next]'), prev = $('[data-r2-prev]'), caption = $('[data-r2-caption]');
  const zoom = $('[data-r2-zoom]'), full = $('[data-r2-open-image]');
  const heading = $('[data-inside-dialog-title]'), stage = $('[data-r2-reader-stage]');
  const dots = dialog ? [...dialog.querySelectorAll('.r2-reader-dots span')] : [];
  const setSource = (image, src) => {
    if (!image) return;
    if (src) {image.src=src;image.hidden=false;}
    else {image.removeAttribute('src');image.hidden=true;}
  };
  function render(n) {
    page = n;
    const single = mobile.matches || dialog?.classList.contains('r2-reader-zoom');
    const leftSrc = n === 2 ? sources[1] : '';
    setSource(left, single ? '' : leftSrc);
    setSource(right, sources[n]);
    if (prev) prev.disabled = n === 0;
    if (next) next.disabled = n === 2;
    if (caption) caption.textContent = `${labels[n]} · ${n+1} de 3`;
    if (full) full.href = sources[n] || '#';
    dots.forEach((dot,i) => dot.classList.toggle('is-current',i === n));
  }
  function stopMotion() {
    token++;
    motion?.cancel();motion=null;busy=false;
    if (leaf) {leaf.hidden=true;leaf.style.transform='';}
  }
  function prepare() {
    if (!dialog) return;
    stopMotion();
    sources = [dialog.dataset.readerCover,dialog.dataset.readerInside,dialog.dataset.readerIndex].map(x=>x || '');
    const title = dialog.dataset.readerTitle || 'Reto a Dos';
    if (heading) heading.textContent=title;
    dialog.classList.remove('r2-reader-zoom');
    if (zoom) {zoom.textContent='Ampliar página';zoom.setAttribute('aria-pressed','false');}
    render(0);
    sources.forEach(url=>{if (url) {const image=new Image();image.src=url;}});
  }
  async function go(to) {
    if (!dialog || busy || to<0 || to>2 || to===page || !sources[to]) return;
    const from=page, forward=to>from, single=mobile.matches || dialog.classList.contains('r2-reader-zoom');
    if (!leaf || !leaf.animate || reduced.matches || Math.abs(to-from)!==1 || dialog.classList.contains('r2-reader-zoom')) {render(to);return;}
    busy=true;
    const id=++token;
    // Eidos gira una página real mediante transformaciones 3D.
    // El pliego inferior ya muestra la página que quedará descubierta.
    setSource(leafFront, forward ? sources[from] : sources[to]);
    setSource(leafBack, forward ? (single ? sources[to] : (to===2 ? sources[1] : '')) : (single ? sources[from] : (from===2 ? sources[1] : '')));
    if (!leafBack.src || leafBack.hidden) {leafBack.removeAttribute('src');leafBack.hidden=true;}
    setSource(right,sources[to]);
    if (!single) setSource(left, to===2 ? sources[1] : '');
    leaf.hidden=false;
    const a=forward?0:-180, b=forward?-180:0;
    leaf.style.transform=`rotateY(${a}deg)`;
    const frames=[{transform:`rotateY(${a}deg)`,filter:'brightness(1)'},{offset:.5,transform:'rotateY(-90deg)',filter:'brightness(.8)'},{transform:`rotateY(${b}deg)`,filter:'brightness(1)'}];
    const anim=leaf.animate(frames,{duration:680,easing:'cubic-bezier(.36,.05,.24,1)',fill:'both'});
    motion=anim;
    try {await anim.finished;} catch(e) {}
    if (id!==token) return;
    leaf.hidden=true;leaf.style.transform='';motion=null;busy=false;render(to);
  }
  next?.addEventListener('click',()=>go(page+1));
  prev?.addEventListener('click',()=>go(page-1));
  zoom?.addEventListener('click',()=>{
    if (!dialog) return;
    stopMotion();const opened=dialog.classList.toggle('r2-reader-zoom');
    zoom.textContent=opened?'Ver libro abierto':'Ampliar página';zoom.setAttribute('aria-pressed',String(opened));render(page);
  });
  dialog?.addEventListener('keydown',event=>{
    if (event.key==='ArrowRight') {event.preventDefault();go(page+1);}
    else if (event.key==='ArrowLeft') {event.preventDefault();go(page-1);}
  });
  stage?.addEventListener('pointerdown',event=>{
    if (event.target.closest('button'))return;
    originX=event.clientX;
  });
  stage?.addEventListener('pointerup',event=>{
    if (originX===null)return;
    const diff=event.clientX-originX;originX=null;
    if(Math.abs(diff)>55) go(page+(diff<0?1:-1));
  });
  stage?.addEventListener('pointercancel',()=>originX=null);
  dialog?.addEventListener('close',stopMotion);
  mobile.addEventListener?.('change',()=>{if(dialog?.open)render(page);});
  window.RetoFlipReader={prepare};

  // Fichas completas: conserva el recuadro original y permite descubrir el
  // índice por hover, foco de teclado o toque. El estado se restablece al salir.
  document.querySelectorAll('.r2-detail-book').forEach(button=>{
    const update = opened => {
      button.classList.toggle('is-open',opened);
      button.setAttribute('aria-pressed',String(opened));
      const idx=button.querySelector('.r2-detail-index');
      button.setAttribute('aria-label', (opened?'Volver a la portadilla de ':'Mostrar el índice de los 40 retos de ')+(idx?.alt.replace(/^Índice con los 40 retos de /,'')||'este libro'));
    };
    button.addEventListener('click',()=>update(!button.classList.contains('is-open')));
    button.addEventListener('keydown',event=>{if(event.key==='Escape'){update(false);button.blur();}});
  });
})();
