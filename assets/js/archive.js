document.addEventListener("DOMContentLoaded", () => {
  const content = document.getElementById("content");

  function loadDocument(name) {
    if (!content) return;
    content.innerHTML = "Cargando: " + name;
  }

  /* árbol */
  document.querySelectorAll(".file").forEach(el => {
    el.addEventListener("click", () => {
      loadDocument(el.textContent);
    });
  });

  /* SIDEBAR TOGGLE (Lógica limpia de tu versión funcional) */
  const sidebar = document.querySelector(".sidebar");
  const toggle = document.querySelector(".sidebar-toggle");

  if (!sidebar || !toggle) {
    console.error("Sidebar o toggle no encontrados");
    return;
  }

  toggle.addEventListener("click", () => {
    const collapsed = sidebar.classList.toggle("collapsed");
    toggle.textContent = collapsed ? "▸" : "◂";
  });
});
