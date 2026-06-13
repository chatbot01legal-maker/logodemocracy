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

/* SIDEBAR TOGGLE (FUNCIONAL Y ESTABLE) */
const sidebar = document.querySelector(".sidebar");
const toggle = document.querySelector(".sidebar-toggle");

toggle.addEventListener("click", () => {
  const collapsed = sidebar.classList.toggle("collapsed");

  toggle.textContent = collapsed ? "▸" : "◂";
});
