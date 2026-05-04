console.log("🔥 SCRIPT CARGADO");

let brainState = {
  focusNode: null,
  visited: new Set()
};
cy.on("tap", "node", (evt) => {
  const node = evt.target;

  // 🧠 estado cognitivo
  brainState.focusNode = node;
  brainState.visited.add(node.id());

  // limpiar estados visuales
  cy.elements().removeClass("focused nearby faded");

  // nodo activo
  node.addClass("focused");

  // propagación simple (vecinos = “pensamiento cercano”)
  cy.nodes().forEach(n => {
    if (n.id() === node.id()) return;

    const isNeighbor = node.neighborhood().nodes().contains(n);

    if (isNeighbor) {
      n.addClass("nearby");
    } else {
      n.addClass("faded");
    }
  });

  // “movimiento del foco mental”
  cy.animate({
    center: { eles: node },
    zoom: 1.5
  }, { duration: 400 });
});

  elements: [
    { data: { id: "a", label: "Nodo A" } },
    { data: { id: "b", label: "Nodo B" } },
    { data: { source: "a", target: "b" } }
  ],

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
    }
  ],

  layout: { name: "grid" }
});

cy.on("tap", "node", (evt) => {
  const node = evt.target;

  // guardar estado cognitivo
  brainState.focusNode = node;
  brainState.visited.add(node.id());

  // limpiar estilos dinámicos
  cy.elements().removeClass("faded focused nearby");

  // nodo activo
  node.addClass("focused");

  // propagación cognitiva (vecinos)
  cy.nodes().forEach(n => {
    if (n.id() === node.id()) return;

    const connected = node.neighborhood().nodes().contains(n);

    if (connected) {
      n.addClass("nearby");
    } else {
      n.addClass("faded");
    }
  });

  // movimiento del “pensamiento”
  cy.animate({
    center: { eles: node },
    zoom: 1.6
  }, { duration: 400 });
});
