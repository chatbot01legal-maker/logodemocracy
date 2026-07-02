#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const CONFIG = {
  protocolFile: path.join(__dirname, 'protocol', 'sophia_protocol.yaml'),
  outputJSON: path.join(__dirname, 'sophia_audit_report.json'),
  outputMD: path.join(__dirname, 'sophia_audit_report.md'),
  minDefinitionLength: 30,
};

// ─────────────────────────────────────────────
// CARGA
// ─────────────────────────────────────────────

function loadProtocol(filePath) {
  return yaml.load(fs.readFileSync(filePath, 'utf8'));
}

// ─────────────────────────────────────────────
// A8 — DEFINICIONES OPERACIONALES (BASE)
// ─────────────────────────────────────────────

function auditOperationalDefinitions(protocol) {
  const incompletos = [];

  protocol.dimensions.forEach(dim => {
    (dim.criteria || []).forEach(c => {
      (c.atoms || []).forEach(a => {
        if (!a.definition || a.definition.length < 20 || !a.version) {
          incompletos.push({ atom: a.id, issue: "incomplete_definition" });
        }
      });
    });
  });

  return {
    id: "A8",
    name: "Definiciones operacionales (átomos)",
    passed: incompletos.length === 0,
    incompletos,
    message: incompletos.length ? `${incompletos.length} átomos incompletos` : "OK"
  };
}

// ─────────────────────────────────────────────
// ADEF — DEFINICIONES ESTRUCTURALES COMPLETAS
// (constructos + átomos)
// ─────────────────────────────────────────────

function auditDefinitions(protocol) {
  const issues = [];

  protocol.dimensions.forEach(dim => {
    (dim.criteria || []).forEach(c => {

      // constructo
      if (!c.construct?.definition || c.construct.definition.length < CONFIG.minDefinitionLength) {
        issues.push({
          type: "construct",
          id: c.construct?.name || c.id,
          issue: "definition_incomplete"
        });
      }

      // átomos
      (c.atoms || []).forEach(a => {
        if (!a.definition || a.definition.length < 20) {
          issues.push({
            type: "atom",
            id: a.id,
            issue: "definition_incomplete"
          });
        }
      });

    });
  });

  return {
    id: "ADEF",
    name: "Definiciones estructurales completas",
    passed: issues.length === 0,
    issues,
    message: issues.length ? `${issues.length} problemas de definición` : "OK"
  };
}

// ─────────────────────────────────────────────
// APAT — PATTERNS (ACTIVACIÓN SEMÁNTICA REAL)
// ─────────────────────────────────────────────

function auditPatterns(protocol) {
  const issues = [];

  protocol.dimensions.forEach(dim => {
    (dim.criteria || []).forEach(c => {
      (c.atoms || []).forEach(a => {

        const patterns = a.patterns || [];
        const def = (a.definition || "").toLowerCase();

        if (patterns.length === 0) {
          issues.push({ atom: a.id, issue: "no_patterns" });
          return;
        }

        // evaluación semántica real (no substring ingenuo)
        const coverage = patterns.filter(p => {
          const regex = new RegExp(`\\b${p.toLowerCase()}\\b`, 'i');
          return regex.test(def);
        }).length;

        const ratio = coverage / patterns.length;

        if (ratio < 0.4) {
          issues.push({
            atom: a.id,
            issue: "low_pattern_alignment",
            ratio
          });
        }
      });
    });
  });

  return {
    id: "APAT",
    name: "Consistencia de patterns (activación semántica)",
    passed: issues.length === 0,
    issues,
    message: issues.length ? `${issues.length} problemas de patterns` : "OK"
  };
}

// ─────────────────────────────────────────────
// AMAP — GENERACIÓN DE PATTERNS (EVOLUCIÓN CONTROLADA)
// ─────────────────────────────────────────────

function auditPatternExpansion(protocol) {
  const suggestions = [];

  const stopwords = new Set(["cuando", "porque", "donde", "entre", "sobre", "desde"]);

  protocol.dimensions.forEach(dim => {
    (dim.criteria || []).forEach(c => {
      (c.atoms || []).forEach(a => {

        const existing = new Set((a.patterns || []).map(p => p.toLowerCase()));
        const text = (a.definition || "").toLowerCase();

        const words = text
          .split(/\s+/)
          .filter(w => w.length > 6)
          .filter(w => !stopwords.has(w));

        const missing = words.filter(w => !existing.has(w));

        const unique = [...new Set(missing)];

        if (unique.length > 0) {
          suggestions.push({
            atom: a.id,
            suggested_patterns: unique.slice(0, 5)
          });
        }

      });
    });
  });

  return {
    id: "AMAP",
    name: "Expansión controlada de patterns",
    passed: suggestions.length === 0,
    suggestions,
    message: suggestions.length
      ? `${suggestions.length} oportunidades de expansión`
      : "OK"
  };
}

