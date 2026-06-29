const SCORES = {
  rigor: 96,
  claridad: 94,
  arquitectura: 91,
  carga: 93,
  deliberativa: 95
};

const VIEWS = {
  inicio: `
    <h1 class="view-title">Sophia</h1>
    <div class="view-body">
      Sistema de evaluación epistémica.
    </div>
  `,

  atomos: `
    <h1 class="view-title">Átomos Cognitivos</h1>
    <div class="view-body">Unidad mínima del conocimiento evaluado.</div>
  `,

  informe: `
    <h1 class="view-title">Informe</h1>
    <div class="view-body">Evaluación estructurada del documento.</div>
  `
};

function renderScores() {
  return `
    <div class="score-list">
      ${Object.entries(SCORES).map(([k,v]) => `
        <div class="score-row">
          <div>${k}</div>
          <div class="score-bar-wrap">
            <div class="score-bar high" data-value="${v}" style="width:0%"></div>
          </div>
          <div>${v}</div>
        </div>
      `).join("")}
    </div>
  `;
}

function render(view) {
  const content = document.getElementById("viewContent");
  const title = document.getElementById("viewTitle");

  title.textContent = view;
  content.innerHTML = VIEWS[view] || VIEWS.inicio;

  requestAnimationFrame(() => {
    document.querySelectorAll(".score-bar").forEach(bar => {
      const value = bar.dataset.value;
      bar.style.width = value + "%";
    });
  });
}

function bindNav() {
  document.querySelectorAll(".snav-item").forEach(btn => {
    btn.addEventListener("click", () => {
      render(btn.dataset.view);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  bindNav();
  render("inicio");
});
