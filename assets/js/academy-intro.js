document.addEventListener("DOMContentLoaded", () => {

  const bootText = document.getElementById("academy-text");
  const bootScreen = document.getElementById("academy-intro");

  const introText = `
Hasta que los filósofos reinen en las ciudades,
o los que ahora son llamados reyes y gobernantes
filosofen de manera genuina y suficiente,
no cesarán los males para las ciudades.

"La República, Libro V"
— Platón
`;

  let i = 0;
  let bootClosed = false;

  function closeBootScreen() {
    if (bootClosed) return;
    bootClosed = true;
    bootScreen.classList.add("fade-out");

    setTimeout(() => {
      window.location.href = "/pages/archive-template.html";
    }, 1500); // Sincronizado exactamente con los 1.5s de la transición CSS
  }

  function typeBoot() {
    if (!bootText) return;

    if (i < introText.length) {
      bootText.innerHTML += introText.charAt(i);
      i++;
      setTimeout(typeBoot, 45);
    } else {
      setTimeout(closeBootScreen, 4500); // 4.5s idéntico al comportamiento original
    }
  }

  setTimeout(typeBoot, 700);

  bootScreen?.addEventListener("click", closeBootScreen);
  bootScreen?.addEventListener("touchstart", closeBootScreen);

});
