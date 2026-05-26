function renderCognitiveMap(containerId) {

  const container = document.getElementById(containerId);
  const map = CognitiveEngine.getMap();
  const state = CognitiveEngine.getState();

  container.innerHTML = "";

  const groups = {};

  Object.entries(map).forEach(([id, node]) => {

    if (!groups[node.group]) {
      groups[node.group] = document.createElement("div");
      groups[node.group].className = "map-group";

      const title = document.createElement("div");
      title.className = "map-group-title";
      title.innerText = node.group;

      groups[node.group].appendChild(title);
    }

    const item = document.createElement("div");
    item.className = "map-node";

    let status = "LOCKED";

    if (state.visited.includes(id)) status = "VISITED";
    if (state.current === id) status = "ACTIVE";

    item.innerHTML = `
      [${status}] ${node.label}
    `;

    item.onclick = () => {
      CognitiveEngine.visit(id);
      window.location.href = `/pages/${id}.html`;
    };

    groups[node.group].appendChild(item);
  });

  Object.values(groups).forEach(g => container.appendChild(g));

  const progress = document.createElement("div");
  progress.className = "map-progress";
  progress.innerText = `PROGRESS: ${state.progress}%`;

  container.appendChild(progress);
}
