/* ═══════════════════════════════════════════════════════
COGNITIVESESSIONFACTORY.JS — Constructor de Contratos v1.0
Ecosistema Logo Democracy
[ARQUITECTURA CONGELADA]
═══════════════════════════════════════════════════════

Esta fábrica es la ÚNICA fuente de verdad para la creación 
de objetos CognitiveSession.

Principios Arquitectónicos (v1.0):
1. Identidad: Toda sesión nace con un sessionId único.
2. Flexibilidad Pedagógica: Provee políticas por defecto, pero 
   permite inyección/sobrescritura desde el módulo de origen.
3. Responsabilidad Única: Solo recibe, valida estructuralmente, 
   ensambla y devuelve el contrato. No interpreta ni ejecuta HTTP.

═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const CONTRACT_VERSION = '1.0';

  // ─── Utilidad Interna ────────────────────────────────
  function generateSessionId() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'rf-ses-' + Date.now() + '-' + Math.random().toString(16).slice(2);
  }

  // ─── Función Base Privada ─────────────────────────────
  function _buildSession({ objective, asset, policy, originModule }) {
    if (!asset) {
      throw new Error(`CognitiveSessionFactory: El activo es obligatorio para el origen '${originModule}'.`);
    }

    return {
      sessionId: generateSessionId(),
      contractVersion: CONTRACT_VERSION,
      objective: objective,
      asset: asset, // Se transporta intacto
      policy: policy || {},
      conversation: [],
      metadata: {
        createdAt: new Date().toISOString(),
        originModule: originModule,
        version: CONTRACT_VERSION
      }
    };
  }

  // ─── API Pública de la Fábrica ────────────────────────
  const CognitiveSessionFactory = {

    /**
     * Construye una sesión cognitiva para el módulo Academia.
     * @param {Object} document - El documento completo a comprender.
     * @param {Object} [customPolicy] - Política pedagógica inyectable opcional.
     * @returns {Object} CognitiveSession
     */
    fromAcademy(document, customPolicy = {}) {
      const defaultPolicy = {
        pedagogicalMode: 'socratic',
        allowFreeQuestions: false,
        preserveOriginalDocument: true,
        canModifyAsset: false
      };

      return _buildSession({
        originModule: 'academy',
        objective: 'understand_document',
        asset: document,
        policy: { ...defaultPolicy, ...customPolicy }
      });
    },

    /**
     * Construye una sesión cognitiva para el módulo SOPHIA.
     * @param {Object} result - El resultado completo de la evaluación.
     * @param {Object} [customPolicy] - Política pedagógica inyectable opcional.
     * @returns {Object} CognitiveSession
     */
    fromSophia(result, customPolicy = {}) {
      const defaultPolicy = {
        pedagogicalMode: 'reflective',
        allowFreeQuestions: false,
        canModifyEvaluation: false,
        canModifyAsset: false
      };

      return _buildSession({
        originModule: 'sophia',
        objective: 'interpret_evaluation',
        asset: result,
        policy: { ...defaultPolicy, ...customPolicy }
      });
    },

    /**
     * Construye una sesión cognitiva para el módulo Logos.
     * @param {Object} comparison - { posicionA, posicionB, resultado, timestamp }
     *   producido por LOGOS.getLastComparison() en logos.js.
     * @param {Object} [customPolicy] - Política pedagógica inyectable opcional.
     * @returns {Object} CognitiveSession
     */
    fromLogos(comparison, customPolicy = {}) {
      const defaultPolicy = {
        pedagogicalMode: 'dialectic', // el Rey Filósofo puede ayudar a examinar la síntesis, nunca imponerla (Logos §2: "la síntesis pertenece a las personas")
        allowFreeQuestions: false,
        canModifyComparison: false,
        canModifyAsset: false
      };

      return _buildSession({
        originModule: 'logos',
        objective: 'interpret_comparison',
        asset: comparison,
        policy: { ...defaultPolicy, ...customPolicy }
      });
    }

  };

  // Exportación compatible con navegador (Window) o Node.js (CommonJS)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = CognitiveSessionFactory;
  } else {
    window.CognitiveSessionFactory = CognitiveSessionFactory;
  }

})();
