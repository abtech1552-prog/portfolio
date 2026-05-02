// AB-TECH PORTFOLIO v3 — SCRIPT.JS

// ---- CURSOR ----
const cursorDot = document.getElementById('cursorDot');
document.addEventListener('mousemove', e => {
  cursorDot.style.left = e.clientX + 'px';
  cursorDot.style.top  = e.clientY + 'px';
});

// ---- DARK/LIGHT TOGGLE ----
const themeToggle  = document.getElementById('themeToggle');
const toggleIcon   = document.getElementById('toggleIcon');
const toggleLabel  = document.getElementById('toggleLabel');
const html         = document.documentElement;
const savedTheme   = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
updateToggleUI(savedTheme);
themeToggle.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateToggleUI(next);
  initCanvas(); // re-init canvas colors on theme switch
});
function updateToggleUI(t) {
  toggleIcon.textContent  = t === 'dark' ? '☀️' : '🌙';
  toggleLabel.textContent = t === 'dark' ? 'Light' : 'Dark';
}

// ---- ANIMATED CANVAS BACKGROUND ----
const canvas = document.getElementById('bgCanvas');
const ctx    = canvas.getContext('2d');
let W, H, particles = [], animFrame;

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Particle {
  constructor() { this.reset(true); }
  reset(init) {
    this.x  = Math.random() * W;
    this.y  = init ? Math.random() * H : H + 10;
    this.r  = Math.random() * 1.4 + 0.3;
    this.vy = -(Math.random() * 0.4 + 0.1);
    this.vx = (Math.random() - 0.5) * 0.15;
    this.life = 0;
    this.maxLife = Math.random() * 200 + 100;
    this.color = Math.random() > 0.5 ? 'cyan' : 'purple';
  }
  update() {
    this.x += this.vx; this.y += this.vy; this.life++;
    if (this.life > this.maxLife || this.y < -10) this.reset(false);
  }
  draw() {
    const alpha = Math.sin((this.life / this.maxLife) * Math.PI) * 0.55;
    const isDark = html.getAttribute('data-theme') !== 'light';
    const c = this.color === 'cyan'
      ? (isDark ? `rgba(0,245,192,${alpha})`   : `rgba(0,122,94,${alpha})`)
      : (isDark ? `rgba(109,74,255,${alpha})`  : `rgba(85,51,204,${alpha})`);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = c;
    ctx.fill();
  }
}

// Orbs
let orbs = [];
class Orb {
  constructor(x, y, color, size) {
    this.ox = x; this.oy = y; this.x = x; this.y = y;
    this.color = color; this.size = size;
    this.t = Math.random() * Math.PI * 2;
    this.speed = 0.003 + Math.random() * 0.002;
    this.amp = 60 + Math.random() * 60;
  }
  update() {
    this.t += this.speed;
    this.x = this.ox + Math.cos(this.t) * this.amp;
    this.y = this.oy + Math.sin(this.t * 0.7) * this.amp * 0.6;
  }
  draw() {
    const isDark = html.getAttribute('data-theme') !== 'light';
    const alpha  = isDark ? 0.12 : 0.07;
    const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
    grad.addColorStop(0, this.color.replace('A', alpha.toString()).replace('B', (alpha * 0.5).toString()));
    grad.addColorStop(1, 'transparent');
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
  }
}

function initCanvas() {
  if (animFrame) cancelAnimationFrame(animFrame);
  particles = Array.from({length: 80}, () => new Particle());
  orbs = [
    new Orb(W * 0.2,  H * 0.25, 'rgba(109,74,255,A)', 320),
    new Orb(W * 0.8,  H * 0.7,  'rgba(0,245,192,A)',  280),
    new Orb(W * 0.55, H * 0.15, 'rgba(109,74,255,B)', 220),
  ];
  animate();
}

function animate() {
  ctx.clearRect(0, 0, W, H);
  orbs.forEach(o => { o.update(); o.draw(); });
  particles.forEach(p => { p.update(); p.draw(); });
  animFrame = requestAnimationFrame(animate);
}

initCanvas();

