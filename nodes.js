console.log("🔥 nodes.js cargado");
alert("nodes.js OK");

const nodesData = [
  {
    id: "pregunta",
    label: "❓",
    x: 30,
    y: 40,
    content: `
      <h2>Pregunta Fundacional</h2>
      <p>¿Hemos aprendido a pensar juntos de verdad?</p>
    `
  },
  {
    id: "problema",
    label: "⚠️",
    x: 50,
    y: 60,
    content: `
      <h2>Problema</h2>
      <p>La democracia no falla por falta de participación, sino por cómo pensamos colectivamente.</p>
    `
  },
  {
    id: "tesis",
    label: "🧠",
    x: 65,
    y: 35,
    content: `
      <h2>Tesis</h2>
      <p>No tenemos sistemas para pensar colectivamente con calidad.</p>
    `
  }
]

function createNodes() {
  const layer = document.getElementById("nodes-layer")

  nodesData.forEach(node => {
    const el = document.createElement("div")
    el.className = "node"
    el.innerHTML = node.label

    el.style.left = node.x + "%"
    el.style.top = node.y + "%"

    el.onclick = () => openNode(node)

    layer.appendChild(el)
  })
}

function openNode(node) {
  const panel = document.querySelector(".content")

  panel.innerHTML = `
    <div style="padding: 40px;">
      ${node.content}
      <br><br>
      <button onclick="location.reload()">Volver</button>
    </div>
  `
}

window.addEventListener("DOMContentLoaded", createNodes)
