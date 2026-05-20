'use strict';

(function () {
  document.querySelectorAll('.card').forEach(card => {
    const shine = card.querySelector('.card-shine');

    card.addEventListener('mousemove', e => {
      const rc = card.getBoundingClientRect();
      const x  = e.clientX - rc.left;
      const y  = e.clientY - rc.top;
      const cx = rc.width  / 2;
      const cy = rc.height / 2;
      const rX = ((y - cy) / cy) * -10;
      const rY = ((x - cx) / cx) *  10;

      card.style.transform    = `perspective(1100px) rotateX(${rX}deg) rotateY(${rY}deg) translateZ(18px)`;
      card.style.boxShadow    = '0 24px 60px rgba(0,0,0,.55), 0 0 42px rgba(0,228,255,.1)';
      card.style.borderColor  = 'rgba(0,228,255,.24)';
      shine.style.background  = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,.1), transparent 65%)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform   = '';
      card.style.boxShadow   = '';
      card.style.borderColor = '';
      shine.style.background = '';
    });
  });
})();
