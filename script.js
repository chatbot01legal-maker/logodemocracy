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
const translations = {
  es: {
    "edu.title": "Educación cívica del siglo XXI",

    "edu.intro1": "La democracia no falla solo por sus instituciones. También falla porque no hemos aprendido a pensar como ciudadanos en el mundo actual.",

    "edu.intro2": "Hoy vivimos expuestos a sobreinformación, distracción constante y dinámicas digitales que afectan cómo percibimos la realidad. Pero estas no son limitaciones inevitables: son habilidades que pueden entrenarse.",

    "edu.card1_title": "🧠 Memoria y criterio",
    "edu.card1_desc": "Aprender a recordar, comparar y evaluar información en el tiempo es una habilidad cívica clave. Una ciudadanía formada no olvida fácilmente ni decide solo por lo inmediato.",

    "edu.card2_title": "📱 Conciencia del pensamiento",
    "edu.card2_desc": "Comprender la complejidad de la realidad implica reconocer cómo nuestras emociones, sesgos y reacciones influyen en lo que pensamos. La educación cívica moderna debe enseñar a observar estos procesos, no solo a consumir información.",

    "edu.card3_title": "🧩 Pensamiento abierto",
    "edu.card3_desc": "Aprender a salir de nuestras propias burbujas, considerar otras perspectivas y sostener desacuerdos es una habilidad entrenable. Sin esto, no hay deliberación real.",

    "edu.closing_label": "+1 posibilidad:",
    "edu.closing_main": "Una mejor democracia no depende solo de nuevas reglas, sino de ciudadanos que desarrollan nuevas formas de pensar."
  },

  en: {
    "edu.title": "Civic education for the 21st century",

    "edu.intro1": "Democracy does not fail only because of its institutions. It also fails because we have not learned how to think as citizens in today’s world.",

    "edu.intro2": "We live in an environment of information overload, constant distraction, and digital dynamics that shape how we see reality. But these are not fixed limitations—they are skills that can be trained.",

    "edu.card1_title": "🧠 Memory and judgment",
    "edu.card1_desc": "Learning to remember, compare, and evaluate information over time is a civic skill. A trained citizen does not forget easily or decide only based on the immediate.",

    "edu.card2_title": "📱 Awareness of thinking",
    "edu.card2_desc": "Understanding reality requires recognizing how emotions, biases, and reactions shape our thinking. Civic education should teach how to observe these processes, not just consume information.",

    "edu.card3_title": "🧩 Open thinking",
    "edu.card3_desc": "Learning to step outside our bubbles, consider other perspectives, and sustain disagreement is a trainable skill. Without it, real deliberation is impossible.",

    "edu.closing_label": "+1 possibility:",
    "edu.closing_main": "A better democracy depends not only on better rules, but on citizens who develop new ways of thinking."
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

function setLanguage(lang) {
  localStorage.setItem("lang", lang);
  applyTranslations(lang);

  const select = document.getElementById("lang-select");
  if (select) select.value = lang;
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
   SELECTOR DE IDIOMA
===================== */
const langSelect = document.getElementById("lang-select");

if (langSelect) {
  langSelect.addEventListener("change", (e) => {
    setLanguage(e.target.value);
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

/* =====================
   TRADUCCIÓN INICIAL
===================== */
const savedLang = localStorage.getItem("lang") || "es";
setLanguage(savedLang);

});
