document.addEventListener("DOMContentLoaded", () => {

  /* =====================
     SIDEBAR TOGGLE
  ===================== */

  const sidebar  = document.getElementById("sidebar");
  const toggle   = document.getElementById("sidebarToggle");

  toggle?.addEventListener("click", (e) => {
    e.stopPropagation();
    const collapsed = sidebar.classList.toggle("collapsed");
    toggle.textContent = collapsed ? "▸" : "◂";
  });

  /* =====================
     FILE INPUT
  ===================== */

  const fileInput = document.getElementById("fileInput");
  const textInput = document.getElementById("textInput");

  fileInput?.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    textInput.value = text;
  });

  /* =====================
     RENDER SCORES
  ===================== */

  function renderScores(scores) {
    const dims = [
      { key: "epist",    barId: "barEpist",    scoreId: "scoreEpist"    },
      { key: "logic",    barId: "barLogic",    scoreId: "scoreLogic"    },
      { key: "clarity",  barId: "barClarity",  scoreId: "scoreClarity"  },
      { key: "pedagogy", barId: "barPedagogy", scoreId: "scorePedagogy" },
      { key: "dialogue", barId: "barDialogue", scoreId: "scoreDialogue" },
    ];

    dims.forEach(({ key, barId, scoreId }) => {
      const val = scores[key];
      const bar = document.getElementById(barId);
      const el  = document.getElementById(scoreId);

      if (bar) bar.style.width = val + "%";
      if (el)  el.textContent  = val;
    });

    const avg = Math.round(
      Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length
    );

    document.getElementById("finalScore").textContent = avg;

    const conf = document.getElementById("scoreConfidence");
    if (conf) {
      if (avg >= 80)      conf.textContent = "NIVEL DE CONFIANZA: ALTO";
      else if (avg >= 60) conf.textContent = "NIVEL DE CONFIANZA: MEDIO";
      else                conf.textContent = "NIVEL DE CONFIANZA: BAJO";
    }
  }

  /* =====================
     RENDER DOCUMENT
  ===================== */

  function renderDocument(text, feedback) {
    const empty  = document.getElementById("emptyState");
    const result = document.getElementById("resultContent");

    if (empty)  empty.style.display  = "none";
    if (result) result.style.display = "block";

    result.innerHTML = `
      <div style="margin-bottom:24px;">
        <div style="font-size:10px; letter-spacing:2px; color:#94a3b8; margin-bottom:10px;">
          TEXTO EVALUADO
        </div>
        <div style="
          padding: 20px;
          border: 1px solid rgba(34,197,94,0.15);
          font-size: 13px;
          line-height: 1.8;
          color: #dbe4ee;
          white-space: pre-wrap;
          background: rgba(5,10,18,0.6);
        ">${escapeHtml(text)}</div>
      </div>

      <div>
        <div style="font-size:10px; letter-spacing:2px; color:#94a3b8; margin-bottom:10px;">
          RETROALIMENTACIÓN SOPHIA
        </div>
        <div style="
          padding: 20px;
          border: 1px solid rgba(34,197,94,0.15);
          font-size: 12px;
          line-height: 1.9;
          color: #dbe4ee;
          background: rgba(5,10,18,0.6);
        ">${feedback}</div>
      </div>
    `;
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  /* =====================
     EVALUATE BUTTON
     (mock — reemplazar por IA real)
  ===================== */

  const runBtn = document.getElementById("runEvalBtn");

  runBtn?.addEventListener("click", async () => {

    const text = textInput?.value?.trim();
    if (!text) {
      alert("Ingresa un texto primero.");
      return;
    }

    runBtn.textContent = "EVALUANDO...";
    runBtn.disabled = true;

    // TODO: reemplazar por llamada real a IA (Vertex / Anthropic API)
    await new Promise(r => setTimeout(r, 1200)); // simula latencia

    const scores = {
      epist:    Math.floor(Math.random() * 40 + 55),
      logic:    Math.floor(Math.random() * 40 + 55),
      clarity:  Math.floor(Math.random() * 40 + 55),
      pedagogy: Math.floor(Math.random() * 40 + 55),
      dialogue: Math.floor(Math.random() * 40 + 55),
    };

    const feedback = `
      <strong>Fortalezas detectadas:</strong><br>
      · El texto presenta una estructura argumentativa identificable.<br>
      · Se observan intentos de distinción entre hechos y opiniones.<br><br>

      <strong>Áreas de mejora:</strong><br>
      · Las fuentes no están explicitadas con suficiente precisión.<br>
      · Algunas afirmaciones requieren mayor evidencia de respaldo.<br>
      · Se recomienda desarrollar posiciones alternativas.<br><br>

      <em style="color:#94a3b8; font-size:11px;">
        Esta es una evaluación de demostración.<br>
        La integración con IA real está pendiente.
      </em>
    `;

    renderDocument(text, feedback);
    renderScores(scores);

    runBtn.textContent = "EVALUAR";
    runBtn.disabled = false;
  });

  /* =====================
     REY FILÓSOFO (placeholder)
  ===================== */

  document.getElementById("askPhilosopher")?.addEventListener("click", () => {
    document.getElementById("philosopherText").textContent =
      "Proximamente: el Rey Filósofo explicará qué significa cada puntaje y cómo mejorar tu escritura.";
  });

});
