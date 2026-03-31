// TEST DE DIAGNÓSTICO - Ejecutar en consola del navegador
(function() {
    console.group('🔍 DIAGNÓSTICO ANIMACIÓN HERO');
    
    // 1. Verificar si el script se cargó
    console.log('1. Script cargado:', !!window.heroAnimationLoaded);
    
    // 2. Buscar contenedor
    const container = document.getElementById('heroChatDemo');
    console.log('2. Contenedor #heroChatDemo:', container ? '✅ ENCONTRADO' : '❌ NO ENCONTRADO');
    
    // 3. Contar mensajes
    const messages = container ? container.querySelectorAll('.message') : [];
    console.log('3. Número de mensajes:', messages.length);
    
    // 4. Verificar estilos CSS
    console.log('4. Estilos CSS aplicados:');
    if (messages.length > 0) {
        const firstMsg = messages[0];
        const styles = window.getComputedStyle(firstMsg);
        console.log('   - Opacity:', styles.opacity);
        console.log('   - Transition:', styles.transition);
    }
    
    // 5. Verificar consola por errores
    console.log('5. Revisar pestaña Console para errores (F12 → Console)');
    
    // 6. Ejecutar prueba manual
    console.log('6. Para probar manualmente, ejecuta en consola:');
    console.log('   animateHeroChat()');
    
    console.groupEnd();
    
    // Función de prueba
    window.animateHeroChat = function() {
        if (!container) {
            console.error('No hay contenedor');
            return;
        }
        
        const msgs = container.querySelectorAll('.message');
        msgs.forEach(msg => msg.style.opacity = '0');
        
        msgs.forEach((msg, i) => {
            setTimeout(() => {
                msg.style.opacity = '1';
                msg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                console.log(`Mensaje ${i+1} mostrado`);
            }, i * 1000);
        });
    };
})();
