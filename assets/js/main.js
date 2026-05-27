document.addEventListener("DOMContentLoaded", () => {

  /* =====================
     BOOT TYPEWRITER
  ===================== */

  const bootText = document.getElementById("boot-text");

  const bootScreen = document.getElementById("boot-screen");

  const introText = `
Salimos perdiendo… Salimos ganando…

Se llevaron el oro y nos dejaron el oro…

Se lo llevaron todo y nos dejaron todo…

Nos dejaron las palabras.

"Confieso que he vivido"

- Pablo Neruda
`;

  let i = 0;

let bootClosed = false;

function closeBootScreen() {

  if (bootClosed) return;

  bootClosed = true;

  bootScreen.classList.add("fade-out");
}
  
  function typeBoot() {

    if (i < introText.length) {

      bootText.innerHTML += introText.charAt(i);

      i++;

      setTimeout(typeBoot, 45);

    } else {

      setTimeout(() => {

        bootScreen.classList.add("fade-out");

      }, 4500);
    }
  }

  setTimeout(typeBoot, 700);

  bootScreen.addEventListener("click", closeBootScreen);

bootScreen.addEventListener("touchstart", closeBootScreen);

  /* =====================
     MENU MOBILE
  ===================== */

  const menuToggle =
    document.getElementById("menu-toggle");

  const menu =
    document.getElementById("menu");

  if (menuToggle && menu) {

    menuToggle.addEventListener("click", () => {

      menu.classList.toggle("active");

    });
  }

  /* =====================
     BACKGROUND ACTIVATION
  ===================== */

  const interfaces =
    document.getElementById("interfaces");

  const canvas =
    document.getElementById("bg-canvas");

  let backgroundStarted = false;

  function startBackground() {

    if (backgroundStarted) return;

    backgroundStarted = true;

    canvas.style.opacity = "0.9";

    initBackground();
  }

  const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {

        startBackground();

      }
    });

  }, { threshold: 0.2 });

  if (interfaces) {
    observer.observe(interfaces);
  }

  
/* =====================
   SUBMENU MOBILE
===================== */

const menuGroups =
  document.querySelectorAll(".menu-group");

menuGroups.forEach(group => {

  const trigger =
    group.querySelector("span");

  if (trigger) {

    trigger.addEventListener("click", () => {

      if (window.innerWidth <= 768) {

        group.classList.toggle("active");

      }

    });

  }

  /* =====================
     INIT COGNITIVE MAP
  ===================== */

  const mapEl = document.getElementById("cognitive-map");

  if (mapEl && typeof renderCognitiveMap === "function") {
    renderCognitiveMap("cognitive-map");
  } else {
    console.warn("Cognitive map not ready");
  }

});
