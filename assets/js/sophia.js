// sophia-debug.js - Versión con depuración visible
console.log('=== SOPHIA DEBUG ===');

// Función para mostrar mensajes en la página
function showDebug(msg, isError = false) {
  const content = document.getElementById('viewContent');
  if (content) {
    content.innerHTML = `<div style="padding:20px; color:${isError ? '#ef4444' : '#22c55e'}; background:#0a0a0a; border:1px solid ${isError ? '#ef4444' : '#22c55e'};">
      <h3>🔍 Depuración SOPHIA</h3>
      <pre style="white-space:pre-wrap; font-size:0.8rem; color:#e5e7eb;">${msg}</pre>
    </div>`;
  } else {
    document.body.innerHTML = `<div style="padding:20px; color:red;">❌ No se encontró #viewContent</div>`;
  }
}

// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  showDebug('✅ DOM cargado. Inicializando...');

  try {
    // Verificar elementos del sidebar
    const titleEl = document.getElementById('viewTitle');
    const contentEl = document.getElementById('viewContent');
    if (!titleEl || !contentEl) {
      showDebug('❌ No se encontraron #viewTitle o #viewContent', true);
      return;
    }
    showDebug('✅ Elementos DOM encontrados');

    // Verificar que el sidebar tenga botones
    const buttons = document.querySelectorAll('.snav-item[data-view]');
    showDebug(`✅ ${buttons.length} botones de navegación encontrados`);

    // Intentar cargar una vista simple
    titleEl.textContent = 'SOPHIA - Modo prueba';
    contentEl.innerHTML = `
      <div style="padding:20px; color:#e5e7eb;">
        <h1>¡SOPHIA está funcionando!</h1>
        <p>Si ves esto, el JavaScript se ejecuta correctamente.</p>
        <p>El problema está en el contenido de las vistas de la versión completa.</p>
        <button id="testBtn" style="padding:10px; background:#3b82f6; border:none; color:#fff; cursor:pointer;">Probar botón</button>
      </div>
    `;

    // Añadir evento al botón de prueba
    const testBtn = document.getElementById('testBtn');
    if (testBtn) {
      testBtn.addEventListener('click', () => alert('✅ Botón funciona'));
    }

    showDebug('✅ Renderizado completado. Si ves este mensaje, el script funciona.');
  } catch (error) {
    showDebug(`❌ Error: ${error.message}\n\nStack: ${error.stack}`, true);
  }
});
