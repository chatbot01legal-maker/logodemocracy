console.log("🔥 SCRIPT CARGADO");

let brainState = {
  focusNode: null,
  visited: new Set()
};

const cy = cytoscape({
  container: document.getElementById("cy"),

  elements: [
  // NODOS PRINCIPALES
  { data: { id: "home", label: "Logodemocracy", content: "Sistema de inteligencia colectiva" } },

  { data: { id: "problema", label: "El problema", content: "La democracia no coordina bien el pensamiento colectivo" } },
  { data: { id: "educacion", label: "Educación cívica", content: "Cómo aprendemos a pensar juntos" } },
  { data: { id: "pensamiento", label: "Pensamiento colectivo", content: "Cómo se coordina la inteligencia social" } },
  { data: { id: "modelo", label: "Modelo", content: "Cómo se organiza la toma de decisiones" } },

  // CONEXIONES
  { data: { source: "home", target: "problema" } },
  { data: { source: "home", target: "educacion" } },
  { data: { source: "home", target: "pensamiento" } },
  { data: { source: "home", target: "modelo" } }
]

  style: [
    {
      selector: "node",
      style: {
        "background-color": "#22c55e",
        label: "data(label)",
        color: "#fff"
      }
    },
    {
      selector: "edge",
      style: {
        "line-color": "#888"
      }
    },
    {
      selector: ".focused",
      style: {
        "background-color": "#facc15",
        "width": 60,
        "height": 60
      }
    },
    {
      selector: ".nearby",
      style: {
        "background-color": "#38bdf8"
      }
    },
    {
      selector: ".faded",
      style: {
        "opacity": 0.2
      }
    }
  ],

  layout: { name: "grid" }
});

// 🧠 SOLO UNA INTERACCIÓN
cy.on("tap", "node", (evt) => {
  const node = evt.target;

  brainState.focusNode = node;
  brainState.visited.add(node.id());

  cy.elements().removeClass("focused nearby faded");

  node.addClass("focused");

  cy.nodes().forEach(n => {
    if (n.id() === node.id()) return;

    const connected = node.neighborhood().nodes().contains(n);

    if (connected) {
      n.addClass("nearby");
    } else {
      n.addClass("faded");
    }
  });

  cy.animate({
    center: { eles: node },
    zoom: 1.6
  }, { duration: 400 });
});
