document.addEventListener("DOMContentLoaded", () => {

  const textInput = document.getElementById("textInput");
  const fileInput = document.getElementById("fileInput");
  const runBtn = document.getElementById("runEvalBtn");

  const doc = document.getElementById("documentContent");

  /* =========================
     MOCK SOPHIA ENGINE
     (luego se reemplaza por IA real)
  ========================= */

  function evaluateSophia(text) {

    // simulación de análisis
    return {
      dimensions: {
        episteme: Math.floor(Math.random() * 40 + 60),
        logic: Math.floor(Math.random() * 40 + 60),
        clarity: Math.floor(Math.random() * 40 + 60),
        pedagogy: Math.floor(Math.random() * 40 + 60),
        dialogue: Math.floor(Math.random() * 40 + 60)
      }
    };
  }

  function renderScores(result) {

    const d = result.dimensions;

    document.getElementById("scoreEpist").innerText = d.episteme;
    document.getElementById("scoreLogic").innerText = d.logic;
    document.getElementById("scoreClarity").innerText = d.clarity;
    document.getElementById("scorePedagogy").innerText = d.pedagogy;
    document.getElementById("scoreDialogue").innerText = d.dialogue;

    const avg = Math.round(
      (d.episteme + d.logic + d.clarity + d.pedagogy + d.dialogue) / 5
    );

    document.getElementById("finalScore").innerText = avg;
  }

  function renderDocument(text) {
    doc.innerText = text;
  }

  /* =========================
     EVENT: EVALUATE
  ========================= */

  runBtn.addEventListener("click", () => {

    const text = textInput.value;

    if (!text.trim()) {
      alert("Ingresa un texto primero");
      return;
    }

    renderDocument(text);

    const result = evaluateSophia(text);

    renderScores(result);
  });

  /* =========================
     FILE INPUT
  ========================= */

  fileInput.addEventListener("change", async (e) => {

    const file = e.target.files[0];
    if (!file) return;

    const text = await file.text();

    textInput.value = text;
  });

});
