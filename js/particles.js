'use strict';

(function () {
  const cv  = document.getElementById('bg-canvas');
  const ctx = cv.getContext('2d');
  let W, H;
  const mouse = { x: -999, y: -999 };
  const N = 130;
  const CONN_D  = 145;   // particle-to-particle connection threshold
  const MOUSE_D = 190;   // mouse influence zone for opacity boost
  const REPEL   = 55;    // repulsion radius

  function resize() {
    W = cv.width  = window.innerWidth;
    H = cv.height = window.innerHeight;
  }

  class P {
    constructor() { this.init(true); }

    init(random) {
      this.x  = random ? Math.random() * W : (Math.random() < .5 ? -5 : W + 5);
      this.y  = random ? Math.random() * H : Math.random() * H;
      this.vx = (Math.random() - .5) * .55;
      this.vy = (Math.random() - .5) * .55;
      this.r  = Math.random() * 1.7 + .6;
      this.a  = Math.random() * .45 + .15;

      /* Palette: cyan / violet / white-blue */
      const t = Math.random();
      if (t < .38)       this.col = [0,   210 + Math.random()*45, 255];
      else if (t < .68)  this.col = [110 + Math.random()*60, 40 + Math.random()*40, 225 + Math.random()*30];
      else               this.col = [160 + Math.random()*60, 160 + Math.random()*60, 255];
    }

    update() {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const d  = Math.hypot(dx, dy);

      if (d < REPEL && d > 0) {
        const f = (REPEL - d) / REPEL * 1.6;
        this.vx += (dx / d) * f * .28;
        this.vy += (dy / d) * f * .28;
      }

      this.vx *= .982;
      this.vy *= .982;

      const spd = Math.hypot(this.vx, this.vy);
      if (spd > 2.2) { this.vx = this.vx / spd * 2.2; this.vy = this.vy / spd * 2.2; }

      this.x += this.vx;
      this.y += this.vy;

      if (this.x < -12) this.x = W + 12;
      if (this.x > W + 12) this.x = -12;
      if (this.y < -12) this.y = H + 12;
      if (this.y > H + 12) this.y = -12;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.col},${this.a})`;
      ctx.fill();
    }
  }

  let pts = [];

  function initPts() { pts = Array.from({ length: N }, () => new P()); }

  function drawEdges() {
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const d  = Math.hypot(dx, dy);
        if (d >= CONN_D) continue;

        const mx  = (pts[i].x + pts[j].x) / 2;
        const my  = (pts[i].y + pts[j].y) / 2;
        const md  = Math.hypot(mx - mouse.x, my - mouse.y);
        let alpha = (1 - d / CONN_D) * .22;
        if (md < MOUSE_D) alpha *= 1 + (1 - md / MOUSE_D) * 3.5;
        alpha = Math.min(alpha, .75);

        ctx.beginPath();
        ctx.strokeStyle = `rgba(${pts[i].col},${alpha})`;
        ctx.lineWidth   = .65;
        ctx.moveTo(pts[i].x, pts[i].y);
        ctx.lineTo(pts[j].x, pts[j].y);
        ctx.stroke();
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    pts.forEach(p => { p.update(); p.draw(); });
    drawEdges();
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => { resize(); initPts(); });
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('touchmove', e => {
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
  }, { passive: true });

  resize();
  initPts();
  loop();
})();
