document.addEventListener("DOMContentLoaded", () => {

  const bootText = document.getElementById("academy-text");
  const bootScreen = document.getElementById("academy-intro");

  const introText = `Hasta que los filósofos reinen en las ciudades,
o los que ahora son llamados reyes y gobernantes
filosofen de manera genuina y suficiente,
no cesarán los males para las ciudades.

"La República, Libro V"
— Platón`;

  let i = 0;
  let bootClosed = false;

  function closeBootScreen() {
    if (bootClosed) return;
    bootClosed = true;

    bootScreen?.classList.add("fade-out");

    setTimeout(() => {
      window.location.href = "/pages/archive-template.html";
    }, 800);
  }

  function typeBoot() {
    if (!bootText) return;

    if (i < introText.length) {
      bootText.textContent += introText.charAt(i);
      i++;
      setTimeout(typeBoot, 45);
    } else {
      setTimeout(closeBootScreen, 5000);
    }
  }

  setTimeout(typeBoot, 700);

  bootScreen?.addEventListener("click", closeBootScreen);
  bootScreen?.addEventListener("touchstart", closeBootScreen);
  window.addEventListener("keydown", closeBootScreen);

});
