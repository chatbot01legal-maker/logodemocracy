document.addEventListener("DOMContentLoaded", () => {

  // =========================
  // AUTH DEMO
  // =========================

  let isLoggedIn = false;

  const userLabel = document.getElementById("userLabel");
  const authButton = document.getElementById("authButton");

  function renderAuth() {

    if (!userLabel || !authButton) return;

    if (isLoggedIn) {

      userLabel.textContent = "⌂ Rodrigo";
      authButton.textContent = "Log out";

    }

    else {

      userLabel.textContent = "⌂ Invitado";
      authButton.textContent = "Log in";

    }

  }

  if (authButton) {

    authButton.addEventListener("click",(e)=>{

      e.preventDefault();

      isLoggedIn = !isLoggedIn;

      renderAuth();

    });

  }

  renderAuth();


  // =========================
  // SIDEBAR
  // =========================

  const sidebar =
    document.querySelector(".sidebar");

  const toggle =
    document.querySelector(".sidebar-toggle");

  if (sidebar && toggle) {

  // Colapsar automáticamente en tablet y móvil

  if (window.innerWidth <= 1024) {

    sidebar.classList.add("collapsed");

    toggle.textContent = "▸";

  }

  toggle.addEventListener("click",()=>{

    sidebar.classList.toggle(
      "collapsed"
    );

    toggle.textContent =

      sidebar.classList.contains(
        "collapsed"
      )

      ? "▸"

      : "◂";

  });

  }
