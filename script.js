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

  style: [
    {
      selector: "node",
      style: {
        "background-color": "#22c55e",
        label: "data(label)",
        color: "#fff",
        "text-valign": "center",
        "text-halign": "center",
        "font-size": 10,
        width: 50,
        height: 50
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


// 🧠 INTERACCIÓN COGNITIVA

cy.on("tap", "node", function(evt) {
  const node = evt.target;
  const level = node.data("level");

  // Panel
  document.getElementById("title").innerText = node.data("label");
  document.getElementById("content").innerText = node.data("content");

  // Enfoque ZDP
  cy.nodes().addClass("faded");

  node.removeClass("faded");
  node.neighborhood().removeClass("faded");

  // Mostrar solo nodos cercanos en nivel cognitivo
  cy.nodes().forEach(n => {
    if (Math.abs(n.data("level") - level) > 1) {
      n.addClass("faded");
    }
  });

  // Animar al centro
  cy.animate({
    center: { eles: node },
    zoom: 1.2
  }, {
    duration: 500
  });
});

{
  selector: "node",
  style: {
    "background-color": "#22c55e",
    label: "data(label)",
    color: "#fff",
    "text-valign": "center",
    "text-halign": "center",
    "font-size": 11,
    width: "mapData(level, 1, 5, 40, 80)",
    height: "mapData(level, 1, 5, 40, 80)",
    "text-wrap": "wrap",
    "text-max-width": 80
  }
},
{
  selector: "node:selected",
  style: {
    "border-width": 3,
    "border-color": "#ffffff"
  }
}
