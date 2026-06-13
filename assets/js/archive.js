document.addEventListener("DOMContentLoaded", () => {
  const content = document.getElementById("content");

  function loadDocument(name) {
    if (!content) return;
    content.innerHTML = "Cargando: " + name;
  }

  /* Interacción básica del árbol */
  document.querySelectorAll(".file").forEach(el => {
    el.addEventListener("click", () => {
      loadDocument(el.textContent);
    });
  });

  /* ========================================================
     SIDEBAR TOGGLE (OPTIMIZADO CON POINTERDOWN PARA TABLETS)
     ======================================================== */
  const sidebar = document.querySelector(".sidebar");
  const toggle = document.querySelector(".sidebar-toggle");

  if (!sidebar || !toggle) {
    console.warn("Sidebar o toggle no encontrados en el DOM actual.");
  } else {
    function toggleSidebar(e) {
      e.stopPropagation(); // Evita la propagación hacia otros contenedores
      
      const isCollapsed = sidebar.classList.toggle("collapsed");
      toggle.textContent = isCollapsed ? "▸" : "◂";
    }

    // pointerdown captura tanto el toque físico de la tablet como el click del mouse sin duplicar eventos
    toggle.addEventListener("pointerdown", toggleSidebar);
  }
});
