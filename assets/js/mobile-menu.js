document.addEventListener("DOMContentLoaded", () => {

  const btn = document.getElementById('mobileMenuBtn');
  const nav = document.querySelector('.module-nav');
  const right = document.querySelector('.topbar-right');

  if (!btn || !nav || !right) return;

  btn.addEventListener('click', () => {

    const isOpen = nav.classList.toggle('open');

    right.classList.toggle('open', isOpen);

  });

});
