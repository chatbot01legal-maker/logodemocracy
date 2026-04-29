let contador = 128;

const contadorElemento = document.getElementById("contador");

// SOLO botón de comunidad
const botonComunidad = document.getElementById("publicar");
const muro = document.getElementById("muro");

let total = 0;


/* =====================
   TRADUCCIONES
===================== */

const translations = {
  es: {
    "edu.title": "Educación Cívica",
    "edu.intro1": "El problema de la democracia no se resuelve solo con instituciones o tecnología. Se resuelve con ciudadanos.",
    "edu.intro2": "Un ciudadano que comprenda las limitaciones del sistema en el que vive, pero también sus posibilidades.",

    "edu.card1_title": "🧭 Conciencia del sistema",
    "edu.card1_desc": "Entiende que la democracia no es perfecta, pero es el espacio donde se toman decisiones que afectan su vida y la de otros.",

    "edu.card2_title": "🗳️ Responsabilidad del voto",
    "edu.card2_desc": "Comprende que votar no es un acto pasivo, sino una forma de ejercer poder y responsabilidad sobre el futuro colectivo.",

    "edu.card3_title": "⚙️ Lectura de la tecnología",
    "edu.card3_desc": "Reconoce que la tecnología no reemplaza la democracia, pero puede ampliar o distorsionar su capacidad de decisión.",

    "edu.closing_label": "+1 principio:",
    "edu.closing_main": "Una democracia no mejora solo con mejores sistemas. Mejora cuando sus ciudadanos aprenden a pensar."
  },

  en: {
    "edu.title": "Civic Education",
    "edu.intro1": "The problem of democracy is not solved only with institutions or technology. It is solved with citizens.",
    "edu.intro2": "A citizen who understands both the limitations and the possibilities of the system they live in.",

    "edu.card1_title": "🧭 System awareness",
    "edu.card1_desc": "Understands that democracy is not perfect, but it is the space where decisions affecting lives are made.",

    "edu.card2_title": "🗳️ Voting responsibility",
    "edu.card2_desc": "Understands that voting is not passive, but an exercise of power and responsibility.",

    "edu.card3_title": "⚙️ Understanding technology",
    "edu.card3_desc": "Recognizes that technology does not replace democracy, but can amplify or distort it.",

    "edu.closing_label": "+1 principle:",
    "edu.closing_main": "A democracy does not improve only with better systems. It improves when citizens learn to think."
  }
};

function applyTranslations(lang) {
  const elements = document.querySelectorAll("[data-i18n]");

  elements.forEach(el => {
    const key = el.getAttribute("data-i18n");
    const text = translations[lang]?.[key];

    if (text) {
      el.innerHTML = text;
    }
  });
}

// MENU HAMBURGUESA
document.addEventListener("DOMContentLoaded", () => {

  /* =====================
     MENÚ
  ===================== */
  const menuToggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("menu");

  if (menuToggle && menu) {
    menuToggle.addEventListener("click", () => {
      menu.classList.toggle("active");
    });
  }

  /* =====================
     CONTADOR / COMUNIDAD
  ===================== */
  const boton = document.getElementById("publicar");
  const muro = document.getElementById("muro");
  const contadorDOM = document.getElementById("contador");

  let total = 0;

  if (boton) {
    boton.addEventListener("click", () => {
      const nombre = document.getElementById("nombre").value.trim();
      const mensaje = document.getElementById("mensaje").value.trim();

      if (!nombre || !mensaje) return;

      const post = document.createElement("div");
      post.classList.add("post");

      post.innerHTML = `
        <strong>${nombre}</strong>
        <p>${mensaje}</p>
      `;

      if (muro) muro.prepend(post);

      total++;

      if (contadorDOM) {
        contadorDOM.textContent = total + " ciudadanos";
      }

      document.getElementById("nombre").value = "";
      document.getElementById("mensaje").value = "";
    });
  }

  /* =====================
     ANIMACIONES SCROLL
  ===================== */
  const elements = document.querySelectorAll(".fade-in");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      } else {
        entry.target.classList.remove("visible");
      }
    });
  }, { threshold: 0.2 });

  elements.forEach(el => observer.observe(el));

  /* =====================
     CANVAS (NODOS)
  ===================== */
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener("resize", resize);
  resize();

  let nodes = [];

  for (let i = 0; i < 60; i++) {
    nodes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          const opacity = 1 - (dist / 120);
ctx.strokeStyle = `rgba(34,197,94,${opacity * 0.6})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    nodes.forEach(n => {

  let connections = 0;

  for (let j = 0; j < nodes.length; j++) {
  if (n === nodes[j]) continue;
    const dx = n.x - nodes[j].x;
    const dy = n.y - nodes[j].y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 120) connections++;
  }

  const alpha = Math.min(1, connections / 8);

  ctx.fillStyle = `rgba(34,197,94,${alpha})`;
      ctx.beginPath();
      ctx.arc(n.x, n.y, 2.5, 0, Math.PI * 2);
      ctx.fill();

      n.x += n.vx;
      n.y += n.vy;

      if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
      if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
    });

    requestAnimationFrame(draw);
  }

  draw();

});
