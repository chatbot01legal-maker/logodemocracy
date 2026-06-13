document.addEventListener("DOMContentLoaded", () => {
  const content = document.getElementById("content");

  function loadDocument(name) {
    if (!content) return;
    content.innerHTML = "Cargando: " + name;
  }

  /* interacción básica del árbol */
  document.querySelectorAll(".file").forEach(el => {
    el.addEventListener("click", () => {
      loadDocument(el.textContent);
    });
  });

  /* =========================
  SIDEBAR TOGGLE (RESTAURADO EXACTO A TU VERSIÓN FUNCIONAL)
  ========================= */
  const sidebar = document.querySelector(".sidebar");
  const toggle = document.querySelector(".sidebar-toggle");

  if (!sidebar || !toggle) {
    console.error("Sidebar o toggle no encontrados");
    return;
  }

  toggle.addEventListener("click", () => {
    const isCollapsed = sidebar.classList.toggle("collapsed");

    // triángulo cambia dirección  
    toggle.textContent = isCollapsed ? "▸" : "◂";
  });
});
