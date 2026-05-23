/* ═══════════════════════════════════════════════════════════
   DEVOPS MISSION CONTROL — main.js
   ═══════════════════════════════════════════════════════════ */

/* ── Live clock ────────────────────────────────────────────── */
function startClock() {
  const el = document.getElementById('liveTime');
  if (!el) return;
  const tick = () => {
    el.textContent = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
  };
  tick();
  setInterval(tick, 1000);
}

/* ── Animated number counters ──────────────────────────────── */
function initCounters() {
  document.querySelectorAll('.counter').forEach(el => {
    const target = parseInt(el.dataset.target, 10) || 0;
    if (target === 0) { el.textContent = '0'; return; }
    let start = 0;
    const duration = 1200;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      el.textContent = start.toLocaleString();
      if (start >= target) clearInterval(timer);
    }, 16);
  });
}

/* ── Scroll-triggered AOS (no library dependency) ─────────── */
function initAOS() {
  const items = document.querySelectorAll('[data-aos]');
  if (!items.length) return;

  const delays = { '60': 60, '80': 80, '120': 120, '160': 160, '180': 180, '240': 240, '300': 300 };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.aosDelay || '0', 10);
        setTimeout(() => entry.target.classList.add('aos-animate'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(el => observer.observe(el));
}

/* ── Traffic bar chart (canvas, no library) ────────────────── */
function initTrafficChart(weeklyData) {
  const canvas = document.getElementById('trafficChart');
  if (!canvas || !weeklyData) return;

  const ctx = canvas.getContext('2d');
  const W = canvas.offsetWidth;
  const H = canvas.offsetHeight;
  canvas.width  = W * devicePixelRatio;
  canvas.height = H * devicePixelRatio;
  ctx.scale(devicePixelRatio, devicePixelRatio);

  const accent  = '#00e5a0';
  const dimBg   = '#162536';
  const textDim = '#3d5a72';
  const textMid = '#6b8eaa';

  const counts = weeklyData.map(d => d.count);
  const labels = weeklyData.map(d => d.day);
  const maxVal = Math.max(...counts, 1);

  const padL = 8, padR = 8, padT = 14, padB = 28;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const barW   = (chartW / counts.length) * 0.55;
  const gap    = chartW / counts.length;

  // Animate bars
  let progress = 0;
  const animate = () => {
    ctx.clearRect(0, 0, W, H);
    progress = Math.min(progress + 0.06, 1);
    const ease = 1 - Math.pow(1 - progress, 3);

    counts.forEach((val, i) => {
      const x = padL + i * gap + (gap - barW) / 2;
      const barH = ((val / maxVal) * chartH * ease) || 2;
      const y = padT + chartH - barH;

      // Bar bg
      ctx.fillStyle = dimBg;
      ctx.fillRect(x, padT, barW, chartH);

      // Bar fill with gradient
      const grad = ctx.createLinearGradient(0, y, 0, padT + chartH);
      grad.addColorStop(0, accent);
      grad.addColorStop(1, 'rgba(0,229,160,0.1)');
      ctx.fillStyle = grad;
      ctx.fillRect(x, y, barW, barH);

      // Label
      ctx.fillStyle = textMid;
      ctx.font = `11px 'Share Tech Mono', monospace`;
      ctx.textAlign = 'center';
      ctx.fillText(labels[i], x + barW / 2, H - padB + 14);

      // Value on top if non-zero
      if (val > 0 && ease > 0.8) {
        ctx.fillStyle = accent;
        ctx.font = `10px 'Share Tech Mono', monospace`;
        ctx.fillText(val, x + barW / 2, y - 4);
      }
    });

    if (progress < 1) requestAnimationFrame(animate);
  };

  requestAnimationFrame(animate);
}

/* ── Pipeline packet animation (already CSS, JS just triggers) */
function animatePipelinePacket() {
  // Nothing needed — CSS @keyframes handles it.
  // This function exists as a hook for future enhancements.
}

/* ── Mobile nav burger ─────────────────────────────────────── */
function initBurger() {
  const btn   = document.getElementById('navBurger');
  const links = document.querySelector('.nav__links');
  if (!btn || !links) return;
  btn.addEventListener('click', () => {
    links.classList.toggle('open');
  });
}

/* ── Boot ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  startClock();
  initAOS();
  initCounters();
  initBurger();
});