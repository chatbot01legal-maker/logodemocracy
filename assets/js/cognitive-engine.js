const CognitiveEngine = (() => {

  const state = {
    visited: new Set(
      JSON.parse(localStorage.getItem("visitedNodes") || "[]")
    ),
    current: null
  };

  const map = {
    "que-es": {
      label: "¿Qué es?",
      group: "THEORY",
      links: ["contexto", "tecnologia-y-democracia"]
    },
    "contexto": {
      label: "Contexto",
      group: "THEORY",
      links: ["que-es"]
    },
    "tecnologia-y-democracia": {
      label: "Tecnología y Democracia",
      group: "THEORY",
      links: ["que-es"]
    },

    "como-funciona": {
      label: "Cómo funciona",
      group: "COGNITION",
      links: ["mapa-y-territorio"]
    },

    "logos": {
      label: "Logos",
      group: "INTERFACES",
      links: []
    }
  };

  function visit(nodeId) {
    state.visited.add(nodeId);
    state.current = nodeId;

    localStorage.setItem(
      "visitedNodes",
      JSON.stringify([...state.visited])
    );
  }

  function getProgress() {
    const total = Object.keys(map).length;
    return Math.round((state.visited.size / total) * 100);
  }

  function getMap() {
    return map;
  }

  function getState() {
    return {
      visited: [...state.visited],
      current: state.current,
      progress: getProgress()
    };
  }

  return {
    visit,
    getMap,
    getState
  };

})();
