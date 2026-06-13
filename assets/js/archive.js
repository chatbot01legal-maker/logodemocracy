const content = document.getElementById("content");

function loadDocument(name) {
  content.innerHTML = "Cargando: " + name;
}

/* interacción básica del árbol */
document.querySelectorAll(".file").forEach(el => {
  el.addEventListener("click", () => {
    loadDocument(el.textContent);
  });
});

/* =========================
   SIDEBAR TOGGLE (FIX ROBUSTO)
   ========================= */

document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector(".sidebar");
  const toggle = document.querySelector(".sidebar-toggle");

  toggle.addEventListener("click", () => {
    const isCollapsed = sidebar.classList.toggle("collapsed");

    toggle.textContent = isCollapsed ? "☰" : "▸";
  });
});

    // cambia el triángulo visual
    toggle.textContent = sidebar.classList.contains("collapsed")
      ? "▾"
      : "▸";
  });
});
