gsap.registerPlugin(ScrollTrigger);

/* 1. CURSOR ──────────────────────────────────────────────── */
const CR = document.getElementById('cr');
const CD = document.getElementById('cd');
let mx=0, my=0;

window.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  gsap.to(CD, { x: mx, y: my, duration: .05 });
  gsap.to(CR, { x: mx, y: my, duration: .3, ease: 'power2.out' });
});

document.querySelectorAll('button, .tc, .pstage, .rose-w, a').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
});

/* 2. ASH ANIMATION ───────────────────────────────────────── */
const canvas = document.getElementById('bg-canvas');
const ctx    = canvas.getContext('2d');
let W, H;
const resize = () => { W = canvas.width = innerWidth; H = canvas.height = innerHeight; };
window.addEventListener('resize', resize); resize();

class Ash {
  constructor() { this.born(true); }
  born(scatter) {
    this.x  = Math.random() * W;
    this.y  = scatter ? Math.random() * H : H + 10;
    this.vx = (Math.random() - .5) * .14;
    this.vy = -(Math.random() * .28 + .07);
    this.r  = Math.random() * 1.3 + .2;
    this.a  = Math.random() * .13 + .02;
    this.w  = Math.random() * Math.PI * 2;
    this.ws = .003 + Math.random() * .005;
    this.red = Math.random() > .68;
    this.life = 0;
    this.maxLife = 600 + Math.random() * 400;
  }
  tick() {
    this.w += this.ws;
    this.x += this.vx + Math.sin(this.w) * .18;
    this.y += this.vy;
    this.life++;
    if (this.y < -12 || this.life > this.maxLife) this.born(false);
  }
  draw() {
    ctx.save();
    const fade = Math.min(1, this.life / 60) * Math.min(1, (this.maxLife - this.life) / 60);
    ctx.globalAlpha = this.a * fade;
    ctx.fillStyle = this.red ? '#a8001a' : '#d8cdb5';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
const ashes = Array.from({ length: 80 }, () => new Ash());
(function loop() {
  ctx.clearRect(0, 0, W, H);
  ashes.forEach(a => { a.tick(); a.draw(); });
  requestAnimationFrame(loop);
})();

/* 3. GHOST LYRICS ────────────────────────────────────────── */
const lyrics = [
  'So long and goodnight', "I'm not okay", 'Carry on', 'Famous last words',
  'To the end', 'Helena', 'Ghost of you', 'Cemetery drive', 'Early sunsets',
  'Vampires will never hurt you', 'Dead!', 'Cancer', 'Mama', 'Disenchanted',
  "I don't love you", 'The sharpest lives', 'Sleep', 'Thank you for the venom'
];
let lastG = 0;
window.addEventListener('mousemove', e => {
  const now = Date.now();
  if (now - lastG < 1500) return;
  lastG = now;
  const el = document.createElement('div');
  el.className = 'ghost';
  el.textContent = lyrics[Math.floor(Math.random() * lyrics.length)];
  el.style.cssText = `left:${e.clientX}px;top:${e.clientY - 20}px`;
  document.body.appendChild(el);
  gsap.fromTo(el,
    { opacity: 0, y: 0 },
    { opacity: .45, y: -90, duration: 4.5, ease: 'power1.out', onComplete: () => el.remove() }
  );
});

/* 4. SCROLL ANIMATIONS ────────────────────────────────────── */
gsap.to('.whisper', {
  y: -200, ease: 'none',
  scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 5 }
});

const heroSeq = ['.hero-eye', '.hero-block', '.hero-sub', '.hero-q', '.hero-sc'];
heroSeq.forEach((sel, i) => {
  const el = document.querySelector(sel);
  if (!el) return;
  gsap.fromTo(el,
    { opacity: 0, y: 55 },
    { opacity: 1, y: 0, duration: 1.9, delay: .5 + i * .38, ease: 'power4.out' }
  );
});

gsap.utils.toArray('.fu').forEach(el => {
  if (el.closest('#hero')) return;
  gsap.fromTo(el, { opacity: 0, y: 42 }, {
    opacity: 1, y: 0, duration: 1.5, ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 87%', toggleActions: 'play none none none' }
  });
});

const heroSection = document.getElementById('hero');
const sigilSvg    = document.querySelector('#sigil svg');
if (heroSection && sigilSvg) {
  heroSection.addEventListener('mousemove', e => {
    const r  = heroSection.getBoundingClientRect();
    const cx = (e.clientX - r.left - r.width / 2) / r.width;
    sigilSvg.style.animationDuration = Math.max(12, 80 - Math.abs(cx) * 130) + 's';
  });
  heroSection.addEventListener('mouseleave', () => { sigilSvg.style.animationDuration = '80s'; });
}

ScrollTrigger.create({
  trigger: '#tracks', start: 'top 80%',
  onEnter: () => {
    gsap.fromTo('.tc', { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: .9, stagger: .08, ease: 'power3.out', delay: .3 });
  }
});

/* 5. POEM GENERATOR ───────────────────────────────────────── */
const subjects = ['Tu alma','Este desfile','La última canción','El frío de Chile','Las luces de México','Nuestra herida','El vacío','Tu sombra','Este silencio','La distancia','Tu nombre escrito en humo'];
const verbs    = ['se quema bajo','grita en','baila con','muere ante','se ahoga en','renace entre','se pierde en','florece sobre','sangra por','desaparece entre'];
const objects  = ['rosas muertas','viejas cintas de cassette','la lluvia negra','promesas rotas','el eco de 2004','sangre y miel','los ojos del abismo','cenizas dulces','tu voz a las tres','cartas sin enviar'];
const pstage   = document.getElementById('pstage');
const poemText = document.getElementById('poem-text');

pstage.addEventListener('click', () => {
  const s = subjects[Math.floor(Math.random() * subjects.length)];
  const v = verbs[Math.floor(Math.random() * verbs.length)];
  const o = objects[Math.floor(Math.random() * objects.length)];
  gsap.to(poemText, {
    opacity: 0, y: -14, duration: .28,
    onComplete: () => {
      const verse = `"${s} ${v} ${o}"`;
      revealChars(poemText, verse);
    }
  });
  gsap.to('body', { backgroundColor: '#0e0210', duration: .07, yoyo: true, repeat: 1 });
  gsap.to('.pstage .b1', { borderColor: 'rgba(223,0,32,.8)', duration: .1, yoyo: true, repeat: 2 });
});

/* 6. ORACLE ──────────────────────────────────────────────── */
const oLines = ['El dolor es tu corona','El desfile nunca termina','No estás sola en esto','Tu voz es el antídoto','Mantente peligrosa','La venganza es dulce','Eres la última de tu especie','La oscuridad te pertenece','Carry on — siempre','El mundo no mereció esta canción','So long and goodnight, mi amor'];
const roseEl   = document.getElementById('rose-el');
const oResp    = document.getElementById('oracle-r');
const oBtn     = document.getElementById('oracle-btn');
let oAnimating = false;

function invokeOracle() {
  if (oAnimating) return;
  oAnimating = true;
  oResp.classList.remove('show');
  gsap.to(roseEl, { rotation: '+=18', duration: .15, yoyo: true, repeat: 5, ease: 'power2.inOut', onComplete: () => { oAnimating = false; } });
  gsap.to('.rose-halo', { opacity: 1, duration: .3, yoyo: true, repeat: 2 });
  setTimeout(() => {
    oResp.textContent = oLines[Math.floor(Math.random() * oLines.length)];
    oResp.classList.add('show');
    gsap.fromTo(oResp, { y: 18, letterSpacing: '12px', opacity: 0 }, { y: 0, letterSpacing: '6px', opacity: 1, duration: 1.2, ease: 'power4.out' });
  }, 700);
}
oBtn.addEventListener('click', invokeOracle);
roseEl.addEventListener('click', invokeOracle);

/* 7. PLAYER ──────────────────────────────────────────────── */
const tracks = ['Side A — Demolition Lovers','Side B — Helena','Side C — The Ghost of You','Side D — Famous Last Words','Side E — Cancer',"Side F — I'm Not Okay"];
let ti = 0;
const pLbl = document.getElementById('p-lbl');
setInterval(() => {
  ti = (ti + 1) % tracks.length;
  gsap.to(pLbl, { opacity: 0, y: -5, duration: .3, onComplete: () => {
    pLbl.textContent = tracks[ti];
    gsap.to(pLbl, { opacity: 1, y: 0, duration: .45 });
  }});
}, 5000);

window.addEventListener('scroll', () => {
  const prog  = window.scrollY / (document.body.scrollHeight - innerHeight);
  document.documentElement.style.setProperty('--scroll-tint', `rgba(168,0,26,${prog * .04})`);
});

/* ── 1. INTRO CURTAIN ─────────────────────── */
const curtain     = document.getElementById('curtain');
const curtainBtn  = document.getElementById('curtain-enter');

curtainBtn.addEventListener('click', () => {
  gsap.to(curtain, {
    clipPath: 'inset(0 0 100% 0)',
    duration: 1.4,
    ease: 'power4.inOut',
    onComplete: () => {
      curtain.style.display = 'none';
      document.body.classList.add('site-active');
      // start heartbeat after curtain lifts
      setTimeout(() => {
        const hL = document.querySelector('.hL');
        if (hL) hL.classList.add('beating');
      }, 800);
    }
  });
  // Flash the whole screen red momentarily
  const flash = document.createElement('div');
  flash.style.cssText = 'position:fixed;inset:0;background:rgba(168,0,26,.15);z-index:8999;pointer-events:none';
  document.body.appendChild(flash);
  gsap.to(flash, { opacity: 0, duration: .8, onComplete: () => flash.remove() });
});

/* ── 2. SCROLL PROGRESS LINE ──────────────── */
const progressLine = document.getElementById('progress-line');
window.addEventListener('scroll', () => {
  const pct = (window.scrollY / (document.body.scrollHeight - innerHeight)) * 100;
  if (progressLine) progressLine.style.width = pct + '%';
});

/* ── 3. BLOOD DRIP SVG ────────────────────── */
(function buildDrips() {
  const svg  = document.getElementById('blood-drip-layer');
  if (!svg) return;
  const count = 12;
  for (let i = 0; i < count; i++) {
    const x   = 60 + (i / count) * 1320 + Math.random() * 60;
    const h   = 20 + Math.random() * 40;
    const w   = 2  + Math.random() * 5;
    const del = Math.random() * 8;
    const dur = 4  + Math.random() * 6;
    const path = document.createElementNS('http://www.w3.org/2000/svg','path');
    const capR = w * .8;
    path.setAttribute('d', `M${x},0 L${x - w/2},${h - capR * 1.5} Q${x},${h + 4} ${x + w/2},${h - capR * 1.5} Z`);
    path.setAttribute('fill','#a8001a');
    path.setAttribute('opacity','0');
    path.style.cssText = `transform-origin:${x}px 0px`;
    svg.appendChild(path);
    gsap.set(path, { scaleY: 0, opacity: 0 });
    gsap.to(path, {
      scaleY: 1, opacity: .75 + Math.random() * .25,
      duration: dur, delay: del, ease: 'power1.in',
      repeat: -1, repeatDelay: 3 + Math.random() * 10,
      onRepeat: function() {
        path.setAttribute('d', `M${x},0 L${x - w/2},${h - capR * 1.5 - Math.random()*10} Q${x},${h + 4 + Math.random()*8} ${x + w/2},${h - capR * 1.5 - Math.random()*8} Z`);
      }
    });
  }
})();

/* ── 4. MIST CANVAS ───────────────────────── */
(function initMist() {
  const mc  = document.getElementById('mist-canvas');
  if (!mc) return;
  const mctx = mc.getContext('2d');
  let mW, mH;
  const mResize = () => { mW = mc.width = innerWidth; mH = mc.height = innerHeight; };
  window.addEventListener('resize', mResize); mResize();

  class MistBlob {
    constructor() { this.reset(); }
    reset() {
      this.x   = Math.random() * mW;
      this.y   = mH * .6 + Math.random() * mH * .5;
      this.r   = 80 + Math.random() * 180;
      this.vx  = (Math.random() - .5) * .08;
      this.vy  = -.02 - Math.random() * .04;
      this.a   = 0;
      this.maxA= .018 + Math.random() * .014;
      this.life= 0;
      this.maxL= 400 + Math.random() * 600;
    }
    tick() {
      this.life++;
      this.x  += this.vx;
      this.y  += this.vy;
      this.r  += .08;
      const t  = this.life / this.maxL;
      this.a   = this.maxA * Math.sin(t * Math.PI);
      if (this.life >= this.maxL) this.reset();
    }
    draw() {
      const g = mctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
      g.addColorStop(0, `rgba(168,0,26,${this.a})`);
      g.addColorStop(1, 'rgba(168,0,26,0)');
      mctx.save();
      mctx.globalAlpha = 1;
      mctx.fillStyle = g;
      mctx.beginPath();
      mctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      mctx.fill();
      mctx.restore();
    }
  }

  const blobs = Array.from({ length: 14 }, () => new MistBlob());
  (function mistLoop() {
    mctx.clearRect(0, 0, mW, mH);
    blobs.forEach(b => { b.tick(); b.draw(); });
    requestAnimationFrame(mistLoop);
  })();
})();

/* ── 5. CURSOR BLOOD TRAIL ────────────────── */
let lastBlood = 0;
window.addEventListener('mousemove', e => {
  const now = Date.now();
  if (now - lastBlood < 80) return;
  lastBlood = now;
  const d = document.createElement('div');
  d.className = 'cursor-blood';
  d.style.cssText = `left:${e.clientX}px;top:${e.clientY}px`;
  document.body.appendChild(d);
  setTimeout(() => d.remove(), 900);
});

/* ── 6. CHAR-BY-CHAR poem reveal ─────────── */
function revealChars(el, text) {
  el.textContent = '';
  el.style.opacity = '1';
  el.style.transform = 'translateY(0)';
  [...text].forEach((ch, i) => {
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = ch === ' ' ? '\u00a0' : ch;
    span.style.animationDelay = (i * 35) + 'ms';
    el.appendChild(span);
  });
}

/* ── 7. MANIFESTO title hover shimmer ─────── */
(function shimmerTitle() {
  const h = document.querySelector('.mf-h');
  if (!h) return;
  const raw = h.innerHTML;
  h.innerHTML = raw.replace(/([^<>])/g, '<span class="shimmer-char">$1</span>');
})();

/* ── 8. TRACK CARD RIPPLE on click ─────────── */
document.querySelectorAll('.tc').forEach(card => {
  card.addEventListener('click', e => {
    const r    = card.getBoundingClientRect();
    const ripple = document.createElement('div');
    ripple.className = 'tc-ripple';
    const size = Math.max(r.width, r.height);
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size/2}px;top:${e.clientY - r.top - size/2}px`;
    card.appendChild(ripple);
    setTimeout(() => ripple.remove(), 900);
  });
});

/* ── 9. STAR FIELD in finale ─────────────── */
(function buildStars() {
  const sf = document.getElementById('star-field');
  if (!sf) return;
  for (let i = 0; i < 50; i++) {
    const s = document.createElement('div');
    s.className = 'star-twinkle';
    const size = .8 + Math.random() * 1.5;
    s.style.cssText = `
      width:${size}px;height:${size}px;
      left:${Math.random()*100}%;top:${Math.random()*100}%;
      --dur:${2+Math.random()*5}s;
      --del:${Math.random()*6}s;
      --max-op:${.08+Math.random()*.18};
    `;
    sf.appendChild(s);
  }
})();

/* ── 10. PARALLAX sections on scroll ─────── */
gsap.to('.hero-bloom', {
  y: -80,
  ease: 'none',
  scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 2 }
});

gsap.to('#sigil svg', {
  y: -120, scale: .9,
  ease: 'none',
  scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 3 }
});

/* ── 11. MANIFESTO XX watermark float ─────── */
gsap.to('.mf-XX', {
  y: -40,
  ease: 'none',
  scrollTrigger: { trigger: '#manifesto', start: 'top bottom', end: 'bottom top', scrub: 2 }
});

/* ── 12. PORTRAIT SVG parallax ─────────────── */
gsap.to('.pl-inner svg', {
  y: -30,
  ease: 'none',
  scrollTrigger: { trigger: '#portrait', start: 'top bottom', end: 'bottom top', scrub: 2 }
});

/* ── 13. TYPEWRITER on hero eyebrow ──────────── */
(function typewriterEye() {
  const eye = document.querySelector('.hero-eye');
  if (!eye) return;
  const full = eye.textContent.trim();
  eye.textContent = '';
  eye.classList.add('typing');
  let i = 0;
  setTimeout(() => {
    const iv = setInterval(() => {
      eye.textContent = full.slice(0, i++);
      if (i > full.length) {
        clearInterval(iv);
        eye.classList.remove('typing');
      }
    }, 40);
  }, 600);
})();

/* ── 14. SECTION NUM fade-in on scroll ───────── */
document.querySelectorAll('.section-num').forEach(el => {
  gsap.fromTo(el, { opacity: 0 }, {
    opacity: 1, duration: 2, ease: 'power2.out',
    scrollTrigger: { trigger: el.parentElement, start: 'top 60%' }
  });
});

/* ── 15. PR-SIG typewriter reveal ────────────── */
ScrollTrigger.create({
  trigger: '.pr-sig', start: 'top 80%',
  onEnter: () => {
    const sig  = document.querySelector('.pr-sig');
    if (!sig || sig._typed) return;
    sig._typed = true;
    const full = sig.textContent;
    sig.textContent = '';
    sig.style.borderRight = '1px solid rgba(168,0,26,.5)';
    let i = 0;
    const iv = setInterval(() => {
      sig.textContent = full.slice(0, i++);
      if (i > full.length) {
        clearInterval(iv);
        setTimeout(() => sig.style.borderRight = '1px solid transparent', 800);
      }
    }, 45);
  }
});

/* ── 16. ORACLE RESPONSE auto-clear ──────────── */
let clearOracleTimer;
function scheduleOracleClear() {
  clearTimeout(clearOracleTimer);
  clearOracleTimer = setTimeout(() => {
    gsap.to(oResp, { opacity: 0, y: 10, duration: 1.5, ease: 'power2.in',
      onComplete: () => { oResp.classList.remove('show'); oResp.style.opacity = ''; oResp.style.transform = ''; }
    });
  }, 8000);
}
const origInvoke = invokeOracle;
function invokeOracleWrapped() { origInvoke(); scheduleOracleClear(); }
roseEl.addEventListener('click', invokeOracleWrapped);
oBtn.addEventListener('click', invokeOracleWrapped);

/* ── 17. TRACKS section title char shimmer ───── */
ScrollTrigger.create({
  trigger: '#tracks', start: 'top 75%',
  onEnter: () => {
    gsap.fromTo('.tracks-title', { letterSpacing: '-.05em', opacity: .3 },
      { letterSpacing: '0em', opacity: 1, duration: 1.2, ease: 'power3.out' });
  }
});

/* ── 18. FINALE aurora colour cycle ─────────── */
gsap.to('.aurora', {
  background: 'radial-gradient(ellipse at 50% 100%,rgba(135,0,26,.22) 0%,rgba(90,0,18,.07) 40%,transparent 70%)',
  duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut'
});

/* ── 19. PLAYER GLOW PULSE on track change ───── */
const playerEl = document.getElementById('player');
function pulsePlayer() {
  if (playerEl) {
    gsap.to(playerEl, { boxShadow: '0 0 20px rgba(168,0,26,.4)', duration: .3,
      yoyo: true, repeat: 3, ease: 'power2.inOut' });
  }
}
setInterval(pulsePlayer, 5000);

/* ── 20. POEM STAGE mouse-track glow ─────────── */
if (pstage) {
  pstage.addEventListener('mousemove', e => {
    const r  = pstage.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width)  * 100;
    const py = ((e.clientY - r.top)  / r.height) * 100;
    const glow = pstage.querySelector('.pstage-glow');
    if (glow) {
      glow.style.background =
        `radial-gradient(ellipse at ${px}% ${py}%,rgba(168,0,26,.12) 0%,transparent 65%)`;
    }
  });
}

console.log('%c✦ Demolition Lovers — Acto XX ✦', 'color:#df0020;font-family:serif;font-size:16px;font-style:italic');