// ---- TERMINAL TYPEWRITER ----
const lines = [
  {text:'$ whoami',       cls:'t-green',  delay:300},
  {text:'Mohamed Gharib', cls:'t-white',  delay:180},
  {text:'',               cls:'',         delay:120},
  {text:'$ cat mission.txt', cls:'t-green', delay:420},
  {text:'> AI & Cybersecurity Enthusiast', cls:'t-accent', delay:80},
  {text:'> Building from الأساس upward',  cls:'t-accent', delay:80},
  {text:'',               cls:'',         delay:120},
  {text:'$ ls skills/',   cls:'t-green',  delay:420},
  {text:'ai-tools  research  python  linux  networking', cls:'t-yellow', delay:120},
  {text:'',               cls:'',         delay:120},
  {text:'$ python3 future.py', cls:'t-green', delay:400},
  {text:'> Initializing roadmap...', cls:'t-muted', delay:80},
  {text:'> Cybersecurity path: LOCKED IN 🔐', cls:'t-accent', delay:80},
  {text:'> Status: Building every day.', cls:'t-accent', delay:80},
  {text:'',               cls:'',         delay:200},
];

const tbody = document.getElementById('terminalBody');
let li = 0;

function typeLine(obj, cb) {
  const div = document.createElement('div');
  if (obj.cls) div.className = obj.cls;
  tbody.appendChild(div);
  if (!obj.text) { tbody.scrollTop = tbody.scrollHeight; setTimeout(cb, 80); return; }
  let ci = 0;
  const spd = obj.cls === 't-green' ? 52 : 20;
  (function next() {
    if (ci < obj.text.length) {
      div.textContent += obj.text[ci++];
      tbody.scrollTop = tbody.scrollHeight;
      setTimeout(next, spd);
    } else {
      tbody.scrollTop = tbody.scrollHeight;
      setTimeout(cb, obj.delay || 180);
    }
  })();
}

function runTerminal() {
  if (li >= lines.length) {
    const last = document.createElement('div');
    last.className = 't-green';
    last.textContent = '$ ';
    const cur = document.createElement('span');
    cur.className = 'terminal-cursor';
    last.appendChild(cur);
    tbody.appendChild(last);
    return;
  }
  typeLine(lines[li++], runTerminal);
}
setTimeout(runTerminal, 900);

// ---- SKILL BARS ----
const fills = document.querySelectorAll('.skill-fill');
const skillObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.width = e.target.getAttribute('data-width') + '%';
      skillObs.unobserve(e.target);
    }
  });
}, {threshold: 0.3});
fills.forEach(f => skillObs.observe(f));

// ---- SCROLL REVEAL ----
document.querySelectorAll('.section').forEach(s => {
  s.classList.add('fade-in');
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { e.target.classList.add('visible'); }
  }, {threshold: 0.08}).observe(s);
});

// ---- ACTIVE NAV ----
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 110) cur = s.id; });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + cur ? 'var(--accent)' : '';
  });
});

// ---- CARD GLOW ON HOVER ----
document.querySelectorAll('.skill-card, .project-card, .course-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top)  / r.height) * 100;
    card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(0,245,192,0.05), var(--surface) 55%)`;
  });
  card.addEventListener('mouseleave', () => card.style.background = '');
});

// ---- SMOOTH SCROLL ----
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const t = document.querySelector(a.getAttribute('href'));
    if (t) t.scrollIntoView({behavior:'smooth', block:'start'});
  });
});

// ---- CONTACT FORM ----
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('.btn-primary');
    btn.querySelector('span').textContent = '⏳ Sending...';
    btn.disabled = true;
    try {
      const res = await fetch('https://formspree.io/f/xnjwnllv', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      });
      if (res.ok) {
        btn.querySelector('span').textContent = '✅ Message Sent!';
        btn.style.background = 'linear-gradient(135deg, #059669, #047857)';
        form.reset();
        setTimeout(() => {
          btn.querySelector('span').textContent = 'Send Message ✉️';
          btn.style.background = '';
          btn.disabled = false;
        }, 4000);
      } else { throw new Error('fail'); }
    } catch {
      btn.querySelector('span').textContent = '❌ Error — Try Again';
      btn.style.background = 'linear-gradient(135deg, #dc2626, #b91c1c)';
      setTimeout(() => {
        btn.querySelector('span').textContent = 'Send Message ✉️';
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }
  });
}
