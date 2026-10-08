document.addEventListener("DOMContentLoaded", () => {

  const btn = document.getElementById('mobileMenuBtn');
  const nav = document.querySelector('.module-nav');

  if (!btn || !nav) return;

  btn.setAttribute('aria-expanded', 'false');

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(isOpen));
    btn.setAttribute(
      'aria-label',
      isOpen ? 'Cerrar menú' : 'Abrir menú'
    );
  });

  /* Cerrar el menú al tocar cualquier parte fuera de él */
  document.addEventListener('click', (e) => {
    if (!nav.classList.contains('open')) return;
    if (nav.contains(e.target)) return;
    if (btn.contains(e.target)) return;
    nav.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Abrir menú');
  });

  /* Cerrar también con tecla Escape (desktop) */
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!nav.classList.contains('open')) return;
    nav.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Abrir menú');
  });

});
