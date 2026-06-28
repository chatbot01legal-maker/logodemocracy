document.addEventListener("DOMContentLoaded", () => {

  const btn = document.querySelector(".evaluate-btn");
  const output = document.getElementById("result");
  const input = document.querySelector(".logos-input");

  if (!btn || !output) return;

  btn.onclick = () => {

    const text = input ? input.value : "";

    output.innerHTML = `
      <div class="metric"><strong>Coherencia</strong> 82</div>
      <div class="metric"><strong>Consenso</strong> 74</div>
      <div class="metric"><strong>Polarización</strong> 63</div>
      <div class="metric"><strong>Calidad argumental</strong> 88</div>
    `;
  };

});
