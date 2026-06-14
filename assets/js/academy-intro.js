const phrase = `Hasta que los filósofos reinen en las ciudades,
o los que ahora son llamados reyes y gobernantes
filosofen de manera genuina y suficiente,
no cesarán los males para las ciudades.

— Platón`;

const el = document.getElementById("text");

let i = 0;
let skipped = false;

// efecto máquina de escribir
function typeWriter() {
  if (skipped) return;

  if (i < phrase.length) {
    el.innerHTML += phrase[i];
    i++;
    setTimeout(typeWriter, 25);
  }
}

// salto inmediato
function skip() {
  if (skipped) return;
  skipped = true;
  goToAcademy();
}

// redirección final
function goToAcademy() {
  window.location.href = "/pages/archive-template.html";
}

// eventos de skip
document.addEventListener("click", skip);
document.addEventListener("keydown", skip);

// inicio
typeWriter();

// auto skip después de 10s
setTimeout(goToAcademy, 10000);