// ─────────────────────────────────────────────
// A9 — COBERTURA SEMÁNTICA GLOBAL
// ─────────────────────────────────────────────

function auditSemanticCoverage(protocol) {
  function auditSemanticTrace(protocol) {
  const trace = [];

  protocol.dimensions.forEach(dim => {
    const dimResult = {
      dimension: dim.id,
      criteria: [],
      dimensionCoverageSum: 0
    };

    (dim.criteria || []).forEach(c => {

      let total = 0;
      let covered = 0;

      const text = (c.construct?.definition || "") + " " + (c.definition || "");

      const atoms = (c.atoms || []).map(a => ({
        id: a.id,
        aliases: (a.aliases || []).map(x => x.toLowerCase())
      }));

      const words = text.toLowerCase().split(/\s+/);

      for (const w of words) {
        if (w.length < 5) continue;

        total++;

        const ok = atoms.some(a =>
          a.id === w || a.aliases.some(al => w.includes(al) || al.includes(w))
        );

        if (ok) covered++;
      }

      const coverage = total ? (covered / total) * 100 : 0;

      dimResult.criteria.push({
        id: c.id,
        coverage: Math.round(coverage),
        total_terms: total,
        covered_terms: covered,
        gap: Math.round(100 - coverage)
      });

    });

    dimResult.avgCoverage = Math.round(
      dimResult.criteria.reduce((acc, c) => acc + c.coverage, 0) /
      (dimResult.criteria.length || 1)
    );

    trace.push(dimResult);
  });

  const ranking = trace
    .flatMap(d => d.criteria.map(c => ({
      dimension: d.dimension,
      ...c
    })))
    .sort((a, b) => a.coverage - b.coverage);

  return {
    id: "A9-TRACE",
    name: "Cobertura semántica trazable",
    trace,
    ranking,
    worst_criteria: ranking.slice(0, 5),
    best_criteria: ranking.slice(-5),
    message: `Peor criterio: ${ranking[0]?.id} (${ranking[0]?.coverage}%)`
  };
  }
  let total = 0;
  let covered = 0;

  protocol.dimensions.forEach(dim => {
    (dim.criteria || []).forEach(c => {

      const text = (c.construct?.definition || "") + " " + (c.definition || "");

      const atoms = (c.atoms || []).map(a => ({
        id: a.id,
        aliases: (a.aliases || []).map(x => x.toLowerCase())
      }));

      const words = text.toLowerCase().split(/\s+/);

      for (const w of words) {
        if (w.length < 5) continue;

        total++;

        const ok = atoms.some(a =>
          a.id === w || a.aliases.some(al => w.includes(al) || al.includes(w))
        );

        if (ok) covered++;
      }
    });
  });

  const coverage = total ? Math.round((covered / total) * 100) : 0;

  return {
    id: "A9",
    name: "Cobertura semántica",
    passed: coverage >= 80,
    coverage,
    message: `Cobertura: ${coverage}%`
  };
}

// ─────────────────────────────────────────────
// RUN AUDITS
// ─────────────────────────────────────────────

function runAudits(protocol) {
const resultados = [
  auditDefinitions(protocol),
  auditOperationalDefinitions(protocol),
  auditPatterns(protocol),
  auditPatternExpansion(protocol),
  auditSemanticCoverage(protocol),
  auditSemanticTrace(protocol)
];

  const indices = {
    SCC: resultados.find(r => r.id === "A9")?.coverage || 0,
    Madurez: Math.round(
      resultados.filter(r => r.passed).length / resultados.length * 100
    )
  };

  return { resultados, indices };
}

const trace = resultados.find(r => r.id === "A9-TRACE");

if (trace?.worst_criteria?.length) {
  console.log("\n🔥 PEOR CRITERIO:");
  console.log(trace.worst_criteria[0]);
}
// ─────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────

module.exports = { runAudits };


// ─────────────────────────────────────────────
// CLI ENTRY POINT (FALTANTE)
// ─────────────────────────────────────────────

function main() {
  const fs = require('fs');
  const path = require('path');
  const yaml = require('js-yaml');

  const protocolPath = path.join(__dirname, 'protocol', 'sophia_protocol.yaml');

  console.log("🔍 SOPHIA AUDITOR vNEXT");
  console.log("📄 Cargando protocolo...");

  const protocol = yaml.load(fs.readFileSync(protocolPath, 'utf8'));

  const { resultados, indices } = runAudits(protocol);

  console.log("\n📊 RESULTADOS:");
  for (const r of resultados) {
    console.log(`- ${r.id}: ${r.passed ? "OK" : "FAIL"} — ${r.message}`);
  }

  console.log("\n📈 MADUREZ:", indices.Madurez ?? indices.SCC ?? 0);
}

if (require.main === module) {
  main();
}
