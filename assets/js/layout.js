document.addEventListener("DOMContentLoaded", () => {

  let isLoggedIn = false;

  const userLabel = document.getElementById("userLabel");
  const authButton = document.getElementById("authButton");

  // estado inicial
  function renderAuth() {
    if (!userLabel || !authButton) return;

    if (isLoggedIn) {
      userLabel.textContent = "⌂ Rodrigo"; // luego viene de DB
      authButton.textContent = "Log out";
    } else {
      userLabel.textContent = "⌂ Invitado";
      authButton.textContent = "Log in";
    }
  }

  // click login/logout
  if (authButton) {
    authButton.addEventListener("click", (e) => {
      e.preventDefault();

      isLoggedIn = !isLoggedIn;
      renderAuth();
    });
  }

  renderAuth();
});


// =========================
// SIDEBAR TOGGLE (FIX)
// =========================

document.addEventListener("DOMContentLoaded", () => {

  const sidebar = document.querySelector(".sidebar");
  const toggle = document.querySelector(".sidebar-toggle");

  if (!sidebar || !toggle) return;

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();

    sidebar.classList.toggle("collapsed");

    // opcional: cambiar icono
    toggle.textContent = sidebar.classList.contains("collapsed") ? "▸" : "◂";
  });

});
