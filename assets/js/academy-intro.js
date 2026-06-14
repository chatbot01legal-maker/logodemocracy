document.addEventListener("DOMContentLoaded", () => {

  const textEl = document.getElementById("academy-text");
  const screen = document.getElementById("academy-intro");

  const introText = `Hasta que los filósofos reinen en las ciudades,
o los que ahora son llamados reyes y gobernantes
filosofen de manera genuina y suficiente,
no cesarán los males para las ciudades.`;

  let i = 0;
  let skipped = false;

  function goToAcademy() {
    if (skipped) return;
    skipped = true;

    window.location.href = "/pages/archive-template.html";
  }

  function typeWriter() {
    if (!textEl) return;

    if (i < introText.length) {
      textEl.innerHTML += introText.charAt(i);
      i++;
      setTimeout(typeWriter, 45);
    } else {
      setTimeout(goToAcademy, 3500);
    }
  }

  // SKIP universal
  screen?.addEventListener("click", goToAcademy);
  screen?.addEventListener("touchstart", goToAcademy);
  document.addEventListener("keydown", goToAcademy);

  // AUTO SKIP
  setTimeout(goToAcademy, 10000);

  setTimeout(typeWriter, 600);

});
