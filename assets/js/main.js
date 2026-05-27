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
     NODES BACKGROUND
  ===================== */

  function initBackground() {

    const ctx =
      canvas.getContext("2d");

    function resize() {

      canvas.width =
        window.innerWidth;

      canvas.height =
        window.innerHeight;
    }

    resize();

    window.addEventListener(
      "resize",
      resize
    );

    const nodes = [];

    for (let i = 0; i < 55; i++) {

      nodes.push({

        x:
          Math.random() * canvas.width,

        y:
          Math.random() * canvas.height,

        vx:
          (Math.random() - 0.5) * 0.35,

        vy:
          (Math.random() - 0.5) * 0.35
      });
    }

    function draw() {

      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      for (let i = 0; i < nodes.length; i++) {

        for (let j = i + 1; j < nodes.length; j++) {

          const dx =
            nodes[i].x - nodes[j].x;

          const dy =
            nodes[i].y - nodes[j].y;

          const dist =
            Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {

            ctx.strokeStyle =
              `rgba(34,197,94,${
                0.15 - dist / 1200
              })`;

            ctx.lineWidth = 1;

            ctx.beginPath();

            ctx.moveTo(
              nodes[i].x,
              nodes[i].y
            );

            ctx.lineTo(
              nodes[j].x,
              nodes[j].y
            );

            ctx.stroke();
          }
        }
      }

      nodes.forEach(n => {

        ctx.strokeStyle =
          "rgba(34,197,94,0.9)";

        ctx.strokeRect(
          n.x - 2,
          n.y - 2,
          4,
          4
        );

        n.x += n.vx;
        n.y += n.vy;

        if (
          n.x < 0 ||
          n.x > canvas.width
        ) n.vx *= -1;

        if (
          n.y < 0 ||
          n.y > canvas.height
        ) n.vy *= -1;
      });

      requestAnimationFrame(draw);
    }

    draw();
  }

});

});


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

});


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
