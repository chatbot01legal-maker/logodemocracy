console.log("🔥 SCRIPT CARGADO");

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
  alert("Click en: " + node.data("label"));
});
