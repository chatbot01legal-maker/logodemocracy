const content = document.getElementById("content");

/* documento */
function loadDocument(name) {
  content.innerHTML = "Cargando: " + name;
}

/* árbol */
document.querySelectorAll(".file").forEach(el => {
  el.addEventListener("click", () => {
    loadDocument(el.textContent);
  });
});

/* TOGGLE SIDEBAR */
const sidebar = document.querySelector(".sidebar");
const toggle = document.querySelector(".sidebar-toggle");

if (sidebar && toggle) {
  toggle.addEventListener("click", () => {
    const collapsed = sidebar.classList.toggle("collapsed");

    // cambio visual del triángulo
    toggle.textContent = collapsed ? "▸" : "◂";
  });
}
