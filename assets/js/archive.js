const content = document.getElementById("content");

/* =========================
   DOCUMENT LOADER
   ========================= */
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
   SIDEBAR TOGGLE (NUEVO)
   ========================= */

const sidebar = document.querySelector(".sidebar");
const toggle = document.querySelector(".toggle-sidebar");
const layout = document.querySelector(".layout");

toggle.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
  layout.classList.toggle("sidebar-collapsed");
});
