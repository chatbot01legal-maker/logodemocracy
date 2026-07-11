document.addEventListener("DOMContentLoaded", () => {
  
  // Trazador 0: Confirmar ejecución del script
  alert("layout.js cargó correctamente");

  const userLabel = document.getElementById("userLabel");
  const authButton = document.getElementById("authButton");

  // Trazador 0.5: Confirmar enlace con el DOM
  alert("authButton = " + (authButton ? "OK" : "NULL"));

  function renderAuth() {
    if (!userLabel || !authButton) return;

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
      
      try {
        alert("1. Click detectado");
        
        if (typeof IdentityProvider !== 'undefined') {
          alert("2. IdentityProvider existe");
          
          if (IdentityProvider.isAuthenticated()) {
            IdentityProvider.clear();
            alert("3. clear terminó");
          } else {
            IdentityProvider.setAuthenticated('mock-jwt-token', { id: 'u123', name: 'Rodrigo' });
            alert("3. setAuthenticated terminó");
          }
          
          alert("4. Modo actual: " + IdentityProvider.getMode());
          alert("5. Usuario: " + IdentityProvider.getUserName());
        } else {
          alert("ERROR FATAL: IdentityProvider es undefined al hacer click.");
        }
      } catch (error) {
        alert("EXCEPCIÓN ATRAPADA: " + error.message);
      }
    });
  }

  if (typeof EventBus !== 'undefined' && typeof EventBus.on === 'function') {
    EventBus.on('auth:changed', renderAuth);
    EventBus.on('identity:ready', renderAuth);
  }

  renderAuth();

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
