console.log("🔥 SCRIPT CARGADO");

let brainState = {
  focusNode: null,
  visited: new Set()
};
const cy = cytoscape({
  container: document.getElementById("cy"),

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
