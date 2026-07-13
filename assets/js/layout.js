// assets/js/layout.js

document.addEventListener("DOMContentLoaded", () => {

    // ===========================
    // SIDEBAR
    // ===========================

    const sidebar =
        document.querySelector(".sidebar");

    const toggle =
        document.querySelector(".sidebar-toggle");

    if (sidebar && toggle) {

        if (window.innerWidth <= 1024) {

            sidebar.classList.add("collapsed");

            toggle.textContent = "▸";

        }

        toggle.addEventListener("click", () => {

            const collapsed =
                sidebar.classList.toggle("collapsed");

            toggle.textContent =
                collapsed
                    ? "▸"
                    : "◂";

        });

    }

});
