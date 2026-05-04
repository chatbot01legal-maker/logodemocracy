document.body.style.background = "red";
console.log("🔥 SCRIPT CARGADO Y EJECUTANDO");
alert("SCRIPT OK");

let brainState = {
  focusNode: null,
  visited: new Set(),
};

const nodesData = [
  { data: { id: "problema", label: "No sabemos pensar juntos", content: "...", level: 1 } },
  { data: { id: "coordinacion", label: "Falta coordinación cognitiva", content: "...", level: 2 } },
  { data: { id: "memoria", label: "Memoria colectiva", content: "...", level: 3 } },
  { data: { id: "logodemocracia", label: "Logodemocracia", content: "...", level: 4 } },
  { data: { id: "votacion", label: "Votación cuadrática", content: "...", level: 5 } }
];

const edgesData = [
  { data: { source: "problema", target: "coordinacion" } },
  { data: { source: "coordinacion", target: "memoria" } },
  { data: { source: "memoria", target: "logodemocracia" } },
  { data: { source: "logodemocracia", target: "votacion" } }
];

const cy = cytoscape({
  container: document.getElementById("cy"),

  elements: [...nodesData, ...edgesData],

  style: [
    {
      selector: "node",
      style: {
        "background-color": "#22c55e",
        "width": 40,
        "height": 40,
        "label": "data(label)",
        "color": "#fff",
        "text-valign": "center",
        "text-halign": "center"
      }
    },
    {
      selector: ".focused",
      style: {
        "background-color": "#facc15",
        "width": 70,
        "height": 70,
        "border-width": 3,
        "border-color": "#ffffff",
        "opacity": 1
      }
    },
    {
      selector: ".nearby",
      style: {
        "background-color": "#38bdf8",
        "opacity": 0.9
      }
    },
    {
      selector: ".faded",
      style: {
        "opacity": 0.15
      }
    },
    {
      selector: "edge",
      style: {
        "width": 2,
        "line-color": "#888"
      }
    }
  ],   // 🔥 ← ESTA COMA FALTABA

  layout: {
    name: "cose",
    animate: true
  }
});

cy.ready(() => {
  cy.fit();
  cy.center();
  cy.nodes().first().addClass("focused");
});

// 🧠 INTERACCIÓN COGNITIVA
cy.on("tap", "node", function(evt) {
  const node = evt.target;
  const level = node.data("level");

  brainState.focusNode = node;
  brainState.visited.add(node.id());

  cy.elements().removeClass("faded focused nearby");
  node.addClass("focused");

  cy.nodes().forEach(n => {
    const distance = Math.abs(n.data("level") - level);
    const wasVisited = brainState.visited.has(n.id());

    if (n.id() === node.id()) return;

    if (distance === 0) {
      n.addClass("focused");
    } else if (wasVisited || distance === 1) {
      n.addClass("nearby");
    } else {
      n.addClass("faded");
    }
  });

  cy.animate({
    center: { eles: node },
    zoom: 1.4
  }, { duration: 500 });
});
