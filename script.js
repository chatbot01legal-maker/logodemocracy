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

// SCROLL ANIMATIONS
const elements = document.querySelectorAll("section, .card");

elements.forEach(el => {
  el.classList.add("fade-in");
});

function revealOnScroll() {
  const trigger = window.innerHeight * 0.85;

  elements.forEach(el => {
    const top = el.getBoundingClientRect().top;

    if (top < trigger) {
      el.classList.add("visible");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);
