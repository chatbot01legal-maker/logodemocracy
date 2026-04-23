let contador = 128; // número inicial fake

const contadorElemento = document.getElementById("contador");

function actualizarContador() {
  contador++;
  contadorElemento.textContent = contador + " ciudadanos";
}

document.querySelector("button").addEventListener("click", actualizarContador);
