'use strict';

function toast(msg, isErr = false) {
  const el  = document.getElementById('toast');
  const txt = document.getElementById('toast-msg');
  const ico = el.querySelector('.t-ico');
  txt.textContent      = msg;
  el.style.borderColor = isErr ? 'rgba(248,113,113,.4)' : 'rgba(0,228,255,.28)';
  ico.style.color      = isErr ? '#f87171' : 'var(--cyan)';
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 3800);
}

(function () {
  function field(inputId, fgId, hintId, validator, msgs) {
    const inp  = document.getElementById(inputId);
    const fg   = document.getElementById(fgId);
    const hint = document.getElementById(hintId);

    function check() {
      const val = inp.value.trim();
      if (!val) {
        fg.classList.remove('valid', 'invalid');
        hint.textContent = '';
        return false;
      }
      const ok = validator(val);
      fg.classList.toggle('valid',   ok);
      fg.classList.toggle('invalid', !ok);
      hint.textContent = ok ? msgs.ok : msgs.err;
      return ok;
    }

    inp.addEventListener('input', check);
    inp.addEventListener('blur',  check);
    return check;
  }

  const vName  = field('f-name',  'fg-name',  'h-name',
    v => v.length >= 2,
    { ok: '✓ Nombre válido', err: 'Mínimo 2 caracteres' }
  );

  const vEmail = field('f-email', 'fg-email', 'h-email',
    v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    { ok: '✓ Email válido', err: 'Ingresá un email válido' }
  );

  const vMsg   = field('f-msg',   'fg-msg',   'h-msg',
    v => v.length >= 15,
    { ok: '✓ Listo para enviar', err: 'El mensaje debe tener al menos 15 caracteres' }
  );

  document.getElementById('contact-form').addEventListener('submit', async e => {
    e.preventDefault();
    if (![vName(), vEmail(), vMsg()].every(Boolean)) {
      toast('Por favor, completá todos los campos correctamente.', true);
      return;
    }
    const btn = e.target.querySelector('.btn-send');
    btn.disabled = true;
    try {
      const res  = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: new FormData(e.target),
      });
      const json = await res.json();
      if (json.success) {
        toast('¡Mensaje enviado! Te respondo pronto 🚀');
        e.target.reset();
        ['fg-name','fg-email','fg-msg'].forEach(id => {
          document.getElementById(id).classList.remove('valid', 'invalid');
        });
        ['h-name','h-email','h-msg'].forEach(id => {
          document.getElementById(id).textContent = '';
        });
      } else {
        toast('No se pudo enviar el mensaje. Intentá de nuevo.', true);
      }
    } catch {
      toast('Error de conexión. Revisá tu internet e intentá de nuevo.', true);
    } finally {
      btn.disabled = false;
    }
  });
})();
