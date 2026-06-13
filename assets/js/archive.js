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

  /* =========================
  SIDEBAR TOGGLE (SOPORTE TÁCTIL SEGURO)
  ========================= */
  const sidebar = document.querySelector(".sidebar");
  const toggle = document.querySelector(".sidebar-toggle");

  if (!sidebar || !toggle) {
    console.error("Sidebar o toggle no encontrados");
    return;
  }

  function toggleSidebar(e) {
    e.preventDefault(); // Evita doble ejecución en pantallas táctiles (click + touch)
    e.stopPropagation(); // Detiene la propagación del evento hacia otros contenedores
    
    const isCollapsed = sidebar.classList.toggle("collapsed");
    toggle.textContent = isCollapsed ? "▸" : "◂";
  }

  // Escucha tanto el toque físico de la tablet como el click convencional
  toggle.addEventListener("touchstart", toggleSidebar, { passive: false });
  toggle.addEventListener("click", toggleSidebar);
});
