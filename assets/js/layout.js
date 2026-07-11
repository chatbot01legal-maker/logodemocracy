document.addEventListener("DOMContentLoaded", () => {

  // =========================
  // Hito 6: AUTH PLATAFORMA 
  // =========================

  const userLabel = document.getElementById("userLabel");
  const authButton = document.getElementById("authButton");

  function renderAuth() {
    if (!userLabel || !authButton) return;

    // Consultamos la fuente única de verdad de forma defensiva
    if (typeof IdentityProvider !== 'undefined' && IdentityProvider.isAuthenticated()) {
      var userName = IdentityProvider.getUserName() || 'Usuario';
      userLabel.textContent = "⌂ " + userName;
      authButton.textContent = "Log out";
    } else {
      userLabel.textContent = "⌂ Invitado";
      authButton.textContent = "Log in";
    }
  }

  if (authButton) {
    authButton.addEventListener("click", (e) => {
      e.preventDefault();
      
      if (typeof IdentityProvider !== 'undefined') {
        if (IdentityProvider.isAuthenticated()) {
          // Si está conectado, cerramos sesión
          IdentityProvider.clear();
        } else {
          // Si es invitado, inyectamos un usuario simulado
          IdentityProvider.setAuthenticated('mock-jwt-token', { id: 'u123', name: 'Rodrigo' });
        }
      }
    });
  }

  // Suscribirse a los cambios del estado global de forma ultra-defensiva
  if (
    typeof EventBus !== 'undefined' &&
    typeof EventBus.on === 'function'
  ) {
    EventBus.on('auth:changed', renderAuth);
    EventBus.on('identity:ready', renderAuth);
  }

  // Render inicial al cargar la página
  renderAuth();

  // =========================
  // SIDEBAR
  // =========================

  const sidebar = document.querySelector(".sidebar");
  const toggle = document.querySelector(".sidebar-toggle");

  if(sidebar && toggle){
      if(window.innerWidth <= 1024){
          sidebar.classList.add("collapsed");
          toggle.textContent = "▸";
      }

      toggle.addEventListener("click", ()=>{
          const collapsed = sidebar.classList.toggle("collapsed");
          toggle.textContent = collapsed ? "▸" : "◂";
      });
  }
});
