document.addEventListener("DOMContentLoaded", () => {

  const content = document.getElementById("content");

  function loadDocument(name) {
    if (!content) return;
    content.innerHTML = "Cargando: " + name;
  }

  /* Árbol */

  document.querySelectorAll(".file").forEach(el => {
    el.addEventListener("click", () => {
      loadDocument(el.textContent);
    });
  });

  /* Sidebar */

  const sidebar = document.querySelector(".sidebar");
  const toggle = document.querySelector(".sidebar-toggle");

  if (!sidebar || !toggle) {
    console.error("Sidebar o toggle no encontrados");
    return;
  }

  toggle.addEventListener("click", (event) => {

    event.stopPropagation();

    const collapsed = sidebar.classList.toggle("collapsed");

    toggle.textContent = collapsed ? "▸" : "◂";

  });

});
