let contador = 128;

const contadorElemento = document.getElementById("contador");

// SOLO botón de comunidad
const botonComunidad = document.getElementById("publicar");
const muro = document.getElementById("muro");

let total = 0;

// MENU HAMBURGUESA
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("menu");

  if (!menuToggle || !menu) return;

  menuToggle.addEventListener("click", (e) => {
    e.preventDefault();
    menu.classList.toggle("active");
  });
});

// SCROLL ANIMATIONS (PRO)
const elements = document.querySelectorAll(".fade-in");

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {

    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    } else {
      entry.target.classList.remove("visible"); // 🔥 efecto foco
    }

  });
}, {
  threshold: 0.2
});

// observar elementos
elements.forEach(el => observer.observe(el));

const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let nodes = [];

// crear nodos
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

  // dibujar líneas
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 120) {
        ctx.strokeStyle = "rgba(34,197,94,0.25)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }
  }

  // dibujar nodos
  nodes.forEach(n => {
    ctx.fillStyle = "rgba(34,197,94,0.9)";
    ctx.beginPath();
    ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
    ctx.fill();

    // movimiento
    n.x += n.vx;
    n.y += n.vy;

    // rebote
    if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
    if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
  });

  requestAnimationFrame(draw);
}

draw();

// COMUNIDAD

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

    if (muro) {
      muro.prepend(post);
    }

    total++;

    if (contadorDOM) {
      contadorDOM.textContent = total + " ciudadanos";
    }

    document.getElementById("nombre").value = "";
    document.getElementById("mensaje").value = "";
  });
}

