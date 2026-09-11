document.addEventListener("DOMContentLoaded", () => {

  const btn = document.getElementById('mobileMenuBtn');
  const nav = document.querySelector('.module-nav');

  if (!btn || !nav) return;

  btn.setAttribute('aria-expanded', 'false');

  btn.addEventListener('click', () => {

    const isOpen = nav.classList.toggle('open');

    btn.setAttribute('aria-expanded', String(isOpen));
    btn.setAttribute(
      'aria-label',
      isOpen ? 'Cerrar menú' : 'Abrir menú'
    );

  });

});
