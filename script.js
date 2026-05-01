/* =====================
   MENÚ + INIT
===================== */
document.addEventListener("DOMContentLoaded", () => {

  /* =====================
     MENÚ MOBILE
  ===================== */
  const menuToggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("menu");

  if (menuToggle && menu) {
    menuToggle.addEventListener("click", () => {
      menu.classList.toggle("active");
    });
  }

  /* =====================
     SELECTOR IDIOMA (PREPARADO)
  ===================== */
  const langSelect = document.getElementById("lang-select");

  if (langSelect) {
    langSelect.addEventListener("change", (e) => {
      localStorage.setItem("lang", e.target.value);
    });
  }

  /* =====================
     COMUNIDAD
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

      muro.prepend(post);

      total++;

      if (contadorDOM) {
        contadorDOM.textContent = total + " ciudadanos";
      }

      document.getElementById("nombre").value = "";
      document.getElementById("mensaje").value = "";
    });
  }

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
          ctx.strokeStyle = `rgba(34,197,94,${opacity * 0.85})`;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    nodes.forEach(n => {
      ctx.fillStyle = "rgba(34,197,94,0.8)";
      ctx.beginPath();
      ctx.arc(n.x, n.y, 3.2, 0, Math.PI * 2);
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
