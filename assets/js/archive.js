const content = document.getElementById("content");

function loadDocument(name) {
  content.innerHTML = "Cargando: " + name;
}

/* árbol */
document.querySelectorAll(".file").forEach(el => {
  el.addEventListener("click", () => {
    loadDocument(el.textContent);
  });
});

/* =========================
   SIDEBAR TOGGLE FIX REAL
   ========================= */

document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector(".sidebar");
  const toggle = document.querySelector(".sidebar-toggle");

  if (!sidebar || !toggle) {
    console.error("Sidebar o toggle no encontrados");
    return;
  }

  toggle.addEventListener("click", () => {
    const isCollapsed = sidebar.classList.toggle("collapsed");

    // cambia dirección del triángulo
    toggle.textContent = isCollapsed ? "▸" : "◂";
  });
});
