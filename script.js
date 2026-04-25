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
// SCROLL ANIMATIONS (PRO)
const elements = document.querySelectorAll(".fade-in");

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {

    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    } else {
      entry.target.classList.remove("visible"); // 🔥 efecto foco
    }

  });
}, {
  threshold: 0.2
});

// observar elementos
elements.forEach(el => observer.observe(el));
