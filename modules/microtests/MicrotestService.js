// modules/microtests/MicrotestService.js

// Asumiendo que `window.ApiClient` está disponible globalmente. Si no, se usará un placeholder.
const ApiClient = window.ApiClient || {
    post: async (path, data) => {
        console.warn(`MicrotestService: Usando placeholder ApiClient. Enviando datos de microtest al backend: ${path}`, data);
        return new Promise(resolve => setTimeout(() => {
            console.log("MicrotestService: Respuesta simulada del backend - éxito.");
            resolve({ success: true, profileUpdateData: { type: 'microtest_update', score: Math.random() * 100 } });
        }, 500));
    }
};

const MicrotestService = {
    /**
     * Guarda la evidencia de microtests en el backend y dispara una actualización del perfil de aprendizaje.
     * @param {object} microtestEvidence - Los resultados de los microtests.
     * @param {object} userSessionContext - Contiene identificadores de usuario y sesión (ej., userId, sessionId).
     * @returns {Promise<boolean>} True si el guardado y la actualización fueron exitosos, false en caso contrario.
     */
    async save(microtestEvidence, userSessionContext) {
        console.log("MicrotestService.save llamado con:", microtestEvidence, userSessionContext);
        try {
            // Enviar datos al backend
            const response = await ApiClient.post('/api/microtests/save', {
                evidence: microtestEvidence,
                userContext: userSessionContext
            });

            if (response.success) {
                console.log("Evidencia de microtest guardada exitosamente en el backend.");
                // Como se indica en el plan, disparar LearningProfileService.refresh()
                // Asumiendo que LearningProfileService está disponible globalmente.
                if (typeof LearningProfileService !== 'undefined' && LearningProfileService.refresh) {
                    await LearningProfileService.refresh(userSessionContext.userId, response.profileUpdateData);
                    return true;
                } else {
                    console.error("LearningProfileService no está disponible o el método refresh falta.");
                    return false;
                }
            } else {
                console.error("Fallo al guardar la evidencia de microtest:", response);
                return false;
            }
        } catch (error) {
            console.error("Error al guardar la evidencia de microtest:", error);
            return false;
        }
    }
};

// Exportar para sistemas de módulos o hacer global si no se usan módulos directamente.
// Dado el contexto de "modules/...", es probable que se use un sistema de módulos.
// Para asegurar la integración con rey-filosofo.js (IIFE), lo hacemos global.
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MicrotestService;
} else if (typeof window !== 'undefined') {
    window.MicrotestService = MicrotestService;
}
