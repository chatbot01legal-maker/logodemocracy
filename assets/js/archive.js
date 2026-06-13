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
