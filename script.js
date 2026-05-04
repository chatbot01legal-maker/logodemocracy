document.body.style.background = "red";
alert("SCRIPT CARGÓ");

console.log("CYTOSCAPE TYPE:", typeof cytoscape);

const cy = cytoscape({
  container: document.getElementById("cy"),

  elements: [
    { data: { id: "a", label: "A" } },
    { data: { id: "b", label: "B" } },
    { data: { source: "a", target: "b" } }
  ],

  style: [
    {
      selector: "node",
      style: {
        "background-color": "green",
        label: "data(label)"
      }
    },
    {
      selector: "edge",
      style: {
        "line-color": "white"
      }
    }
  ],

  layout: {
    name: "grid"
  }
});

cy.on("tap", "node", () => alert("CLICK OK"));
