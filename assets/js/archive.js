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
   TOGGLE SIDEBAR (FIX LIMPIO)
   ========================= */
document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector(".sidebar");
  const toggle = document.querySelector(".sidebar-toggle");

  if (!sidebar || !toggle) return;

  toggle.addEventListener("click", () => {
    const collapsed = sidebar.classList.toggle("collapsed");

    // dirección del triángulo
    toggle.textContent = collapsed ? "▸" : "◂";
  });
});
