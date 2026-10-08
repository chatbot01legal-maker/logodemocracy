// modules/learning/LearningProfileService.js

// Un almacenamiento simple en memoria para los perfiles de aprendizaje.
// En una aplicación real, esto interactuaría con un almacenamiento más persistente o una API.
const learningProfiles = {};

// Asumiendo que CognitiveRuntime está disponible globalmente o se importa.
// Para asegurar la integración, lo hacemos global si no se usa un sistema de módulos.

const LearningProfileService = {
    /**
     * Actualiza el perfil de aprendizaje de un usuario basándose en nueva evidencia/datos del backend.
     * Después de actualizar el perfil, dispara una actualización de la estrategia cognitiva.
     * @param {string} userId - El ID del usuario cuyo perfil necesita ser actualizado.
     * @param {object} profileUpdateData - Datos del backend para actualizar el perfil.
     * @returns {Promise<void>}
     */
    async refresh(userId, profileUpdateData) {
        console.log(`LearningProfileService.refresh llamado para el usuario ${userId} con datos:`, profileUpdateData);

        if (!userId) {
            console.error("LearningProfileService.refresh: se requiere userId.");
            return;
        }

        // Simular la actualización del perfil. En una aplicación real, esto podría implicar
        // buscar desde el backend o fusionar nuevos datos con datos de perfil existentes.
        if (!learningProfiles[userId]) {
            learningProfiles[userId] = {};
        }
        Object.assign(learningProfiles[userId], profileUpdateData); // Fusionar nuevos datos

        console.log(`LearningProfileService: Perfil para el usuario ${userId} actualizado:`, learningProfiles[userId]);

        // Como se indica en el plan, invocar CognitiveRuntime.refreshStrategy()
        if (typeof CognitiveRuntime !== 'undefined' && CognitiveRuntime.refreshStrategy) {
            await CognitiveRuntime.refreshStrategy(userId, learningProfiles[userId]);
        } else {
            console.error("CognitiveRuntime no está disponible o el método refreshStrategy falta.");
        }
    },

    /**
     * Obtiene el perfil de aprendizaje actual para un usuario dado.
     * @param {string} userId - El ID del usuario.
     * @returns {object|null} El objeto de perfil de aprendizaje o null si no se encuentra.
     */
    getProfile(userId) {
        return learningProfiles[userId] || null;
    }
};

// Exportar para sistemas de módulos o hacer global.
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LearningProfileService;
} else if (typeof window !== 'undefined') {
    window.LearningProfileService = LearningProfileService;
}
