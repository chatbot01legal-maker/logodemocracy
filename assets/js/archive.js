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

    // cambia el triángulo visual
    toggle.textContent = sidebar.classList.contains("collapsed")
      ? "▾"
      : "▸";
  });
});
