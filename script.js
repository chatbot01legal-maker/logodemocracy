console.log("SCRIPT CARGADO ✔");
console.log("NODOS:", nodesData.length);

let brainState = {
  focusNode: null,
  visited: new Set(),
  mode: "explore"
};
const nodesData = [
  {
    data: {
      id: "problema",
      label: "No sabemos pensar juntos",
      content: "La humanidad no ha diseñado sistemas para pensar colectivamente con calidad.",
      level: 1
    }
  },
  {
    data: {
      id: "coordinacion",
      label: "Falta coordinación cognitiva",
      content: "No fallamos por inteligencia individual, sino por cómo pensamos como sistema.",
      level: 2
    }
  },
  {
    data: {
      id: "memoria",
      label: "Memoria colectiva",
      content: "Una sociedad inteligente recuerda cómo pensó y qué aprendió.",
      level: 3
    }
  },
  {
    data: {
      id: "logodemocracia",
      label: "Logodemocracia",
      content: "Sistema para organizar el pensamiento colectivo y mejorar decisiones.",
      level: 4
    }
  },
  {
    data: {
      id: "votacion",
      label: "Votación cuadrática",
      content: "Permite expresar intensidad de preferencias.",
      level: 5
    }
  }
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

  
{
  selector: ".focused",
  style: {
    "background-color": "#facc15",
    "border-width": 3,
    "border-color": "#ffffff",
    "opacity": 1,
    "z-index": 9999
  }
},
{
  selector: ".nearby",
  style: {
    "background-color": "#22c55e",
    "opacity": 0.7
  }
}
  {
    selector: "node:selected",
    style: {
      "border-width": 3,
      "border-color": "#ffffff"
    }
  },
  {
    selector: "edge",
    style: {
      width: 2,
      "line-color": "#888"
    }
  },
  {
    selector: ".faded",
    style: {
      opacity: 0.1
    }
  }
],
  layout: {
    name: "cose",
    animate: true
  }
});
cy.ready(() => {
  cy.fit();
  cy.center();
});


// 🧠 INTERACCIÓN COGNITIVA

cy.on("tap", "node", function(evt) {
  const node = evt.target;
  const level = node.data("level");

  brainState.focusNode = node;
  brainState.visited.add(node.id());

  document.getElementById("title").innerText = node.data("label");
  document.getElementById("content").innerText = node.data("content");

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

  cy.layout({
  name: "cose",
  animate: true,
  fit: false
}).run();
  
  cy.animate({
    center: { eles: node },
    zoom: 1.4
  }, { duration: 500 });
});
