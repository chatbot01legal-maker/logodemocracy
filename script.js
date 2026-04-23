let contador = 128; // número inicial fake

const contadorElemento = document.getElementById("contador");

function actualizarContador() {
  contador++;
  contadorElemento.textContent = contador + " ciudadanos";
}

document.querySelector("button").addEventListener("click", actualizarContador);

const toggle = document.getElementById("menu-toggle");
const menu = document.getElementById("menu");

toggle.addEventListener("click", () => {
  menu.classList.toggle("active");
});
