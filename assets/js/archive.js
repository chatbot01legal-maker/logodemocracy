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
  SIDEBAR TOGGLE (FIX ROBUSTO)
  ========================= */
  const sidebar = document.querySelector(".sidebar");
  const toggle = document.querySelector(".sidebar-toggle");

  if (!sidebar || !toggle) {
    console.error("Sidebar o toggle no encontrados");
    return;
  }

  toggle.addEventListener("click", () => {
    const isCollapsed = sidebar.classList.toggle("collapsed");
    // El triángulo cambia de dirección según el estado de colapso
    toggle.textContent = isCollapsed ? "▸" : "◂";
  });
});
