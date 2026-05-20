'use strict';

(function () {
  const dot  = document.getElementById('cur-dot');
  const ring = document.getElementById('cur-ring');
  let rx = 0, ry = 0, mx = 0, my = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  /* Smooth ring with lerp */
  (function animateRing() {
    rx += (mx - rx) * .11;
    ry += (my - ry) * .11;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  })();

  /* Hover state */
  const sel = 'a, button, input, textarea, .card, .badge, .s-link';
  document.addEventListener('mouseover', e => {
    document.body.classList.toggle('c-hover', !!e.target.closest(sel));
  });
})();
