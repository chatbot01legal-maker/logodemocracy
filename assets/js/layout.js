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
