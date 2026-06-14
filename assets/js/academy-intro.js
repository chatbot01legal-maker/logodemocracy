function typeAcademyIntro() {

  const text = document.getElementById("academy-text");

  const intro = `
Hasta que los filósofos reinen en las ciudades,
o los que ahora son llamados reyes y gobernantes
filosofen de manera genuina y suficiente,
no cesarán los males para las ciudades.
`;

  let i = 0;

  function type() {
    if (!text) return;

    if (i < intro.length) {
      text.innerHTML += intro.charAt(i);
      i++;
      setTimeout(type, 45);
    }
  }

  type();
}

document.addEventListener("DOMContentLoaded", typeAcademyIntro);
