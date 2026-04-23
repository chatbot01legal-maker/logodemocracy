let contador = 128; // número inicial fake

const contadorElemento = document.getElementById("contador");
const boton = document.querySelector("button");

if (boton && contadorElemento) {
  boton.addEventListener("click", () => {
    contador++;
    contadorElemento.textContent = contador + " ciudadanos";
  });
}

// MENU HAMBURGUESA
const toggle = document.getElementById("menu-toggle");
const menu = document.getElementById("menu");

if (toggle && menu) {
  toggle.addEventListener("click", () => {
    menu.classList.toggle("active");
  });
}
