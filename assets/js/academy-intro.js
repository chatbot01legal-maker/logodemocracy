document.addEventListener("DOMContentLoaded", () => {

  const bootText = document.getElementById("academy-text");
  const bootScreen = document.getElementById("academy-intro");

  const introText = `"La República"`;

  let i = 0;
  let bootClosed = false;

  function closeBootScreen() {
    if (bootClosed) return;
    bootClosed = true;

    if (bootScreen) {
      bootScreen.classList.add("fade-out");
    }

    setTimeout(() => {
      window.location.href = "/pages/archive-template.html";
    }, 800);
  }

  function typeBoot() {
    if (!bootText) return;

    if (i < introText.length) {
      bootText.innerHTML += introText.charAt(i);
      i++;
      setTimeout(typeBoot, 45);
    } else {
      setTimeout(() => {
        closeBootScreen();
      }, 5000);
    }
  }

  setTimeout(typeBoot, 700);

  bootScreen?.addEventListener("click", closeBootScreen);
  bootScreen?.addEventListener("touchstart", closeBootScreen);
  window.addEventListener("keydown", closeBootScreen);

});
