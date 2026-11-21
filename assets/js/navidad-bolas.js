(() => {
  'use strict';
  // Pendulums are decorative. Preserve the unchanged original artwork when JS or
  // motion is unavailable, including the exact original cord lengths.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const drawings = {"top": "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"xmas-ornament-overlay\" viewBox=\"0 0 1600 252\" preserveAspectRatio=\"none\" aria-hidden=\"true\" focusable=\"false\"><defs><radialGradient id=\"pend-canopy-red\" cx=\".28\" cy=\".17\" r=\".9\"><stop stop-color=\"#ffd0b5\"/><stop offset=\".2\" stop-color=\"#e86a52\"/><stop offset=\".56\" stop-color=\"#bd232e\"/><stop offset=\"1\" stop-color=\"#621522\"/></radialGradient><radialGradient id=\"pend-canopy-gold\" cx=\".26\" cy=\".18\" r=\".9\"><stop stop-color=\"#fff4b4\"/><stop offset=\".2\" stop-color=\"#f8d66b\"/><stop offset=\".6\" stop-color=\"#cc8b24\"/><stop offset=\"1\" stop-color=\"#70400f\"/></radialGradient><radialGradient id=\"pend-canopy-pine\" cx=\".24\" cy=\".2\" r=\".9\"><stop stop-color=\"#bad9b1\"/><stop offset=\".2\" stop-color=\"#48916d\"/><stop offset=\".7\" stop-color=\"#156145\"/><stop offset=\"1\" stop-color=\"#073b2e\"/></radialGradient><filter id=\"pend-canopy-shadow\" x=\"-100%\" y=\"-100%\" width=\"300%\" height=\"300%\"><feGaussianBlur stdDeviation=\"3\"/></filter></defs><g class=\"xmas-pendulum\" data-anchor-x=\"118\" data-anchor-y=\"52.7\" data-ball-x=\"118\" data-ball-y=\"137\" data-length=\"84.3\"><path d=\"M118 52.7Q124 94.9 118 130.0\" stroke=\"#dbcba2\" stroke-width=\"2\" fill=\"none\"/><ellipse cx=\"124\" cy=\"144\" rx=\"28\" ry=\"28\" opacity=\".2\" filter=\"url(#pend-canopy-shadow)\" fill=\"#000\"/><circle cx=\"118\" cy=\"137\" r=\"28\" fill=\"url(#pend-canopy-red)\" stroke=\"#fff2c2\" stroke-width=\"1\" opacity=\".96\"/><rect x=\"110\" y=\"106\" width=\"16\" height=\"7\" rx=\"2\" fill=\"#d7b464\"/><path d=\"M111 109l3 -5h8l3 5\" fill=\"none\" stroke=\"#ead7a3\" stroke-width=\"2\"/><ellipse cx=\"107.9\" cy=\"126.6\" rx=\"6.7\" ry=\"9.5\" transform=\"rotate(35 107.9 126.6)\" fill=\"#fff\" opacity=\".24\"/><path d=\"M104.0 140.0 Q118 149.0 132.0 140.0\" stroke=\"#fff1c1\" opacity=\".18\" stroke-width=\"2\" fill=\"none\"/><circle class=\"xmas-pendulum-hit\" cx=\"118\" cy=\"137\" r=\"34\" fill=\"transparent\" pointer-events=\"all\"/></g><g class=\"xmas-pendulum\" data-anchor-x=\"395\" data-anchor-y=\"54.8\" data-ball-x=\"395\" data-ball-y=\"175\" data-length=\"120.2\"><path d=\"M395 54.8Q401 114.9 395 167.8\" stroke=\"#dbcba2\" stroke-width=\"2\" fill=\"none\"/><ellipse cx=\"401\" cy=\"182\" rx=\"29\" ry=\"29\" opacity=\".2\" filter=\"url(#pend-canopy-shadow)\" fill=\"#000\"/><circle cx=\"395\" cy=\"175\" r=\"29\" fill=\"url(#pend-canopy-gold)\" stroke=\"#fff2c2\" stroke-width=\"1\" opacity=\".96\"/><rect x=\"387\" y=\"143\" width=\"16\" height=\"7\" rx=\"2\" fill=\"#d7b464\"/><path d=\"M388 146l3 -5h8l3 5\" fill=\"none\" stroke=\"#ead7a3\" stroke-width=\"2\"/><ellipse cx=\"384.6\" cy=\"164.3\" rx=\"7.0\" ry=\"9.9\" transform=\"rotate(35 384.6 164.3)\" fill=\"#fff\" opacity=\".24\"/><path d=\"M380.5 178.0 Q395 187.0 409.5 178.0\" stroke=\"#fff1c1\" opacity=\".18\" stroke-width=\"2\" fill=\"none\"/><circle class=\"xmas-pendulum-hit\" cx=\"395\" cy=\"175\" r=\"35\" fill=\"transparent\" pointer-events=\"all\"/></g><g class=\"xmas-pendulum\" data-anchor-x=\"681\" data-anchor-y=\"34.5\" data-ball-x=\"681\" data-ball-y=\"114\" data-length=\"79.5\"><path d=\"M681 34.5Q687 74.2 681 108.5\" stroke=\"#dbcba2\" stroke-width=\"2\" fill=\"none\"/><ellipse cx=\"687\" cy=\"121\" rx=\"22\" ry=\"22\" opacity=\".2\" filter=\"url(#pend-canopy-shadow)\" fill=\"#000\"/><circle cx=\"681\" cy=\"114\" r=\"22\" fill=\"url(#pend-canopy-pine)\" stroke=\"#fff2c2\" stroke-width=\"1\" opacity=\".96\"/><rect x=\"673\" y=\"89\" width=\"16\" height=\"7\" rx=\"2\" fill=\"#d7b464\"/><path d=\"M674 92l3 -5h8l3 5\" fill=\"none\" stroke=\"#ead7a3\" stroke-width=\"2\"/><ellipse cx=\"673.1\" cy=\"105.9\" rx=\"5.3\" ry=\"7.5\" transform=\"rotate(35 673.1 105.9)\" fill=\"#fff\" opacity=\".24\"/><circle class=\"xmas-pendulum-hit\" cx=\"681\" cy=\"114\" r=\"28\" fill=\"transparent\" pointer-events=\"all\"/></g><g class=\"xmas-pendulum\" data-anchor-x=\"932\" data-anchor-y=\"32.6\" data-ball-x=\"932\" data-ball-y=\"158\" data-length=\"125.4\"><path d=\"M932 32.6Q938 95.3 932 150.8\" stroke=\"#dbcba2\" stroke-width=\"2\" fill=\"none\"/><ellipse cx=\"938\" cy=\"165\" rx=\"29\" ry=\"29\" opacity=\".2\" filter=\"url(#pend-canopy-shadow)\" fill=\"#000\"/><circle cx=\"932\" cy=\"158\" r=\"29\" fill=\"url(#pend-canopy-red)\" stroke=\"#fff2c2\" stroke-width=\"1\" opacity=\".96\"/><rect x=\"924\" y=\"126\" width=\"16\" height=\"7\" rx=\"2\" fill=\"#d7b464\"/><path d=\"M925 129l3 -5h8l3 5\" fill=\"none\" stroke=\"#ead7a3\" stroke-width=\"2\"/><ellipse cx=\"921.6\" cy=\"147.3\" rx=\"7.0\" ry=\"9.9\" transform=\"rotate(35 921.6 147.3)\" fill=\"#fff\" opacity=\".24\"/><path d=\"M917.5 161.0 Q932 170.0 946.5 161.0\" stroke=\"#fff1c1\" opacity=\".18\" stroke-width=\"2\" fill=\"none\"/><circle class=\"xmas-pendulum-hit\" cx=\"932\" cy=\"158\" r=\"35\" fill=\"transparent\" pointer-events=\"all\"/></g><g class=\"xmas-pendulum\" data-anchor-x=\"1194\" data-anchor-y=\"51.2\" data-ball-x=\"1194\" data-ball-y=\"192\" data-length=\"140.8\"><path d=\"M1194 51.2Q1200 121.6 1194 184.0\" stroke=\"#dbcba2\" stroke-width=\"2\" fill=\"none\"/><ellipse cx=\"1200\" cy=\"199\" rx=\"32\" ry=\"32\" opacity=\".2\" filter=\"url(#pend-canopy-shadow)\" fill=\"#000\"/><circle cx=\"1194\" cy=\"192\" r=\"32\" fill=\"url(#pend-canopy-gold)\" stroke=\"#fff2c2\" stroke-width=\"1\" opacity=\".96\"/><rect x=\"1186\" y=\"157\" width=\"16\" height=\"7\" rx=\"2\" fill=\"#d7b464\"/><path d=\"M1187 160l3 -5h8l3 5\" fill=\"none\" stroke=\"#ead7a3\" stroke-width=\"2\"/><ellipse cx=\"1182.5\" cy=\"180.2\" rx=\"7.7\" ry=\"10.9\" transform=\"rotate(35 1182.5 180.2)\" fill=\"#fff\" opacity=\".24\"/><path d=\"M1178.0 195.0 Q1194 204.0 1210.0 195.0\" stroke=\"#fff1c1\" opacity=\".18\" stroke-width=\"2\" fill=\"none\"/><circle class=\"xmas-pendulum-hit\" cx=\"1194\" cy=\"192\" r=\"38\" fill=\"transparent\" pointer-events=\"all\"/></g><g class=\"xmas-pendulum\" data-anchor-x=\"1474\" data-anchor-y=\"55.8\" data-ball-x=\"1474\" data-ball-y=\"130\" data-length=\"74.2\"><path d=\"M1474 55.8Q1480 92.9 1474 123.5\" stroke=\"#dbcba2\" stroke-width=\"2\" fill=\"none\"/><ellipse cx=\"1480\" cy=\"137\" rx=\"26\" ry=\"26\" opacity=\".2\" filter=\"url(#pend-canopy-shadow)\" fill=\"#000\"/><circle cx=\"1474\" cy=\"130\" r=\"26\" fill=\"url(#pend-canopy-pine)\" stroke=\"#fff2c2\" stroke-width=\"1\" opacity=\".96\"/><rect x=\"1466\" y=\"101\" width=\"16\" height=\"7\" rx=\"2\" fill=\"#d7b464\"/><path d=\"M1467 104l3 -5h8l3 5\" fill=\"none\" stroke=\"#ead7a3\" stroke-width=\"2\"/><ellipse cx=\"1464.6\" cy=\"120.4\" rx=\"6.2\" ry=\"8.8\" transform=\"rotate(35 1464.6 120.4)\" fill=\"#fff\" opacity=\".24\"/><circle class=\"xmas-pendulum-hit\" cx=\"1474\" cy=\"130\" r=\"32\" fill=\"transparent\" pointer-events=\"all\"/></g></svg>", "side": "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"xmas-ornament-overlay\" viewBox=\"0 0 94 860\" preserveAspectRatio=\"none\" aria-hidden=\"true\" focusable=\"false\"><defs><radialGradient id=\"pend-side-red\" cx=\".24\" cy=\".18\"><stop stop-color=\"#ffc1a6\"/><stop offset=\".23\" stop-color=\"#e3644a\"/><stop offset=\"1\" stop-color=\"#8e2331\"/></radialGradient><radialGradient id=\"pend-side-gold\" cx=\".25\" cy=\".18\"><stop stop-color=\"#fff6d6\"/><stop offset=\".32\" stop-color=\"#ffd16e\"/><stop offset=\"1\" stop-color=\"#bf8038\"/></radialGradient><radialGradient id=\"pend-side-green\" cx=\".23\" cy=\".2\"><stop stop-color=\"#b1e1a8\"/><stop offset=\".28\" stop-color=\"#3a9570\"/><stop offset=\"1\" stop-color=\"#0b4d38\"/></radialGradient></defs><g class=\"xmas-pendulum\" data-anchor-x=\"68.8\" data-anchor-y=\"130\" data-ball-x=\"44.8\" data-ball-y=\"174\" data-length=\"50.12\"><path d=\"M68.8 130 L44.8 160\" stroke=\"#c7aa75\" stroke-width=\"1.6\"/><rect x=\"39.8\" y=\"156\" width=\"10\" height=\"6\" rx=\"2\" fill=\"#c9a466\"/><circle cx=\"44.8\" cy=\"174\" r=\"12.5\" fill=\"url(#pend-side-red)\" stroke=\"#ead3a9\" stroke-width=\".7\"/><circle class=\"xmas-pendulum-hit\" cx=\"44.8\" cy=\"174\" r=\"18.5\" fill=\"transparent\" pointer-events=\"all\"/></g><g class=\"xmas-pendulum\" data-anchor-x=\"50\" data-anchor-y=\"330\" data-ball-x=\"35\" data-ball-y=\"374\" data-length=\"46.487\"><path d=\"M50.0 330 L35.0 360\" stroke=\"#c7aa75\" stroke-width=\"1.6\"/><rect x=\"30.0\" y=\"356\" width=\"10\" height=\"6\" rx=\"2\" fill=\"#c9a466\"/><circle cx=\"35.0\" cy=\"374\" r=\"12.5\" fill=\"url(#pend-side-gold)\" stroke=\"#ead3a9\" stroke-width=\".7\"/><circle class=\"xmas-pendulum-hit\" cx=\"35\" cy=\"374\" r=\"18.5\" fill=\"transparent\" pointer-events=\"all\"/></g><g class=\"xmas-pendulum\" data-anchor-x=\"69.4\" data-anchor-y=\"590\" data-ball-x=\"45.4\" data-ball-y=\"634\" data-length=\"50.12\"><path d=\"M69.4 590 L45.4 620\" stroke=\"#c7aa75\" stroke-width=\"1.6\"/><rect x=\"40.4\" y=\"616\" width=\"10\" height=\"6\" rx=\"2\" fill=\"#c9a466\"/><circle cx=\"45.4\" cy=\"634\" r=\"12.5\" fill=\"url(#pend-side-green)\" stroke=\"#ead3a9\" stroke-width=\".7\"/><circle class=\"xmas-pendulum-hit\" cx=\"45.4\" cy=\"634\" r=\"18.5\" fill=\"transparent\" pointer-events=\"all\"/></g><g class=\"xmas-pendulum\" data-anchor-x=\"50.8\" data-anchor-y=\"770\" data-ball-x=\"35.8\" data-ball-y=\"814\" data-length=\"46.487\"><path d=\"M50.8 770 L35.8 800\" stroke=\"#c7aa75\" stroke-width=\"1.6\"/><rect x=\"30.8\" y=\"796\" width=\"10\" height=\"6\" rx=\"2\" fill=\"#c9a466\"/><circle cx=\"35.8\" cy=\"814\" r=\"12.5\" fill=\"url(#pend-side-red)\" stroke=\"#ead3a9\" stroke-width=\".7\"/><circle class=\"xmas-pendulum-hit\" cx=\"35.8\" cy=\"814\" r=\"18.5\" fill=\"transparent\" pointer-events=\"all\"/></g></svg>", "spray": "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"xmas-ornament-overlay\" viewBox=\"0 0 420 520\" preserveAspectRatio=\"none\" aria-hidden=\"true\" focusable=\"false\"><defs><radialGradient id=\"pend-spray-r\" cx=\".24\" cy=\".2\" r=\".93\"><stop stop-color=\"#ffd3b5\"/><stop offset=\".22\" stop-color=\"#e85c56\"/><stop offset=\".7\" stop-color=\"#a71d2e\"/><stop offset=\"1\" stop-color=\"#68132a\"/></radialGradient><radialGradient id=\"pend-spray-g\" cx=\".24\" cy=\".15\" r=\"1\"><stop stop-color=\"#fff2c4\"/><stop offset=\".2\" stop-color=\"#f6da72\"/><stop offset=\".75\" stop-color=\"#c28a27\"/><stop offset=\"1\" stop-color=\"#805017\"/></radialGradient></defs><g class=\"xmas-pendulum\" data-anchor-x=\"190\" data-anchor-y=\"149\" data-ball-x=\"190\" data-ball-y=\"238\" data-length=\"89.0\"><path d=\"M190 149V184\" stroke=\"#dcc58a\" stroke-width=\"3\"/><rect x=\"180\" y=\"178\" width=\"20\" height=\"8\" rx=\"2\" fill=\"#dfb46a\"/><circle cx=\"190\" cy=\"238\" r=\"54\" fill=\"url(#pend-spray-r)\"/><ellipse cx=\"168.4\" cy=\"213.7\" rx=\"11.34\" ry=\"16.74\" transform=\"rotate(34 168.4 213.7)\" fill=\"white\" opacity=\".22\"/><circle class=\"xmas-pendulum-hit\" cx=\"190\" cy=\"238\" r=\"60\" fill=\"transparent\" pointer-events=\"all\"/></g><g class=\"xmas-pendulum\" data-anchor-x=\"285\" data-anchor-y=\"238\" data-ball-x=\"285\" data-ball-y=\"335\" data-length=\"97.0\"><path d=\"M285 238V273\" stroke=\"#dcc58a\" stroke-width=\"3\"/><rect x=\"275\" y=\"267\" width=\"20\" height=\"8\" rx=\"2\" fill=\"#dfb46a\"/><circle cx=\"285\" cy=\"335\" r=\"62\" fill=\"url(#pend-spray-g)\"/><ellipse cx=\"260.2\" cy=\"307.1\" rx=\"13.02\" ry=\"19.22\" transform=\"rotate(34 260.2 307.1)\" fill=\"white\" opacity=\".22\"/><circle class=\"xmas-pendulum-hit\" cx=\"285\" cy=\"335\" r=\"68\" fill=\"transparent\" pointer-events=\"all\"/></g></svg>"};
  const imageFiles = {
    'navidad-guirnalda-calida.svg': 'top',
    'navidad-guirnalda-lateral-calida.svg': 'side',
    'navidad-rama-bolas.svg': 'spray'
  };
  const standalone = new Set(['christmas-canopy','xmas-divider-garland','christmas-catalog-spray']);
  const all = [];
  let animation = 0;
  const maxAngle = 1.12;
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  function startAnimation() {
    if (!animation) animation = requestAnimationFrame(tick);
  }
  function tick(now) {
    animation = 0;
    let running = false;
    for (const ball of all) {
      if (ball.dragging) continue;
      if (Math.abs(ball.angle) < .0008 && Math.abs(ball.velocity) < .008) {
        if (ball.angle !== 0) { ball.angle=0; ball.g.removeAttribute('transform'); }
        ball.lastFrame = now;
        continue;
      }
      const dt = Math.min(.034, Math.max(0,(now - (ball.lastFrame || now)) / 1000));
      ball.lastFrame = now;
      // Fixed-length pendulum: angular gravity + air friction; frame-rate independent.
      const g = 1500, damping = 1.35;
      const acceleration = -(g / ball.pixelLength()) * Math.sin(ball.angle) - damping * ball.velocity;
      ball.velocity = clamp(ball.velocity + acceleration * dt, -5.5, 5.5);
      ball.angle = clamp(ball.angle + ball.velocity * dt, -maxAngle, maxAngle);
      if (Math.abs(ball.angle) === maxAngle && Math.sign(ball.velocity) === Math.sign(ball.angle)) ball.velocity *= -.18;
      ball.draw();
      running = true;
    }
    if (running) startAnimation();
  }
  function frameFor(img, type) {
    let frame;
    const parent=img.parentElement;
    if (parent && (parent.classList.contains('xmas-professional-garland') ||
                   parent.classList.contains('xmas-side-sprig') ||
                   parent.classList.contains('holiday-banner__decor'))) {
      frame=parent;
      frame.classList.add('xmas-ornament-frame');
    } else {
      frame=document.createElement('span');
      frame.className=img.className+' xmas-ornament-frame xmas-ornament-standalone';
      img.className='xmas-ornament-background';
      img.parentNode.insertBefore(frame,img);
      frame.appendChild(img);
      if (type === 'spray') frame.classList.add('xmas-ornament-spray');
      if (frame.classList.contains('xmas-divider-garland')) {
        frame.parentElement.classList.add('xmas-divider-interactive');
      }
      if (frame.classList.contains('christmas-canopy')) frame.classList.add('xmas-ornament-canopy');
    }
    return frame;
  }
  function pointerPosition(svg, e) {
    const m=svg.getScreenCTM();
    if (!m) return null;
    const p=svg.createSVGPoint();
    p.x=e.clientX;p.y=e.clientY;
    return p.matrixTransform(m.inverse());
  }
  function animateBall(g, svg) {
    const hit=g.querySelector('.xmas-pendulum-hit');
    const ax=Number(g.dataset.anchorX), ay=Number(g.dataset.anchorY);
    const bx=Number(g.dataset.ballX), by=Number(g.dataset.ballY);
    const length=Number(g.dataset.length);
    const base=Math.atan2(bx-ax,by-ay);
    // Cord is the first original shape. Keep it in the swinging parent group.
    // Compensate ONLY the bauble artwork for non-uniformly stretched garland art.
    const art=document.createElementNS('http://www.w3.org/2000/svg','g');
    art.setAttribute('class','xmas-pendulum-art');
    while(g.children.length>1) art.appendChild(g.children[1]);
    g.appendChild(art);
    function drawSphere(angle) {
      const m=svg.getScreenCTM();
      if(!m)return;
      const sx=Math.hypot(m.a,m.b), sy=Math.hypot(m.c,m.d);
      if(!sx || !sy)return;
      const correction=sy/sx;
      const degrees=angle*180/Math.PI;
      art.setAttribute('transform',`translate(${bx} ${by}) rotate(${degrees}) scale(${correction} 1) rotate(${-degrees}) translate(${-bx} ${-by})`);
    }
    const ball={g,svg,hit,ax,ay,bx,by,length,base,
      angle:0,velocity:0,dragging:false,lastFrame:0,lastMove:0,offset:0,
      pixelLength() {
        const m=svg.getScreenCTM();
        if (!m) return Math.max(42,length);
        const v=Math.hypot(m.c*(by-ay)+m.a*(bx-ax),m.d*(by-ay)+m.b*(bx-ax));
        return Math.max(40,v);
      },
      draw() {
        if (Math.abs(this.angle)<.000001) g.removeAttribute('transform');
        else g.setAttribute('transform',`rotate(${-this.angle*180/Math.PI} ${ax} ${ay})`);
        drawSphere(this.angle);
      }
    };
    function desired(e) {
      const pos=pointerPosition(svg,e);
      if(!pos)return null;
      const dir=Math.atan2(pos.x-ax,pos.y-ay)-base;
      return Math.atan2(Math.sin(dir),Math.cos(dir));
    }
    hit.addEventListener('pointerenter', e=>{
      if(e.pointerType==='mouse' && !ball.dragging && Math.abs(ball.velocity)<1){
        ball.velocity-=.62;
        ball.lastFrame=performance.now();
        startAnimation();
      }
    });
    hit.addEventListener('pointerdown',e=>{
      if(e.pointerType==='mouse' && e.button!==0)return;
      const a=desired(e);
      if(a===null)return;
      e.preventDefault();e.stopPropagation();
      ball.dragging=true;
      ball.velocity=0;
      ball.offset=a-ball.angle;
      ball.lastMove=performance.now();
      hit.classList.add('is-dragging');
      try {hit.setPointerCapture(e.pointerId);} catch(_){}
    });
    hit.addEventListener('pointermove',e=>{
      if(!ball.dragging)return;
      const a=desired(e);
      if(a===null)return;
      e.preventDefault();
      const at=performance.now();
      const newAngle=clamp(a-ball.offset,-maxAngle,maxAngle);
      const dt=clamp((at-ball.lastMove)/1000,.008,.06);
      const instantaneous=(newAngle-ball.angle)/dt;
      ball.velocity=clamp(.45*ball.velocity+.55*instantaneous,-5.5,5.5);
      ball.angle=newAngle;
      ball.lastMove=at;
      ball.draw();
    });
    function end(e){
      if(!ball.dragging)return;
      ball.dragging=false;
      hit.classList.remove('is-dragging');
      if(e && hit.hasPointerCapture(e.pointerId))try{hit.releasePointerCapture(e.pointerId)}catch(_){}
      ball.lastFrame=performance.now();
      // On letting go, the hanging ornament falls and gently oscillates.
      startAnimation();
    }
    hit.addEventListener('pointerup',end);
    hit.addEventListener('pointercancel',end);
    hit.addEventListener('lostpointercapture',()=>end(null));
    ball.draw();
    all.push(ball);
  }
  function setup() {
    const candidates=[...document.querySelectorAll('img[src*="navidad-guirnalda-calida.svg"],img[src*="navidad-guirnalda-lateral-calida.svg"],img[src*="navidad-rama-bolas.svg"]')];
    for(const img of candidates){
      const url=img.getAttribute('src')||'';
      const type=imageFiles[url.split('/').pop().split('?')[0]];
      if(!type)continue;
      const frame=frameFor(img,type);
      const source=img.getAttribute('src');
      const svgWrapper=document.createElement('div');
      svgWrapper.innerHTML=drawings[type];
      const overlay=svgWrapper.firstElementChild;
      if(!overlay)continue;
      // Background only changes after the interactive identical illustration is in place.
      frame.appendChild(overlay);
      if(frame.classList.contains('christmas-canopy'))overlay.setAttribute('preserveAspectRatio',matchMedia('(max-width: 760px)').matches?'xMidYMid slice':'none');
      img.src=source.replace('.svg','-sin-bolas.svg');
      frame.classList.add('xmas-ornament-ready');
      overlay.querySelectorAll('.xmas-pendulum').forEach(g=>animateBall(g,overlay));
    }
    window.addEventListener('resize',()=>{
      all.forEach(ball=>ball.draw());
      document.querySelectorAll('.xmas-ornament-canopy .xmas-ornament-overlay').forEach(svg=>svg.setAttribute('preserveAspectRatio',matchMedia('(max-width:760px)').matches?'xMidYMid slice':'none'));
    },{passive:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup,{once:true});
  else setup();
})();
